import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
extend({ OrbitControls: OrbitControls });

export default function Planet() {
  const {camera, gl} = useThree();
  const texture = new THREE.TextureLoader().load('/public/map/planet.jpg'); 

    return (
      <>
      <orbitControls args= { [camera, gl.domElement ] } /> 
        <mesh
            position={[0, 0, 0]}
            scale={1.5} 
        >
            <sphereGeometry />
            <meshStandardMaterial map={texture}/>
        </mesh>
        
      </>
    );
}
