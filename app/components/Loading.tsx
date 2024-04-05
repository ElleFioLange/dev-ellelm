import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function Loading({
  duration,
  resetDuration,
  delay,
  onLoad,
  className,
  reset,
  paused,
}: {
  duration: number;
  resetDuration: number;
  delay: number;
  onLoad: () => void;
  className?: string;
  reset: any;
  paused: boolean;
}) {
  const loader = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const width = gsap.getProperty(loader.current, "width");

    if (!paused) {
      if (width) {
        gsap.killTweensOf(loader.current);
        gsap.to(loader.current, {
          duration: resetDuration,
          width: "0%",
        });
        gsap.to(loader.current, {
          duration,
          delay: delay + resetDuration,
          width: "100%",
        });
      } else {
        gsap.to(loader.current, {
          duration,
          delay,
          width: "100%",
        });
      }
    } else {
      const [tween] = gsap.getTweensOf(loader.current);
      if (tween?.vars.width === "100%") {
        gsap.killTweensOf(loader.current);
        gsap.to(loader.current, {
          duration: resetDuration,
          width: "0%",
        });
      }
    }
  }, [reset, paused]);

  useEffect(() => {
    if (!paused) {
      const timeout = setTimeout(
        onLoad,
        (duration + delay) * 1000 +
          // Add 0.1s as a buffer for the animation to finish
          100
      );

      return () => clearTimeout(timeout);
    }
  }, [reset, paused]);

  return (
    <div className={"h-0.5 rounded-full bg-fg/30 " + className}>
      <div ref={loader} className="h-full w-0 rounded-full bg-fg" />
    </div>
  );
}
