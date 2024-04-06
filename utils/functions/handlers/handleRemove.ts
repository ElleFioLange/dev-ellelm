import { Dispatch } from "react";

export default function handleRemove({
  name,
  selected,
  reset,
}: {
  name: string;
  selected: [string[], Dispatch<string[]>];
  reset: [never[], Dispatch<never[]>];
}) {
  selected[1](selected[0].filter((option) => option !== name));
  reset[1]([]);
}
