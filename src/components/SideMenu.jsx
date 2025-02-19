import { useState } from "react";
import { Menu, Layout } from "antd";
import { DesktopOutlined, UserOutlined } from "@ant-design/icons";
import AccountButton from "./AccountButton";
import Constants from "../modules/constants";
import PropTypes from "prop-types";
import { useLocation } from "react-router";

const { Sider } = Layout;

const { MenuItems } = Constants;

function getItem(label, key, icon, path, children) {
  return {
    key,
    icon,
    children,
    label,
    path
  };
}
const items = [
  getItem("Backend Accounts", MenuItems.BackendAccounts, <UserOutlined />, "/accounts"),
  getItem("Games", MenuItems.Game, <DesktopOutlined />, "/games"),
  // getItem("Games", "sub1", <UserOutlined />, [
  //   getItem("Create Game", MenuItems.CreateGame, <FileOutlined />),
  //   getItem("Update Game", "3"),
  // ]),
];

export const getMenuItem = (key) => {
  return items.find((item) => item.key === key);
};

export default function SideMenu({ onSelectMenu }) {
  const l = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  let selectedMenu = MenuItems.BackendAccounts;

  const pathItem = items.find((item) => item.path == l.pathname);
  if (pathItem) {
    selectedMenu = pathItem.key;
  }

  console.log("selectedMenu", selectedMenu)

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <img src={"/img/logo_dashfun.jpeg"} />
      <div className="w-[60%] mx-auto my-5">
        <AccountButton collapsed={collapsed} />
      </div>
      <Menu
        theme="dark"
        defaultSelectedKeys={[selectedMenu]}
        mode="inline"
        items={items}
        onSelect={onSelectMenu}
      />
    </Sider>
  );
}

SideMenu.propTypes = {
  onSelectMenu: PropTypes.func.isRequired,
};