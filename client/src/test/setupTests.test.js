// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import { handlers } from './testServerHandlers';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import City from '../components/City/City';

// global.TextEncoder = TextEncoder;

// const url = "http://localhost:8000";

const server = setupServer(...handlers);

beforeAll(() => {server.listen();});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
// jest.spyOn(window, "close").mockImplementation(jest.fn());

test("load home page and display weather forcast of default cities", async () => {
  // jest.mock('@auth0/auth0-spa-js');
  render(
    <MemoryRouter>
      <City 
        city={{name: "Los Angeles",
          latitude: 34.0536909,
          longitude: -118.242766,
          country: "US",
          state: "California",
        }}
        weather={{
          "current": {
            "temp": 56.01,
            "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01n"
              }
          ]}
        }}
        unit={"imperial"}/>
      </MemoryRouter>
    );
  expect(screen.getByTestId("city-card")).toHaveTextContent("Los Angeles");
  expect(screen.getByTestId("city-card")).toHaveTextContent("Clear");
  expect(screen.getByTestId("city-card")).toHaveTextContent("56.01");
});