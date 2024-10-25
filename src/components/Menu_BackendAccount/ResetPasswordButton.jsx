import { useState } from "react";
import { Alert, Button, Popconfirm } from "antd";
import API, { requestWithAuthHeader } from "../../modules/api";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";

export default function ResetPasswordButton({ record, messageApi }) {
  const [resetPwdLoading, setResetPwdLoading] = useState(false);

  const resetPasswordHandler = async (user_id) => {
    setResetPwdLoading(true);
    try {
      const res = await requestWithAuthHeader.post(API.resetPassword, {
        user_id,
      });
      const { code, data, msg } = res.data;
      console.log("res", code, data, msg);
      if (code == 0) {
        console.log("success");
        messageApi.success("Password reset successfully");
        JSEvent.emit(Events.GameTable_Update);
      } else {
        console.log("error", msg);
        messageApi.error(msg);
      }
    } catch (e) {
      console.log("error", e);
      messageApi.error("Password reset failed");
    }
    setResetPwdLoading(false);
  };

  return (
    <>
      <Popconfirm
        key={3}
        title={
          <div>
            Are you sure to reset password for user
            <span className="font-semibold"> {record.name}</span>?
            <br />
            user will not be able to login until the account has been
            reactivated.
          </div>
        }
        okText="Yes"
        cancelText="cancel"
        onConfirm={() => resetPasswordHandler(record.id)}
      >
        <Button loading={resetPwdLoading}>Reset Password</Button>
      </Popconfirm>
    </>
  );
}
