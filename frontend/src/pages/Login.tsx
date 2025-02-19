import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { apiRoutes, routes } from "../config/route";
import { useAuthCheck } from "../services/useAuthCheck";

const Login = () => {
  const navigate = useNavigate();
  const checkAuthStatus = useAuthCheck("/home", "Vous êtes déjà connecté !");

  useEffect(() => {
    checkAuthStatus()
  }, []);

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message)
        navigate(routes.home, { state: { message: "Vous êtes connecté !" } })
      }
      else {
        setMessage(data.message || "Échec de la connexion");
      }
    } catch (error) {
      console.error("Error while submiting request: ", error)
    }
  }

  return (
    <>
      <div className="containerForm">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="labelInput">
            <label htmlFor="connection-email">Adresse Email</label>
            <input id="connection-email" type="email" name="email" placeholder="John.doe@catworld.fr" onChange={handleChange} />
          </div>
          <div className="labelInput">
            <label htmlFor="connection-password">Mot de passe</label>
            <input id="connection-password" type="password" name="password" placeholder="********" onChange={handleChange} />
          </div>
          <div className="buttonsForm">
            <button type="submit"><p>Me connecter</p></button>
            {message && <p>{message}</p>}
            <p><a href={routes.register}> Je n’ai pas de compte, m’inscrire</a> </p>
          </div>
        </form>
      </div>
      <img className="topStars starsForm" src="/image/stars.svg" alt="" />
      <img className="rightStars starsForm" src="/image/stars.svg" alt="" />
      <img className="bottomStars starsForm" src="/image/stars.svg" alt="" />
    </>
  );
};

export default Login;
