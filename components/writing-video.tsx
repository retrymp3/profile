type WritingVideoProps = {
  src: string;
  caption?: string;
};

export function WritingVideo({ src, caption }: WritingVideoProps) {
  return (
    <figure className="not-prose my-8">
      <div className="glass-card overflow-hidden">
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
