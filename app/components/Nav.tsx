import Link from "next/link";
import { Dispatch } from "react";

// TODO Add to layout position with fixed ?

export default function Nav({
  paused,
  reset,
  className,
}: {
  paused?: [boolean, Dispatch<boolean>];
  reset?: [never[], Dispatch<never[]>];
  className: string;
}) {
  return (
    <nav
      className={"font-cormorant flex flex-row-reverse " + className}
      onMouseEnter={
        paused
          ? () => {
              paused[1](true);
              if (reset) reset[1]([]);
            }
          : undefined
      }
      onMouseLeave={paused ? () => paused[1](false) : undefined}
    >
      <Link href="/">Home</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/portfolio">Portfolio</Link>
      <Link href="https://github.com/ElleFioLange/ellelm">GitHub</Link>
      {/* <Link href="/blog">Blog</Link> */}
    </nav>
  );
}
