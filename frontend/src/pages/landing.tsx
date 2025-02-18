import { Canvas, useThree } from '@react-three/fiber';
import Planet from './components/Planet';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Cat from './components/Cat';
import { isUserAuth } from '../services/useAuthCheck';
import '../../public/style/pages/landing.scss'
import { MouseEventHandler } from 'react';
import { routes } from '../config/route';

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

    const onLogButtonClicked = async (isLogin: boolean, event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const url = isLogin ? routes.login : routes.register
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
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
                navigate(routes.home, { state: { message: "Vous êtes connecté !" } })
            }
            else {
                setMessage(data.message || "Échec de la connexion");
            }
        } catch (error) {
            console.error("Error while submiting request: ", error)
        }
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
                    <button onClick={(event) => onLogButtonClicked(true, event)}><p>Me connecter</p></button>
                    <button ><p>Créer mon compte</p></button>
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