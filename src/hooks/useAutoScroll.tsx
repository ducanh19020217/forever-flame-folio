import { useEffect, useRef, useState, RefObject, useCallback } from "react";

type BottomStrategy = "stop" | "loop" | "bounce";

interface AutoScrollOptions {
    speed?: number;
    resumeDelayMs?: number;
    enabled?: boolean;
    containerRef?: RefObject<HTMLElement>;
    bottomStrategy?: BottomStrategy;
    respectReducedMotion?: boolean;
    maxFPS?: number | null;
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
    const [isActive, setIsActive] = useState(enabled);
    const speedRef = useRef(speed);
    const dirRef = useRef<1 | -1>(1);
    const rafRef = useRef<number | null>(null);
    const lastTsRef = useRef<number>(0);
    const accRef = useRef<number>(0);
    const pausedUntilRef = useRef<number>(0);
    const resumeTimerRef = useRef<number | null>(null);
    const autoPausedRef = useRef<boolean>(false);
    const isActiveRef = useRef<boolean>(isActive);
    const warmupRef = useRef<number>(0);
    const frameMinInterval = maxFPS ? 1000 / maxFPS : 0;

    useEffect(() => { isActiveRef.current = isActive; }, [isActive]);
    const now = () => performance.now();
    const isWindowMode = !containerRef?.current;

    const readTop = () =>
        !isWindowMode
            ? containerRef!.current!.scrollTop
            : window.scrollY || document.documentElement.scrollTop || 0;

    const readDims = () => {
        if (!isWindowMode) {
            const el = containerRef!.current!;
            return { scrollHeight: el.scrollHeight, clientHeight: el.clientHeight };
        }
        const docEl = document.documentElement;
        const scrollHeight = Math.max(docEl.scrollHeight, document.body.scrollHeight);
        return { scrollHeight, clientHeight: window.innerHeight };
    };

    // ✅ tránh repaint mạnh
    const scrollByInt = (dy: number) => {
        if (dy === 0) return;
        if (!isWindowMode) containerRef!.current!.scrollTop += dy;
        else window.scrollBy(0, dy);
    };

    useEffect(() => { speedRef.current = Math.max(0, speed); }, [speed]);

    const requestResume = useCallback(() => {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = window.setTimeout(() => {
            pausedUntilRef.current = 0;
            if (!enabled) return;
            if (autoPausedRef.current && !isActiveRef.current) {
                accRef.current = 0;
                warmupRef.current = 0; // reset warm-up
                setIsActive(true);
                autoPausedRef.current = false;
                tick();
            }
        }, resumeDelayMs) as unknown as number;
    }, [resumeDelayMs, enabled]);

    const pauseForUser = useCallback(() => {
        if (isActiveRef.current) setIsActive(false);
        autoPausedRef.current = true;
        accRef.current = 0;
        pausedUntilRef.current = now() + resumeDelayMs;
        requestResume();
    }, [requestResume, resumeDelayMs]);

    useEffect(() => {
        if (!enabled) return;
        const onWheel = pauseForUser;
        const onTouchStart = pauseForUser;
        const onPointerDown = pauseForUser;
        const onKeyDown = (e: KeyboardEvent) => {
            if (["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," ","Space"].includes(e.key))
                pauseForUser();
        };
        const el = isWindowMode ? window : containerRef!.current!;
        el.addEventListener("wheel", onWheel, { passive: true });
        el.addEventListener("touchstart", onTouchStart, { passive: true });
        el.addEventListener("pointerdown", onPointerDown, { passive: true });
        window.addEventListener("keydown", onKeyDown);
        return () => {
            el.removeEventListener("wheel", onWheel);
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("keydown", onKeyDown);
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        };
    }, [enabled, pauseForUser, isWindowMode, containerRef]);

    // 🎬 loop chính
    const tick = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        lastTsRef.current = 0;
        warmupRef.current = 0;

        const frame = (ts: number) => {
            if (!isActiveRef.current || !enabled) return;
            if (
                respectReducedMotion &&
                window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
            )
                return;

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

            const dt = Math.min(dtMs / 1000, 0.05);
            lastTsRef.current = ts;

            if (pausedUntilRef.current && now() < pausedUntilRef.current) {
                rafRef.current = requestAnimationFrame(frame);
                return;
            }

            const { scrollHeight, clientHeight } = readDims();
            const maxScroll = Math.max(0, scrollHeight - clientHeight);
            const y = readTop();

            // 🌸 warm-up giảm hiện tượng “giật trắng” frame đầu
            const warmup = Math.min(1, (warmupRef.current += dt * 2)); // 0 → 1 trong 0.5s
            const effectiveSpeed = speedRef.current * (0.3 + 0.7 * warmup);

            accRef.current += effectiveSpeed * dt * dirRef.current;
            const deltaInt = accRef.current > 0 ? Math.floor(accRef.current) : Math.ceil(accRef.current);
            accRef.current -= deltaInt;

            const atBottom = y >= maxScroll - 2;
            const atTop = y <= 2;

            if (dirRef.current === 1 && atBottom) {
                if (bottomStrategy === "stop") {
                    setIsActive(false);
                    return;
                } else if (bottomStrategy === "loop") {
                    if (!isWindowMode) containerRef!.current!.scrollTop = 0;
                    else window.scrollTo({ top: 0, behavior: "instant" as any });
                } else dirRef.current = -1;
            } else if (dirRef.current === -1 && atTop) {
                if (bottomStrategy === "bounce") dirRef.current = 1;
            } else if (deltaInt !== 0) {
                scrollByInt(deltaInt);
            }

            rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);
    }, [enabled, bottomStrategy, respectReducedMotion, frameMinInterval]);

    useEffect(() => {
        setIsActive(enabled);
        isActiveRef.current = enabled;
        if (enabled) tick();
        else if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, [enabled, tick]);

    const start = useCallback(() => {
        if (!isActiveRef.current) {
            setIsActive(true);
            isActiveRef.current = true;
            accRef.current = 0;
            warmupRef.current = 0;
            tick();
        }
    }, [tick]);

    const stop = useCallback(() => {
        if (isActiveRef.current) setIsActive(false);
        autoPausedRef.current = false;
        isActiveRef.current = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, []);

    const setSpeed = (v: number) => { speedRef.current = Math.max(0, v); };

    return { isActive, start, stop, setSpeed };
};
