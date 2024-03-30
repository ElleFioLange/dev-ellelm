import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Loading from "./Loading";

export default function ElleLM({
  selected,
  handleChange,
}: {
  selected: Array<string>;
  handleChange: (args: { change: "remove"; name: string }) => void;
}) {
  const [text, setText] = useState("");

  const displayText = useMemo(() => {
    if (text) return text;
    if (selected.length) return "";
    return "Select one or more items above to learn more.";
  }, [text, selected]);

  const ref = useRef<HTMLParagraphElement>(null);

  const handleExplain = async () => {
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
      const text = new TextDecoder().decode(value);
      const add = document.createElement("span");
      add.innerText = text;
      add.className = "animate-stream";
      ref.current?.appendChild(add);
      result += text;
      setText(result);
      ref.current?.scrollTo({
        top: ref.current.scrollHeight,
      });
    }
  };

  return (
    <section className="ellelm-grid">
      <h1 className={selected.length ? "" : " opacity-30"}>Tell me about </h1>

      {selected.length ? (
        <Loading
          duration={3}
          onLoad={handleExplain}
          reset={selected}
          className="col-span-2"
        />
      ) : (
        <div className="h-0.5 rounded-full bg-dark/30 dark:bg-light/30" />
      )}

      <div>
        {selected.map((name) => (
          <button
            key={name}
            className="text-lg cursor-pointer block hover:text-red"
            onClick={() => handleChange({ change: "remove", name })}
          >
            {name}
          </button>
        ))}
      </div>

      <p
        className="font-corm ml-2 pr-2 whitespace-pre-wrap overflow-auto h-full"
        ref={ref}
      >
        {/* {displayText} */}
      </p>
    </section>
  );
}
