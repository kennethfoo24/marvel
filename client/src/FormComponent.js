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
      <div className="msg">
        <div>Welcome to Puppy Avengers</div>
        <div>Enter your username:</div>
        <Form onFinish={handleSubmit}>
          <Form.Item name="username">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button size="large" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default FormComponent;
