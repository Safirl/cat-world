import NavBar from "./components/Navbar";
import '../../public/style/pages/createLetter.scss'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import stamps from '../data/stamps';
import { apiRoutes } from "../config/route";

const initialFormData = {
    receiver_id: "",
    title: "",
    content: "",
    stamp: "",
    src_img: null as File | null
};



const CreateLetter = () => {

    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [stampError, setStampError] = useState<string>("");
    const [image, setImage] = useState<File>();
    const [showValidation, setShowValidation] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [showStamps, setShowStamps] = useState(false);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState<{ _id: string, username: string }>();
    const [friends, setFriends] = useState<{ _id: string, username: string }[]>([]);
    const navigate = useNavigate();
    const formattedDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());


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
                setUser(data.user);
            } else {
                setMessage(data.message || "Échec de la connexion");
            }
        } catch (error) {
            console.error("Error while submitting request: ", error);
        }
    };

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
            if (response.ok) {
                setFriends(data.friends);
            } else {
                setMessage(data.message || "Échec de la connexion");
            }
        } catch (error) {
            console.error("Error while submitting request: ", error);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchFriends();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hasSubmitted) {
            return;
        }

        // On indique que l'utilisateur a cliqué sur "Submit"
        setHasSubmitted(true);

        // Vérifie si un timbre a été sélectionné
        if (formData.stamp === "" || formData.stamp === "test") {
            setStampError("Veuillez ajouter un timbre avant d'envoyer votre lettre");
            // setHasSubmitted(false);
            return; // Stoppe l'exécution de la fonction ici
        } else {
            setStampError(""); // Efface le message d'erreur si tout va bien
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("receiver_id", formData.receiver_id)
            formDataToSend.append("title", formData.title)
            formDataToSend.append("content", formData.content)
            formDataToSend.append("stamp", formData.stamp)

            if (formData.src_img) {
                formDataToSend.append("src_img", formData.src_img)
            }


            const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.sendLetter, {
                method: "POST",
                body: formDataToSend,
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setFormData(initialFormData);
                // Afficher l'animation
                setShowValidation(true);

                // Attendre 3s puis rediriger
                setTimeout(() => {
                    setShowValidation(false);
                    navigate("/Letters");
                }, 3000);
            } else {
                setMessage(data.message || "Échec de la connexion");
            }
        } catch (error) {
            console.error("Error while submitting request: ", error);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (e.target.type === "file") {
            const fileInput = e.target as HTMLInputElement;
            if (fileInput.files && fileInput.files[0]) {
                setImage(fileInput.files[0])
                setFormData({ ...formData, src_img: fileInput.files[0] });
            }
        }
        else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    useEffect(() => {
        setHasSubmitted(false);
    }, [formData]);


    const StampList = () => {
        return (
            <>
                <div className="stampList">
                    <h1>Choisis un timbre</h1>
                    {stamps.map((stamp, index) => (
                        <img
                            className="stampElement"
                            key={index}
                            src={`/image/stamps/${stamp}.svg`}
                            alt="stamp"
                            onClick={() => { setShowStamps(!showStamps); setFormData({ ...formData, stamp: stamp + ".svg" }); }}
                        />
                    ))}
                </div>
            </>
        );
    };

    return (
        <>
            <div className="createLetterPage">
                <NavBar />
                <div className="createLetterContainer">
                    <h1>Ma lettre</h1>
                    <div className="letter">
                        {message && <p>{message}</p>}
                        <img className="letterBackground" src="/image/letters/letter-background.svg" alt="letter background" />

                        <form className="letterContentForm" onSubmit={handleSubmit}>
                            <div>
                                <div className="letterHeaderCreate">
                                    <button className="buttonStamp" type="button" onClick={() => setShowStamps(!showStamps)}>
                                        {formData.stamp && formData.stamp !== "test" ? (
                                            <img
                                                className="stampImage"
                                                src={`/image/stamps/${formData.stamp}`}
                                                alt="chosen stamp"
                                            />
                                        ) : (
                                            <>
                                                <img src="/image/icons/import.svg" />
                                                <p>Ajouter un timbre</p>
                                            </>
                                        )}
                                    </button>
                                    <div className="letterInformation">
                                        <p className="username">De : {user?.username}</p>
                                        <div className="selectReceiver">
                                            <p className="receiver"> À :  </p>
                                            <select name="receiver_id" id="receiver-select" onChange={handleChange} value={formData.receiver_id} required>
                                                <option value="">Choisis un(e) ami(e)</option>
                                                {friends && friends.map(friend => (
                                                    <option key={friend._id} value={friend._id}>{friend.username}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="date">Le : {formattedDate}</p>
                                    </div>
                                </div>
                                {hasSubmitted && stampError && (
                                    <p className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {stampError}
                                    </p>
                                )}
                            </div>
                            <div className="letterBody">
                                <div>
                                    <label htmlFor="title">Titre</label>
                                    <input id="title" type='text' name="title" placeholder="Ma lettre" onChange={handleChange} value={formData.title} required />
                                </div>
                                <div className="letterContainerContent">
                                    <label htmlFor="content">Contenu</label>
                                    <textarea className="letterContentText" id="content" name="content" placeholder="Cher ami..." onChange={handleChange} value={formData.content} required />
                                </div>
                            </div>
                            <p className="senderText">{user?.username}</p>
                            <div className="sendContainer">
                                <div className="addImageContainer">
                                    <label htmlFor="image">
                                        {
                                            image ?
                                                <img className="imageInput" src={URL.createObjectURL(image)} alt="letter selected image" />
                                                :
                                                <div className="imageInput">
                                                    <img className="importImage" src="/image/icons/import.svg" />
                                                    <p>Ajouter une image</p>
                                                </div>
                                        }
                                    </label>
                                    <input style={{ display: "none" }} placeholder="mon image" title="choisir une image" id="image" type='file' name="image" accept="image/*" onChange={handleChange} />
                                </div>
                                <button className="sendButton" type="submit" disabled={hasSubmitted}><p>Envoyer</p></button>
                            </div>
                        </form>
                    </div>
                </div>
                {showStamps && <StampList />}


            </div>
            <div className={`validationSendAnimation ${showValidation ? 'visible' : ''}`}>
                <p>Lettre envoyée</p>
                <img src="/image/letters/letter.svg" alt="" />
            </div>
        </>
    );
}

export default CreateLetter;