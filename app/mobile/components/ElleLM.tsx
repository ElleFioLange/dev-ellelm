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
  handleRemove: (names: string[]) => void;
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
  const selectedRef = useRef<HTMLDivElement>(null);

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

  const closePreview = (to: 0 | 1) => {
    selState[1](to);
    selectedRef.current?.parentElement?.scrollTo({ top: 0 });
  };

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
          height: state[0] > 0 ? `calc(100% - 8.625rem)` : 0,
        }}
      />
      <h1
        className={
          "transition-all z-10 shrink-0 duration-500 ease-in-out overflow-hidden text-center" +
          (selected.length ? " h-12" : " h-0")
        }
      >
        Ask me about{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="fill-fg inline-block size-7"
          // fill="#000000"
        >
          <path d="m4.714 15.956l4.718-2.648l.079-.23l-.08-.128h-.23l-.79-.048l-2.695-.073l-2.337-.097l-2.265-.122l-.57-.121l-.535-.704l.055-.353l.48-.321l.685.06l1.518.104l2.277.157l1.651.098l2.447.255h.389l.054-.158l-.133-.097l-.103-.098l-2.356-1.596l-2.55-1.688l-1.336-.972l-.722-.491L2 6.223l-.158-1.008l.656-.722l.88.06l.224.061l.893.686l1.906 1.476l2.49 1.833l.364.304l.146-.104l.018-.072l-.164-.274l-1.354-2.446l-1.445-2.49l-.644-1.032l-.17-.619a3 3 0 0 1-.103-.729L6.287.133L6.7 0l.995.134l.42.364l.619 1.415L9.735 4.14l1.555 3.03l.455.898l.243.832l.09.255h.159V9.01l.127-1.706l.237-2.095l.23-2.695l.08-.76l.376-.91l.747-.492l.583.28l.48.685l-.067.444l-.286 1.851l-.558 2.903l-.365 1.942h.213l.243-.242l.983-1.306l1.652-2.064l.728-.82l.85-.904l.547-.431h1.032l.759 1.129l-.34 1.166l-1.063 1.347l-.88 1.142l-1.263 1.7l-.79 1.36l.074.11l.188-.02l2.853-.606l1.542-.28l1.84-.315l.832.388l.09.395l-.327.807l-1.967.486l-2.307.462l-3.436.813l-.043.03l.049.061l1.548.146l.662.036h1.62l3.018.225l.79.522l.473.638l-.08.485l-1.213.62l-1.64-.389l-3.825-.91l-1.31-.329h-.183v.11l1.093 1.068l2.003 1.81l2.508 2.33l.127.578l-.321.455l-.34-.049l-2.204-1.657l-.85-.747l-1.925-1.62h-.127v.17l.443.649l2.343 3.521l.122 1.08l-.17.353l-.607.213l-.668-.122l-1.372-1.924l-1.415-2.168l-1.141-1.943l-.14.08l-.674 7.254l-.316.37l-.728.28l-.607-.461l-.322-.747l.322-1.476l.388-1.924l.316-1.53l.285-1.9l.17-.632l-.012-.042l-.14.018l-1.432 1.967l-2.18 2.945l-1.724 1.845l-.413.164l-.716-.37l.066-.662l.401-.589l2.386-3.036l1.439-1.882l.929-1.086l-.006-.158h-.055L4.138 18.56l-1.13.146l-.485-.456l.06-.746l.231-.243l1.907-1.312Z" />
        </svg>
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
            ref={selectedRef}
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
                    getComputedStyle(document.documentElement).fontSize,
                  );

                  // Account for width of removed elements
                  let p = 0;
                  const container = selectedRef.current;
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
                    selState[0] === 2 ? handleRemove([name]) : selState[1](2)
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

        <div className="w-full h-min shrink-0 absolute bottom-0 transition-all duration-300 ease-in-out">
          <button
            className={
              "w-full block shrink-0 bg-red text-center text-lg font-extrabold overflow-hidden mb-2 text-bg transition-all duration-300 ease-in-out" +
              (selState[0] === 2 ? " h-8" : " h-0")
            }
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(selected);
              closePreview(0);
            }}
          >
            Clear
          </button>
          <button
            className={
              "w-full block shrink-0  border border-b-2 border-fg bottom-0 text-center transition-all duration-300 ease-in-out" +
              (selState[0] === 2 ? " h-12 invert-theme" : " h-6")
            }
            onClick={(e) => {
              e.stopPropagation();
              if (selState[0] === 2) {
                closePreview(1);
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
        </div>

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
          "w-full py-2 invert-theme fixed bottom-0 left-0 transition-all duration-500 text-4xl text-center" +
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
