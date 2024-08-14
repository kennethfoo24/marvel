import React from "react";
import { Button } from "antd";

const CustomButton = (props) => {
  const { label } = props;
  return (
    <Button
      type="primary"
      style={{
        backgroundColor: "#ff5733",
        borderColor: "#ff5733",
        color: "#ffffff",
        borderRadius: "6px",
        height: "50px",
        padding: "0 20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
