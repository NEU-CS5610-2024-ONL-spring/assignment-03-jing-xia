import * as dotenv from "dotenv";
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import { getCurrentForecast, getLocationByCity, getWeatherByCities } from "./services/WeatherService.js";

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
 * This endpoint is used to add a city to the user's city list
 */
//app.post("/user/addCity", requireAuth, async (req, res) => {
app.post("/user/addCity", async (req, res) => {
  //const auth0Id = req.auth.payload.sub;
  const auth0Id = "auth0|661201489fbd80a7b65838e5";
  const { name, latitude, longitude, contry, state } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  let city = await prisma.city.findFirst({
    where:{
      latitude: latitude,
      longitude: longitude,
    }
  });
  if(!city){
    city = await prisma.city.create({
      data:{
        name: name,
        latitude: latitude,
        longitude: longitude,
        country: contry,
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
    },});
  console.log("🏛️ add city: ", city);
  res.json(city);
});

/**
 * URL:     /weather/list
 * params:  cities, unit
 * This endpoint is used to get weathers of a list of cities by names
 */
app.get("/weather/list", async (req, res) => {
  const cityNames = req.query.cities.split(",");
  if (!cityNames) {
    res.status(400).send("cities query param is required");
  } else {
    const unit = req.query.unit || "imperial";
    const weathers = await getWeatherByCities(cityNames, unit);
    console.log("🌦️ get weathers by city names: ");
    res.json(weathers);
  }
});

/**
 * url:     /weather/detail
 * params:  city_name, unit
 */
//app.get("/weather/detail", requireAuth, async (req, res) => {
app.get("/weather/detail", async (req, res) => {
  const cityName = req.query.city_name;
  if (!cityName) {
    res.status(400).send("city_name query param is required");
  } else {
    const unit = req.query.unit || "imperial";
    const weather = await getWeatherByCities([cityName], unit);
    console.log("🌦️ get weather detail by city name: ");
    res.json(weather);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
