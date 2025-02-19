import { Layout, notification, theme } from "antd";
import SideMenu, { getMenuItem } from "./SideMenu";
import Constants from "../modules/constants";
import { useCallback, useEffect, useState } from "react";
import LoginModal from "./LoginModal";
import JSEvent from "../utils/JSEvent";
import Events from "../modules/Events";
import PageRoutes from "./PageRoutes";
import { useNavigate } from "react-router";

const { Content } = Layout;

const { MenuItems } = Constants;

const Home = () => {
  const nav = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onSelectMenu = useCallback((item) => {
    console.log("onSelectMenu", item);
    const mi = getMenuItem(item.key);
    nav(mi.path);

  }, []);

  useEffect(() => {
    const onLogout = () => {
      setCurrentContent(null);
    };

    JSEvent.on(Events.Account.Logout, onLogout);

    return () => {
      JSEvent.remove(Events.Account.Logout, onLogout);
    };
  }, []);

  return (
    <Layout className="w-screen h-screen">
      {contextHolder}
      <LoginModal />
      <SideMenu onSelectMenu={onSelectMenu} />
      <Layout>
        {/* <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        
        /> */}
        <Content
          style={{
            margin: "16px",
          }}
        >
          <div
          className="h-full"
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <PageRoutes />
          </div>
        </Content>
        {/* <Footer>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default Home;
