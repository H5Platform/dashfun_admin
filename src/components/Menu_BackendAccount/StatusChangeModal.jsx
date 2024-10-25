import { useState } from "react";
import { Modal, Button, Form, Radio } from "antd";
import API, { requestWithAuthHeader } from "../../modules/api";
import Constants from "../../modules/constants";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";

const { UserStatus } = Constants;

const StatusCheckBoxGroup = () => (
  <Form.Item
    label="Status"
    name="status"
    rules={[
      {
        required: true,
        message: "You must select at least one authority!",
      },
    ]}
  >
    <Radio.Group>
      <Radio value={UserStatus.Normal} defaultChecked={true}>
        Normal
      </Radio>
      <Radio value={UserStatus.ResetPassword}>ResetPassword</Radio>
      <Radio value={UserStatus.Ban}>Ban</Radio>
    </Radio.Group>
  </Form.Item>
);

export default function StatusChangeModal({ record, messageApi }) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeStatusHandler = async ({ status }) => {
    console.log("values", status);
    setLoading(true);
    try {
      const res = await requestWithAuthHeader.post(API.updateUserStatus, {
        user_id: record.id,
        status,
      });
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code == 0) {
        console.log("success");
        setOpen(false);
        messageApi.success("Status changed successfully");
        JSEvent.emit(Events.AccountTable_Update);
      } else {
        console.log("error", msg);
        messageApi.error(msg);
      }
    } catch (e) {
      console.log("error", e);
      messageApi.error("Status change failed");
    }
    setLoading(false);
  };

  return (
    <>
      <Button key={2} onClick={handleOpen}>
        Change Status
      </Button>
      <Modal
        title="Change Status"
        open={open}
        // onOk={changeAuthHandler}
        onCancel={handleClose}
        okText="Change"
        // confirmLoading={loading}
        footer={null}
      >
        <Form
          form={form}
          name="stuasChange"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          className="p-[1.5rem]"
          onFinish={changeStatusHandler}
        >
          <StatusCheckBoxGroup />
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
    </>
  );
}
