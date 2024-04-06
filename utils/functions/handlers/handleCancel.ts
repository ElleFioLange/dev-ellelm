import { State } from "@/utils/types/state";
import { Dispatch } from "react";

export default function handleCancel({
  reader,
  state,
}: {
  reader: [
    ReadableStreamReader<Uint8Array> | undefined,
    Dispatch<ReadableStreamReader<Uint8Array> | undefined>
  ];
  state: [State, Dispatch<State>];
}) {
  reader[0]?.cancel();
  state[1](3); // Canceled
}
