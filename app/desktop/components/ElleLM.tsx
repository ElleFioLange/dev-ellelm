import { Dispatch, useMemo, useRef, useState } from "react";
import Loading from "@/app/components/Loading";
import { State } from "@/utils/types/state";

export default function ElleLM({
  selected,
  handleRemove,
  reset,
  state,
  paused,
}: {
  selected: Array<string>;
  handleRemove: (name: string) => void;
  reset: [never[], Dispatch<never[]>];
  state: [State, Dispatch<State>];
  paused: [boolean, Dispatch<boolean>];
}) {
  const text = useState("");
  const reader = useState<ReadableStreamReader<Uint8Array>>();
  const prevExplained = useState<string[]>([]);

  const ref = useRef<HTMLParagraphElement>(null);

  // TODO Fix bug with repeated inferences
  const handleExplain =
    // Uncomment to disable GPT inference
    // () => {};
    async () => {
      // Use timeout because Loading component resets when prevExplained is updated
      setTimeout(() => prevExplained[1]([...selected]), 1000);

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
        const _text = new TextDecoder().decode(value);
        if (_text.includes("errno")) {
          // TODO Error handling
          break;
        }
        const add = document.createElement("span");
        add.innerText = _text;
        add.className = "animate-fade-in";
        ref.current?.appendChild(add);
        result += _text;
      }

      text[1](result);
      state[1](2); // Finished
    };

  const handleCancel = () => {
    reader[0]?.cancel();
    state[1](3); // Canceled
  };

  // TODO Consolidate handlers across desktop and mobile into util file

  const handleClose = () => {
    ref.current?.classList.add("animate-fade-out");
    state[1](4); // Closing
    reset[1]([]);
    setTimeout(() => {
      if (ref.current) ref.current.textContent = "";
      ref.current?.classList.remove("animate-fade-out");
      state[1](0); // Idle
    }, 1000);
  };

  return (
    <section className="ellelm-grid overflow-hidden">
      <div
        className={
          "box-content left-0 bottom-0 w-full transition-all duration-[2.5s] border-fg ease-in-out c-invert" +
          (state[0] > 0 ? " h-full border-t-2" : " h-0 border-t-0")
        }
      />
      <div
        className={
          "box-content left-0 bottom-0 w-full transition-all duration-[2.5s] border-fg ease-in-out bg-accent/10" +
          (state[0] > 0 ? " h-full border-t-2" : " h-0 border-t-0")
        }
      />
      <h1 className={selected.length ? "" : " opacity-30"}>Tell me about </h1>
      <button
        //  TODO transition height add overflow-hidden
        className={
          "relative text-xl w-min px-2 place-self-end text-red hover:bg-red/10 transition-all duration-150 ease-in-out" +
          (state[0] > 0 && state[0] < 4 ? " opacity-1" : " opacity-0")
        }
        onClick={state[0] > 1 ? handleClose : handleCancel}
        disabled={state[0] === 0 || state[0] === 4}
      >
        {state[0] > 1 ? "Close" : "Cancel"}
      </button>

      {/* <button className={""} /> */}

      <Loading
        duration={3}
        delay={1.5}
        resetDuration={0.5}
        onLoad={handleExplain}
        reset={reset}
        className="col-span-2"
        paused={
          (prevExplained.length &&
            JSON.stringify(selected) === JSON.stringify(prevExplained[0])) ||
          paused[0] ||
          state[0] > 0
        }
      />

      <div>
        {selected.map((name) => (
          <button
            key={name}
            className={
              "text-lg px-2 w-full text-left cursor-pointer transition-all duration-150 ease-in-out block hover:text-red hover:bg-red/10" +
              (state[0] > 0 ? " text-bg" : "")
            }
            onClick={() => {
              handleRemove(name);
              paused[1](false);
            }}
            onMouseEnter={() => paused[1](true)}
            onMouseLeave={() => paused[1](false)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* TODO Make previous text viewable after close */}
      <p
        className={
          "font-cormorant ml-4 whitespace-pre-wrap overflow-auto h-full" +
          (state[0] > 0 ? " pr-12 pt-2 pb-64" : " pr-0 pt-1 pb-0")
        }
        ref={ref}
      />
    </section>
  );
}
