import {useLocation, useNavigate} from "react-router-dom"
import { useEffect } from "react";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  //Delete message after a delay
  useEffect(() => {
    if (location.state?.message) {
        setTimeout(() => {
            navigate(".", { replace: true, state: {} });
        }, 3000);
    }
}, [location, navigate]);

  let message = "";
  if (location.state) {
    message = location.state.message;
  }

  return (
    <div>
      <h1>Bienvenue sur la page d'accueil</h1>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Home;
