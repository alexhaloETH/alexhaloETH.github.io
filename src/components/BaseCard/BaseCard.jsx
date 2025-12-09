import './BaseCard.css';

function BaseCard({ children, className = '', variant = 'default' }) {
  return (
    <div className={`base-card ${className} ${variant}`}>
      {children}
    </div>
  );
}

export default BaseCard;
