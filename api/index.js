import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

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

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];
  // console.log("email", email);
  // test verify user return auth0Id
  res.json({ auth0Id });

  // const user = await prisma.user.findUnique({
  //   where: {
  //     auth0Id,
  //   },
  // });

  // if (user) {
  //   res.json(user);
  // } else {
  //   const newUser = await prisma.user.create({
  //     data: {
  //       email,
  //       auth0Id,
  //       name,
  //     },
  //   });

  //   res.json(newUser);
  // }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
