import React from 'react';
import CareerCard from './CareerCard.jsx';

export default function Sidebar({ careers, activeId, onSelectCareer }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Day In The Life</h1>
        <p>Take a peek into the daily life of different professions</p>
      </div>
      <div className="sidebar-careers">
        <p className="career-label">Careers</p>
        {careers.map((career) => (
          <CareerCard
            key={career.id}
            career={career}
            isActive={career.id === activeId}
            onClick={() => onSelectCareer(career.id)}
          />
        ))}
      </div>
    </aside>
  );
}
