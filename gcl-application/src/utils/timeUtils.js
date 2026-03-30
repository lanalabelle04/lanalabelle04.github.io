export function parseTimeToMinutes(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'AM' && hours === 12) hours = 0;
  if (period === 'PM' && hours !== 12) hours += 12;
  return hours * 60 + minutes;
}

export function calcHeight(startTime, endTime) {
  const durationMins = parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
  return Math.round((durationMins / 60) * 70);
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}
