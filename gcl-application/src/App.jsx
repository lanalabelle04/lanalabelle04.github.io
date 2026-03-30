import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Timeline from './components/Timeline.jsx';
import Confetti from './components/Confetti.jsx';
import { lanaScheduleItems } from './data/lanaSchedule.js';
import { fetchCareerData } from './utils/gemini.js';
import { toTitleCase } from './utils/timeUtils.js';

const colorPalette = ['#F4A8F3', '#BFE41B', '#F88E52', '#92D4F7', '#FAE55D'];

const initialCareers = [
  {
    id: 'lana',
    name: 'Designer (Lana Labelle)',
    emoji: '👩',
    description: "Lana is the creator of this app! She's a senior design student at The Cooper Union, and she's also a design intern at The Working Assembly.\n\nLana works across mediums and thrives when there's room to play and permission to be weird about it. Google Creative Lab is the perfect place to grow her practice further, as it's a space where experimentation isn't just a side project, it's the whole point.",
    scheduleItems: lanaScheduleItems,
    colorStartIndex: 0,
    isLoading: false,
  },
];

export default function App() {
  const [careers, setCareers] = useState(initialCareers);
  const [activeId, setActiveId] = useState('lana');
  const [nextColorIndex, setNextColorIndex] = useState(1);
  const [confetti, setConfetti] = useState({ emoji: '', triggerKey: 0 });

  async function addCareer(careerName) {
    const displayName = toTitleCase(careerName.trim());
    const id = `career-${Date.now()}`;
    const thisColorIndex = nextColorIndex % colorPalette.length;

    const newCareer = {
      id,
      name: displayName,
      emoji: '⏳',
      description: '',
      scheduleItems: [],
      colorStartIndex: thisColorIndex,
      isLoading: true,
    };

    setCareers((prev) => [...prev, newCareer]);
    setActiveId(id);
    setNextColorIndex((prev) => prev + 1);

    try {
      const { emoji, description, schedule } = await fetchCareerData(careerName.trim());
      setCareers((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, emoji, description, scheduleItems: schedule, isLoading: false }
            : c
        )
      );
      setConfetti({ emoji, triggerKey: Date.now() });
    } catch (err) {
      console.error('Gemini error:', err);
      setCareers((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                emoji: '💼',
                description: `A ${displayName} navigates the unique challenges and rewards of their role every day.`,
                scheduleItems: [],
                isLoading: false,
              }
            : c
        )
      );
    }
  }

  const activeCareer = careers.find((c) => c.id === activeId);

  return (
    <div className="landing-screen">
      <Sidebar careers={careers} activeId={activeId} onSelectCareer={setActiveId} />
      <Timeline activeCareer={activeCareer} onAddCareer={addCareer} />
      <Confetti emoji={confetti.emoji} triggerKey={confetti.triggerKey} />
    </div>
  );
}
