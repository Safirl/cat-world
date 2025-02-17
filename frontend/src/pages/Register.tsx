import React, { useState, useEffect } from "react";
import { useAuthCheck } from "../services/useAuthCheck";
import { useNavigate } from "react-router-dom"
import { routes } from "../config/route";


const Register = () => {
    const navigate = useNavigate();
    const checkAuthStatus = useAuthCheck("/", "Vous êtes déjà connecté !");

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
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
                    <input id="register-username" type="text" name="username" placeholder="John doe" onChange={handleChange} />
                </div>
                <div className="labelInput">
                    <label htmlFor="register-email">Adresse Email</label>
                    <input id="register-email" type="email" name="email" placeholder="John.doe@catworld.fr" onChange={handleChange} />
                </div>
                <div className="labelInput">
                    <label htmlFor="register-passwor">Mot de passe</label>
                    <input id="register-password" type="password" name="password" placeholder="********" onChange={handleChange} />
                </div>
                <div className="buttonsForm">
                    <button type="submit">Register</button>
                    {message && <p>{message}</p>}
                    <p>J’ai déjà un compte,<a href="/Login"> me connecter</a> </p>
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