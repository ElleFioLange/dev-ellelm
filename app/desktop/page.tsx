"use client";

import Link from "next/link";
import ElleLM from "./components/ElleLM";
import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState<Array<string>>([]);

  const Option = ({ name }: { name: string }) => {
    const isSelected = selected.includes(name);
    return (
      <button
        className={"text-lg ml-1 block" + (isSelected ? " opacity-30" : "")}
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

      <ElleLM selected={selected} handleChange={handleChange} />

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
