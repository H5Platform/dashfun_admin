import Dropdown from "antd/es/dropdown/dropdown";
import { LogoutOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { logoutHandler } from "../utils/authHandler";
import DataCenter from "../modules/DataCenter";
import { useEffect, useState } from "react";
import JSEvent from "../utils/JSEvent";
import Events from "../modules/Events";
import { Button, Space } from "antd";

export default function AccountButton({ collapsed }) {
  const [username, setUsername] = useState(DataCenter.userInfo.username);

  useEffect(() => {
    const onLogin = () => {
      setUsername(DataCenter.userInfo.username);
    };

    JSEvent.on(Events.Account.Login, onLogin);

    return () => {
      JSEvent.remove(Events.Account.Login, onLogin);
    };
  }, []);

  const onMenuClick = (e) => {
    console.log("click", e);
    if (e.key === "1") {
      console.log("Change Password");
    } else if (e.key === "2") {
      console.log("Logout");
      logoutHandler();
    }
  };
  const items = [
    {
      key: "0",
      label: "User:" + username,
      disabled: true,
    },
    { type: "divider" },
    {
      key: "1",
      label: "Change Password",
      icon: <EditOutlined />,
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        onClick: onMenuClick,
      }}
    >
      <Button>
        <Space className=" flex items-center justify-center">
          <UserOutlined />
          {!collapsed && ("User:" + username)}
        </Space>
      </Button>
    </Dropdown >
  );
}
