import { useRef, useState } from 'react';
import { Icon } from './Icon';

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
      <div className="frame video-frame">
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
          className="btn btn-primary btn-sm video-toggle"
          type="button"
          aria-pressed={playing}
          aria-controls={id}
          onClick={toggle}
        >
          <Icon name={playing ? 'pause' : 'play'} />
          {playing ? 'Pause demo' : 'Play demo'}
        </button>
      </div>
      <figcaption className="caption">{video.caption}</figcaption>
    </figure>
  );
}
