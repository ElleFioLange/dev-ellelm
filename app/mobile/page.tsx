"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ElleLM from "./components/ElleLM";
import colors from "@/utils/constants/colors";

export default function Home() {
  const selected = useState<Array<string>>([]);
  const recalculatePos = useState([]);

  const reset = useState([]);

  const Option = ({ name }: { name: string }) => {
    const scale = useState<number>(1);
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const scrollPos = ref.current?.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const centerPos = windowHeight / 2.1;
      if (scrollPos) {
        const centerDist =
          (Math.abs(scrollPos - centerPos) / windowHeight) * 30;
        const x = centerDist;
        const _scale = x >= Math.PI ? 0 : (Math.cos(x) + 1) / 6;
        scale[1](_scale + 1);
      }
    }, [reset[0]]);

    const isSelected = selected[0].includes(name);
    return (
      <button
        ref={ref}
        className={
          "text-2xl mt-16 block z-0 w-min whitespace-nowrap" +
          (isSelected ? " opacity-30" : "")
        }
        style={{
          scale: scale[0],
        }}
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

  const handleChange = ({
    change,
    name,
  }: {
    change: "remove";
    name: string;
  }) => {
    if (change === "remove") {
      selected[1](selected[0].filter((option) => option !== name));
      reset[1]([]);
    }
  };

  return (
    <main
      className={
        "pt-0 w-screen max-w-screen h-screen max-h-screen no-scrollbar overflow-auto"
      }
      onScroll={() => reset[1]([])}
    >
      <section className="z-10 fixed w-full px-4 pt-12 left-0 top-0 max-h-screen flex flex-col bg-light dark:bg-dark">
        <div className="w-full h-16 bg-gradient-to-b absolute -bottom-16 from-light dark:from-dark via-light/80 dark:via-dark/80 via-35%" />

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
          handleChange={handleChange}
        />
      </section>

      <section className="flex flex-col  items-center mt-[calc(100vh_-_4rem)]">
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
