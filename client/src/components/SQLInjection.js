import React, { useState } from "react";
import { Form, Input, Button, Modal } from "antd-mobile";
import api from "../Api";
import { useLocation } from "react-router-dom";

const SQLInjection = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");

  const handleSubmit = async (values) => {
    const input = values.input?.trim();
    if (input !== undefined && input.length > 0) {
      try {
        setLoading(true);
        setOpen(true);
        const resp = await api.sqlInjection(input, username);
        console.log(resp);
        setData(resp);
        setLoading(false);
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
      <h1 style={{ color: "white" }}>SQL Injection Demo</h1>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="input">
          <Input size="large" />
        </Form.Item>
        <Form.Item>
          <Button className="button" size="large" onClick={handleAutofill}>
            Autofill SQL Injection
          </Button>
        </Form.Item>
        <Form.Item>
          <Button className="button" size="large" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Modal
        loading={loading}
        open={open}
        footer=""
        onCancel={() => setOpen(false)}
      >
        <div>
          <h1>HTTP Response</h1>
          <div>{data}</div>
        </div>
      </Modal>
    </div>
  );
};

export default SQLInjection;
