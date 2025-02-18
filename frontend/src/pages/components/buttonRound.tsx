import React from "react";

type ButtonProps = {
    text: string;
    srcImage?: string;
    hasBackground?: boolean;
    customClassName?: string;
    onClick?: () => void;
};

const ButtonRound: React.FC<ButtonProps> = ({ text, srcImage, hasBackground, customClassName, onClick }) => {
    return (
        <button 
            onClick={onClick} 
            className={`button ${hasBackground ? 'defaultBackground' : 'backgroundcolorWhite'} ${customClassName || ''}`}
        >
            <p>{text}</p>
            {srcImage && <img src={srcImage} alt="button icon" />}
        </button>
    );
};

export default ButtonRound;
