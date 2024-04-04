import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Loading({
  duration,
  resetDuration,
  delay,
  onLoad,
  className,
  reset,
}: {
  // TODO Add pause
  duration: number;
  // Default is 0.5s
  resetDuration?: number;
  // Default is 1.5s
  delay?: number;
  onLoad: () => void;
  className?: string;
  reset: any;
}) {
  const loader = useRef<HTMLDivElement>(null);

  loader.current?.offsetWidth;

  useGSAP(
    () => {
      const _resetDuration = resetDuration !== undefined ? resetDuration : 0.5;
      const _delay = delay !== undefined ? delay : 1.5;

      const _width = loader.current?.offsetWidth;

      if (_width) {
        gsap.killTweensOf(loader.current);
        gsap.to(loader.current, {
          duration: _resetDuration,
          width: "0%",
        });
        gsap.to(loader.current, {
          duration,
          delay: _delay + _resetDuration,
          width: "100%",
        });
      } else {
        gsap.to(loader.current, {
          duration,
          delay: _delay,
          width: "100%",
        });
      }
    },
    { dependencies: [reset] }
  );

  useEffect(() => {
    const timeout = setTimeout(onLoad, (duration + (delay || 1.5)) * 1000);

    return () => clearTimeout(timeout);
  }, [reset]);

  return (
    <div
      className={"h-0.5 rounded-full bg-dark/30 dark:bg-light/30 " + className}
    >
      <div
        ref={loader}
        className="h-full w-0 rounded-full bg-dark dark:bg-light"
      />
    </div>
  );
}
