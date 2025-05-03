async function getPokemonByTime() {
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
  
  if ((hour12 >= 10 && minute >= 10 && hour12 <= 12) || 
      (hour12 === 12 && minute <= 59)) {
    document.getElementById("pokemon").textContent = `Time: ${timeString} - sry the pokemon are asleep.`;
    document.getElementById("pokemon-image").src = "https://media.tenor.com/3Qj2zvHVl40AAAAi/snorlax-sleeping.gif";
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
    if (!response.ok) throw new Error('Pokémon not found');
    
    let data = await response.json();
    let name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    
    document.getElementById("pokemon").textContent = `${timeString} - #${pokemonId} ${name}`;
    document.getElementById("pokemon-image").src = data.sprites.front_default;
    document.getElementById("pokemon-image").style.display = "block";
  } catch (error) {
    document.getElementById("pokemon").textContent = `Time: ${timeString} - pokemon not found.`;
    document.getElementById("pokemon-image").style.display = "none";
    console.error("Error fetching Pokemon:", error);
  }
}

getPokemonByTime();
setInterval(getPokemonByTime, 60000); 