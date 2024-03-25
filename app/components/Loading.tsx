import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Loading({
  duration,
  delay,
  onLoad,
  className,
  reset,
}: {
  duration: number;
  // Delay default is 1.5s
  delay?: number;
  onLoad: () => void;
  className?: string;
  reset: any;
}) {
  const loader = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(loader.current, {
        duration,
        delay: delay || 1.5,
        width: "100%",
      });
    },
    { dependencies: [reset], revertOnUpdate: true }
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
