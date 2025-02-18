import { routes } from '../../config/route'
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
    const handleClick = (route: string) => {
        navigate(route);
    }

    return (
        <nav>
            <div className="buttonNavbar">
                <button className="left highlightLabelButtonBackground" onClick={() => handleClick(routes.home)}>
                    <div className="label">
                        <img src="/image/navbar/planet.svg" alt="" />
                        <p>Ma planète</p>
                    </div>
                    <img className="highlightCote highlightCoteleft" src="/image/navbar/highlightRight.svg" alt="" />
                    <img className="highlight " src="/image/navbar/highlightBottom.svg" alt="" />
                    <img className="highlightUnder " src="/image/navbar/highlightunder.svg" alt="" />
                </button>
                <button className="center highlightLabelButtonBackground" onClick={() => handleClick(routes.letters)}>
                    <div className="label">
                        <img src="/image/navbar/letter.svg" alt="" />
                        <p>Mes lettres</p>
                    </div>
                    <img className="highlight center" src="/image/navbar/highlightBottom.svg" alt="" />
                    <img className="highlightUnder " src="/image/navbar/highlightundercenter.svg" alt="" />
                </button>
                <button className="right highlightLabelButtonBackground" onClick={() => handleClick(routes.account)}>
                    <div className="label">
                        <img src="/image/navbar/account.svg" alt="" />
                        <p>Mon compte</p>
                    </div>
                    <img className="highlightCote highlightCoteright" src="/image/navbar/highlightLeft.svg" alt="" />
                    <img className="highlight " src="/image/navbar/highlightBottom.svg" alt="" />
                    <img className="highlightUnder " src="/image/navbar/highlightundertright.svg" alt="" />
                </button>
            </div>
            <img className="background" src="/image/navbar/background.svg" alt="" />
        </nav>
    );
};

export default NavBar;
