// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import { handlers } from './testServerHandlers';
import { MemoryRouter } from 'react-router-dom';
import City from '../components/City/City';
import DetailHeader from '../components/Detail/DetailHeader';
import { AuthTokenProvider } from '../AuthTokenContext';
import UserProfile from '../components/UserProfile/UserProfile';
import { useAuth0 } from '@auth0/auth0-react';

const server = setupServer(...handlers);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock("@auth0/auth0-react");

const mockGetToken = () => {
  return "test token";
};

beforeAll(() => {
  jest.mocked(useAuth0, true).mockReturnValue({
    isAuthenticated: true,
    getAccessTokenSilently: mockGetToken,
    logout: jest.fn(),
  });
  server.listen();
});

afterEach(() => {
  jest.clearAllMocks();
  server.resetHandlers()
});

afterAll(() => server.close());

test("test if city component could display city name and weather info correctly", async () => {
  render(
    <MemoryRouter>
      <City 
        city={{
          name: "Los Angeles",
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
  expect(screen.getByTestId("city-card")).toHaveTextContent("More");
  expect(screen.getByTestId("city-card")).toHaveTextContent("Clear");
  expect(screen.getByTestId("city-card")).toHaveTextContent("56.01");
});

test("test if detail header could load city and subscribe status correctly", async () => {
  render(
    <AuthTokenProvider>
      <DetailHeader city={{
        name: "Los Angeles",
        latitude: 34.0536909,
        longitude: -118.242766,
        country: "US",
        state: "California",
      }}/>
    </AuthTokenProvider>)
  expect(screen.getByTestId("detail-header")).toHaveTextContent("Los Angeles, California, US");
  expect(screen.getByTestId("detail-header")).toHaveTextContent("Subscribe");
});

test("load profile page", async () => {
    render(
      <AuthTokenProvider>
          <MemoryRouter>
            <UserProfile />
          </MemoryRouter>
      </AuthTokenProvider>);
  await waitFor(() => expect(screen.getByTestId("profile-content")).toHaveTextContent("test@northeastern.edu"));
  expect(screen.getByTestId("profile-subscribed-city-list")).toHaveTextContent("Oakland");
  expect(screen.getByTestId("profile-subscribed-city-list")).toHaveTextContent("London");
  fireEvent.click(screen.getByText("Settings"));
  expect(screen.getByTestId("profile-settings")).toHaveTextContent("Access to my locationEnable");
  fireEvent.click(screen.getByText("Auth Debugger"));
  expect(screen.getByTestId("profile-auth-debugger")).toHaveTextContent("Tokentest token");
});
