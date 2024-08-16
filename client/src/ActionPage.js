import React, { useRef, useState } from "react";
import { Tabs, Swiper } from "antd-mobile";
import SelectCharacter from "./components/SelectCharacter";
import SimulateResponses from "./components/SimulateResponses";
import SQLInjection from "./components/SQLInjection";
import "./index.css";

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
    <div>
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
              "--title-font-size": "30px",
              "--active-title-color": "white",
              color: "white",
            }}
            title={item.label}
            key={item.key}
          />
        ))}
      </Tabs>
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
          <div className="container">
            <SelectCharacter />
          </div>
        </Swiper.Item>
        <Swiper.Item>
          <div className="container">
            <SimulateResponses />
          </div>
        </Swiper.Item>
        <Swiper.Item>
          <div className="container">
            <SQLInjection />
          </div>
        </Swiper.Item>
      </Swiper>
    </div>
  );
};

export default ActionPage;
