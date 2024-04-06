import Link from "next/link";

export default function Contact() {
  return (
    <main className="w-screen h-screen grid place-items-center">
      <a href="mailto:elle.fio.lange@gmail.com" target="_blank">
        elle.fio.lange@gmail.com
      </a>
      <Link href="/">Home</Link>
    </main>
  );
}
