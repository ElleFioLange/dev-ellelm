"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ElleLM from "./components/ElleLM";

export type State =
  | 0 // Idle
  | 1 // Streaming
  | 2 // Finished
  | 3; // Canceled

export default function Home() {
  const selected = useState<Array<string>>([
    // "option",
    // "option",
    // "option",
    // "option",
    // "option",
  ]);
  const state = useState<State>(0);

  const reset = useState([]);

  // const fade = useMemo(() => {
  //   const base = getComputedStyle(document.body).getPropertyValue("var(--fg)");
  //   const accent = getComputedStyle(document.body).getPropertyValue(
  //     "var(--accent-100)"
  //   );

  //   return {
  //     base,
  //     accent,
  //   };
  // }, []);

  const Option = ({ name }: { name: string }) => {
    const scale = useState<number>(1);
    const highlight = useState<number>(0);

    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const scrollPos = ref.current?.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const centerPos = windowHeight / 2;
      if (scrollPos) {
        const centerDist = Math.abs(scrollPos - centerPos) / windowHeight;
        const scaleX = centerDist * 8;
        const highlightX = centerDist * 12;
        const _scale = scaleX >= Math.PI ? 0 : (Math.cos(scaleX) + 1) / 8;
        const _highlight =
          highlightX >= Math.PI ? 0 : (Math.cos(highlightX) + 1) / 2;
        scale[1](_scale + 1);
        highlight[1](_highlight);
      }
    }, [reset[0]]);

    const isSelected = selected[0].includes(name);
    return (
      <button
        ref={ref}
        className={
          "text-2xl mt-16 block relative whitespace-nowrap w-full text-center" +
          (isSelected ? " text-accent-mid bg-accent-mid/10" : "")
        }
        // style={{
        //   scale: scale[0],
        //   color: `#${interpolateColor(fade.accent, fade.base, highlight[0])}`,
        // }}
        onClick={() => {
          selected[1]([...selected[0], name]);
          reset[1]([]);
        }}
        disabled={isSelected}
      >
        {name}
      </button>
    );
  };

  const handleRemove = ({ name }: { name: string }) => {
    selected[1](selected[0].filter((option) => option !== name));
    reset[1]([]);
  };

  return (
    <main
      className={
        "pt-0 w-screen max-w-screen h-screen max-h-screen no-scrollbar overflow-auto"
      }
      onScroll={() => reset[1]([])}
    >
      <section className="z-10 fixed w-full px-4 pt-12 left-0 top-0 max-h-screen flex flex-col bg-bg">
        <div className="w-full h-16 bg-gradient-to-b absolute -bottom-16 left-0 from-bg via-bg/80 via-35%" />

        <h2 className="z-10 relative text-right">Elle Fiorentino-Lange</h2>
        <nav className="z-10 relative flex flex-row-reverse gap-8 mb-4">
          <Link href="#">Home</Link>
          <Link href="#">Contact</Link>
          <Link href="#">Portfolio</Link>
          <Link href="#">Blog</Link>
        </nav>

        <ElleLM
          selected={selected[0]}
          reset={reset[0]}
          handleRemove={handleRemove}
          state={state}
        />
      </section>

      <section className="flex flex-col items-center mt-[calc(100vh_-_4rem)]">
        <h1 className="text-center">I'm a</h1>
        <Option name="Developer" />
        <Option name="Designer" />
        <Option name="Engineer" />
      </section>

      <section className=" flex flex-col items-center mt-24">
        <h1 className="text-center">interested in</h1>
        <Option name="Startups" />
        <Option name="Typography" />
        <Option name="Language Models" />
      </section>

      <section className=" flex flex-col items-center mt-24">
        <h1 className="text-center">who knows</h1>
        <Option name="Javascript" />
        <Option name="Typescript" />
        <Option name="Python" />
        <Option name="CSS" />
        <Option name="Tailwind" />
        <Option name="React" />
        <Option name="Next.js" />
        <Option name="Firebase" />
        <Option name="SQL" />
        <Option name="Transformers" />
        <Option name="Langchain" />
        <Option name="RAG LLMs" />
        <Option name="Vector Databases" />
      </section>

      <div className="h-1/2" />
    </main>
  );
}
