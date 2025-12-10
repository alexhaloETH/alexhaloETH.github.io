import './StarsBackground.css';

const STAR_COUNT = 30;

function StarsBackground() {
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => (
    <div key={i} className="star" />
  ));

  return (
    <div className="stars-background">
      <div className="stars">{stars}</div>
    </div>
  );
}

export default StarsBackground;
