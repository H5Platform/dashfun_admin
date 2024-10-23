import { Alert, Button, Checkbox, Col, Form, Input, Modal, Row } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import Constants from "../../modules/constants";
import API, { requestWithAuthHeader } from "../../modules/api";
import DataCenter from "../../modules/DataCenter";

const { Authority } = Constants;

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const AuthCheckBoxGroup = () => (
  <Form.Item
    label="Authorities"
    name="authorities"
    rules={[
      {
        validator(_, value) {
          if (value && value.length > 0) {
            return Promise.resolve();
          }
          return Promise.reject(
            new Error("You must select at least one authority!")
          );
        },
      },
    ]}
  >
    <Checkbox.Group>
      <Row>
        <Col span={24}>
          <Checkbox value={Authority.UserManagement}>User Management</Checkbox>
        </Col>
        <Col span={24}>
          <Checkbox value={Authority.GameManagement}>Game Management</Checkbox>
        </Col>
        <Col span={24}>
          <Checkbox value={Authority.TaskManagement}>Task Management</Checkbox>
        </Col>
      </Row>
    </Checkbox.Group>
  </Form.Item>
);

export default function CreateAccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [form] = Form.useForm();

  console.log("auth:", DataCenter.authHeaderValue);

  const onCreateAccount = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const { email, username, authorities } = values;
      console.log("values", email, username, authorities);

      const auth = authorities.reduce((acc, cur) => acc + cur, 0);
      console.log("auth", auth);

      const res = await requestWithAuthHeader.post(API.userCreate, {
        username,
        email,
        auth: 1,
      });
      console.log("res", res);
    } catch (e) {
      const { data } = e.response;
      const msg = data.msg;
      setFeedback({ type: "error", msg });
      console.log("Failed:", e);
    }
    setLoading(false);
    // setLoading(true);
    // try {
    //   const values = await form.validateFields();
    //   console.log("values", values);
    // } catch (e) {
    //   console.log("Failed:", e);
    // }
    // setLoading(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={openModal}
        className="mb-5"
        icon={<UserAddOutlined />}
      >
        Create Account
      </Button>
      <Modal
        title="Create Account"
        open={isOpen}
        onOk={onCreateAccount}
        onCancel={handleCancel}
        okText="Create"
        confirmLoading={loading}
      >
        <div className="w-full flex justify-center pb-2">
          Enter the email of the user you want to create
        </div>
        <Form form={form} name="login" autoComplete="off" {...layout}>
          <Form.Item
            name="email"
            label="email"
            rules={[
              {
                type: "email",
                message: "Incorrect email format!",
              },
              {
                required: true,
                message: "Please input the email of the user!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input the username of the user!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <AuthCheckBoxGroup />
          {feedback && (
            <Alert message={feedback.msg} type={feedback.type} showIcon />
          )}
        </Form>
      </Modal>
    </div>
  );
}
