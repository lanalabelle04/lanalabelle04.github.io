import React from 'react';
import ScheduleScroll from './ScheduleScroll.jsx';
import InputBar from './InputBar.jsx';

export default function Timeline({ activeCareer, onAddCareer }) {
  return (
    <main className="timeline">
      <div className="timeline-top-bar"></div>
      {activeCareer && (
        <ScheduleScroll
          scheduleItems={activeCareer.scheduleItems}
          colorStartIndex={activeCareer.colorStartIndex}
        />
      )}
      <div className="timeline-bottom-bar"></div>
      <InputBar onSubmit={onAddCareer} />
    </main>
  );
}
