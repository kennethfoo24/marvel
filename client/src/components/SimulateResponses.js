import React, { useState } from "react";
import { Button, Modal, DotLoading } from "antd-mobile";
import api from "../Api";
import { useLocation } from "react-router-dom";

const actions = [
  {
    action: "status/200",
    label: "Simulate 200",
  },
  {
    action: "status/400",
    label: "Simulate 400",
  },
  {
    action: "status/500",
    label: "Simulate 500",
  },
  {
    action: "attackGKE",
    label: "Simulate Attack",
  },
];

const SimulateResponses = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const handleClick = async (e) => {
    const index = e.currentTarget.getAttribute("data-id");
    try {
      setLoading(true);
      setOpen(true);
      const resp = await api.simulateAttack(actions[index].action, username);
      setData(resp);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setData(error);
    }
  };
  return (
    <div className="container">
      {actions.map((c, i) => (
        <Button
          className="button"
          size="large"
          style={{
            margin: "0.5em",
          }}
          key={i}
          data-id={i}
          data-name={c.key}
          onClick={handleClick}
        >
          {c.label}
        </Button>
      ))}
      <Modal
        visible={open}
        showCloseButton
        closeOnMaskClick
        destroyOnClose
        content={
          loading ? (
            <span style={{ fontSize: 24 }}>
              <DotLoading />
            </span>
          ) : (
            <div>
              <h1>HTTP Response</h1>
              <div>{JSON.stringify(data, null, 2)}</div>
            </div>
          )
        }
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default SimulateResponses;
