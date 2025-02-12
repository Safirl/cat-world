import {useLocation, useNavigate} from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from '@react-three/fiber';
import Planet from './components/Planet';
import * as THREE from 'three';
import Cat from "./components/Cat";

const Home = () => {
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null);

  const handleMoveCat = (position: THREE.Vector3) => {
    setTargetPosition(position);
  };

  const location = useLocation();
  const navigate = useNavigate();
  function AdaptiveCamera() {
    const { camera, size } = useThree();
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
  
    useEffect(() => {
      perspectiveCamera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }, [size, perspectiveCamera]);
  
    return null; // Ce composant ne rend rien, il ajuste juste la caméra
  }

  const planetRef = useRef<THREE.Mesh>(null!)
  const planetPosition: THREE.Vector3 = planetRef.current ? planetRef.current.position : new THREE.Vector3(0, 0, 0);
  
  //Delete message after a delay
  useEffect(() => {
    if (location.state?.message) {
        setTimeout(() => {
            navigate(".", { replace: true, state: {} });
        }, 3000);
    }
}, [location, navigate]);

  let message = "";
  if (location.state) {
    message = location.state.message;
  }

  return (
    <>
      <img className="stars" src="'../../public/image/stars.png" alt="stars" />
      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 5] }}>
        <AdaptiveCamera />
        <ambientLight intensity={2.4} color="#C8B3FF" />
        <directionalLight position={[1, 2, 3]} intensity={0.5} />
        <Planet ref={planetRef} onClick={handleMoveCat}/>
        <Cat planetPosition={planetPosition} targetPosition={targetPosition}/>
      </Canvas>
      <img className="aurorBoreal" src="'../../public/image/aurorBoreal.png" alt="auror boreal" />
    
      {message && <p>{message}</p>}
      </>
  );
};

export default Home;
