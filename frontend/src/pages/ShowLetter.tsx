const CreateLetter = () => {

interface User {
    email: string;
    username: string;
    _id: string;
}

const ShowLetter = () => {
    const location = useLocation();
    const letter: { _id: string, title: string, content: string, stamp: string, src_img: string, sender_id: User, createdAt: string } = location.state?.letter;
    const [showLetter, setShowLetter] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [showContent, setShowContent] = useState(false)


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
                                    src={`/image/stamps/${letter.stamp}`}
                                    alt="chosen stamp"
                                />
                                <div className="letterInformation">
                                    <p className="username">De : {letter.sender_id.username}</p>
                                    <p className="date">Le : {letter.createdAt}</p>
                                </div>
                            </div>
                            <div className="letterBody">
                                <div>
                                    <p>{letter.title}</p>
                                </div>
                                <div className="contenuLetterContainer">
                                    <p>{letter.content}</p>
                                </div>
                            </div>
                            <p className="usernameContenue">{letter.sender_id.username}</p>
                        </div>
                    </div>

                    : //Or

                    <div className={`letter ${isExiting ? "slideOutToTop" : ""}`} onClick={handleShowLetter}>
                        {!showLetter && <h4>Appuies pour ouvrir</h4>}
                        <img src={showLetter ? "/image/letters/opened-letter.svg" : "/image/letters/closed-letter.svg"} alt="" />
                    </div>
                }
            </div>
        </>
    )
}

export default CreateLetter;