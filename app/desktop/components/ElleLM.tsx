import { Dispatch, useMemo, useRef, useState } from "react";
import Loading from "@/app/components/Loading";

export default function ElleLM({
  selected,
  handleRemove,
  reset,
}: {
  selected: Array<string>;
  handleRemove: (name: string) => void;
  reset: [never[], Dispatch<never[]>];
}) {
  const text = useState("");

  const displayText = useMemo(() => {
    if (text) return text;
    if (selected.length) return "";
    return "Select one or more items above to learn more.";
  }, [text, selected]);

  const ref = useRef<HTMLParagraphElement>(null);

  const handleExplain =
    // Uncomment to disable GPT inference
    // () => {};
    async () => {
      const response = await fetch("/api/explain", {
        method: "POST",
        body: JSON.stringify({ selected }),
      });

      const reader = response.body?.getReader();

      if (!reader) return;

      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const _text = new TextDecoder().decode(value);
        const add = document.createElement("span");
        add.innerText = _text;
        add.className = "animate-stream";
        ref.current?.appendChild(add);
        result += _text;
        text[1](result);
        ref.current?.scrollTo({
          top: ref.current.scrollHeight,
        });
      }
    };

  return (
    <section className="ellelm-grid">
      <h1 className={selected.length ? "" : " opacity-30"}>Tell me about </h1>

      <Loading
        duration={3}
        delay={1.5}
        resetDuration={0.5}
        onLoad={handleExplain}
        reset={reset}
        className="col-span-2"
        paused={!selected.length}
      />

      <div>
        {selected.map((name) => (
          <button
            key={name}
            className="text-lg cursor-pointer block hover:text-red"
            onClick={() => handleRemove(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* TODO Make previous text viewable after close */}
      <p
        className="font-corm ml-2 pr-2 whitespace-pre-wrap overflow-auto h-full"
        ref={ref}
      >
        {/* {displayText} */}
      </p>
    </section>
  );
}
