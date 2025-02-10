import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../pages/Home.jsx';
import Login from "../pages/Login";
import Register from "../pages/Register";
import routes from "../config/route";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.login} element={<Login />} />
                <Route path={routes.register} element={<Register />} />
                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
        </Router>
    );
};

export default AppRouter;