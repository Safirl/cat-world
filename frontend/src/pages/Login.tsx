import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import routes from "../config/route";
import { useAuthCheck } from "../services/useAuthCheck";

const Login = () => {
  const navigate = useNavigate();
  const checkAuthStatus = useAuthCheck("/", "Vous êtes déjà connecté !");

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
      const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
