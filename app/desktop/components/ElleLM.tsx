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

      <h1 className={selected.length ? "" : " opacity-30"}>Ask me about </h1>

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
        Select one or more items below to learn more. Powered by Claude
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="fill-fg inline-block p-0.5 pb-1"
          // fill="#000000"
        >
          <path d="m4.714 15.956l4.718-2.648l.079-.23l-.08-.128h-.23l-.79-.048l-2.695-.073l-2.337-.097l-2.265-.122l-.57-.121l-.535-.704l.055-.353l.48-.321l.685.06l1.518.104l2.277.157l1.651.098l2.447.255h.389l.054-.158l-.133-.097l-.103-.098l-2.356-1.596l-2.55-1.688l-1.336-.972l-.722-.491L2 6.223l-.158-1.008l.656-.722l.88.06l.224.061l.893.686l1.906 1.476l2.49 1.833l.364.304l.146-.104l.018-.072l-.164-.274l-1.354-2.446l-1.445-2.49l-.644-1.032l-.17-.619a3 3 0 0 1-.103-.729L6.287.133L6.7 0l.995.134l.42.364l.619 1.415L9.735 4.14l1.555 3.03l.455.898l.243.832l.09.255h.159V9.01l.127-1.706l.237-2.095l.23-2.695l.08-.76l.376-.91l.747-.492l.583.28l.48.685l-.067.444l-.286 1.851l-.558 2.903l-.365 1.942h.213l.243-.242l.983-1.306l1.652-2.064l.728-.82l.85-.904l.547-.431h1.032l.759 1.129l-.34 1.166l-1.063 1.347l-.88 1.142l-1.263 1.7l-.79 1.36l.074.11l.188-.02l2.853-.606l1.542-.28l1.84-.315l.832.388l.09.395l-.327.807l-1.967.486l-2.307.462l-3.436.813l-.043.03l.049.061l1.548.146l.662.036h1.62l3.018.225l.79.522l.473.638l-.08.485l-1.213.62l-1.64-.389l-3.825-.91l-1.31-.329h-.183v.11l1.093 1.068l2.003 1.81l2.508 2.33l.127.578l-.321.455l-.34-.049l-2.204-1.657l-.85-.747l-1.925-1.62h-.127v.17l.443.649l2.343 3.521l.122 1.08l-.17.353l-.607.213l-.668-.122l-1.372-1.924l-1.415-2.168l-1.141-1.943l-.14.08l-.674 7.254l-.316.37l-.728.28l-.607-.461l-.322-.747l.322-1.476l.388-1.924l.316-1.53l.285-1.9l.17-.632l-.012-.042l-.14.018l-1.432 1.967l-2.18 2.945l-1.724 1.845l-.413.164l-.716-.37l.066-.662l.401-.589l2.386-3.036l1.439-1.882l.929-1.086l-.006-.158h-.055L4.138 18.56l-1.13.146l-.485-.456l.06-.746l.231-.243l1.907-1.312Z" />
        </svg>
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
