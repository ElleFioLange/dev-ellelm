import { Dispatch, useEffect, useMemo, useRef, useState } from "react";
import Loading from "../../components/Loading";
import { State } from "@/utils/types/state";
import _handleExplain from "@/utils/functions/handlers/handleExplain";
import _handleCancel from "@/utils/functions/handlers/handleCancel";
import _handleClose from "@/utils/functions/handlers/handleClose";
import _handleReturn from "@/utils/functions/handlers/handleReturn";

export default function ElleLM({
  selected,
  handleRemove,
  reset,
  state,
}: {
  selected: Array<string>;
  handleRemove: (name: string) => void;
  // Used to reset the Loading component
  reset: [never[], Dispatch<never[]>];
  state: [State, Dispatch<State>];
}) {
  // TODO Store all past inferences (object with keys as sorted selected items)
  const text = useState("");
  const reader = useState<ReadableStreamReader<Uint8Array>>();
  // Selected state
  const selState = useState<
    | 0 // Closed
    | 1 // Preview
    | 2 // Open
  >(0);
  const prevExplained = useState<string[]>([]);

  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (selected.length) {
      if (selState[0] === 0) selState[1](1); // Preview
    } else {
      selState[1](0); // Closed
    }
  }, [selected]);

  const matchesPrev =
    prevExplained[0].length &&
    JSON.stringify([...selected].sort()) ===
      JSON.stringify([...prevExplained[0]].sort());

  const handleExplain =
    // Uncomment to disable GPT inference
    // () => {};
    () =>
      _handleExplain({
        prevExplained,
        selected,
        selState,
        state,
        reader,
        ref,
        text,
      });

  const handleCancel = () => _handleCancel({ reader, state });

  const handleClose = () => _handleClose({ ref, state, reset, selState });

  const handleReturn = () => _handleReturn({ state, ref, text, selState });

  return (
    <section
      className={
        "max-h-full w-full relative overflow-hidden flex flex-col transition-all duration-500 ease-in-out" +
        (selected.length ? " -mt-4" : " mt-0")
      }
    >
      <div
        className={
          "fixed box-content left-0 bottom-0 w-full transition-all duration-[2.5s] border-fg ease-in-out bg-accent-bg" +
          (state[0] > 0 ? " border-t-2" : " border-t-0")
        }
        style={{
          height: state[0] > 0 ? `calc(100% - 8.375rem)` : 0,
        }}
      />
      <h1
        className={
          "transition-all z-10 shrink-0 duration-500 ease-in-out overflow-hidden" +
          (selected.length ? " h-12" : " h-0")
        }
      >
        Tell me about
      </h1>
      <span
        className={
          "overflow-hidden font-cormorant text-center transition-all inline-block duration-500 ease-in-out" +
          (selState[0] === 0 && !selected.length
            ? " opacity-1 h-6"
            : " opacity-0 h-0")
        }
      >
        Select one or more items below to learn more.
      </span>
      <div className="z-10">
        <Loading
          duration={3}
          delay={1.5}
          resetDuration={0.5}
          onLoad={handleExplain}
          reset={reset[0]}
          className="col-span-2 z-10"
          paused={
            matchesPrev || selState[0] === 2 || state[0] > 0 || !selected.length
          }
        />
      </div>
      <div
        onClick={() => selState[1](2)}
        className={
          "shrink-0 flex overscroll-contain flex-col relative overflow-hidden w-full duration-500 ease-in-out transition-all" +
          (selState[0] === 0 ? " mt-0 h-0" : "") +
          (selState[0] === 1 ? " mt- h-14" : "") +
          (selState[0] === 2 ? " mt-4 h-[60vh]" : "")
        }
      >
        <div className="w-full overflow-y-auto overflow-x-hidden grow">
          <div
            id="selection-container"
            className="white-space-nowrap width-full flex gap-2"
            style={{
              height: selState[0] === 2 ? `${selected.length + 12}rem` : "",
            }}
          >
            {selected.map((name, i) => {
              let left = "0px";
              let top = "0px";
              if (selState[0] === 2) {
                const elm = document.getElementById(`selection-${name}`);
                if (elm) {
                  const x = elm.offsetLeft;
                  const w = elm.offsetWidth;
                  const c = window.innerWidth / 2;

                  const _left = c - x - w / 2;

                  // Account for padding and margin of containers
                  const t = parseInt(
                    getComputedStyle(document.documentElement).fontSize
                  );

                  // Account for width of removed elements
                  let p = 0;
                  const container = document.getElementById(
                    "selection-container"
                  );
                  const children = container?.children;
                  if (children && children?.length !== selected.length) {
                    const [{ c, _i }] = Array.from(children)
                      .map((c, _i) => ({ c, _i }))
                      .filter(({ c }) => {
                        // Slice off the X
                        const text = c.textContent?.slice(0, -1) || "";
                        return !selected.includes(text);
                      });

                    if (i >= _i) p = c.clientWidth + t / 2;
                  }

                  left = `${_left - t + p}px`;
                  top = `${i * 4 + 1}rem`;
                }
              }

              return (
                <span
                  key={name + i}
                  id={`selection-${name}`}
                  style={{
                    transform: `translate(${left}, ${top})`,
                  }}
                  onClick={() =>
                    selState[0] === 2 ? handleRemove(name) : selState[1](2)
                  }
                  className="inline-block text-2xl cursor-pointer whitespace-nowrap transition-all ease-in-out duration-500"
                  // onClick={() => handleChange({ change: "remove", name })}
                >
                  {name}
                  <span
                    className={
                      "text-red text-lg absolute -right-2 -top-1 transition-all duration-500 ease-in-out" +
                      (selState[0] === 2 ? " opacity-1" : " opacity-0")
                    }
                  >
                    x
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* TODO Add clear button */}
        <button
          className={
            "w-full block shrink-0 absolute bg-bg border border-b-2 border-fg bottom-0 text-center transition-all duration-300 ease-in-out" +
            (selState[0] === 2 ? " h-12 c-invert" : " h-6")
          }
          onClick={(e) => {
            e.stopPropagation();
            if (selState[0] === 2) {
              selState[1](1);
              reset[1]([]);
            } else selState[1](2);
          }}
        >
          <span
            className={
              "transition-all duration-300 ease-in-out inline-block" +
              (selState[0] === 2
                ? " rotate-180 scale-[200%] font-bold"
                : " rotate-0 scale-100 font-normal")
            }
          >
            V
          </span>
        </button>

        <span
          className={
            "absolute w-16 right-0 top-0 bg-gradient-to-l from-bg via-bg/80 via-35% transition-all duration-500 ease-in-out" +
            (selState[0] > 0 ? " h-8" : " h-0") +
            (selState[0] === 2 ? " opacity-0" : " opacity-1")
          }
        />
      </div>

      <p
        className={
          "font-cormorant text-justify no-scrollbar transition-all text-base duration-300 ease-in-out w-full max-h-full relative whitespace-pre-wrap overflow-auto grow overscroll-none" +
          (state[0] > 0 ? " pr-6 pl-2 pt-2 pb-[40vh]" : " pr-0 pl-0 pt-1 pb-0")
        }
        ref={ref}
      />
      <button
        onClick={() => {
          if (state[0] > 1) handleClose();
          else if (state[0] === 1) handleCancel();
          else handleReturn();
        }}
        className={
          "w-full py-2 c-invert fixed bottom-0 left-0 transition-all duration-500 text-4xl text-center" +
          ((state[0] > 0 && state[0] < 4) || matchesPrev
            ? " opacity-1 translate-y-0"
            : " opacity-0 translate-y-8")
        }
        disabled={(state[0] === 0 && !matchesPrev) || state[0] === 4}
      >
        {state[0] > 1 && state[0] < 4 ? "Close" : ""}
        {state[0] === 1 ? "Cancel" : ""}
        {(state[0] === 0 || state[0] === 4) && matchesPrev ? "Return" : ""}
      </button>
    </section>
  );
}
