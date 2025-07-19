import React from "react";
import { Form, Input, Button } from "antd-mobile";
import { datadogRum } from "@datadog/browser-rum";
import { useNavigate } from "react-router-dom";
import api from "./Api";

const FormComponent = ({ setUsername }) => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const username = values.username?.trim();
    if (username !== undefined && username.length > 0) {
      datadogRum.setUser({
        id: username,
        name: username,
      });
      setUsername(username);
      api.submitUsername(username);
      navigate(`/actions?username=${username}`);
    }
  };

  return (
    <div className="container">
      <div className="logo">PUPVENGERS</div>
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        className="form-area"
        footer={
          <Button
            block
            type="submit"
            style={{
              backgroundColor: "white",
              color: "#632CA6",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Submit
          </Button>
        }
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input
            placeholder="Enter your name"
            style={{
              borderRadius: 8,
              backgroundColor: "white",
            }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormComponent;
