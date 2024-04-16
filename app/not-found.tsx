import Link from "next/link";

export default function Custom404() {
  return (
    <main className="animate-fade-in w-full h-full flex flex-col gap-2 justify-center items-center">
      <h1>404</h1>
      <Link href="/">Home</Link>
    </main>
  );
}
