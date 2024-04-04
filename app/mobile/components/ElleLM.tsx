import { Dispatch, useEffect, useMemo, useRef, useState } from "react";
import Loading from "../../components/Loading";
import { State } from "../page";

export default function ElleLM({
  selected,
  handleRemove,
  reset,
  state,
}: {
  selected: Array<string>;
  handleRemove: (args: { name: string }) => void;
  // Used to reset the Loading componentx
  reset: never[];
  state: [State, Dispatch<State>];
}) {
  const reader = useState<ReadableStreamReader<Uint8Array>>();
  // Selected state
  const selState = useState<
    | 0 // Closed
    | 1 // Preview
    | 2 // Open
  >(0);
  // Selected lefts
  // When removing a selected term, the left position of the remaining terms will be recalculated.
  // The recalculation uses the current window position, which causes the terms to jump around.
  // This state is used to store the left position of the terms when the terms are in the open state.
  const lefts = useState<{
    [term: string]: string;
  }>({});

  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (selected.length) {
      if (selState[0] === 0) selState[1](1); // Preview
    } else {
      selState[1](0); // Closed
    }
  }, [selected]);

  const handleExplain =
    //
    // () => {};
    async () => {
      const response = await fetch("/api/explain", {
        method: "POST",
        body: JSON.stringify({ selected }),
      });

      selState[1](0); // Closed
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
      setTimeout(() => {
        selState[1](1); // Preview
      }, 1000);
    }, 950);
  };

  return (
    <div
      className={
        "max-h-full relative overflow-hidden flex flex-col" +
        (selected.length ? " -mt-4" : " mt-0")
      }
    >
      <div
        className={
          "fixed box-content left-0 bottom-0 w-screen transition-all duration-[2.5s] border-dark dark:border-light ease-in-out bg-accent-fg" +
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
            className="col-span-2 z-10"
          />
        ) : (
          <div className="h-0.5 rounded-full bg-dark/30 dark:bg-light/30" />
        )}
      </div>
      <div
        onClick={() => selState[1](2)}
        className={
          "border-fg shrink-0 flex overscroll-contain flex-col relative overflow-hidden w-full duration-500 ease-in-out transition-all" +
          (selState[0] === 0 ? " mt-0 border-0 h-0" : "") +
          (selState[0] === 1 ? " mt-0 border border-t-0 h-14" : "") +
          (selState[0] === 2 ? " mt-4 border h-[60vh]" : "")
        }
      >
        <div className="w-full overflow-y-auto overflow-x-hidden grow">
          <div
            className="white-space-nowrap width-full mx-2 flex gap-2"
            style={{
              height: selState[0] === 2 ? `${selected.length}rem` : " h-4",
            }}
          >
            {selected.map((name, i) => {
              let left = "0px";
              if (selState[0] === 2) {
                const elm = document.getElementById(`selection-${name}`);
                const x = elm?.offsetLeft;
                const w = elm?.offsetWidth;
                const c = window.innerWidth / 2;

                const _left = x && w && c ? c - x - w / 2 : 0;

                // Accodomodate padding and margin of containers
                const m = parseInt(
                  getComputedStyle(document.documentElement).fontSize
                );

                left = `${_left - m}px`;
              }

              const top = selState[0] === 2 ? `${i * 4 + 1}rem` : 0;

              return (
                <span
                  key={name}
                  id={`selection-${name}`}
                  style={{
                    transform: `translate(${left}, ${top})`,
                  }}
                  onClick={() =>
                    selState[0] === 2 ? handleRemove({ name }) : selState[1](2)
                  }
                  className="inline-block relative text-2xl cursor-pointer whitespace-nowrap transition-all ease-in-out duration-500"
                  // onClick={() => handleChange({ change: "remove", name })}
                >
                  {name}
                  {/* <span
                    className={
                      "text-red text-lg absolute -right-2 -top-1 transition-all duration-500 ease-in-out" +
                      (selState[0] === 2 ? " opacity-1" : " opacity-0")
                    }
                  >
                    x
                  </span> */}
                </span>
              );
            })}
          </div>
        </div>

        <button
          className={
            "w-full border-fg block shrink-0 absolute bottom-0 c-invert text-center transition-all duration-300 ease-in-out" +
            (selState[0] === 2 ? " h-12 " : " h-6 border-0")
          }
          onClick={(e) => {
            e.stopPropagation();
            selState[1](selState[0] === 2 ? 1 : 2);
          }}
        >
          <span
            className={
              "transition-all duration-300 ease-in-out grid place-items-center" +
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
      {/* TODO Use state to manage expand and hide/show of cancel/close button */}
      <p
        className={
          "font-cormorant transition-all duration-300 ease-in-out w-full max-h-full relative whitespace-pre-wrap overflow-auto grow overscroll-none" +
          (state[0] > 0
            ? " text-justify pr-12 pl-2 pt-2"
            : " text-center pr-0 pl-0 pt-1")
        }
        ref={ref}
      >
        <span
          className={
            "overflow-hidden transition-all duration-500 ease-in-out" +
            (selState[0] === 0 ? " opacity-1 h-4" : " opacity-0 h-0")
          }
        >
          Select one or more items below to learn more.
        </span>
      </p>
      <button
        onClick={state[0] > 1 ? handleClose : handleCancel}
        className={
          "w-full py-4 c-invert fixed bottom-0 left-0 transition-all duration-500 text-4xl text-center" +
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
