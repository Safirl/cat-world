import NavBar from "./components/Navbar";
import '../../public/style/pages/createLetter.scss'
import { useEffect, useState } from "react";
import stamps from '../data/stamps'
import { apiRoutes } from "../config/route";

const CreateLetter = () => {
    const [formData, setFormData] = useState({ receiver_id: "67b60e2bda7a14ca3027b2d2", title: "testTitle", content: "testContent", stamp: "test", src_img: "test" });
    const [showStamps, setShowStamps] = useState(false)
    const [message, setMessage] = useState("");
    const [user, setUser] = useState<{ _id: string, username: string }>()
    const [friends, setFriends] = useState<{ _id: string, username: string }[]>()

    const fetchUser = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.getUser, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user)
            }
            else {
                setMessage(data.message || "Échec de la connexion");
            }
        } catch (error) {
            console.error("Error while submiting request: ", error)
        }
    }

    const fetchFriends = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.getFriends, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            const data = await response.json();
            setFriends(data.friends)

            if (response.ok) {
                // updateMessage(data.message)
            }
            else {
                setMessage(data.message || "Échec de la connexion");
            }
        } catch (error) {
            console.error("Error while submiting request: ", error)
        }
    }

    useEffect(() => {
        fetchUser();
        fetchFriends();
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.sendLetter, {
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
                //@todo, changer par une redirection de la lettre et vider les champs avant pour éviter le double clic
                console.log("letter send", data.letter)
            }
            else {
                setMessage(data.message || "Échec de la connexion");
            }
        } catch (error) {
            console.error("Error while submiting request: ", error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const StampList = () => {
        return (
            <>
                <div className="stampList">
                    <h1>Choisis un timbre</h1>
                    {
                        stamps.map((stamp, index) => (
                            <img
                                className="stampElement"
                                key={index} src={`/image/stamps/${stamp}.svg`}
                                alt="stamp"
                                onClick={() => { setShowStamps(!showStamps); setFormData({ ...formData, stamp: stamp + ".svg" }); }} />
                        ))
                    }
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="containerCreateLetter">
                <h1>Ma lettre</h1>
                <div className="letter">
                    {message && <p>{message}</p>}
                    <img className="letterBackground" src="/image/letters/letter-background.svg" alt="letter background" />

                    <form className="letterContent" onSubmit={handleSubmit} method="post">
                        <div className="letterHeader">
                            <button type="button" onClick={() => setShowStamps(!showStamps)}>
                                {
                                    formData.stamp ?
                                        <img className="stampImage" src={`/image/stamps/${formData.stamp}`} alt="chosen stamp" />
                                        :
                                        <div className="addStamp"></div>
                                }
                            </button>
                            {/* <input className="stamp" id="stamp" type='image' name="image" onChange={handleChange} /> */}
                            <div className="letterInformation">
                                <p className="username">{user?.username}</p>
                                <p className="receiver">receiver</p>
                                <p className="date">today</p>
                            </div>
                        </div>
                        <div className="letterBody">
                            <div>
                                <label htmlFor="send-letter">Titre</label>
                                <input id="title" type='text' name="title" placeholder="Ma lettre" onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="send-letter">Contenu</label>
                                <input id="content" type="text" name="content" placeholder="Cher ami..." onChange={handleChange} />
                            </div>
                        </div>
                        <button type="submit"><p>Envoyer</p></button>
                    </form>
                </div>
            </div>
            {showStamps && <StampList />}
        </>
    );
}

export default CreateLetter;