import { Dispatch, useMemo, useRef, useState } from "react";
import Loading from "@/app/components/Loading";
import { State } from "@/utils/types/state";
import _handleExplain from "@/utils/functions/handlers/handleExplain";
import _handleClose from "@/utils/functions/handlers/handleClose";
import _handleCancel from "@/utils/functions/handlers/handleCancel";
import _handleReturn from "@/utils/functions/handlers/handleReturn";

export default function ElleLM({
  selected,
  handleRemove,
  reset,
  state,
  paused,
}: {
  selected: Array<string>;
  handleRemove: (names: string[]) => void;
  reset: [never[], Dispatch<never[]>];
  state: [State, Dispatch<State>];
  paused: [boolean, Dispatch<boolean>];
}) {
  const text = useState("");
  const reader = useState<ReadableStreamReader<Uint8Array>>();
  const prevExplained = useState<string[]>([]);

  const ref = useRef<HTMLParagraphElement>(null);

  const matchesPrev =
    prevExplained[0].length &&
    JSON.stringify([...selected].sort()) ===
      JSON.stringify([...prevExplained[0]].sort());

  const handleExplain =
    // Uncomment to disable GPT inference
    // () => {};
    () => _handleExplain({ prevExplained, selected, state, reader, ref, text });

  const handleCancel = () => _handleCancel({ reader, state });

  const handleClose = () => _handleClose({ ref, state, reset });

  const handleReturn = () => _handleReturn({ state, ref, text });

  return (
    <section className="ellelm-grid overflow-hidden">
      {/* --- Paragraph background --- */}
      {/* TODO Add fade at bottom of paragraph (attach here with z-20 to anchor to bottom) */}
      <div
        className={
          "transition-all place-self-end w-full duration-[2.5s] ease-in-out bg-accent-bg" +
          (state[0] > 0 ? " h-full" : " h-0")
        }
      />
      {/* ---------------------------- */}

      <h1 className={selected.length ? "" : " opacity-30"}>Tell me about </h1>

      <button
        className={
          "relative text-xl w-min px-2 place-self-end transition-all duration-150 ease-in-out" +
          ((state[0] > 0 && state[0] < 4) || matchesPrev
            ? " opacity-1 translate-y-0"
            : " opacity-0 translate-y-8") +
          (state[0] > 0 && state[0] < 4
            ? " text-red enabled:hover:bg-red/10"
            : " text-green enabled:hover:bg-green/10")
        }
        onClick={() => {
          if (state[0] > 1) handleClose();
          else if (state[0] === 1) handleCancel();
          else handleReturn();
        }}
        disabled={(state[0] === 0 && !matchesPrev) || state[0] === 4}
      >
        {state[0] > 1 && state[0] < 4 ? "Close" : ""}
        {state[0] === 1 ? "Cancel" : ""}
        {(state[0] === 0 || state[0] === 4) && matchesPrev ? "Return" : ""}
      </button>

      <Loading
        duration={3}
        delay={1.5}
        resetDuration={0.5}
        onLoad={handleExplain}
        reset={reset}
        className="col-span-2"
        paused={matchesPrev || paused[0] || state[0] > 0 || !selected.length}
      />

      <p
        className={
          "transition-all duration-150 ease-in-out font-cormorant mt-1 ml-1 pointer-events-none" +
          (!selected.length ? " opacity-1" : " opacity-0")
        }
      >
        Select one or more options above to learn more.
      </p>

      {/* TODO Add hover states in case mobile is used with mouse (iPad) */}
      <div className="transition-all duration-[2.5s] ease-in-out">
        {selected.map((name) => (
          <button
            key={name}
            className={
              "text-lg opacity-1 disabled:opacity-30 pl-1 pr-2 w-full text-left cursor-pointer transition-all duration-150 ease-in-out block enabled:hover:text-red enabled:hover:bg-red/10"
            }
            onClick={() => {
              handleRemove([name]);
              paused[1](false);
            }}
            disabled={state[0] > 0}
            onMouseEnter={() => paused[1](true)}
            onMouseLeave={() => paused[1](false)}
          >
            {name}
          </button>
        ))}
        {selected.length > 0 && (
          <button
            onClick={() => {
              handleRemove(selected);
              paused[1](false);
            }}
            disabled={state[0] > 0}
            onMouseEnter={() => paused[1](true)}
            onMouseLeave={() => paused[1](false)}
            className="text-red text-lg opacity-1 disabled:opacity-30 pl-1 pr-2 w-full text-left cursor-pointer transition-all duration-150 ease-in-out block enabled:hover:bg-red/10"
          >
            Clear
          </button>
        )}
      </div>

      <p
        className="font-cormorant pr-10 mr-2 mt-2 mb-2 pb-64 pl-6 relative whitespace-pre-wrap overflow-auto"
        ref={ref}
      />
    </section>
  );
}
