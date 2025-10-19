import { useEffect, useRef, useState, RefObject, useCallback } from "react";

type BottomStrategy = "stop" | "loop" | "bounce";

interface AutoScrollOptions {
    speed?: number;                // px/s
    resumeDelayMs?: number;        // tạm dừng sau khi user tương tác
    enabled?: boolean;
    containerRef?: RefObject<HTMLElement>; // nếu không truyền -> cuộn window
    bottomStrategy?: BottomStrategy;
    respectReducedMotion?: boolean; // mặc định true
    maxFPS?: number | null;        // ví dụ 60; null = không giới hạn
}

export const useAutoScroll = ({
                                  speed = 120,
                                  resumeDelayMs = 2000,
                                  enabled = true,
                                  containerRef,
                                  bottomStrategy = "stop",
                                  respectReducedMotion = false,
                                  maxFPS = 60,
                              }: AutoScrollOptions = {}) => {
    const [isActive, setIsActive] = useState<boolean>(enabled);

    // refs nội bộ để không re-render
    const speedRef = useRef(speed);
    const dirRef = useRef<1 | -1>(1);
    const rafRef = useRef<number | null>(null);
    const lastTsRef = useRef<number>(0);
    const accRef = useRef<number>(0);                  // tích lũy sub-pixel
    const pausedUntilRef = useRef<number>(0);
    const resumeTimerRef = useRef<number | null>(null);
    const programmaticRef = useRef<boolean>(false);
    const userIntentUntilRef = useRef<number>(0);      // cửa sổ 120ms sau input
    const frameMinInterval = maxFPS ? (1000 / maxFPS) : 0;

    const now = () => performance.now();

    // --- iOS-safe: window vs container ---
    const isWindowMode = !containerRef?.current;

    // Đọc vị trí cuộn
    const readTop = () => {
        if (!isWindowMode) {
            return containerRef!.current!.scrollTop;
        }
        // window mode: iOS có thể dùng body thay vì html
        return (
            window.pageYOffset ??
            document.documentElement.scrollTop ??
            document.body.scrollTop ??
            0
        );
    };

    // Đọc kích thước
    const readDims = () => {
        if (!isWindowMode) {
            const el = containerRef!.current!;
            return { scrollHeight: el.scrollHeight, clientHeight: el.clientHeight };
        }
        const docEl = document.documentElement;
        const body = document.body;
        const scrollHeight = Math.max(
            docEl?.scrollHeight || 0,
            body?.scrollHeight || 0
        );
        const clientHeight = window.innerHeight; // viewport thực tế (thanh địa chỉ thay đổi)
        return { scrollHeight, clientHeight };
    };

    // Cuộn tới vị trí y
    const scrollToY = (y: number) => {
        programmaticRef.current = true;
        if (!isWindowMode) {
            containerRef!.current!.scrollTop = y; // instant
        } else {
            window.scrollTo(0, y);                 // iOS chắc chắn ăn
        }
        queueMicrotask(() => { programmaticRef.current = false; });
    };

    const scrollByInt = (dyInt: number) => {
        if (dyInt === 0) return;
        scrollToY(readTop() + dyInt);
    };

    // --- điều chỉnh tốc độ từ props ---
    useEffect(() => { speedRef.current = Math.max(0, speed); }, [speed]);

    // --- pause/resume theo input người dùng ---
    const requestResume = useCallback(() => {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = window.setTimeout(() => {
            pausedUntilRef.current = 0;
            if (!isActive && enabled) {
                setIsActive(true);
                tick(); // kick loop
            }
        }, resumeDelayMs) as unknown as number;
    }, [resumeDelayMs, enabled, isActive]);

    const pauseForUser = useCallback(() => {
        if (isActive) setIsActive(false);
        pausedUntilRef.current = now() + resumeDelayMs;
        requestResume();
    }, [isActive, requestResume, resumeDelayMs]);

    const markUserIntent = () => { userIntentUntilRef.current = now() + 120; };

    // --- listeners: KHÔNG pause theo 'scroll' để tránh giật ---
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
        const onScroll = () => {
            // Không pause theo scroll; chỉ theo intent
            // if (programmaticRef.current) return;
            // if (now() <= userIntentUntilRef.current) pauseForUser();
        };

        const el: any = isWindowMode ? window : containerRef!.current!;
        el.addEventListener("wheel", onWheel, { passive: true });
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("touchmove", onTouchMove, { passive: true });
        el.addEventListener("pointerdown", onPointerDown, { passive: true });
        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("keydown", onKeyDown, { passive: true });

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

    // --- visibility & reduced motion ---
    useEffect(() => {
        if (!enabled) return;
        const onVis = () => {
            if (document.visibilityState === "hidden") {
                if (isActive) setIsActive(false);
            } else {
                pausedUntilRef.current = now() + 250;
                requestResume();
            }
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [enabled, isActive, requestResume]);

    // --- rAF loop ---
    const tick = useCallback(() => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        lastTsRef.current = 0;

        const frame = (ts: number) => {
            if (!isActive || !enabled) return;

            // reduced motion tắt hẳn
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

            // clamp dt để tránh nhảy vọt
            let dt = Math.min(dtMs / 1000, 0.05);
            lastTsRef.current = ts;

            if (pausedUntilRef.current && now() < pausedUntilRef.current) {
                rafRef.current = requestAnimationFrame(frame);
                return;
            }

            const { scrollHeight, clientHeight } = readDims();
            const maxScroll = Math.max(0, scrollHeight - clientHeight);
            const y = readTop();

            // áp dụng accumulator -> chỉ scroll số nguyên px
            accRef.current += speedRef.current * dt * dirRef.current;
            const deltaInt = accRef.current > 0 ? Math.floor(accRef.current) : Math.ceil(accRef.current);
            accRef.current -= deltaInt;

            // 👇 tolerance lớn hơn cho iOS (thanh địa chỉ co giãn)
            const TOL = 6;
            const atBottom = y >= maxScroll - TOL;
            const atTop = y <= TOL;

            if (dirRef.current === 1 && atBottom) {
                if (bottomStrategy === "stop") {
                    setIsActive(false);
                    return;
                } else if (bottomStrategy === "loop") {
                    scrollToY(0);
                } else {
                    dirRef.current = -1; // bounce
                }
            } else if (dirRef.current === -1 && atTop) {
                if (bottomStrategy === "bounce") dirRef.current = 1;
            } else {
                scrollByInt(deltaInt);
            }

            rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);
    }, [enabled, isActive, bottomStrategy, respectReducedMotion, frameMinInterval]);

    // đồng bộ enabled -> isActive và kick loop
    useEffect(() => {
        setIsActive(enabled);
        if (enabled) tick();
        else if (rafRef.current) cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    // public api đơn giản
    const start = useCallback(() => { if (!isActive) { setIsActive(true); tick(); } }, [isActive, tick]);
    const stop  = useCallback(() => { if (isActive) setIsActive(false); if (rafRef.current) cancelAnimationFrame(rafRef.current); }, [isActive]);

    return { isActive, start, stop, setSpeed: (v:number)=>{ speedRef.current = Math.max(0, v); } };
};
