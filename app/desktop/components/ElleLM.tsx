import { Dispatch, useMemo, useRef, useState } from "react";
import Loading from "@/app/components/Loading";
import { State } from "@/utils/types/state";

export default function ElleLM({
  selected,
  handleRemove,
  reset,
  state,
}: {
  selected: Array<string>;
  handleRemove: (name: string) => void;
  reset: [never[], Dispatch<never[]>];
  state: [State, Dispatch<State>];
}) {
  const text = useState("");
  const prevExplained = useState<string[]>([]);

  const displayText = useMemo(() => {
    if (text) return text;
    if (selected.length) return "";
    return "Select one or more items above to learn more.";
  }, [text, selected]);

  const ref = useRef<HTMLParagraphElement>(null);

  const handleExplain =
    // Uncomment to disable GPT inference
    () => {
      text[1]("asdopifajelkf jajweofpij awelfkj asd;lf jaose fas");
      state[1](1);
    };
  async () => {
    state[1](1); // Streaming

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
      const _text = new TextDecoder().decode(value);
      const add = document.createElement("span");
      add.innerText = _text;
      add.className = "animate-fade-in";
      ref.current?.appendChild(add);
      result += _text;
      text[1](result);
      // ref.current?.scrollTo({
      //   top: ref.current.scrollHeight,
      // });
    }
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
          "box-content left-0 bottom-0 w-full transition-all duration-[2.5s] border-fg ease-in-out bg-accent-bg" +
          (state[0] > 0 ? " h-full border-t-2" : " h-0 border-t-0")
        }
      />
      <h1 className={selected.length ? "" : " opacity-30"}>Tell me about </h1>

      {/* <button className={""} /> */}

      <Loading
        duration={3}
        delay={1.5}
        resetDuration={0.5}
        onLoad={handleExplain}
        reset={reset}
        className="col-span-2"
        paused={
          prevExplained.length &&
          JSON.stringify(selected) === JSON.stringify(prevExplained[0])
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
            onClick={() => handleRemove(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* TODO Make previous text viewable after close */}
      <p
        className={
          "font-cormorant text-bg ml-2 pr-2 whitespace-pre-wrap overflow-auto h-full" +
          (state[0] > 0 ? " pr-12 pl-2 pt-2 pb-64" : " pr-0 pl-0 pt-1 pb-0")
        }
        ref={ref}
      />
    </section>
  );
}
