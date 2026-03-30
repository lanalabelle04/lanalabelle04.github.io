import React from 'react';
import TimeEntry from './TimeEntry.jsx';

const colorPalette = ['#F4A8F3', '#BFE41B', '#F88E52', '#92D4F7', '#FAE55D'];

export default function ScheduleScroll({ scheduleItems, colorStartIndex }) {
  return (
    <div className="schedule-scroll">
      <div className="schedule">
        {scheduleItems.map((item, index) => (
          <TimeEntry
            key={index}
            startTime={item.startTime}
            endTime={item.endTime}
            title={item.title}
            description={item.description}
            color={colorPalette[(colorStartIndex + index) % colorPalette.length]}
          />
        ))}
      </div>
    </div>
  );
}
