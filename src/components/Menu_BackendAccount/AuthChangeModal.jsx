import { useState } from "react";
import { Modal, Button, Form, Checkbox, Row, Col } from "antd";
import API, { requestWithAuthHeader } from "../../modules/api";
import Constants from "../../modules/constants";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";

const { Authority } = Constants;

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
          <Checkbox value={Authority.TaskManagement}>Task Management</Checkbox>
        </Col>
        <Col span={24}>
          <Checkbox value={Authority.GameManagement}>Game Management</Checkbox>
        </Col>
      </Row>
    </Checkbox.Group>
  </Form.Item>
);

export default function AuthChangeModal({ record }) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeAuthHandler = async (values) => {
    let authorities = values.authorities[0];
    for (let i = 1; i < values.authorities.length; i++) {
      authorities = authorities | values.authorities[i];
    }
    console.log("authorities", authorities);
    setLoading(true);
    try {
      const res = await requestWithAuthHeader.post(API.updateUserInfo, {
        user_id: record.id,
        email: record.email,
        auth: authorities,
      });
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code == 0) {
        console.log("success");
        JSEvent.emit(Events.AccountTable_Update);
      } else {
        console.log("error", msg);
      }
    } catch (e) {
      console.log("error", e);
    }
    setLoading(false);
  };

  return (
    <div>
      <Button key={1} onClick={handleOpen}>
        Change Authorities
      </Button>
      <Modal
        title="Change Authorities"
        open={open}
        // onOk={changeAuthHandler}
        onCancel={handleClose}
        okText="Change"
        // confirmLoading={loading}
        footer={null}
      >
        <Form
          form={form}
          name="authChange"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          className="p-[1.5rem]"
          onFinish={changeAuthHandler}
        >
          <AuthCheckBoxGroup />
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
