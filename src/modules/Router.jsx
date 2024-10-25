import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import ActivateAccount from "../components/ActivateAccount";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/activate/:decodedToken",
    element: <ActivateAccount />,
  },
]);

export default Router;
