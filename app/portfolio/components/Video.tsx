export default async function Video({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <iframe
      src={src}
      className={"border-0 aspect-video w-full " + className}
      allowFullScreen={true}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
