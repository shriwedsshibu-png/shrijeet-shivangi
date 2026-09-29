import React, { useEffect, useState } from 'react';

function calc(target) {
  const diff = new Date(target).getTime() - Date.now();
  if (!(diff > 0)) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: false,
  };
}

export default function Countdown({ target }) {
  const [t, setT] = useState(() => calc(target));
  useEffect(() => {
    setT(calc(target));
    const id = setInterval(() => setT(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [['Days', t.days], ['Hours', t.hours], ['Minutes', t.minutes], ['Seconds', t.seconds]];
  return (
    <div className="cd-grid" role="timer" aria-label="Countdown to the wedding">
      {units.map(([label, value]) => (
        <div className="cd-box" key={label}>
          <div className="cd-num">{String(value).padStart(2, '0')}</div>
          <div className="cd-lab">{label}</div>
        </div>
      ))}
    </div>
  );
}
