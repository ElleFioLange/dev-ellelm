"use client";

import Link from "next/link";
import ElleLM from "./components/ElleLM";
import { useState } from "react";
import { State } from "@/utils/types/state";

// TODO Fade in intro animation
export default function Home() {
  const selected = useState<Array<string>>([]);
  const state = useState<State>(0);
  const reset = useState([]);
  const paused = useState(false);

  const Option = ({ name }: { name: string }) => {
    const isSelected = selected[0].includes(name);

    return (
      <button
        className={
          "text-lg pl-1 opacity-1 disabled:opacity-30 bg-bg block w-full transition-all duration-300 ease-in-out text-left" +
          (isSelected
            ? " text-green cursor-pointer bg-green/10 enabled:hover:text-red enabled:hover:bg-red/10"
            : " enabled:hover:bg-green/10 enabled:hover:text-green")
        }
        onClick={() => {
          if (isSelected) handleRemove(name);
          else selected[1]([...selected[0], name]);
          reset[1]([]);
        }}
        disabled={state[0] > 0}
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
      <section
        onMouseEnter={() => {
          if (!paused[0]) {
            paused[1](true);
            reset[1]([]);
          }
        }}
        onMouseLeave={() => {
          if (paused[0]) paused[1](false);
        }}
      >
        <h1>I'm a</h1>
        <Option name="Developer" />
        <Option name="Designer" />
        <Option name="Engineer" />
      </section>
      <section
        onMouseEnter={() => {
          if (!paused[0]) {
            paused[1](true);
            reset[1]([]);
          }
        }}
        onMouseLeave={() => {
          if (paused[0]) paused[1](false);
        }}
      >
        <h1>interested in</h1>
        <Option name="Startups" />
        <Option name="Typography" />
        <Option name="Language Models" />
      </section>
      <section
        onMouseEnter={() => {
          if (!paused[0]) {
            paused[1](true);
            reset[1]([]);
          }
        }}
        onMouseLeave={() => {
          if (paused[0]) paused[1](false);
        }}
      >
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
        state={state}
        paused={paused}
      />
      <section className="place-self-end">
        <h2 className="text-right leading-5 mb-8">
          <span className="mr-2 leading-5">Elle</span>
          <br />
          Fiorentino-Lange
        </h2>
      </section>
      {/* // TODO Font cormorant */}
      <nav
        className="flex flex-row-reverse gap-12 text-lg"
        onMouseEnter={() => {
          paused[1](true);
          reset[1]([]);
        }}
        onMouseLeave={() => paused[1](false)}
      >
        <Link href="#">Home</Link>
        <Link href="#">Contact</Link>
        <Link href="#">Portfolio</Link>
        <Link href="#">Blog</Link>
      </nav>
    </main>
  );
}
