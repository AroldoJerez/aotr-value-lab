const VIDEO_ID = "3R1mMK7t36o";

export default function AmbientVideoBackground() {
  const src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0`;

  return (
    <div aria-hidden="true" className="ambient-background">
      <iframe
        className="ambient-video"
        src={src}
        title=""
        tabIndex={-1}
        allow="autoplay; encrypted-media"
      />
      <div className="ambient-vignette" />
      <div className="ambient-mesh" />
    </div>
  );
}
