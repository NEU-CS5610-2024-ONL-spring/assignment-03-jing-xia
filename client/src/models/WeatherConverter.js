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

export function iconUrlConvert(icon){
  return `${process.env.REACT_APP_API_ICON_URL}${icon}@2x.png`;
  // return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
export function getRainIcon(){
  return "https://openweathermap.org/img/wn/09d@2x.png";
}