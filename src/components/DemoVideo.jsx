import { useRef, useState } from 'react';
import { PixelIcon } from './Icon';

// A muted demo clip that only loads and plays when asked to. No autoplay.
export default function DemoVideo({ id, video }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  };

  return (
    <figure className="video">
      <div className="video-frame">
        <video
          id={id}
          ref={ref}
          src={video.src}
          poster={video.poster}
          width={video.width}
          height={video.height}
          preload="none"
          muted
          loop
          playsInline
          aria-label={video.label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <button
          className="btn btn-secondary btn-sm video-toggle"
          type="button"
          aria-pressed={playing}
          aria-controls={id}
          onClick={toggle}
        >
          <PixelIcon name={playing ? 'pause' : 'play'} />
          {playing ? 'Pause demo' : 'Play demo'}
        </button>
      </div>
      <figcaption>{video.caption}</figcaption>
    </figure>
  );
}
