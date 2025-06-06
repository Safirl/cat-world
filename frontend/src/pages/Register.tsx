import React, { use, useState } from "react";
import { useAuthCheck } from "../services/useAuthCheck";
import { useNavigate } from "react-router-dom"
import { apiRoutes, routes } from "../config/route";


const Register = () => {
    const navigate = useNavigate();
    const checkAuthStatus = useAuthCheck("/home", "Vous êtes déjà connecté !");

    // useEffect(() => {
    //     checkAuthStatus();
    // }, []);
    use(checkAuthStatus())

    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.register, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: "include"
            });
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                navigate(routes.home, { state: { message: "Vous êtes connecté !" } })
            }
            else {
                setMessage(data.message || "Something went wrong with registration");
            }
        }
        catch (error) {
            console.error(error);
            setMessage("An error occurred");
        }
    };

    return (
        <>
            <div className="containerForm">
                <h1>Inscription</h1>
                <form onSubmit={handleSubmit}>
                    <div className="labelInput">
                        <label htmlFor="register-username">Username</label>
                        <input id="register-username" type="text" name="username" placeholder="John doe" onChange={handleChange} required />
                    </div>
                    <div className="labelInput">
                        <label htmlFor="register-email">Adresse Email</label>
                        <input id="register-email" type="email" name="email" placeholder="John.doe@catworld.fr" onChange={handleChange} required />
                    </div>
                    <div className="labelInput">
                        <label htmlFor="register-passwor">Mot de passe</label>
                        <input id="register-password" type="password" name="password" placeholder="********" onChange={handleChange} required />
                        {message && <p>{message}</p>}
                    </div>
                    <div className="buttonsForm">
                        <button type="submit"><p>Me créer un compte</p></button>

                        <p><a href={routes.login}>J’ai déjà un compte, me connecter</a> </p>
                    </div>
                </form>
            </div>
            <img className="topStars starsForm" src="/image/stars.svg" alt="" />
            <img className="rightStars starsForm" src="/image/stars.svg" alt="" />
            <img className="bottomStars starsForm" src="/image/stars.svg" alt="" />
        </>
    );
};

export default Register;