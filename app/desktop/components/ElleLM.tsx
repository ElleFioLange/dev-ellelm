import { Dispatch, useMemo, useRef, useState } from "react";
import Loading from "@/app/components/Loading";
import { State } from "@/utils/types/state";
import _handleExplain from "@/utils/functions/handlers/handleExplain";
import _handleClose from "@/utils/functions/handlers/handleClose";
import _handleCancel from "@/utils/functions/handlers/handleCancel";

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

  const handleExplain =
    // Uncomment to disable GPT inference
    // () => {};
    () => _handleExplain({ prevExplained, selected, state, reader, ref, text });
  async () => {
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
    prevExplained[1]([...selected]);
  };

  const handleCancel = () => _handleCancel({ reader, state });

  const handleClose = () => _handleClose({ ref, state, reset });

  return (
    <section className="ellelm-grid overflow-hidden">
      {/* --- Paragraph background --- */}
      <div
        className={
          "transition-all place-self-end w-full duration-[2.5s] ease-in-out bg-accent-bg" +
          (state[0] > 0 ? " h-full" : " h-0")
        }
      />
      {/* ---------------------------- */}

      {/* TODO Add "Telling you about" state when explaining (?) */}
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

      <Loading
        duration={3}
        delay={1.5}
        resetDuration={0.5}
        onLoad={handleExplain}
        reset={reset}
        className="col-span-2"
        paused={
          (prevExplained.length &&
            JSON.stringify([...selected].sort()) ===
              JSON.stringify([...prevExplained[0]].sort())) ||
          paused[0] ||
          state[0] > 0 ||
          !selected.length
        }
      />

      <div className="transition-all duration-[2.5s] ease-in-out">
        {selected.map((name) => (
          <button
            key={name}
            className={
              "text-lg opacity-1 disabled:opacity-30 pl-1 pr-2 w-full text-left cursor-pointer transition-all duration-150 ease-in-out block enabled:hover:text-red enabled:hover:bg-red/10"
            }
            onClick={() => {
              handleRemove(name);
              paused[1](false);
            }}
            disabled={state[0] > 0}
            onMouseEnter={() => paused[1](true)}
            onMouseLeave={() => paused[1](false)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* TODO Make previous text viewable after close */}
      <p
        className="font-cormorant pr-12 pt-2 pb-64 pl-8 whitespace-pre-wrap overflow-auto h-full"
        ref={ref}
      />
    </section>
  );
}
