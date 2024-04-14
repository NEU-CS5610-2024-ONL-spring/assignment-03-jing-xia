import * as dotenv from "dotenv";
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import { getCurrentForecast, getDailyForecast, getHourlyForecast, getLocationByCity, getLocationsByCityName, getWeatherByCities } from "./services/WeatherService.js";

dotenv.config();

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

// add your endpoints below this line

/**
 * url:   /verify-user
 * This endpoint is used by the client to verify the user status 
 * and to make sure the user is registered in our database once they signup with Auth0
 * if not registered in our database we will create it.
 * if the user is already registered we will return the user information
 */
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  // check if user is already registered, if not then register it
  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });
    console.log("😀 new user created: ", newUser);
    res.json(newUser);
  }
});

/**
 * url:   /user/cityList
 * This endpoint is used to get the city list of the user
 */
//app.get("/user/cityList", requireAuth, async (req, res) => {
app.get("/user/cityList", async (req, res) => {
  //const auth0Id = req.auth.payload.sub;
  const auth0Id = "auth0|661201489fbd80a7b65838e5";
  const cities = await prisma.city.findMany({
    where:{
      users: {
        some: {
          user:{
            auth0Id: auth0Id,
          }
        }
      },
    },
  })
  console.log("🏛️ get city list: ", cities);
  res.json(cities);
});

/**
 * url:   /user/addCity
 * params: body = {name, latitude, longitude, country, state}
 * This endpoint is used to add a city to the user's city list
 */
//app.post("/user/addCity", requireAuth, async (req, res) => {
app.post("/user/addCity", async (req, res) => {
  //const auth0Id = req.auth.payload.sub;
  const auth0Id = "auth0|661201489fbd80a7b65838e5";
  const { name, latitude, longitude, country, state } = req.body;
  if(!name || !latitude || !longitude || !country || !state){
    return res.status(400).send("City's information is required");
  }
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  // check if city already exists in the database, if not then create it
  let city = await prisma.city.findFirst({
    where:{
      latitude: latitude,
      longitude: longitude,
    }
  });
  // create city if not exists
  if(!city){
    city = await prisma.city.create({
      data:{
        name: name,
        latitude: latitude,
        longitude: longitude,
        country: country,
        state: state,
      },
    });
  }
  const cityList = await prisma.cityList.create({
    data:{
      user:{
        connect:{
          id: user.id,
        }
      },
      city:{
        connect:{
          id: city.id,
        }
      },
    },
  });
  if(!cityList){
    return res.status(500).send("Failed to add city to the user's city list");
  };
  console.log("🧍 add cityList: ", cityList);
  res.json(cityList);
});

/**
 * url: /user/removeCity?cityId=1
 * params: cityId
 * This endpoint is used to remove a city from the user's city list
 */
// app.delete("/user/removeCity", requireAuth, async (req, res) => {
app.delete("/user/removeCity", async (req, res) => {
  // const auth0Id = req.auth.payload.sub;
  const auth0Id = "auth0|661201489fbd80a7b65838e5";
  const cityId = req.query.cityId;
  if(!cityId){
    // res.status(400).send("id query param is required");
    return res.status(400).send("id query param is required");
  }
  const city = await prisma.city.findUnique({
    where: {
      id: parseInt(cityId),
    },
  });
  if(!city){
    return res.status(404).send("Invalid city id");
  }
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  const cityList = await prisma.cityList.delete({
    where: {
      userId_cityId: {
        userId: user.id,
        cityId: parseInt(cityId),
      }
    }
  });
  if(!cityList){
    res.status(404).send("City not found");
  }
  console.log("🧍 remove city: ", cityList);
  res.status(200).send("OK");
});

/**
 * url: /user/locate?allow=true
 * params: allow
 * This endpoint is used to update the allowLocation in user table
 */
// app.put("/user/locate", requireAuth, async (req, res) => {
app.put("/user/locate", async (req, res) => {
  // const auth0Id = req.auth.payload.sub;
  const auth0Id = "auth0|661201489fbd80a7b65838e5";
  const isAllowed = req.query.allow;
  if(!isAllowed){
    return res.status(400).send("allow query param is required");
  }
  const allow = isAllowed === "true" ? 1 : 0;
  const user = await prisma.user.update({
    where: {
      auth0Id,
    },
    data: {
      allowLocate: allow,
    },
  });
  console.log("🧍 update allowLocation: ", user);
  res.json(user);
});

