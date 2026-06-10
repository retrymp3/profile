import Image from "next/image";

type WritingFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export function WritingFigure({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
}: WritingFigureProps) {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] p-4 shadow-[var(--shadow)]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="mx-auto h-auto w-full max-w-xl rounded-[12px]"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-[13px] text-[var(--text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
