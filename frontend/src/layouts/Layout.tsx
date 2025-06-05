import React from "react";
import { ReactNode } from "react";
import NavBar from "../pages/components/Navbar";

type LayoutProps = {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="layout">
            <NavBar />
            <main>
                {children}
            </main>
        </div>
    )
}

export default Layout;