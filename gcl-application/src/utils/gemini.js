const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function fetchCareerData(career) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `For the career "${career}", provide the following in a single raw JSON object (no markdown, no code blocks):
{
  "emoji": "<single relevant emoji>",
  "description": "<2-3 sentences describing what a typical day looks like, present tense>",
  "schedule": [
    {"startTime": "12:00 AM", "endTime": "7:00 AM", "title": "...", "description": "..."}
  ]
}
Schedule rules:
- Cover the full day from exactly 12:00 AM to 11:00 PM with no gaps
- Each item endTime equals next item startTime
- Times in format "H:MM AM/PM"
- title: action-oriented, specific to a real ${career}'s day
- description length must scale with the slot duration:
  - Under 30 min: 3-5 words only (e.g. "Quick coffee and emails.")
  - 30 min to 1 hour: 1 short sentence, max 10 words
  - 1 to 2 hours: 1 sentence
  - Over 2 hours: 1-2 sentences` }] }]
      })
    }
  );
  const data = await response.json();

  if (!response.ok || !data.candidates) {
    console.error('Gemini API error:', JSON.stringify(data, null, 2));
    throw new Error(data.error?.message || 'Gemini API returned no candidates');
  }

  const raw = data.candidates[0].content.parts[0].text.trim();
  const cleaned = raw.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(cleaned);
}
