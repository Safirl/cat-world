import {useLocation, useNavigate} from "react-router-dom"
import { useEffect } from "react";
import { Canvas, useThree } from '@react-three/fiber';
import Planet from './components/Planet';
import * as THREE from 'three';

const Home = () => {
  function AdaptiveCamera() {
    const { camera, size } = useThree();
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
  
    useEffect(() => {
      perspectiveCamera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }, [size, perspectiveCamera]);
  
    return null; // Ce composant ne rend rien, il ajuste juste la caméra
  }

  const location = useLocation();
  const navigate = useNavigate();
  
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
        <Planet />
      </Canvas>
     <img className="aurorBoreal" src="'../../public/image/aurorBoreal.png" alt="auror boreal" />
    
      {message && <p>{message}</p>}
      </>
  );
};

export default Home;
