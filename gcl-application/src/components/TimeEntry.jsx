import React from 'react';
import { calcHeight } from '../utils/timeUtils.js';

export default function TimeEntry({ startTime, endTime, title, description, color }) {
  const height = calcHeight(startTime, endTime);

  return (
    <div className="time-entry">
      <p className="time-label">{startTime} - {endTime}</p>
      <div
        className="time-slot"
        style={{
          height: `${height}px`,
          background: color,
          justifyContent: !description ? 'center' : 'flex-start',
        }}
      >
        <p className="title">{title}</p>
        {description && <p className="description">{description}</p>}
      </div>
    </div>
  );
}
