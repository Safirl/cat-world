import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import Planet from './components/Planet';

// Hook pour adapter la caméra quand la fenêtre change de taille
function AdaptiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  }, [size, camera]);

  return null; // Ce composant ne rend rien, il ajuste juste la caméra
}

export default function Home() {
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
    </>
  );
}
