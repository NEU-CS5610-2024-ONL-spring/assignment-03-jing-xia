import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import Home from "./components/Home/Home";
import VerifyUser from "./components/VerifyUser";
import UserProfile from "./components/UserProfile/UserProfile"
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import { ConfigProvider } from 'antd';
import RequireAuth from "./components/RequireAuth";
import { UnitContextProvider } from "./UnitContext";

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

const requestedScopes = ["profile", "email"];

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <UnitContextProvider>
          <BrowserRouter>
            <ConfigProvider
              theme={{
                token: {
                  colorBgContainer: 'aliceblue',
                },
                components: {
                  Select: {
                    selectorBg:'aliceblue'
                  },
                  Menu: {
                    itemColor: 'white',
                    itemHoverColor: '#1677ff',
                  }
                },
              }}
            >
              <Routes>
                <Route path="/*" element={<Home />} />
                <Route path="/home/*" element={<Home />} />
                <Route path="/verify-user" element={<VerifyUser />} />
                <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ConfigProvider>
          </BrowserRouter>
        </UnitContextProvider>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
