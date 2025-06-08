import { Outlet } from "react-router-dom";
import NavBar from "../pages/components/Navbar";

const NavLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}

export default NavLayout;