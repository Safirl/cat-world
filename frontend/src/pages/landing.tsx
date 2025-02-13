import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from '@react-three/fiber';
import Planet from './components/Planet';
import * as THREE from 'three';

const Landing = () => {



    return (
        <>
            <img className="stars" src="../../public/image/stars.png" alt="stars" />
            <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 5] }}>
                <AdaptiveCamera />
                <ambientLight intensity={2.4} color="#C8B3FF" />
                <directionalLight position={[1, 2, 3]} intensity={0.5} />
                <Planet ref={planetRef} onClick={handleMoveCat} />
                {
                    cats.map(cat => (
                        <CatModel targetPosition={targetPosition} key={cat._id} />
                    ))
                }
            </Canvas>
            <img className="aurorBoreal" src="'../../public/image/aurorBoreal.png" alt="auror boreal" />

            {message && <p>{message}</p>}
        </>
    );
}