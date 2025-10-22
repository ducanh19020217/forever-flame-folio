// useAutoScroll.ts
import { useEffect, useRef, useState, RefObject, useCallback } from "react";

type BottomStrategy = "stop" | "loop" | "bounce";

interface AutoScrollOptions {
    speed?: number;                 // px/s
    resumeDelayMs?: number;         // thời gian tạm dừng sau tương tác user
    enabled?: boolean;
    containerRef?: RefObject<HTMLElement>; // nếu không truyền -> cuộn window
    bottomStrategy?: BottomStrategy; // dừng | lặp từ đầu | bật nảy
    respectReducedMotion?: boolean;  // mặc định true
    maxFPS?: number | null;          // ví dụ 60; null = không giới hạn
}

export const useAutoScroll = ({
                                  speed = 120,
                                  resumeDelayMs = 2000,
                                  enabled = true,
                                  containerRef,
                                  bottomStrategy = "stop",
                                  respectReducedMotion = true,
                                  maxFPS = 60,
                              }: AutoScrollOptions = {}) => {
    const [isActive, setIsActive] = useState<boolean>(enabled);

    // --- refs nội bộ (không gây re-render) ---
    const speedRef = useRef(speed);
    const dirRef = useRef<1 | -1>(1);
    const rafRef = useRef<number | null>(null);
    const lastTsRef = useRef<number>(0);
    const accRef = useRef<number>(0);               // tích lũy sub-pixel
    const pausedUntilRef = useRef<number>(0);
    const resumeTimerRef = useRef<number | null>(null);
    const programmaticRef = useRef<boolean>(false);
    const userIntentUntilRef = useRef<number>(0);
    const frameMinInterval = maxFPS ? (1000 / maxFPS) : 0;

    // --- chống stale state & kiểm soát resume ---
    const isActiveRef = useRef<boolean>(isActive);
    const autoPausedRef = useRef<boolean>(false);
    useEffect(() => { isActiveRef.current = isActive; }, [isActive]);

    // --- chống flicker: tránh ghi trùng vị trí ---
    const lastWriteYRef = useRef<number>(-1);

    const now = () => performance.now();
    const isWindowMode = !containerRef?.current;

    // Đọc vị trí hiện tại
    const readTop = () => {
        if (!isWindowMode) return containerRef!.current!.scrollTop;
        return (
            window.pageYOffset ??
            document.documentElement.scrollTop ??
            document.body.scrollTop ??
            0
        );
    };

    // Đọc kích thước scroll/viewport
    const readDims = () => {
        if (!isWindowMode) {
            const el = containerRef!.current!;
            return { scrollHeight: el.scrollHeight, clientHeight: el.clientHeight };
        }
        const docEl = document.documentElement;
        const body = document.body;
        const scrollHeight = Math.max(docEl?.scrollHeight || 0, body?.scrollHeight || 0);
        const clientHeight = window.innerHeight; // iOS thay đổi khi address bar co/giãn
        return { scrollHeight, clientHeight };
    };

    // Cuộn tới vị trí y (tránh ghi trùng để không repaint vô ích)
    const scrollToY = (y: number) => {
        const cur = readTop();
        if (Math.round(cur) === Math.round(y)) return; // 🚫 tránh flicker
        programmaticRef.current = true;
        if (!isWindowMode) containerRef!.current!.scrollTop = y;
        else window.scrollTo(0, y);
        lastWriteYRef.current = y;
        queueMicrotask(() => { programmaticRef.current = false; });
    };

    const scrollByInt = (dyInt: number) => {
        if (dyInt === 0) return; // không ghi nếu không cần
        scrollToY(readTop() + dyInt);
    };

    // Đồng bộ tốc độ runtime
    useEffect(() => { speedRef.current = Math.max(0, speed); }, [speed]);

    // Resume sau khi user dừng tương tác
    const requestResume = useCallback(() => {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = window.setTimeout(() => {
            pausedUntilRef.current = 0;
            if (!enabled) return;

            if (autoPausedRef.current && !isActiveRef.current) {
                // reset “đà” để frame đầu mượt, tránh nhảy 1px
                accRef.current = 0;
                lastWriteYRef.current = -1;

                setIsActive(true);
                autoPausedRef.current = false;
                tick();
            }
        }, resumeDelayMs) as unknown as number;
    }, [resumeDelayMs, enabled]); // không phụ thuộc isActive (tránh stale)

    // Pause do user (wheel/touch/pointer/keyboard)
    const pauseForUser = useCallback(() => {
        if (isActiveRef.current) setIsActive(false);
        autoPausedRef.current = true;
        accRef.current = 0;            // reset đà để resume mượt
        lastWriteYRef.current = -1;
        pausedUntilRef.current = now() + resumeDelayMs;
        requestResume();
    }, [requestResume, resumeDelayMs]);

    const markUserIntent = () => { userIntentUntilRef.current = now() + 120; };

    // Listeners: pause theo intent, không pause theo event "scroll"
    useEffect(() => {
        if (!enabled) return;

        const onWheel = () => { markUserIntent(); pauseForUser(); };
        const onTouchStart = () => { markUserIntent(); pauseForUser(); };
        const onTouchMove = () => { markUserIntent(); pauseForUser(); };
        const onPointerDown = () => { markUserIntent(); pauseForUser(); };
        const onKeyDown = (e: KeyboardEvent) => {
            if (["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," ","Space"].includes(e.key)) {
                markUserIntent(); pauseForUser();
            }
        };
        const onScroll = () => { /* cố ý không pause theo scroll để tránh giật */ };

        const el = isWindowMode ? window : containerRef!.current!;
        el.addEventListener("wheel", onWheel, { passive: true });
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchmove", onTouchMove, { passive: true });
        el.addEventListener("pointerdown", onPointerDown, { passive: true });
        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("keydown", onKeyDown); // không dùng passive cho keydown

        return () => {
            el.removeEventListener("wheel", onWheel);
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchmove", onTouchMove);
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("keydown", onKeyDown);
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        };
    }, [enabled, pauseForUser, isWindowMode, containerRef]);

    // Visibility: khi tab quay lại, resume mềm
    useEffect(() => {
        if (!enabled) return;
        const onVis = () => {
            if (document.visibilityState === "hidden") {
                if (isActiveRef.current) setIsActive(false);
            } else {
                pausedUntilRef.current = now() + 250;
                requestResume();
            }
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [enabled, requestResume]);

    // Vòng lặp rAF
    const tick = useCallback(() => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        lastTsRef.current = 0;

        const frame = (ts: number) => {
            if (!isActiveRef.current || !enabled) return;

            if (respectReducedMotion && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
                return;
            }

            if (lastTsRef.current === 0) {
                lastTsRef.current = ts;
                rafRef.current = requestAnimationFrame(frame);
                return;
            }

            const dtMs = ts - lastTsRef.current;
            if (frameMinInterval && dtMs < frameMinInterval) {
                rafRef.current = requestAnimationFrame(frame);
                return;
            }

            const dt = Math.min(dtMs / 1000, 0.05); // clamp để tránh nhảy vọt
            lastTsRef.current = ts;

            if (pausedUntilRef.current && now() < pausedUntilRef.current) {
                rafRef.current = requestAnimationFrame(frame);
                return;
            }

            const { scrollHeight, clientHeight } = readDims();
            const maxScroll = Math.max(0, scrollHeight - clientHeight);
            const y = readTop();

            // tích lũy + chỉ cuộn số nguyên px
            accRef.current += speedRef.current * dt * dirRef.current;
            const deltaInt = accRef.current > 0 ? Math.floor(accRef.current) : Math.ceil(accRef.current);
            accRef.current -= deltaInt;

            // tolerance lớn hơn cho iOS (address bar co/giãn)
            const TOL = 6;
            const atBottom = y >= maxScroll - TOL;
            const atTop = y <= TOL;

            // Chạm đáy
            if (dirRef.current === 1 && atBottom) {
                if (bottomStrategy === "stop") {
                    // hạ cánh mềm: đảm bảo chốt về đúng maxScroll rồi mới tắt ở frame sau
                    if (Math.round(y) !== Math.round(maxScroll)) scrollToY(maxScroll);
                    rafRef.current = requestAnimationFrame(() => {
                        setIsActive(false);
                    });
                    return;
                } else if (bottomStrategy === "loop") {
                    scrollToY(0);
                } else {
                    dirRef.current = -1; // bounce
                }
            }
            // Chạm đỉnh khi đang đi lên
            else if (dirRef.current === -1 && atTop) {
                if (bottomStrategy === "bounce") dirRef.current = 1;
            }
            // Bình thường thì cuộn
            else {
                if (deltaInt !== 0) {          // tránh ghi trùng → giảm flicker
                    scrollByInt(deltaInt);
                }
            }

            rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);
    }, [enabled, bottomStrategy, respectReducedMotion, frameMinInterval]);

    // Đồng bộ enabled -> isActive và kick loop
    useEffect(() => {
        setIsActive(enabled);
        isActiveRef.current = enabled;
        if (enabled) tick();
        else if (rafRef.current) cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    // Public API
    const start = useCallback(() => {
        if (!isActiveRef.current) {
            setIsActive(true);
            isActiveRef.current = true;
            // reset đà khi start thủ công để frame đầu mượt
            accRef.current = 0;
            lastWriteYRef.current = -1;
            tick();
        }
    }, [tick]);

    const stop = useCallback(() => {
        if (isActiveRef.current) setIsActive(false);
        autoPausedRef.current = false;   // stop thủ công → không auto resume
        isActiveRef.current = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, []);

    const setSpeed = (v: number) => { speedRef.current = Math.max(0, v); };

    return { isActive, start, stop, setSpeed };
};
