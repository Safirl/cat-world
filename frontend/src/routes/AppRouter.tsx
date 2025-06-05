import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Login from "../pages/Login";
import Letters from '../pages/Letters';
import Register from "../pages/Register";
import { routes } from "../config/route";
import PrivateRoute from "./PrivateRoute";
import Landing from "../pages/landing"
import CreateLetter from "../pages/CreateLetter";
import Account from "../pages/Account";
import ShowLetter from "../pages/ShowLetter";

const AppRouter = () => {
    return (
        <Routes>
            {/* Private route */}
            <Route element={<PrivateRoute />}>
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.letters} element={<Letters />} />
                <Route path={routes.account} element={<Account />} />
                <Route path={routes.createLetter} element={<CreateLetter />} />
                <Route path={routes.showLetter} element={<ShowLetter />} />
            </Route>
            <Route path={routes.login} element={<Login />} />
            <Route path={routes.register} element={<Register />} />
            <Route path={routes.landing} element={<Landing />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    );
};

export default AppRouter;