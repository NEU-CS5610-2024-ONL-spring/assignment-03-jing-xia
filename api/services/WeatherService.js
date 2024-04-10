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
  console.log("☀️ get location by city name: ", location);
  const city = {
    name: location[0].name,
    latitude: location[0].lat,
    longitude: location[0].lon,
    contry: location[0].country,
    state: location[0].state,
  }
  console.log("☀️ city geo:", city);
  return city;
}

// get current condition of city by key, 
// unit: metric Celsius , imperial Fahrenheit , standard Kelvin 
export async function getCurrentForecast(latitude, longitude, unit="imperial") {
  const res = await fetch(
    `${process.env.OPENWEATHER_CURRENT_FORECAST}?apikey=${process.env.OPENWEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&units=${unit}&exclude=minutely`);
  const forecast = await res.json();
  console.log("☀️ get current forecast by location: ");
  return forecast;
}

export async function getWeatherByCities(names, unit="imperial") {
  const weathers = names.map(async (name) => {
    const location = await getLocationByCity(name);
    const weathers = getCurrentForecast(location.latitude, location.longitude, unit);
    return weathers;
  });
  return Promise.all(weathers);
}

// getLocationByCity("New York");
// getCurrentForecast(40.7128, -74.0060);


//****** accu weather */
// get location info by city name
// export async function getLocationByCity(name) {
//   const res = await fetch(
//     `${process.env.ACCUWEATHER_CITY_Location_SEARCH}?apikey=${process.env.ACCUWEATHER_API_KEY}&q=${name}`);
//   const location = await res.json();
//   console.log("☀️ get location by city name: ", location);
//   const city = {
//     name: location.LocalizedName,
//     locationKey: location.Key,
//     latitude: location.GeoPosition.Latitude,
//     longitude: location.GeoPosition.Longitude,
//   }
//   return city;
// }


// get top 100 city locations
// export async function getTopCityLocations() {
//   const locations = await fetch(
//     `${process.env.ACCUWEATHER_TOP_CITIES}/100?apikey=${process.env.ACCUWEATHER_API_KEY}`);
//   console.log("☀️ get top city locations: ", locations);
//   const cities = locations.map((location) => {
//     return {
//       name: location.LocalizedName,
//       locationKey: location.Key,
//       latitude: location.GeoPosition.Latitude,
//       longitude: location.GeoPosition.Longitude,
//     }
//   });
//   return cities;
// }

// get current condition of city by key, 
// details = true, TemperatureSummary: Past24HourRange
// export async function getCurrentConditionByKey(key) {
//   const condition = await fetch(
//     `${process.env.ACCUWEATHER_CURRENT_CONDITIONS}/${key}?apikey=${process.env.ACCUWEATHER_API_KEY}&details=true`);
//   console.log("☀️ get current condition by key: ", condition);
//   return condition;
// }

// get 12 hours forecasts of city by key
// export async function get12HForecasts(key) {
//   const forecasts = await fetch(
//     `${process.env.ACCUWEATHER_12H_FORECASTS}/${key}?apikey=${process.env.ACCUWEATHER_API_KEY}`);
//   console.log("☀️ get 12h forecasts: ", forecasts);
//   return forecasts;
// }

// // get 1 days forecasts of city by key
// export async function get1DForecasts(key) {
//   const forecasts = await fetch(
//     `${process.env.ACCUWEATHER_1D_FORECASTS}/${key}?apikey=${process.env.ACCUWEATHER_API_KEY}`);
//   console.log("☀️ get 1d forecasts: ", forecasts);
//   return forecasts;
// }

// // get 5 days forecasts of city by key
// export async function get5DForecasts(key) {
//   const forecasts = await fetch(
//     `${process.env.ACCUWEATHER_5D_FORECASTS}/${key}?apikey=${process.env.ACCUWEATHER_API_KEY}`);
//   console.log("☀️ get 5d forecasts: ", forecasts);
//   return forecasts;
// }

