const GEMINI_API_KEY = 'AIzaSyD9kC0kciWpiJGXNvwtB8V3KycQsbYI9tw';
const colorPalette = ['#F4A8F3', '#BFE41B', '#F88E52', '#92D4F7', '#FAE55D'];
let colorStartIndex = 0;

// Maps each career card to its corresponding schedule node
const cardSchedules = new WeakMap();

function toTitleCase(str) {
  return str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function parseTimeToMinutes(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'AM' && hours === 12) hours = 0;
  if (period === 'PM' && hours !== 12) hours += 12;
  return hours * 60 + minutes;
}

function calcHeight(startTime, endTime) {
  const durationMins = parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
  return Math.round((durationMins / 60) * 70);
}

function renderSchedule(items, startColorIndex) {
  const schedule = document.createElement('div');
  schedule.className = 'schedule';

  items.forEach((item, i) => {
    const color = colorPalette[(startColorIndex + i) % colorPalette.length];
    const height = calcHeight(item.startTime, item.endTime);

    const entry = document.createElement('div');
    entry.className = 'time-entry';
    entry.innerHTML = `
      <p class="time-label">${item.startTime} - ${item.endTime}</p>
      <div class="time-slot" style="height: ${height}px; background: ${color};">
        <p class="title">${item.title}</p>
        <p class="description">${item.description}</p>
      </div>
    `;
    schedule.appendChild(entry);
  });

  return schedule;
}

async function fetchCareerDataFromGemini(career) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `For the career "${career}", provide the following in a single raw JSON object (no markdown, no code blocks):
{
  "emoji": "<single relevant emoji>",
  "description": "<2-3 sentences describing what a typical day looks like, present tense>",
  "schedule": [
    {"startTime": "12:00 AM", "endTime": "7:00 AM", "title": "...", "description": "..."},
    ...
  ]
}

Schedule rules:
- Cover the full day from exactly 12:00 AM to 11:00 PM with no gaps
- Each item's endTime must equal the next item's startTime
- Times in format "H:MM AM/PM" (e.g. "9:00 AM", "12:30 PM")
- title: action-oriented and specific to a real ${career}'s day
- description: 1-2 concise sentences, not verbose`
          }]
        }]
      })
    }
  );
  const data = await response.json();
  const raw = data.candidates[0].content.parts[0].text.trim();
  const cleaned = raw.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(cleaned);
}

function setActiveCard(activeCard) {
  const currentSchedule = document.querySelector('.schedule-scroll .schedule');
  const targetSchedule = cardSchedules.get(activeCard);
  if (targetSchedule && currentSchedule !== targetSchedule) {
    currentSchedule.replaceWith(targetSchedule);
  }

  document.querySelectorAll('.sidebar-careers .career').forEach(card => {
    const isActive = card === activeCard;
    card.classList.toggle('career-inactive', !isActive);
    const desc = card.querySelector('.career-description');
    if (desc) desc.style.display = isActive ? '' : 'none';
  });
}

function attachCardClickListener(card) {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => setActiveCard(card));
}

async function addCareer(careerName) {
  careerName = careerName.trim();
  if (!careerName) return;
  const displayName = toTitleCase(careerName);

  // Snapshot the color index for this career before incrementing
  const thisColorIndex = colorStartIndex;
  colorStartIndex = (colorStartIndex + 1) % colorPalette.length;

  // Create card immediately with loading state
  const newCard = document.createElement('div');
  newCard.className = 'career';
  newCard.innerHTML = `
    <h2>⏳ ${displayName}</h2>
    <p class="career-description">Loading...</p>
  `;
  document.querySelector('.sidebar-careers').appendChild(newCard);
  attachCardClickListener(newCard);

  // Associate an empty placeholder schedule and make card active
  const placeholderSchedule = document.createElement('div');
  placeholderSchedule.className = 'schedule';
  cardSchedules.set(newCard, placeholderSchedule);
  setActiveCard(newCard);

  document.querySelector('.career-input').value = '';

  // Fetch from Gemini and update
  try {
    const { emoji, description, schedule } = await fetchCareerDataFromGemini(careerName);

    // Update card content
    newCard.querySelector('h2').textContent = `${emoji} ${displayName}`;
    newCard.querySelector('.career-description').textContent = description;

    // Render full schedule and replace placeholder
    const renderedSchedule = renderSchedule(schedule, thisColorIndex);
    const currentPlaceholder = cardSchedules.get(newCard);
    cardSchedules.set(newCard, renderedSchedule);
    if (currentPlaceholder.isConnected) {
      currentPlaceholder.replaceWith(renderedSchedule);
    }
  } catch (err) {
    console.error('Gemini error:', err);
    newCard.querySelector('h2').textContent = `💼 ${displayName}`;
    newCard.querySelector('.career-description').textContent =
      `A ${displayName} navigates the unique challenges and rewards of their role every day.`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const lanaCard = document.querySelector('.sidebar-careers .career');
  const lanaSchedule = document.querySelector('.schedule-scroll .schedule');
  cardSchedules.set(lanaCard, lanaSchedule);
  attachCardClickListener(lanaCard);

  const input = document.querySelector('.career-input');
  const uploadBtn = document.querySelector('.upload-btn');

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addCareer(input.value);
  });

  uploadBtn.addEventListener('click', () => addCareer(input.value));
});
