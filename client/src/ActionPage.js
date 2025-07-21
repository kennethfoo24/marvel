import React, { useRef, useState } from "react";
import { Tabs, Swiper } from "antd-mobile";
import SelectCharacter from "./components/SelectCharacter";
import SimulateResponses from "./components/SimulateResponses";
import SQLInjection from "./components/SQLInjection";

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
