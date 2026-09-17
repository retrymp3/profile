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
      <div className="overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--bg-secondary)] p-2 sm:p-3">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="mx-auto h-auto w-full max-w-4xl rounded-[8px]"
          sizes="(max-width: 768px) 100vw, min(56rem, 100vw)"
          quality={95}
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
