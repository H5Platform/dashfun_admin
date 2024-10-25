import { useState } from "react";
import { Alert, Button, Form, Input, Space } from "antd";
import API, { requestWithAuthHeader } from "../modules/api";
import { setAuthHeader } from "../utils/authHandler";
import { useNavigate, useParams } from "react-router-dom";

export default function ActivateAccount() {
  const [loading, setLoading] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { decodedToken } = useParams();
  const navigate = useNavigate();
  console.log("token", decodedToken);

  // try {
  //   const currentUrl = window.location.href;
  //   console.log("currentUrl", currentUrl);
  //   const base64String = currentUrl.split("/activate/")[1];
  //   const decodedString = atob(base64String);
  //   const { user_id, token } = JSON.parse(decodedString);
  //   setAuthHeader(user_id, token);
  // } catch (e) {
  //   console.log("Error parsing token", e);
  // }

  const decodedString = atob(decodedToken);
  const { user_id, token } = JSON.parse(decodedString);
  setAuthHeader(user_id, token);

  const onActivateAccount = async ({ password }) => {
    console.log("Activate account", password);
    const formData = new FormData();
    formData.append("new_password", password);
    setLoading(true);
    try {
      const res = await requestWithAuthHeader.post(API.activateUser, formData);
      const { code, msg } = res.data;
      if (code === 0) {
        setHasActivated(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setErrorMsg("Error activating account ", msg);
      }
    } catch (e) {
      // console.log("Error activating account", e);
      setErrorMsg("Error activating account ", e);
    }
    setLoading(false);
  };

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
          {hasActivated && (
            <Alert
              message={
                "Account activated successfully, the page will redirect after 3 seconds. If not, please click the button below."
              }
              type="success"
              showIcon
              className="my-3"
            />
          )}
          {errorMsg && (
            <Alert message={errorMsg} type="error" showIcon className="my-3" />
          )}
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 4,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Activate
              </Button>
              <Button disabled={!hasActivated} onClick={() => navigate("/")}>
                Go to login
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
