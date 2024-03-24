import { useRef } from "react";

export default function ElleLM({
  selected,
  handleChange,
}: {
  selected: Array<string>;
  handleChange: (args: { change: "remove"; name: string }) => void;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  return (
    <>
      <h1>
        Tell me about
        {/* <button className="ml-8 hover:" */}
      </h1>
      {selected.map((name, i) => (
        <span
          className={
            "text-lg cursor-pointer hover:text-red" + (i ? "" : " ml-1")
          }
          onClick={() => handleChange({ change: "remove", name })}
        >
          {name}
          {i === selected.length - 1 ? "" : ", "}
        </span>
      ))}
      <p ref={ref} />
    </>
  );
}
