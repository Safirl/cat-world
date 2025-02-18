import { Canvas, useThree } from '@react-three/fiber';
import Planet from './components/Planet';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Cat from './components/Cat';
import { isUserAuth } from '../services/useAuthCheck';
import '../../public/style/pages/landing.scss'
import { routes } from '../config/route';
import ButtonRound from './components/buttonRound';

const Landing = () => {
    // const [message, setMessage] = useState("");
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

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await isUserAuth();
            console.log(isAuth);
        };
        checkAuth();
    }, []);
    return (
        <>
            <div className='landingContainer'>
                <h1>CAT WORLD</h1>
                <div className='buttonsContainer'>
                    <ButtonRound
                        text='Se connecter'
                        hasBackground={true}
                    />
                    <ButtonRound
                        text='Créer son compte '
                        hasBackground={true}
                    />
                    {/* {message && <p>{message}</p>} */}
                </div>
            </div >
            <img className="aurorBoreal" src="'../../public/image/aurores-back.png" alt="aurore boreal" />
            <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ fov: 50 }}>
                <Scene />
                <ambientLight intensity={2.4} color="#C8B3FF" />
                <directionalLight position={[1, 2, 3]} intensity={0.5} />
                <Planet ref={planetRef} onClick={handleMoveCat} />
                <Cat targetPosition={new THREE.Vector3()} texture_name={"cat_texture_black.png"} />

            </Canvas>
            <img className="aurorBoreal" src="'../../public/image/aurorBoreal.png" alt="aurore boreal" />
            <img className="stars" src="/image/stars.png" alt="stars" />
        </>
    );
}

export default Landing;