import React from 'react';

export default function CareerCard({ career, isActive, onClick }) {
  const cardClass = isActive ? 'career' : 'career career-inactive';

  return (
    <div className={cardClass} onClick={onClick} style={{ cursor: 'pointer' }}>
      <h2>{career.isLoading ? '⏳' : career.emoji} {career.name}</h2>
      {isActive && (
        <p className="career-description">
          {career.isLoading
            ? 'Loading...'
            : career.description.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
        </p>
      )}
    </div>
  );
}
