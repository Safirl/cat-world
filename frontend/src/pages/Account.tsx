import { Canvas } from "@react-three/fiber";
import NavBar from "./components/Navbar";
import Cat from "./components/Cat";
import { useState, useEffect } from "react";
import { apiRoutes, routes } from "../config/route";
import * as THREE from "three";
import colors from "../data/colors";
import { useNavigate } from "react-router-dom";


const initialFormData = {
    friend_id: ''
};

const Account = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState(initialFormData);
    const [user, setUser] = useState<{
        username: string;
        _id: string;
        color: string;
    }>();
    const [friends, setFriends] = useState<{ username: string }[]>([]);
    const [error, setError] = useState<{ message: string; target: string } | null>(null);
    const [isEditMenuOpened, setIsEditMenuOpened] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
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
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, friend_id: e.target.value });
        setError(null);
    };

    const handleChangeCatColor = async (newColor: string) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.changeCatColor, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newColor }),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                fetchUser()
            } else {
                setError({ message: data.message, target: data.target || "global" });
            }
        } catch (error) {
            setError({ message: "Une erreur s'est produite lors de l'ajout de l'ami", target: "global" });
            console.error(error);
        }
    }

    const handleLogOut = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.logout, {
                method: "POST",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                navigate(routes.landing)
            } else {
                setError({ message: data.message, target: data.target || "global" });
            }
        } catch (error) {
            setError({ message: "Une erreur s'est produite lors de l'ajout de l'ami", target: "global" });
            console.error(error);
        }
    }

    useEffect(() => {
        fetchFriends();
        fetchUser();
    }, []);

    return (
        <>
            <NavBar />
            <div className={`containerAccount ${isEditMenuOpened && "containerAccountEditMenu"}`}>
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

                <div className="editButton">
                    <button onClick={() => setIsEditMenuOpened(!isEditMenuOpened)}>
                        <img src={`/image/icons/${!isEditMenuOpened ? "EditButtonAccount.svg" : "cross.svg"}`} alt="edit menu icon" />
                    </button>
                </div>

                {
                    !isEditMenuOpened ?  //Normal mode
                        <div className="containerAccountInformation">
                            <h4>{user && user.username}</h4>

                            <div className="friendcode">
                                <p>code ami :&nbsp;</p>
                                <p>{user && user._id}</p>
                                <img src="/image/icons/copy.svg" alt="Copier votre code friend" />
                            </div>

                            <div className="AddfriendContainer">
                                <form onSubmit={handleSubmit} method="post">
                                    <label htmlFor="friend_id">Ajout d’un(e) ami(e)</label>
                                    <input id="friend_id" type="text" placeholder="Le code de ton ami(e)" onChange={handleChange} required minLength={24} maxLength={24} />
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
                                    {!friends ?
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
                                        ))}
                                </div>
                            </div>

                            <div className="buttonEnd">
                                <a onClick={handleLogOut}>
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

                        : //OR

                        <div className="containerAccountInformation selectColors">
                            <h4>Ton avatar</h4>
                            <p className="colorsP">Couleurs</p>
                            {colors.map((color, index) => (
                                <svg
                                    onClick={() => handleChangeCatColor(color.texture)}
                                    className="colorIcon"
                                    key={index}
                                    width="37"
                                    height="37"
                                    viewBox="0 0 37 37"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M36 18.5C36 28.165 28.165 36 18.5 36C8.83502 36 1 28.165 1 18.5C1 8.83502 8.83502 1 18.5 1C28.165 1 36 8.83502 36 18.5Z"
                                        fill={color.primary} // Remplace la première couleur
                                    />
                                    <path
                                        d="M12.8101 35.0541L32.2807 7.7124C34.6108 10.6849 36 14.4303 36 18.5C36 28.165 28.165 36 18.5 36C16.5081 36 14.5939 35.6671 12.8101 35.0541Z"
                                        fill={color.secondary} // Remplace la deuxième couleur
                                    />
                                    <path
                                        d="M36 18.5C36 28.165 28.165 36 18.5 36M36 18.5C36 8.83502 28.165 1 18.5 1C8.83502 1 1 8.83502 1 18.5C1 28.165 8.83502 36 18.5 36M36 18.5C36 14.4303 34.6108 10.6849 32.2807 7.7124L12.8101 35.0541C14.5939 35.6671 16.5081 36 18.5 36"
                                        stroke="#4B4438"
                                    />
                                </svg>
                            ))}
                        </div>

                }
            </div>
        </>
    );
};


export default Account;
