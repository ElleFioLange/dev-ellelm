"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ElleLM from "./components/ElleLM";

export default function Home() {
  const [selected, setSelected] = useState<Array<string>>([]);
  const [recalculatePos, setRecalculatePos] = useState([]);

  const Option = ({ name }: { name: string }) => {
    const [pos, setPos] = useState<number | null>(null);

    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const scrollPos = ref.current?.getBoundingClientRect().top;
    });

    const isSelected = selected.includes(name);
    return (
      <button
        ref={ref}
        className={
          "text-2xl mb-8 block z-0" + (isSelected ? " opacity-30" : "")
        }
        onClick={() => setSelected([...selected, name])}
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
      setSelected(selected.filter((option) => option !== name));
    }
  };

  return (
    <main
      className={
        "p-4 pt-0 w-screen max-w-screen h-screen max-h-screen no-scrollbar overflow-auto"
      }
      onScroll={() => setRecalculatePos([])}
    >
      <section className="z-10 sticky top-0 pt-4 relative max-h-full bg-light dark:bg-dark">
        <h2 className="text-right">Elle Fiorentino-Lange</h2>
        <nav className="relative flex flex-row-reverse gap-8">
          <Link href="#">Home</Link>
          <Link href="#">Contact</Link>
          <Link href="#">Portfolio</Link>
          <Link href="#">Blog</Link>
        </nav>

        <ElleLM selected={selected} handleChange={handleChange} />

        <div className="w-full h-16 bg-gradient-to-b absolute -bottom-16 from-light dark:from-dark" />
      </section>

      <section className="flex flex-col justify-center mt-16">
        <h1 className="text-center">I'm a</h1>
        <Option name="Developer" />
        <Option name="Designer" />
        <Option name="Engineer" />
      </section>

      <section className=" flex flex-col justify-center mt-16">
        <h1 className="text-center">interested in</h1>
        <Option name="Startups" />
        <Option name="Typography" />
        <Option name="Language Models" />
      </section>

      <section className=" flex flex-col justify-center mt-16">
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
      <div className="h-1/2"></div>
    </main>
  );
}
