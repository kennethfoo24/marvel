import React from "react";
import { Form, Input, Button } from "antd";
import { datadogRum } from "@datadog/browser-rum";
import { useNavigate } from "react-router-dom";

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
      navigate(`/actions?username=${username}`);
    }
  };

  return (
    <div className="container">
      <div className="logo">MARVEL</div>
      <div className="msg">
        <div>Welcome to the Marvel Avenger Selector</div>
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
