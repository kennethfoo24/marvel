import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { datadogRum } from "@datadog/browser-rum";

datadogRum.init({
  clientToken: "pub815b4dbf3e6fc56dee01fe5345bd8e6a",
  applicationId: "abf6318d-6424-4d8d-9f8d-43e4e8e498ce",
  // `site` refers to the Datadog site parameter of your organization
  // see https://docs.datadoghq.com/getting_started/site/
  site: "datadoghq.com",
  service: "avengers-app-browser",
  env: "avengers-app", //  service: 'my-web-application',
  //  env: 'production',
  //  version: '1.0.0',
  version: "phase1",
  allowedTracingUrls: ["https://dd-demo-sg.one", "http://dd-demo-sg.one"],
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask-user-input",
  trackSessionAcrossSubdomains: true,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
