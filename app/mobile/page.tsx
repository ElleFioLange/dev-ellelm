"use client";

import { useState } from "react";
import ElleLM from "./components/ElleLM";
import { State } from "@/utils/types/state";
import _handleRemove from "@/utils/functions/handlers/handleRemove";
import Nav from "../components/Nav";

// TODO Use localStorage to recommend visitors to check out mobile site if they haven't visited it yet (bc it's just so good)

export default function Home() {
  const selected = useState<Array<string>>([]);
  const state = useState<State>(0);

  const reset = useState([]);

  const Option = ({ name }: { name: string }) => {
    const isSelected = selected[0].includes(name);
    return (
      <button
        className={
          "text-2xl mt-16 block relative whitespace-nowrap w-full text-center" +
          (isSelected ? " text-green bg-green/10" : "")
        }
        onClick={() => {
          if (isSelected) handleRemove(name);
          else selected[1]([...selected[0], name]);
          reset[1]([]);
        }}
      >
        {name}
      </button>
    );
  };

  const handleRemove = (name: string) =>
    _handleRemove({ name, selected, reset });

  return (
    <main
      className="animate-fade-in pt-0 w-screen max-w-screen h-screen max-h-screen no-scrollbar overflow-auto"
      onScroll={() => reset[1]([])}
    >
      <header className="z-10 fixed w-full px-4 pt-6 left-0 top-0 max-h-screen flex flex-col bg-bg">
        <div className="w-full h-16 bg-gradient-to-b absolute -bottom-16 left-0 from-bg via-bg/80 via-35%" />

        <h2 className="z-10 relative text-right text-3xl overflow-x-auto shrink-0 whitespace-nowrap">
          Elle Fiorentino-Lange
        </h2>
        <Nav
          reset={reset}
          className="z-10 overflow-x-auto shrink-0 relative transition-all duration-500 ease-in-out gap-8 mb-4"
        />

        <ElleLM
          selected={selected[0]}
          reset={reset}
          handleRemove={handleRemove}
          state={state}
        />
      </header>

      <section className="flex flex-col items-center mt-48 animate-scroll-up">
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

      <section className=" flex flex-col items-center mt-24 mb-[25%]">
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
        <Option name="RAG LLMs" />
        <Option name="Vector Databases" />
      </section>
    </main>
  );
}
