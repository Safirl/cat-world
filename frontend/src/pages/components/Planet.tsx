import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';


export default function Planet() {
  const {camera, gl} = useThree();
  const texture = new THREE.TextureLoader().load('/public/map/planet.jpg'); 

    return (
      <>
      <OrbitControls 
      args= { [camera, gl.domElement ] } 
      enableZoom={false}
      /> 
        <mesh>
            <sphereGeometry />
            <meshStandardMaterial map={texture}/>
        </mesh>
      </>
    );
}
