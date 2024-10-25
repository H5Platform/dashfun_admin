import { Button, Input, Select, Space } from "antd";
import { useState } from "react";
import Constants from "../../modules/constants";
import JSEvent from "../../utils/JSEvent";
import Events from "../../modules/Events";

const { UserStatus } = Constants;

export default function AccountFilter() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState(undefined);

  const onStausChange = (value) => {
    setStatus(value);
  };

  const isEmail = (keyword) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(keyword);
  };

  const onApplyFilter = () => {
    let filter = {};

    if (isEmail(keyword)) {
      filter = {
        email: keyword,
        status,
      };
    }

    if (!isEmail(keyword)) {
      filter = {
        name: keyword,
        status,
      };
    }

    JSEvent.emit(Events.AccountTable_Update, filter);
  };

  return (
    <div className="mb-3">
      <Input
        placeholder="Search user by name or email"
        onChange={(e) => setKeyword(e.target.value)}
        style={{ width: 400 }}
        className="mr-2"
      />
      <Select
        placeholder="Select status"
        value={status}
        onChange={onStausChange}
        className="mb-3"
        options={Object.entries(UserStatus).map(([key, value]) => ({
          label: key,
          value,
        }))}
      />
      <Space>
        <Button color="primary" variant="link" onClick={onApplyFilter}>
          Apply Filter
        </Button>
        {/* <Button color="default" variant="link" onClick={onResetFilter}>
          Clear Filter
        </Button> */}
      </Space>
    </div>
  );
}
