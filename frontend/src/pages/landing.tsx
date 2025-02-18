import { Canvas, useThree } from '@react-three/fiber';
import Planet from './components/Planet';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Cat from './components/Cat';
import { isUserAuth } from '../services/useAuthCheck';
import '../../public/style/pages/landing.scss'
import { routes } from '../config/route';
import ButtonRound from './components/buttonRound';
import { useNavigate } from 'react-router-dom';
import { useAuthCheck } from '../services/useAuthCheck';

const Landing = () => {
    const navigate = useNavigate();
    // const [message, setMessage] = useState("");
    const checkAuthStatus = useAuthCheck("/home", "Vous êtes déjà connecté !");

    useEffect(() => {
        checkAuthStatus()
    }, []);
    const planetRef = useRef<THREE.Mesh>(null!)
    const cats = [
        {
            _id: 1,
            color: "cat_texture_black.png"
        },
        {
            _id: 2,
            color: "cat_texture_white.png"
        }
    ]

    const handleMoveCat = (position: THREE.Vector3) => {
        // setTargetPosition(position);
    };

    function Scene() {
        const { camera } = useThree();

        useEffect(() => {
            camera.position.set(0, 2, 5); // Position de la caméra
            camera.lookAt(0, 2.5, 0); // Regarde légèrement vers le haut
        }, [camera]);

        return null;
    }


    const onButtonClick = (isLogin: boolean) => {
        const route = isLogin ? routes.login : routes.register
        navigate(route)
    }

    return (
        <>
            <div className='landingContainer'>
                <h1>CAT WORLD</h1>
                <div className='buttonsContainer'>
                    <ButtonRound
                        text='Se connecter'
                        onClick={() => onButtonClick(true)}
                    />
                    <ButtonRound
                        text='Créer son compte'
                        onClick={() => onButtonClick(false)}
                    />
                </div>
            </div >
            <img className="aurorBoreal" src="'../../public/image/aurores-back.png" alt="aurore boreal" />
            <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ fov: 50 }}>
                <Scene />
                <ambientLight intensity={2.4} color="#C8B3FF" />
                <directionalLight position={[1, 2, 3]} intensity={0.5} />
                <Planet ref={planetRef} />
                <Cat targetPosition={new THREE.Vector3()} texture_name={"cat_texture_black.png"} defaultAngle={{ theta: 90, phi: 80 }} />

            </Canvas>
            <img className="aurorBoreal" src="'../../public/image/aurorBoreal.png" alt="aurore boreal" />
            <img className="stars" src="/image/stars.png" alt="stars" />
        </>
    );
}

export default Landing;