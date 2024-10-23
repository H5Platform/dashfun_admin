import { useState } from "react";
import { Button, Form, Input, Space } from "antd";

export default function ActivateAccount() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const onActivateAccount = async (values) => {
    console.log("Activate account", values);
  };

  try {
    const currentUrl = window.location.href;
    console.log("currentUrl", currentUrl);
    const base64String = currentUrl.split("/verify/")[1];
    const decodedString = atob(base64String);
    const { email, token } = JSON.parse(decodedString);
    setEmail(email);
    setToken(token);
  } catch (e) {
    console.log("Error parsing token", e);
  }

  return (
    <div className="flex justify-center p-5 h-screen">
      <div className="w-[50vw]">
        <img
          src="/img/logo_dashfun.jpeg"
          alt="logo"
          className="w-[200px] mx-auto"
        />
        <h2 className="text-center text-xl font-bold my-3">Activate Account</h2>
        <Form
          name="activate-account"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 500,
            width: "100%",
            margin: "0 auto",
          }}
          onFinish={onActivateAccount}
        >
          <Form.Item
            label="Create a password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 4,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit">
                Activate
              </Button>
              <Button>Go to login</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
