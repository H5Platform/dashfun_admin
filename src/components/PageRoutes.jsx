import { Route, Routes } from "react-router"
import BackendAccounts from "./Menu_BackendAccount/BackendAccounts"
import GamePage from "../pages/GamePage"

const PageRoutes = () => {
    return <Routes>
        <Route path="/" element={<BackendAccounts />} />
        <Route path="/accounts" element={<BackendAccounts />} />
        <Route path="/games" element={<GamePage />} />
    </Routes>
}

export default PageRoutes;