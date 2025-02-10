import { State } from "@/utils/types/state";
import { Dispatch } from "react";

export default function handleClose({
  ref,
  state,
  reset,
  selState,
}: {
  ref: React.RefObject<HTMLParagraphElement>;
  state: [State, Dispatch<State>];
  reset: [never[], Dispatch<never[]>];
  selState?: [0 | 1 | 2, Dispatch<0 | 1 | 2>];
}) {
  ref.current?.classList.toggle("animate-fade-out");
  state[1](4); // Closing
  reset[1]([]);
  setTimeout(() => {
    if (ref.current) ref.current.textContent = "";
    ref.current?.classList.toggle("animate-fade-out");
    state[1](0); // Idle
    if (selState)
      setTimeout(() => {
        selState[1](1); // Preview
      }, 1050);
  }, 1000);
}
