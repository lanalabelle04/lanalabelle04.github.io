function updateBackgroundImage() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let totalMinutes = hour * 60 + minute;

  let dawnRanges = [
    [5 * 60 + 51, 6 * 60],
    [19 * 60 + 50, 20 * 60 + 4]
  ];
  let nightRange1 = [20 * 60 + 5, 24 * 60];   
  let nightRange2 = [0, 5 * 60 + 50];
  let dayRange = [6 * 60 + 1, 19 * 60 + 49]; 
  let backgroundUrl = "images/night.jpg"; 

  if (
    (totalMinutes >= nightRange1[0] && totalMinutes <= nightRange1[1]) ||
    (totalMinutes >= nightRange2[0] && totalMinutes <= nightRange2[1])
  ) {
    backgroundUrl = "images/night.jpg";
  } else if (
    dawnRanges.some(([start, end]) => totalMinutes >= start && totalMinutes <= end)
  ) {
    backgroundUrl = "images/dawn.jpg";
  } else if (totalMinutes >= dayRange[0] && totalMinutes <= dayRange[1]) {
    backgroundUrl = "images/day.jpg";
  }

  document.body.style.backgroundImage = `url('${backgroundUrl}')`;
}

async function getPokemonByTime() {
  updateBackgroundImage(); 

  let now = new Date();
  let hour24 = now.getHours();
  let minute = now.getMinutes();

  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  let formattedHour = hour12.toString().padStart(2, '0');
  let formattedMinute = minute.toString().padStart(2, '0');
  let ampm = hour24 < 12 ? 'AM' : 'PM';

  let timeString = `${formattedHour}:${formattedMinute} ${ampm}`;
  let timeValue = (hour12 * 100) + minute;
  let totalMinutes = hour24 * 60 + minute;

  let blockedRanges = [
    [10 * 60 + 11, 12 * 60 + 59],  
    [22 * 60 + 11, 23 * 60 + 59],  
    [0, 0 + 59]                   
  ];

  let isBlocked = blockedRanges.some(([start, end]) => totalMinutes >= start && totalMinutes <= end);

  if (isBlocked) {
    document.getElementById("pokemon").textContent = `${timeString}`;
    document.getElementById("pokemon2").textContent = `There’s a time and place for everything! But not now.`;
    document.getElementById("pokemon-image").src = "images/143.png";
    document.getElementById("pokemon-image").style.display = "block";
    return;
  }

  let pokemonId = timeValue;
  if (pokemonId > 1008) {
    pokemonId = pokemonId % 1008;
    if (pokemonId === 0) pokemonId = 1;
  }

  try {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let data = await response.json();
    let name = data.name.charAt(0).toUpperCase() + data.name.slice(1);

    document.getElementById("pokemon").innerHTML = `${timeString}`;
    document.getElementById("pokemon-image").src = data.sprites.front_default;
    document.getElementById("pokemon-image").style.display = "block";
    document.getElementById("pokemon2").innerHTML = `#${pokemonId} ${name}`;
  } catch (error) {
    document.getElementById("pokemon").textContent = `Time: ${timeString} - pokemon not found.`;
    document.getElementById("pokemon-image").style.display = "none";
    console.error("Error fetching Pokemon:", error);
  }
}

getPokemonByTime();
setInterval(getPokemonByTime, 60000);
