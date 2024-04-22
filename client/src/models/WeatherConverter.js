export function windDirConvert(degrees){
  const dir = Math.floor((degrees / 22.5) + 0.5);
  const compass = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW"
  ];
  return compass[(dir % 16)];
}