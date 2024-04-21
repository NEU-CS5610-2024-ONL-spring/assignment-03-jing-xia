import { rest } from 'msw';

const url = "http://localhost:8000";

export const handlers = [

  rest.get(url + "/user/isSubscribed", (req, res, ctx) => {
    return res(ctx.json(false));
  }),

  rest.post(url + "/user/addCity", (req, res, ctx) => {
    return res(ctx.json({
      "id": 1
    }));
  }),

  rest.get(url + "/user/profile", (req, res, ctx) => {
    return res(ctx.json({
      "id": 1,
      "email": "test@northeastern.edu",
      "auth0Id": "auth0|test",
      "name": "test@northeastern.edu",
      "allowLocate": 0
    }));
  }),

  rest.get(url + "/user/cityList", (req, res, ctx) => {
    return res(ctx.json([
      {
          "id": 1,
          "name": "Oakland",
          "latitude": 37.8044557,
          "longitude": -122.271356,
          "country": "US",
          "state": "California"
      },
      {
          "id": 2,
          "name": "London",
          "latitude": 51.5073219,
          "longitude": -0.1276474,
          "country": "GB",
          "state": "England"
      },
    ]));
  }),

]