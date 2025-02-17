import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Login from "../pages/Login";
import Letters from '../pages/Letters';
import Register from "../pages/Register";
import { routes } from "../config/route";
import PrivateRoute from "./PrivateRoute";
import Landing from "../pages/landing"

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Private route */}
                <Route element={<PrivateRoute />}>
                    <Route path={routes.home} element={<Home />} />
                    <Route path={routes.letters} element={<Letters />} />
                </Route>
                <Route path={routes.login} element={<Login />} />
                <Route path={routes.register} element={<Register />} />
                <Route path={routes.landing} element={<Landing />} />
                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
        </Router>
    );
};

export default AppRouter;