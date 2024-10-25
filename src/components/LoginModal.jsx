import { useCallback, useEffect, useState } from "react";
import { Button, Modal, Form, Input, Checkbox, Alert } from "antd";
import axios from "axios";
import API, { requestWithAuthHeader } from "../modules/api";
import {
  getFromLocalStorage,
  saveAuthInfo,
  saveQuickLoginAuthInfo,
  setAuthHeader,
  validateToken,
} from "../utils/authHandler";
import JSEvent from "../utils/JSEvent";
import Events from "../modules/Events";
import DataCenter from "../modules/DataCenter";

const LoginModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState(false);

  const onLogin = useCallback(async (values) => {
    const { username, password } = values;
    try {
      const res = await axios.post(API.userLogin, { username, password });
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code == 0) {
        saveAuthInfo(data, username);
        setModalOpen(false);
        JSEvent.emit(Events.Account.Login);
      } else {
        setErrorMsg(msg);
      }
      console.log("success");
    } catch (e) {
      const errorMsg = e.response.data.msg;
      setErrorMsg(errorMsg);
      console.log(errorMsg);
    }
  }, []);

  const onLoginFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    const quickLogin = async () => {
      try {
        const { token, id, username } = getFromLocalStorage();
        console.log("quick login", token, id, username);
        setAuthHeader(id, token);
        const res = await requestWithAuthHeader.post(API.loginCheck);
        const { code, data, msg } = res.data;
        console.log("login check res", code, data);
        if (code == 0) {
          console.log("login check result: ", msg);
          // saveAuthInfo(data, username);
          saveQuickLoginAuthInfo();
          JSEvent.emit(Events.Account.Login);
        } else {
          setModalOpen(true);
        }
      } catch (e) {
        console.log(e);
        setModalOpen(true);
      }
    };

    const isTokenValidated = validateToken();
    console.log("isTokenValidated", isTokenValidated);
    if (isTokenValidated) {
      quickLogin();
    } else {
      setModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const relogoin = () => {
      setModalOpen(true);
    };

    JSEvent.on(Events.Account.Logout, relogoin);

    () => {
      JSEvent.remove(Events.Account.Logout, relogoin);
    };
  }, []);

  return (
    <>
      {/* <Button type="primary" onClick={() => setModalOpen(true)} /> */}
      <Modal
        title="Login"
        centered
        open={modalOpen}
        // onOk={() => setModalOpen(false)}
        // onCancel={() => setModalOpen(false)}
        footer={null}
        closeIcon={null}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onLogin}
          onFinishFailed={onLoginFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          {errorMsg && <Alert message={errorMsg} type="error" />}
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default LoginModal;
