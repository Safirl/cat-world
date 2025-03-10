import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar";
import CatCloseView from "./components/CatCloseView";
import { routes, apiRoutes } from "../config/route";
import "../../public/style/pages/friendProfile.scss"


const ShowFriendProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showDeleteFriend, setShowDeleteFriend] = useState(false);
    const [friend, setFriend] = useState<{
            username: string;
            _id: string;
            color: string;
        }>({username: "", _id: location.state, color: ""});

    const fetchFriend = async () => {
        if (friend._id == "") {
            console.error("Please provide a friend id.")
            return
        }
        try {
            const response = await fetch(
                import.meta.env.VITE_API_URL + apiRoutes.getUser + friend._id,
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
            setFriend(data.user);
        } catch (error) {
            console.error("Error while submiting request: ", error);
        }
    }

    const handleOnCloseFriendProfile = () => {
        navigate(routes.account);
    }

    const handleSendLetterToFriend = () => {
        navigate(routes.createLetter, {state: friend._id});
    }

    useEffect(() => {
        fetchFriend();
    }, [])

    return (
        <>
            <NavBar />
            <div className="containerShowFriendProfile">
                <div className="editButton">
                    <button onClick={handleOnCloseFriendProfile}>
                        <img src="/image/icons/cross.svg" alt="close friend profile button icon" />
                    </button>
                </div>
                {friend.color && <CatCloseView color={friend.color} />}
                <div className="containerAccountInformation friendProfileContainer">
                    <h4>{friend.username}</h4>
                    <button className="sendLetterToFriend" onClick={handleSendLetterToFriend}>Envoyer une lettre</button>
                    <a className="deleteFriend" onClick={() => setShowDeleteFriend(true)}>Supprimer l'amitié</a>
                </div>
            </div>
        </>
    );
}

export default ShowFriendProfile;