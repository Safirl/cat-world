import React from "react";

type NavBar = {

};

const NavBar: React.FC<NavBar> = ({ }) => {
    return (
        <nav>
            <div className="buttonNavbar">
                <div className="left highlightLabelButtonBackground">
                    <div className="label">
                        <img src="/image/navbar/planet.svg" alt="" />
                        <p>Ma planète</p>
                    </div>
                    <img className="highlightCote highlightCoteleft" src="/image/navbar/highlightRight.svg" alt="" />
                    <img className="highlight " src="/image/navbar/highlightBottom.svg" alt="" />
                    <img className="highlightUnder " src="/image/navbar/highlightunder.svg" alt="" />

                </div>
                <div className="center highlightLabelButtonBackground">
                    <div className="label">
                        <img src="/image/navbar/letter.svg" alt="" />
                        <p>Mes lettres</p>
                    </div>
                    <img className="highlight center" src="/image/navbar/highlightBottom.svg" alt="" />
                    <img className="highlightUnder " src="/image/navbar/highlightundercenter.svg" alt="" />
                </div>
                <div className="right highlightLabelButtonBackground">
                    <div className="label">
                        <img src="/image/navbar/account.svg" alt="" />
                        <p>Mon compte</p>
                    </div>
                    <img className="highlightCote highlightCoteright" src="/image/navbar/highlightLeft.svg" alt="" />
                    <img className="highlight " src="/image/navbar/highlightBottom.svg" alt="" />
                    <img className="highlightUnder " src="/image/navbar/highlightundertright.svg" alt="" />
                </div>
            </div>
            <img className="background" src="/image/navbar/background.svg" alt="" />
        </nav>
    );
};

export default NavBar;