/**
 * url: /user/profile
 * This endpoint is used to get the user infomation
 */
app.get("/user/profile", requireAuth, async (req, res) => {
// app.get("/user/profile", async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  // const auth0Id = "auth0|661201489fbd80a7b65838e5";
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  console.log("🧍 get user profile: ", user);
  res.json(user);
});

/**
 * URL:     /weather/list
 * params:  cities, unit
 * This endpoint is used to get weathers of a list of cities by names
 */
app.get("/weather/list", async (req, res) => {
  if(!req.query.cities){
    return res.status(400).send("cities query param is required");
  }
  const cityNames = req.query.cities.split(",");
  const unit = req.query.unit || "imperial";
  const weathers = await getWeatherByCities(cityNames, unit);
  console.log("🌦️ get weathers by city names: ");
  res.json(weathers);
});

/**
 * url:     /weather/detail?city_name=New York&unit=imperial
 * params:  city_name, unit
 */
//app.get("/weather/detail", requireAuth, async (req, res) => {
// app.get("/weather/detail", async (req, res) => {
//   const cityName = req.query.city_name;
//   if (!cityName) {
//     res.status(400).send("city_name query param is required");
//   } else {
//     const unit = req.query.unit || "imperial";
//     const weather = await getWeatherByCities([cityName], unit);
//     console.log("🌦️ get weather detail by city name: ");
//     res.json(weather);
//   }
// });

/**
 * url: /weather/detail?latitude=1&longitude=1&unit=imperial
 * params: latitude, longitude, unit
 * This endpoint is used to get weather detail by latitude and longitude
 */
// app.get("/weather/detail", requireAuth, async (req, res) => {
app.get("/weather/detail", async (req, res) => {
  if(!req.query.latitude || !req.query.longitude){
    return res.status(400).send("latitude and longitude query params are required");
  }
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const unit = req.query.unit || "imperial";
  const weather = await getCurrentForecast(latitude, longitude, unit);
  console.log("🌦️ get weather detail by latitude and longitude: ");
  res.json(weather);
});

/**
 * url: /weather/detail/hourly?latitude=1&longitude=1&unit=imperial
 * params: latitude, longitude, unit
 * This endpoint is used to get 48 hours' hourly weather detail by latitude and longitude
 */
// app.get("/weather/detail/hourly", requireAuth, async (req, res) => {
app.get("/weather/detail/hourly", async (req, res) => {
  if(!req.query.latitude || !req.query.longitude){
    return res.status(400).send("latitude and longitude query params are required");
  }
  const { latitude, longitude } = req.query;
  if(!latitude || !longitude){
    res.status(400).send("latitude and longitude query params are required");
  } else {
    const unit = req.query.unit || "imperial";
    const weather = await getHourlyForecast(latitude, longitude, unit);
    console.log("🌦️ get hourly weather detail by latitude and longitude: ");
    res.json(weather);
  }
});

/**
 * url: /weather/detail/daily?latitude=1&longitude=1&unit=imperial
 * params: latitude, longitude, unit
 * This endpoint is used to get 8 days' daily weather detail by latitude and longitude
 */
// app.get("/weather/detail/daily", requireAuth, async (req, res) => {
app.get("/weather/detail/daily", async (req, res) => {
  if(!req.query.latitude || !req.query.longitude){
    return res.status(400).send("latitude and longitude query params are required");
  }
  const { latitude, longitude } = req.query;
  const unit = req.query.unit || "imperial";
  const weather = await getDailyForecast(latitude, longitude, unit);
  console.log("🌦️ get daily weather detail by latitude and longitude: ");
  res.json(weather);
});

/**
 * url: /search?city=name
 * params: city
 * This endpoint is used to search a city by name
 */
app.get("/search", async (req, res) => {
  if(!req.query.city){
    return res.status(400).send("city query param is required");
  }
  const cityName = req.query.city;
  const cities = await getLocationsByCityName(cityName);
  console.log("🌦️ search cities by name: ");
  res.json(cities);
}); 

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT} 🎉 🚀`);
});
