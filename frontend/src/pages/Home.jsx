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
    <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 5] }}>
      <AdaptiveCamera />
      <ambientLight intensity={1} color="#C8B3FF" />
      <directionalLight position={[1, 2, 3]} intensity={2} />
      <Planet />
    </Canvas>
  );
}
