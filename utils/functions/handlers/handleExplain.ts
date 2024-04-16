import { State } from "@/utils/types/state";
import { Dispatch } from "react";

const handleExplain = async ({
  prevExplained,
  selected,
  selState,
  state,
  reader,
  ref,
  text,
}: {
  prevExplained: [string[], Dispatch<string[]>];
  selected: string[];
  selState?: [0 | 1 | 2, Dispatch<0 | 1 | 2>];
  state: [State, Dispatch<State>];
  reader: [
    ReadableStreamReader<Uint8Array> | undefined,
    Dispatch<ReadableStreamReader<Uint8Array> | undefined>
  ];
  ref: React.RefObject<HTMLParagraphElement>;
  text: [string, Dispatch<string>];
}) => {
  if (selState) selState[1](0); // Closed

  const response = await fetch("/api/explain", {
    method: "POST",
    body: JSON.stringify({ keywords: selected }),
  });

  prevExplained[1]([...selected]);
  state[1](1); // Streaming

  const _reader = response.body?.getReader();

  if (!_reader) return;

  reader[1](_reader);

  let result = "";
  while (true) {
    const { done, value } = await _reader.read();
    if (done) break;
    const _text = new TextDecoder().decode(value);
    const add = document.createElement("span");
    add.innerText = _text;
    add.className = "animate-fade-in";
    ref.current?.appendChild(add);
    result += _text;
  }

  text[1](result);
  state[1](2); // Finished
};

export default handleExplain;
