import { routes } from '../../config/route'
import { useNavigate } from "react-router-dom";
import styles from '../../style/component/navbar.module.scss';

const NavBar = () => {
    const navigate = useNavigate();
    const handleClick = (route: string) => {
        navigate(route);
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.buttonNavbar}>
                <button
                    className={`${styles.left} ${styles.highlightLabelButtonBackground}`}
                    onClick={() => handleClick(routes.home)}
                >
                    <div className={styles.label}>
                        <img src="/image/navbar/planet.svg" alt="" />
                        <p>Ma planète</p>
                    </div>
                    <img className={`${styles.highlightSide} ${styles.highlightSideleft}`} src="/image/navbar/highlightRight.svg" alt="" />
                    <img className={styles.highlight} src="/image/navbar/highlightBottom.svg" alt="" />
                    <img className={styles.highlightUnder} src="/image/navbar/highlightunder.svg" alt="" />
                </button>

                <button
                    className={`${styles.center} ${styles.highlightLabelButtonBackground}`}
                    onClick={() => handleClick(routes.letters)}
                >
                    <label className={styles.label}>
                        <img src="/image/navbar/letter.svg" alt="" />
                        <p>Mes lettres</p>
                    </label>
                    <img className={styles.highlight} src="/image/navbar/highlightBottom.svg" alt="" />
                    <img className={styles.highlightUnder} src="/image/navbar/highlightundercenter.svg" alt="" />
                </button>

                <button
                    className={`${styles.right} ${styles.highlightLabelButtonBackground}`}
                    onClick={() => handleClick(routes.account)}
                >
                    <div className={styles.label}>
                        <img src="/image/navbar/account.svg" alt="" />
                        <p>Mon compte</p>
                    </div>
                    <img className={`${styles.highlightSide} ${styles.highlightSideRight}`} src="/image/navbar/highlightLeft.svg" alt="" />
                    <img className={styles.highlight} src="/image/navbar/highlightBottom.svg" alt="" />
                    <img className={styles.highlightUnder} src="/image/navbar/highlightundertright.svg" alt="" />
                </button>
            </div>

            <img className={styles.background} src="/image/navbar/background.svg" alt="" />
        </nav>
    );
};

export default NavBar;
