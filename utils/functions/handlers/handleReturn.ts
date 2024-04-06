import { State } from "@/utils/types/state";
import { Dispatch } from "react";

export default function handleReturn({
  state,
  ref,
  text,
  selState,
}: {
  state: [State, Dispatch<State>];
  ref: React.RefObject<HTMLParagraphElement>;
  text: [string, Dispatch<string>];
  selState?: [0 | 1 | 2, Dispatch<0 | 1 | 2>];
}) {
  state[1](2); // Finished
  if (selState) selState[1](0); // Closed
  setTimeout(() => {
    ref.current?.classList.add("animate-fade-in");
    if (ref.current) ref.current.textContent = text[0];
    setTimeout(() => {
      ref.current?.classList.remove("animate-fade-in");
    }, 1000);
  }, 1000);
}
