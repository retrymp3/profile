type WritingVideoProps = {
  src: string;
  caption?: string;
};

export function WritingVideo({ src, caption }: WritingVideoProps) {
  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[var(--shadow)]">
        <video
          className="block w-full"
          controls
          playsInline
          preload="metadata"
          aria-label={caption ?? "Proof of concept video"}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-[13px] text-[var(--text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
