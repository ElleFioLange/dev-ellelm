import Link from "next/link";

export default function Contact() {
  return (
    <main className="animate-fade-in w-full h-full flex flex-col gap-2 items-center justify-center">
      <a href="mailto:elle.fio.lange@gmail.com" target="_blank">
        elle.fio.lange@gmail.com
      </a>
      <Link href="/">Home</Link>
    </main>
  );
}
