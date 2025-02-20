import { useEffect, useState } from "react";
import { routes } from "../config/route";
import ButtonRound from "./components/buttonRound";
import NavBar from "./components/Navbar";
import { useNavigate } from "react-router-dom";
import { apiRoutes } from "../config/route";

const Letters = () => {
    const navigate = useNavigate();
    const [unreadLetters, setUnreadLetters] = useState<{ _id: string, title: string, content: string, stamp: string, src_img: string, sender_id: string, createdAt: string }[]>()
    const [readLetters, setReadLetters] = useState<{ _id: string, title: string, content: string, stamp: string, src_img: string, sender_id: string, createdAt: string }[]>()

    const handleCreateLetter = () => {
        navigate(routes.createLetter);
    }

    const handleShowLetter = () => {
        if (!unreadLetters) {
            return;
        }
        navigate(routes.showLetter, { state: { letter: unreadLetters[0] } })
    }

    const fetchUnreadLetters = async () => {
        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL + apiRoutes.fetchLetterUnread,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                console.error(data.message);
            }
            setUnreadLetters(data.letters);

        } catch (error) {
            console.error("Error while submiting request: ", error);
        }
    }
    const fetchreadLetters = async () => {
        try {
            
            const response = await fetch(
                import.meta.env.VITE_API_URL + apiRoutes.fetchLetterRead,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );
            console.log('response', response)

            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                console.error(data.message);
            }
            setUnreadLetters(data.letters);

        } catch (error) {
            console.error("Error while submiting request: ", error);
        }
    }

    useEffect(() => {
        fetchUnreadLetters()
        fetchreadLetters()
    }, [])

    return (
        <>

            <div className="containerLetter">
                <ButtonRound
                    text="Envoyer une lettre"
                    srcImage="/image/icons/send.svg"
                    hasBackground
                    customClassName="btnWhiteLetter"
                    onClick={handleCreateLetter}
                />

                <NavBar />
                <div className="wall">
                    <img className="postit read" src="/image/decors/postItRead.svg" alt="Lettre lu" />
                    <img className="postit unread" src="/image/decors/postItunread.svg" alt="Lettre pas lu" />

                </div>

                <div className="stackletter">
                    <img className="stack read" src="/image/letters/stackOfletters25.svg" alt="Tas de lettre  lu" />
                    <img className="stack unread" src="/image/letters/stackOfletters25.svg" alt="Tas de lettre non lu" />
                    <img className="shadowRead" src="/image/decors/shadowLeft.svg" alt="ombre lettre lu" />
                    <img className="shadowUnread" src="/image/decors/shadow.svg" alt="ombre lettre non lu" />
                </div>

                <div className="letter">

                {
                    unreadLetters && unreadLetters.length > 0 ?
                        <div onClick={handleShowLetter}>
                            
                            <img className="elementLetter" src="/image/letters/letterPerspective.svg" alt="texture png" />
                        </div>
                        :
                        <div><img className="elementLetter" src="/image/decors/postItNoletter.svg" alt="texture png" /></div>
                }
                
                </div>
            </div>
        </>
    )



}

export default Letters;