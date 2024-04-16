import { Suspense } from "react";
import Nav from "@/app/components/Nav";
import Video from ".././components/Video";
import items from "../items";
import "./css.css";

export default function Portfolio() {
  return (
    <main className="animate-fade-in overflow-x-hidden overflow-y-auto w-full h-full">
      {items.map(({ name, date, description, videoSrc }) => (
        <section className="w-full h-full portfolio-grid p-4" key={name}>
          <div className="place-self-start p-4 w-full h-full bg-accent-fg text-bg">
            <h1>{name}</h1>
            <h3 className="italic">{date}</h3>
            {/* TODO Add suspense fallback */}
            <Suspense fallback={<div></div>}>
              <Video className="mt-2" src={videoSrc} />
            </Suspense>
          </div>
          <div className="p-4 text-justify overflow-auto bg-accent-bg">
            {/* TODO Add fade at bottom of paragraph */}
            <p className="font-cormorant">{description}</p>
          </div>
        </section>
      ))}
      <Nav className="fixed bottom-8 right-8" />
    </main>
  );
}
