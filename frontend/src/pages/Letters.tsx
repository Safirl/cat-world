import ButtonRound from "./components/buttonRound";

const Letters = () => {

    return(
        <>
        <ButtonRound 
        text="Test button"     
        srcImage="/image/icon/send.svg"
        customClassName="btnWhiteLetter"
        onClick={() => console.log('coucou')}
  
        />
        <div className="containerLetter">
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
                <img className="elementLetter" src="/image/decors/postItNoletter.svg" alt="texture png" />
                <img className="elementLetter" src="/image/letters/letterPerspective.svg" alt="texture png" />
            </div>
        </div>
        </>
    )
        
    

}

export default Letters;