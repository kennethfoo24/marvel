import React, { useRef, useState } from "react";
import { Tabs, Swiper } from "antd-mobile";
import SelectCharacter from "./components/SelectCharacter";
import SimulateResponses from "./components/SimulateResponses";
import SQLInjection from "./components/SQLInjection";
import { useLocation } from "react-router-dom";
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
  allowedTracingUrls: [
    "https://dd-demo-sg.com",
    "http://dd-demo-sg.com",
    "https://dd-demo-sg.one",
    "http://dd-demo-sg.one",
    "https://kenneth-marvel-958371799887.us-central1.run.app",
    "http://kenneth-marvel-958371799887.us-central1.run.app",
  ],
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask-user-input",
  trackSessionAcrossSubdomains: true,
});

const tabItems = [
  {
    label: "Character",
    key: "selectCharacter",
  },
  {
    label: "HTTP",
    key: "simulateHttpResponses",
  },
  {
    label: "Security",
    key: "injectSQL",
  },
];

const ActionPage = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");
  if (username !== undefined && username.length > 0) {
    datadogRum.setUser({
      id: username,
      name: username,
    });
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        activeKey={tabItems[activeIndex].key}
        onChange={(key) => {
          const index = tabItems.findIndex((item) => item.key === key);
          setActiveIndex(index);
          swiperRef.current?.swipeTo(index);
        }}
      >
        {tabItems.map((item) => (
          <Tabs.Tab
            style={{
              "--title-font-size": "1.5em",
              "--active-title-color": "white",
              color: "white",
            }}
            title={item.label}
            key={item.key}
          />
        ))}
      </Tabs>
      <div
        style={{
          background: "radial-gradient(#632ca6, black)",
        }}
      >
        <Swiper
          direction="horizontal"
          loop
          indicator={() => null}
          ref={swiperRef}
          defaultIndex={activeIndex}
          onIndexChange={(index) => {
            setActiveIndex(index);
          }}
        >
          <Swiper.Item>
            <SelectCharacter />
          </Swiper.Item>
          <Swiper.Item>
            <SimulateResponses />
          </Swiper.Item>
          <Swiper.Item>
            <SQLInjection />
          </Swiper.Item>
        </Swiper>
      </div>
    </div>
  );
};

export default ActionPage;
