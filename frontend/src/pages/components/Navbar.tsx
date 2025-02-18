import React from "react";

type NavBar = {

};

const NavBar: React.FC<NavBar> = ({  }) => {
    return (
            <nav>
                <div className="buttonNavbar">
                    <div className="left hylightLabelButtonBackground">
                        <div className="label">
                            <img src="/image/navbar/planet.svg" alt="" />
                            <p>Ma planète</p>
                        </div>
                        <img className="hylightCote hylightCoteleft" src="/image/navbar/hylightRight.svg" alt="" />
                        <img className="hylight " src="/image/navbar/hylightBottom.svg" alt="" />
                        <img className="hylightUnder " src="/image/navbar/hylightunder.svg" alt="" />
                        
                    </div>
                    <div className="center hylightLabelButtonBackground">
                        <div className="label">
                                <img src="/image/navbar/letter.svg" alt="" />
                                <p>Mes lettres</p>
                        </div>
                        <img className="hylight center" src="/image/navbar/hylightBottom.svg" alt="" />
                        <img className="hylightUnder " src="/image/navbar/hylightundercenter.svg" alt="" />
                    </div>
                    <div className="right hylightLabelButtonBackground">
                        <div className="label">
                                <img src="/image/navbar/account.svg" alt="" />
                                <p>Mon compte</p>
                        </div>
                        <img className="hylightCote hylightCoteright" src="/image/navbar/hylightLeft.svg" alt="" />
                        <img className="hylight " src="/image/navbar/hylightBottom.svg" alt="" />
                        <img className="hylightUnder " src="/image/navbar/hylighundertright.svg" alt="" />
                    </div>
                </div>
                <img className="background" src="/image/navbar/background.svg" alt="" />
            </nav>
    );
};

export default NavBar;
