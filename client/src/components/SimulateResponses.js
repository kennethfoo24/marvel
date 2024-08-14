import React, { useState } from "react";
import { Button, Modal, Typography } from "antd";
import api from "../Api";

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const handleClick = async (e) => {
    const index = e.currentTarget.getAttribute("data-id");
    try {
      setLoading(true);
      setOpen(true);
      const resp = await api.simulateAttack(actions[index].action);
      console.log(resp);
      setData(resp);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div>
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
        loading={loading}
        open={open}
        footer=""
        onCancel={() => setOpen(false)}
      >
        <div>
          <Typography.Title>HTTP Response</Typography.Title>
          <div>{JSON.stringify(data, null, 2)}</div>
        </div>
      </Modal>
    </div>
  );
};

export default SimulateResponses;
