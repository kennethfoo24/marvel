import React from "react";
import { Typography, Form, Input, Button } from "antd";
import api from "../Api";

const SQLInjection = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const input = values.input?.trim();
    if (input !== undefined && input.length > 0) {
      try {
        const resp = await api.sqlInjection(input);
        console.log(resp);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleAutofill = () => {
    form.setFieldsValue({
      input: "'; DROP TABLE users; SELECT * FROM users; --",
    });
  };
  return (
    <div>
      <Typography.Title style={{ color: "white" }}>
        SQL Injection Demo
      </Typography.Title>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="input">
          <Input size="large" />
        </Form.Item>
        <Form.Item>
          <Button className="button" size="large" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item>
          <Button className="button" size="large" onClick={handleAutofill}>
            Autofill SQL Injection
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SQLInjection;
