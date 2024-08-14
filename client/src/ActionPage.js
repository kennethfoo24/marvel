import React, { useState } from "react";
import { Menu } from "antd";
import SelectCharacter from "./components/SelectCharacter";
import SimulateResponses from "./components/SimulateResponses";
import SQLInjection from "./components/SQLInjection";

const items = [
  {
    label: "Select Character",
    key: "selectCharacter",
  },
  {
    label: "Simulate HTTP Reponses",
    key: "simulateHttpResponses",
  },
  {
    label: "SQL Injection",
    key: "injectSQL",
  },
];

const ActionPage = () => {
  const [current, setCurrent] = useState(items[0].key);
  const onClick = (e) => {
    setCurrent(e.key);
  };

  const renderContent = () => {
    switch (current) {
      case "selectCharacter":
        return <SelectCharacter />;
      case "simulateHttpResponses":
        return <SimulateResponses />;
      case "injectSQL":
        return <SQLInjection />;
      default:
        return <></>;
    }
  };

  return (
    <div>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
      <div className="container">{renderContent()}</div>
    </div>
  );
};

export default ActionPage;
