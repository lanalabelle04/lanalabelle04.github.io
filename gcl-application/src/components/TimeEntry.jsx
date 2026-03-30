import React from 'react';
import { calcHeight } from '../utils/timeUtils.js';

export default function TimeEntry({ startTime, endTime, title, description, color }) {
  const height = calcHeight(startTime, endTime);
  const hasDescription = Boolean(description?.trim());

  return (
    <div className="time-entry">
      <p className="time-label">{startTime} - {endTime}</p>
      <div
        className="time-slot px-4 py-2"
        style={{
          height: `${height}px`,
          background: color,
        }}
      >
        <p className="title">{title}</p>
        {hasDescription && <p className="description">{description}</p>}
      </div>
    </div>
  );
}
