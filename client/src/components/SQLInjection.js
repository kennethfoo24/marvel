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
    <div className="container">
      <h1 style={{ color: "white" }}>SQL Injection Demo</h1>
      <Button
        style={{
          backgroundColor: "#c887ff",
          color: "black",
          borderRadius: "8px",
          margin: "0.5em",
          border: "0",
        }}
        onClick={handleAutofill}
      >
        Sample SQL query
      </Button>
      <Form
        form={form}
        onFinish={handleSubmit}
        footer={
          <div>
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
          </div>
        }
      >
        <Form.Item name="input">
          <Input size="large" />
        </Form.Item>
      </Form>
      <Modal
        loading={loading}
        open={open}
        footer=""
        showCloseButton
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
