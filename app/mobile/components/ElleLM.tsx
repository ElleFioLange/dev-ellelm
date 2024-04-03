import { useMemo, useRef, useState } from "react";
import Loading from "../../components/Loading";

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
    }
  };

  return (
    <div className="bg-light flex flex-col sticky top-0 dark:bg-dark max-h-screen">
      <h1 className={"sticky top-0" + (selected.length ? "" : " opacity-30")}>
        Tell me about{" "}
      </h1>
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
      <div className="flex gap-2">
        {selected.map((name) => (
          <button
            key={name}
            className="text-2xl cursor-pointer hover:text-red"
            onClick={() => handleChange({ change: "remove", name })}
          >
            {name}
          </button>
        ))}
      </div>
      {/* TODO Use state to manage expand and hide/show of cancel/close button */}
      <p
        className="font-cormorant w-full bg-light dark:bg-dark relative whitespace-pre-wrap overflow-auto max-h-[60vh] overscroll-none"
        ref={ref}
      >
        {!selected.length && (
          <>
            Select one or more option below to learn more.
            <span className="block w-full h-8 bg-gradient-to-b from-light dark:from-dark absolute top-0" />
          </>
        )}
        {/* Select one or more option below to learn more. Select one or more option
        below to learn more. Select one or more option below to learn more.
        Select one or more option below to learn more. Select one or more option
        below to learn more. Select one or more option below to learn more.
        Select one or more option below to learn more. Select one or more option
        Select one or more option below to learn mo Select one or more option
        below to learn mo Select one or more option below to learn mo Select one
        or more option below to learn mo Select one or more option below to
        learn mo Select one or more option below to learn mo Select one or more
        option below to learn mo Select one or more option below to learn mo
        Select one or more option below to learn mo Select one or more option
        below to learn mo below to learn mo below to learn mo below to learn mo
        below to learn mo below to learn mo below to learn mo below to learn mo
        below to learn mo below to learn mo below to learn mo below to learn mo
        below to learn mo below to learn mo below to learn mo below to learn mo
        Select one or more option below to learn more. Select one or more option
        below to learn more. Select one or more option below to learn more.
        Select one or more option below to learn more. Select one or more option
        below to learn more. Select one or more option below to learn more.
        Select one or more option below to learn more. Select one or more option
        Select one or more option below to learn mo Select one or more option
        below to learn mo Select one or more option below to learn mo Select one
        or more option below to learn mo Select one or more option below to
        learn mo Select one or more option below to learn mo Select one or more
        option below to learn mo Select one or more option below to learn mo
        Select one or more option below to learn mo Select one or more option
        below to learn mo below to learn mo below to learn mo below to learn mo
        below to learn mo below to learn mo below to learn mo below to learn mo
        below to learn mo below to learn mo below to learn mo below to learn mo
        below to learn mo below to learn mo below to learn mo below to learn mo */}
      </p>
      {/* <button className=" w-full text-top text-red text-4xl text-center pt-[10vw]">
        Close
      </button> */}
    </div>
  );
}
