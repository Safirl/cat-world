import { useLocation } from "react-router-dom";
import "../../public/style/pages/ShowLetter.scss"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonRound from "./components/buttonRound";
import { apiRoutes } from "../config/route";


interface User {
    email: string;
    username: string;
    _id: string;
}

interface Letter {
    title: string,
    content: string,
    stamp: string,
    sender: string
    _id: string
}

const ShowLetter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const letter: { _id: string, sender_id: User, createdAt: string, letter_id: Letter, read: boolean } = location.state?.letter;
    const [letterImage, setLetterImage] = useState<string | null>(null);
    const [showLetter, setShowLetter] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [showContent, setShowContent] = useState(false)
    const formattedDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(letter.createdAt));
    const [showImage, setShowImage] = useState(false);
    const [exitShowImage, setExitShowImage] = useState(false);


    const updateRead = async (newRead: boolean) => {
        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL + apiRoutes.updateRead + letter._id,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ read: newRead }),
                    credentials: "include",
                }
            );
            if (response.ok) {
                navigate("/letters");
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const handleBacktoDesk = async () => {
        await updateRead(true)
    }

    const handleShowLetter = async () => {
        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL + apiRoutes.getLetterImage + letter.letter_id._id,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (response.ok) {
                const data = await response.json()
                setLetterImage(data.img_url);
            }
        }
        catch (error) {
            console.error(error)
        }

        setShowLetter(true);
        setTimeout(() => {
            setIsExiting(true)
            setTimeout(() => {
                setShowContent(true)
            }, 1000);
        }, 1000);
    }

    const handleExitShowImage = () => {
        setExitShowImage(true)
        setTimeout(() => {
            setShowImage(false)
            setExitShowImage(false)
        }, 500);
    }

    const FullScreenImage = () => {
        return (
            <div className={`showImageContainer ${exitShowImage ? "exit" : ""}`} onClick={handleExitShowImage}>
                {letterImage && <img src={letterImage} alt="letter image full size" className={`${exitShowImage ? "exit" : ""}`} />}
            </div>
        )
    }

    if (!letter) {
        return <p>Aucune lettre sélectionnée.</p>
    }

    return (
        <>
            <div className="showLetterContainer">

                {showContent ?
                    <div className="content">
                        <img className="letterBackground" src="/image/letters/letter-background.svg" alt="letter background" />

                        <div className="letterContent">
                            <div className="letterHeader">
                                <img
                                    className="stampImage"
                                    src={`/image/stamps/${letter.letter_id.stamp}`}
                                    alt="${letter.stamp}"
                                />
                                <div className="letterInformation">
                                    <p className="username">De : {letter.sender_id.username}</p>
                                    <p className="date">Le : {formattedDate}</p>
                                </div>
                            </div>
                            <div className="letterBody">
                                <div>
                                    <p className="titleContent">{letter.letter_id.title}</p>
                                </div>
                                <div className="letterContainerContent">
                                    <p>{letter.letter_id.content}</p>
                                </div>
                            </div>
                            <div className={`letterFooter ${!letterImage ? "letterFooterWithoutImage" : ""}`}>
                                {
                                    letterImage &&
                                    <img src={letterImage} alt="image sent by your friend" onClick={() => setShowImage(true)} className={showImage ? "showImage" : ""} />
                                }
                                <p className="senderText">{letter.sender_id.username}</p>
                            </div>
                            <ButtonRound
                                text="Retourner à mon bureau"

                                hasBackground
                                customClassName="btnWhiteShowLetter"
                                onClick={handleBacktoDesk}
                            />
                        </div>
                    </div>

                    : //Or

                    <div className={`letter ${isExiting ? "slideOutToTop" : ""}`} onClick={handleShowLetter}>
                        {!showLetter && <h4>Appuies pour ouvrir</h4>}
                        <img src={showLetter ? "/image/letters/opened-letter.svg" : "/image/letters/closed-letter.svg"} alt="" />
                    </div>
                }

            </div>

            {showImage && <FullScreenImage />}
        </>
    )
}

export default ShowLetter;