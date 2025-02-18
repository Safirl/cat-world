import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';

interface PlanetProps {
  onClick?: (position: THREE.Vector3) => void;
}

const Planet = forwardRef<THREE.Mesh, PlanetProps>(({ onClick }, ref) => {
  const texture = new THREE.TextureLoader().load('/textures/map/planet.jpg');

  // const raycaster = new THREE.Raycaster();
  // const mouse = new THREE.Vector2();

  const planetRef = useRef<THREE.Mesh>(null!)
  useImperativeHandle(ref, () => planetRef.current);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = ((event.clientY / window.innerHeight) * 2 - 1) * -1;

    // // raycaster.setFromCamera(mouse, camera);
    // const intersections = raycaster.intersectObject(planetRef.current);

    // //Return if nothing is touched
    // if (intersections.length < 0) {
    //   return;
    // }
    // const targetPosition = intersections[0].point;
    // onClick(targetPosition);
  }

  return (
    <>
      <mesh ref={planetRef} onClick={handleClick}>
        <sphereGeometry args={[1.5, 50, 50]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </>
  );
});

export default Planet;