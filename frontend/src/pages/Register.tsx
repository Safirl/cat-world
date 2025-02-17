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
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Register</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default Register;