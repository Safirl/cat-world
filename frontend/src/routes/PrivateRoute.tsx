import { Navigate, Outlet } from "react-router-dom";
import { isUserAuth } from "../services/useAuthCheck";
import { useState, useEffect } from "react";
import routes from "../config/route";

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    
    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await isUserAuth();
            setIsAuthenticated(authStatus);
        };
        checkAuth();
    }, []);
    return isAuthenticated ? <Outlet /> : <Navigate to={routes.login} state={{message: "Connectez-vous pour accéder à cette page."}} replace />;
}

export default PrivateRoute;