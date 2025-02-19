import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import ActivateAccount from "../components/ActivateAccount";
import BackendAccounts from "../components/Menu_BackendAccount/BackendAccounts";
import GameTable from "../components/Menu_Game/GameTable";

export const contentRoutes = [
  { path: "/accounts", element: <BackendAccounts />, },
  { path: "/games", element: <GameTable />, },
]

const Router = createBrowserRouter([
  { path: "*", element: <Home />, },
  { path: "/activate/:decodedToken", element: <ActivateAccount />, },
]);

export default Router;
