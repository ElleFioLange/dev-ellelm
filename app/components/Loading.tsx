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
    // TODO Fix weird jump on initial reset
    const loading = gsap.isTweening(loader.current);
    const width = loading ? gsap.getProperty(loader.current, "width") : 0;
    console.log(loading);

    if (!paused) {
      if (loading) {
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
      gsap.killTweensOf(loader.current);
      if (width) {
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
