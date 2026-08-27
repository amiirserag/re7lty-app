import { useState } from "react";
import { prefersReducedMotion } from "../core/motion";

interface Props {
  image?: string;
  video?: string;
  alt?: string;
  className?: string;
  fit?: "cover" | "contain";
}

/** Plays a muted loop when the video file exists; otherwise the still. */
export function MediaHero({ image, video, alt = "", className = "", fit = "cover" }: Props) {
  const [videoOk, setVideoOk] = useState(Boolean(video));
  const playVideo = Boolean(video) && videoOk && !prefersReducedMotion();

  return (
    <div className={`media-hero ${className}`}>
      {playVideo && (
        <video
          key={video}
          src={video}
          poster={image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoOk(false)}
          aria-hidden
          style={{ objectFit: fit }}
        />
      )}
      {(!playVideo) && image && <img src={image} alt={alt} style={{ objectFit: fit }} />}
    </div>
  );
}
