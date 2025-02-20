import { Canvas } from "@react-three/fiber";
import NavBar from "./components/Navbar";
import Cat from "./components/Cat";
import { useState, useEffect } from "react";
import { apiRoutes } from "../config/route";
import * as THREE from "three";


const initialFormData = {
  friend_id:''
};

const Account = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [user, setUser] = useState<{
    username: string;
    _id: string;
    color: string;
  }>();
  const [friends, setFriends] = useState<{ username: string }[]>([]);
  const [error, setError] = useState<{ message: string; target: string } | null>(null);

    const fetchFriends = async () => {
        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL + apiRoutes.getFriends,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            const data = await response.json();
            setFriends(data.friends);

            if (!response.ok) {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error while submiting request: ", error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL + apiRoutes.getUser,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            const data = await response.json();
            if (!response.ok) {
                console.error(data.message);
                return;
            }
            setUser(data.user);
        } catch (error) {
            console.error("Error while submiting request: ", error);
        }
    };

    useEffect(() => {
        fetchFriends();
        fetchUser();
    }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('form Data', formData);
      const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.addFriend, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(initialFormData);
        setError(null); // Réinitialiser l'erreur si la requête réussit
        fetchFriends();
      } else {
        // Définir l'erreur avec le message et la cible
        setError({ message: data.message, target: data.target || "global" });
      }
    } catch (error) {
      setError({ message: "Une erreur s'est produite lors de l'ajout de l'ami", target: "global" });
    }
  };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, friend_id: e.target.value });
      setError(null); 
    };


  useEffect(() => {
    fetchFriends();
    fetchUser();
  }, []);
   


  return (
    <>
      <NavBar />
      <div className="containerAccount">
        <Canvas className="canvasAccount" camera={{ position: [0, 2, 5] }}>
          <ambientLight intensity={2.4} color="#C8B3FF" />
          <directionalLight position={[1, 2, 3]} intensity={0.5} />
          {user && (
            <Cat
              color={user.color}
              defaultYRotation={Math.PI}
              defaultPosition={new THREE.Vector3(0, 1.6, 4)}
            />
          )}
        </Canvas>

                <div className="containerAccountInformation">
                    <h4>{user && user.username}</h4>

                    <div className="friendcode">
                        <p>code ami :&nbsp;</p>
                        <p>{user && user._id}</p>
                        <img src="/image/icons/copy.svg" alt="Copier votre code friend" />
                    </div>

                    <div className="AddfriendContainer">
                        <p>Ajout d’un(e) ami(e)</p>

          <div className="AddfriendContainer">
            <form onSubmit={handleSubmit} method="post">
            <label htmlFor="friend_id">Ajout d’un(e) ami(e)</label>
            <input id="friend_id" type="text" placeholder="Le code de ton ami(e)" onChange={handleChange} required minLength={12}  maxLength={12} />
            <input type="submit" value="Ajoute ton ami(e)" />
            {error && error.target === "friend_id" && ( // Afficher l'erreur si la cible est "friend_id"
                <p style={{ color: 'red' }}>{error.message}</p>
              )}

            </form>
            
          </div>

          <div className="listFriend">
            <p>Liste d’amis : </p>
            <div className="containerlistFriend">

              {/* @todo, ajouter des images de profil aux utilisateurs plus tard */}
              {!friends? 
              <p>Tu n'as pas encore d'ami(e)s</p> : 
              friends.map((friend, index) => (
                <div className="containerFriendDetails" key={index}>
                  <img
                    src="/image/cat/gingerCat.svg"
                    alt="une image de ton ami(e)"
                  />

                  <p>{friend.username}</p>
{/* 
                  <a href="#">
                    <p>Voir le profil</p>

                    <img src="/image/icons/arrow.svg" alt="voir plus" />
                  </a> */}

                </div>
            </div>
          </div>

          <div className="buttonEnd">
            <a href="#">
              <p>Se déconnecter</p>
            </a>
            <a href="">
              <p>Supprimer son compte</p>
            </a>
            <a href="">
              <p>Mention Légale</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};


export default Account;
