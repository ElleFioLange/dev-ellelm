import { Suspense } from "react";
import Nav from "../components/Nav";
import Video from "./components/Video";

export default function Portfolio() {
  const items = [
    {
      name: "Basil LLM",
      date: "Jan - Mar 2024",
      description:
        "I undertook the development of a customized project management system for Basil, aimed at simplifying the freelancer hiring process and project planning. Designed a user-friendly interface allowing users to input project details effortlessly. Engineered features for automated freelancer matching from contacts and dynamic project plan generation. Resulted in notable time savings and enhanced project efficiency, marking a significant advancement for Basil's operations.",
      videoSrc: "https://www.youtube.com/embed/Aezwsn0zIU4",
    },
    {
      name: "Pupil Tutor",
      date: "Sep 2023",
      description:
        "At the Boston Startup Weekend 2023, I engaged in a dynamic collaborative effort where I contributed to the conception and development of Pupil, an innovative LLM-based tutor system. Worked closely with a team to conceptualize and prototype a platform aimed at monitoring student performance and delivering concise performance reports to parents and teachers. Utilized my skills in brainstorming, problem-solving, and rapid prototyping to bring the idea to life within a fast-paced startup environment. This experience honed my ability to work effectively within a team, think creatively, and execute on ambitious projects under tight deadlines.",
      videoSrc: "https://www.youtube.com/embed/O8SBJmmwq7M",
    },
    {
      name: "Usabl Developer Testing",
      date: "Nov 2021 - May 2022",
      description:
        "As a founding engineer at Usabl, I played a pivotal role in developing both front-end and back-end systems for the company's innovative user testing platform. Tasked with building software to facilitate user testing sessions, I designed and implemented features enabling users to record their testing sessions seamlessly, communicate feedback effectively, and annotate insights for collaborative issue resolution. This involved creating a user-friendly interface for capturing and sharing feedback, as well as coordinating with team members to address any identified issues promptly.",
      videoSrc: "https://youtube.com/embed/WQxAEkjkHCg",
    },
  ];
  return (
    <main className="animate-fade-in overflow-x-hidden overflow-y-auto w-screen h-screen">
      {items.map(({ name, date, description, videoSrc }) => (
        <section className="w-screen h-screen portfolio-grid p-4">
          <div className="place-self-start p-4 bg-accent-fg w-full h-full text-bg">
            <h1>{name}</h1>
            <h3 className="italic">{date}</h3>
            <Suspense fallback={<div></div>}>
              <Video className="mt-2" src={videoSrc} />
            </Suspense>
          </div>
          <div className="p-8 text-justify overflow-auto bg-accent-bg">
            <p className="font-cormorant ">{description}</p>
          </div>
        </section>
      ))}
      <Nav className="fixed bottom-8 gap-12 right-8" />
    </main>
  );
}
