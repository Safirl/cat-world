import { Canvas, useThree } from '@react-three/fiber';
import Planet from './components/Planet';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Cat from './components/Cat';
import { isUserAuth } from '../services/useAuthCheck';

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
            <section>
                <h1>Hello</h1>
            </section>
            <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ fov: 50 }}>
                <Scene />
                <ambientLight intensity={2.4} color="#C8B3FF" />
                <directionalLight position={[1, 2, 3]} intensity={0.5} />
                <Planet ref={planetRef} onClick={handleMoveCat} />
                <Cat targetPosition={new THREE.Vector3()} texture_name={"cat_texture_black.png"} />

            </Canvas>
            <img className="stars" src="/image/stars.png" alt="stars" />
            <img className="aurorBoreal" src="'../../public/image/aurorBoreal.png" alt="auror boreal" />

            {/* {message && <p>{message}</p>} */}
        </>
    );
}

export default Landing;