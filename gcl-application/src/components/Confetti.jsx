import React, { useEffect, useState } from 'react';

export default function Confetti({ emoji, triggerKey }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!triggerKey || !emoji) return;

    const count = Math.floor(Math.random() * 31) + 20; // 20–50 particles

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,                    // % along bottom
      size: Math.random() * 1.2 + 0.9,              // 0.9–2.1em
      duration: Math.random() * 1.5 + 1.8,          // 1.8–3.3s
      delay: Math.random() * 0.6,                    // 0–0.6s stagger
      drift: Math.random() * 260 - 130,              // –130 to 130px horizontal
      rotation: Math.random() * 720 - 360,           // –360 to 360deg
    }));

    setParticles(newParticles);

    const cleanup = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(cleanup);
  }, [triggerKey]);

  if (!particles.length) return null;

  return (
    <div className="confetti-container">
      {particles.map(p => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}em`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--rotation': `${p.rotation}deg`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
