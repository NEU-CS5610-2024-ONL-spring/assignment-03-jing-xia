import * as dotenv from "dotenv";
dotenv.config({
  debug: true,
  path: ".env",
});

// OPENWEATHER, get location info by city name 
export async function getLocationByCity(name) {
  const res = await fetch(
    `${process.env.OPENWEATHER_GEOCODING}?appid=${process.env.OPENWEATHER_API_KEY}&q=${name}`);
  const location = await res.json();
  // console.log("☀️ get location by city name: ");
  const city = {
    name: location[0].name,
    latitude: location[0].lat,
    longitude: location[0].lon,
    country: location[0].country,
    state: location[0].state,
  }
  console.log("☀️ get location by city city geo:");
  return city;
}
// OPENWEATHER, get mutiple locations info by city name 
export async function getLocationsByCityName(name) {
  const res = await fetch(
    `${process.env.OPENWEATHER_GEOCODING}?appid=${process.env.OPENWEATHER_API_KEY}&q=${name}&limit=5`);
  const locations = await res.json();
  // console.log("☀️ search locations by city name: ");
  const cities = locations.map((location) => {
    return {
      name: location.name,
      latitude: location.lat,
      longitude: location.lon,
      country: location.country,
      state: location.state,
    }
  });
  console.log("☀️ getLocationsByCityName cities geo:", cities);
  return cities;
}

// get full weather by latitude and longitude
export async function getFullWeather(latitude, longitude, unit="imperial") {
  const res = await fetch(
    `${process.env.OPENWEATHER_CURRENT_FORECAST}?apikey=${process.env.OPENWEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&units=${unit}`);
  const forecast = await res.json();
  console.log("☀️ get full weather by location: ");
  return forecast;
}

// get current condition of city by latitude and longitude, 
// unit: metric Celsius , imperial Fahrenheit , standard Kelvin 
export async function getCurrentForecast(latitude, longitude, unit="imperial") {
  const res = await fetch(
    `${process.env.OPENWEATHER_CURRENT_FORECAST}?apikey=${process.env.OPENWEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&units=${unit}&exclude=minutely,hourly,daily`);
  const forecast = await res.json();
  console.log("☀️ get current forecast by location: ");
  return forecast;
}

// get current weathers' of multiple cities by names
export async function getWeatherByCities(names, unit="imperial") {
  const weathers = names.map(async (name) => {
    const location = await getLocationByCity(name);
    const weather = await getCurrentForecast(location.latitude, location.longitude, unit);
    weather.city = location;
    return weather;
  });
  return Promise.all(weathers);
}

// get 48 hours' hourly forecast by location
export async function getHourlyForecast(latitude, longitude, unit="imperial") {
  const res = await fetch(
    `${process.env.OPENWEATHER_CURRENT_FORECAST}?apikey=${process.env.OPENWEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&units=${unit}&exclude=minutely,daily`);
  const forecast = await res.json();
  console.log("☀️ get hourly forecast by location: ");
  return forecast;
}

// get 8 days' daily forecast by location
export async function getDailyForecast(latitude, longitude, unit="imperial") {
  const res = await fetch(
    `${process.env.OPENWEATHER_CURRENT_FORECAST}?apikey=${process.env.OPENWEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&units=${unit}&exclude=minutely,hourly`);
  const forecast = await res.json();
  console.log("☀️ get daily forecast by location: ");
  return forecast;
}
