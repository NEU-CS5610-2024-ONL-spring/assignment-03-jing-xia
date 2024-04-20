import { rest } from 'msw';

const url = "http://localhost:8000";

export const handlers = [
  rest.get(url +"/ping", (req, res, ctx) => {
    return res(ctx.json("pong"));
  }),

  // weather/list?cities=
  rest.get(url +"/weather/list?cities=New York,Emeryville,Oakland,Chicago&unit=imperial", (req, res, ctx) => {
    return res(
      ctx.json([
      {
        "lat": 40.7127,
        "lon": -74.006,
        // "timezone": "America/New_York",
        // "timezone_offset": -14400,
        "current": {
          "temp": 49.14,
          "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04n"
            }
          ]
        },
        "city": {
          "name": "New York County",
          "latitude": 40.7127281,
          "longitude": -74.0060152,
          "country": "US",
          "state": "New York"
        }
      },
      {
        "lat": 37.8314,
        "lon": -122.2865,
        "current": {
          "temp": 60.49,
          "weather": [
            {
                "id": 801,
                "main": "Clouds",
                "description": "few clouds",
                "icon": "02n"
            }
          ]
        },
        "city": {
          "name": "Emeryville",
          "latitude": 37.8314089,
          "longitude": -122.2865266,
          "country": "US",
          "state": "California"
        }
      },
      {
        "lat": 37.8045,
        "lon": -122.2714,
        "current": {
          "temp": 60.51,
          "weather": [
            {
                "id": 801,
                "main": "Clouds",
                "description": "few clouds",
                "icon": "02n"
            }
          ]
        },
        "city": {
          "name": "Oakland",
          "latitude": 37.8044557,
          "longitude": -122.271356,
          "country": "US",
          "state": "California"
        }
      },
      {
        "lat": 41.8756,
        "lon": -87.6244,
        "current": {
          "temp": 55.67,
          "weather": [
            {
                "id": 803,
                "main": "Clouds",
                "description": "broken clouds",
                "icon": "04n"
            }
          ]
        },
        "city": {
          "name": "Chicago",
          "latitude": 41.8755616,
          "longitude": -87.6244212,
          "country": "US",
          "state": "Illinois"
        }
      }, 
    ])
    )
  }),
]