"use client";

import Link from "next/link";
import ElleLM from "./components/ElleLM";
import { useState } from "react";

export default function Home() {
  const selected = useState<Array<string>>([]);

  const reset = useState([]);

  const Option = ({ name }: { name: string }) => {
    const isSelected = selected[0].includes(name);
    return (
      <button
        className={"text-lg ml-1 block" + (isSelected ? " opacity-30" : "")}
        onClick={() => {
          if (isSelected) handleRemove(name);
          else selected[1]([...selected[0], name]);
          reset[1]([]);
        }}
        disabled={isSelected}
      >
        {name}
      </button>
    );
  };

  const handleRemove = (name: string) => {
    selected[1](selected[0].filter((option) => option !== name));
    reset[1]([]);
  };

  return (
    <main className="home-grid gap-1 w-screen h-screen max-w-screen max-h-screen overflow-hidden p-8">
      <section>
        <h1>I'm a</h1>
        <Option name="Developer" />
        <Option name="Designer" />
        <Option name="Engineer" />
      </section>

      <section>
        <h1>interested in</h1>
        <Option name="Startups" />
        <Option name="Typography" />
        <Option name="Language Models" />
      </section>

      <section>
        <h1>who knows</h1>
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

      <ElleLM
        selected={selected[0]}
        reset={reset}
        handleRemove={handleRemove}
      />

      <section className="place-self-end">
        <h2 className="text-right leading-5 mb-8">
          <span className="mr-2 leading-5">Elle</span>
          <br />
          Fiorentino-Lange
        </h2>
      </section>

      <nav className="flex flex-row-reverse gap-12 text-lg">
        <Link href="#">Home</Link>
        <Link href="#">Contact</Link>
        <Link href="#">Portfolio</Link>
        <Link href="#">Blog</Link>
      </nav>
    </main>
  );
}
