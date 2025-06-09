import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <main id="main">
            <Outlet />
        </main>
    )
}

export default AppLayout;