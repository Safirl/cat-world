import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../pages/Home.jsx';
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
        </Router>
    );
};

export default AppRouter;