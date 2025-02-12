import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Login from "../pages/Login";
import Register from "../pages/Register";
import routes from "../config/route";
// import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* <Route element={<PrivateRoute />}> */}
                    <Route path={routes.home} element={<Home />} />
                {/* </Route> */}
                <Route path={routes.login} element={<Login />} />
                <Route path={routes.register} element={<Register />} />
                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
        </Router>
    );
};

export default AppRouter;