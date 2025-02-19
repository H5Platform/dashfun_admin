import { RouterProvider, useNavigate } from "react-router-dom";
import Router from "./modules/Router";
import { Layout, theme } from "antd";
import { useCallback } from "react";
import LoginModal from "./components/LoginModal";
import SideMenu, { getMenuItem } from "./components/SideMenu";
import { Content } from "antd/es/layout/layout";

const App = () => {
  return <RouterProvider router={Router} />;
};

const App1 = () => {

  const onSelectMenu = useCallback((item) => {
    const mi = getMenuItem(item.key);
  }, []);

  return <Layout className="h-screen w-screen"  >
    <LoginModal />
    <SideMenu onSelectMenu={onSelectMenu} />
    <Layout>
      <Content id="page content" className="p-4">
        <RouterProvider router={Router} />
      </Content>
    </Layout>
  </Layout>
};
export default App;
