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

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await isUserAuth();
            console.log(isAuth);
        };
        checkAuth();
    }, []);
    return (
        <>
            <img className="stars" src="/image/stars.png" alt="stars" />
            <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={2.4} color="#C8B3FF" />
                <directionalLight position={[1, 2, 3]} intensity={0.5} />
                <Planet ref={planetRef} onClick={handleMoveCat} />
                {
                    cats.map(cat => (
                        <Cat targetPosition={new THREE.Vector3()} key={cat._id} texture_name={cat.color} />
                    ))
                }
            </Canvas>
            <img className="aurorBoreal" src="'../../public/image/aurorBoreal.png" alt="auror boreal" />

            {/* {message && <p>{message}</p>} */}
        </>
    );
}

export default Landing;