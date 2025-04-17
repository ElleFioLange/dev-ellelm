import { Dispatch } from "react";

export default function handleRemove({
  names,
  selected,
  reset,
}: {
  names: string[];
  selected: [string[], Dispatch<string[]>];
  reset: [never[], Dispatch<never[]>];
}) {
  selected[1](selected[0].filter((option) => !names.includes(option)));
  reset[1]([]);
}
