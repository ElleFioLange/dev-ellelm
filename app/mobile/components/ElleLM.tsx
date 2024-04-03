import { useMemo, useRef, useState } from "react";
import Loading from "../../components/Loading";

export default function ElleLM({
  selected,
  handleChange,
  reset,
}: {
  selected: Array<string>;
  handleChange: (args: { change: "remove"; name: string }) => void;
  // Used to reset the Loading component
  reset: never[];
}) {
  const state = useState<
    | 0 // Idle
    | 1 // Streaming
    | 2 // Finished
    | 3 // Canceled
  >(0);
  const reader = useState<ReadableStreamReader<Uint8Array>>();

  const ref = useRef<HTMLParagraphElement>(null);

  const handleExplain = async () => {
    const response = await fetch("/api/explain", {
      method: "POST",
      body: JSON.stringify({ selected }),
    });

    state[1](1); // Streaming

    const _reader = response.body?.getReader();

    if (!_reader) return;

    reader[1](_reader);

    let result = "";
    while (true) {
      const { done, value } = await _reader.read();
      if (done) break;
      const text = new TextDecoder().decode(value);
      const add = document.createElement("span");
      add.innerText = text;
      add.className = "animate-fade-in";
      ref.current?.appendChild(add);
      result += text;
    }
    // Adds blank space at the bottom of the text so that the text will scroll to a readable position.
    const add = document.createElement("span");
    add.className = "h-[40vh] w-full block";
    ref.current?.appendChild(add);

    state[1](2); // Finished
  };

  const handleCancel = () => {
    reader[0]?.cancel();
    state[1](3); // Canceled
  };

  const handleClose = () => {
    if (state[0] === 2) {
      reader[0]?.cancel();
    }
    ref.current?.classList.add("animate-fade-out");
    setTimeout(() => {
      if (ref.current) ref.current.textContent = "";
      ref.current?.classList.remove("animate-fade-out");
      state[1](0); // Idle
    }, 950);
  };

  return (
    <div className="max-h-full relative overflow-hidden flex flex-col">
      <div
        className={
          "fixed box-content left-0 bottom-0 w-screen transition-all duration-[2.5s] border-dark dark:border-light ease-in-out bg-salmon dark:bg-eggplant" +
          (state[0] > 0 ? " h-screen border-t-2" : " h-0 border-t-0")
        }
      />
      <h1
        className={
          "transition-all z-10 shrink-0 duration-500 ease-in-out overflow-hidden" +
          (selected.length ? " h-12" : " h-0")
        }
      >
        Tell me about{" "}
      </h1>
      <div className="z-10">
        {selected.length ? (
          <Loading
            duration={3}
            onLoad={handleExplain}
            reset={reset}
            className="col-span-2"
          />
        ) : (
          <div className="h-0.5 rounded-full bg-dark/30 dark:bg-light/30" />
        )}
      </div>
      <div
        className={
          "flex z-10 gap-2 w-full overflow-auto transition-all shrink-0 duration-300 ease-in-out" +
          (selected.length ? " my-2" : " my-0")
        }
      >
        {selected.map((name) => (
          <button
            key={name}
            className="text-2xl cursor-pointe whitespace-nowrap hover:text-red"
            onClick={() => handleChange({ change: "remove", name })}
          >
            {name}
          </button>
        ))}
      </div>
      {/* TODO Use state to manage expand and hide/show of cancel/close button */}
      <p
        className="font-cormorant w-full max-h-full pr-4 relative whitespace-pre-wrap overflow-auto grow overscroll-none"
        ref={ref}
      >
        {state[0] === 0 &&
          selected.length === 0 &&
          "Select one or more items below to learn more."}
      </p>
      <button
        onClick={state[0] > 1 ? handleClose : handleCancel}
        className={
          "w-full bg-light dark:bg-dark py-4 fixed bottom-0 left-0 transition-all duration-500 text-4xl text-center" +
          (state[0] > 0
            ? " opacity-1 translate-y-0"
            : " opacity-0 translate-y-8")
        }
      >
        {state[0] > 1 ? "Close" : "Cancel"}
      </button>
    </div>
  );
}
