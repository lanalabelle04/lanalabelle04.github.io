import React, { useState } from 'react';

export default function InputBar({ onSubmit }) {
  const [value, setValue] = useState('');

  function handleSubmit() {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="career-input-bar">
      <input
        type="text"
        className="career-input"
        placeholder="Explore a career (e.g. fruit vendor, nurse, astronaut…)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <img
        src={`${import.meta.env.BASE_URL}images/uploadbutton.png`}
        alt="Upload"
        className="upload-btn"
        onClick={handleSubmit}
      />
    </div>
  );
}
