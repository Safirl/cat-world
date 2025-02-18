import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from '@react-three/fiber';
import Planet from './components/Planet';
import * as THREE from 'three';
import Cat from './components/Cat';
import { apiRoutes } from "../config/route"
import { OrbitControls } from '@react-three/drei';

const Home = () => {
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null);
  const planetRef = useRef<THREE.Mesh>(null!)
  const [cats, setCats] = useState([])
  const [user, setUser] = useState()
  const [message, setMessage] = useState("");
  const cameraControlRef = useRef<typeof OrbitControls | null>(null);

  const updateMessage = (message: string) => {
    setMessage(message)
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  const handleMoveCat = (position: THREE.Vector3) => {
    setTargetPosition(position);
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.getFriends, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      const data = await response.json();
      setCats(data.friends)

      if (response.ok) {
        updateMessage(data.message)
      }
      else {
        updateMessage(data.message || "Échec de la connexion");
      }
    } catch (error) {
      console.error("Error while submiting request: ", error)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + apiRoutes.getUser, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      const data = await response.json();
      setUser(data.user)
    } catch (error) {
      console.error("Error while submiting request: ", error)
    }
  }

  useEffect(() => {
    fetchFriends();
    fetchUser();
  }, [])

  return (
    <>
      <img className="stars" src="../../public/image/stars.png" alt="stars" />
      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 5] }}>
        <OrbitControls ref={cameraControlRef} />
        <ambientLight intensity={2.4} color="#C8B3FF" />
        <directionalLight position={[1, 2, 3]} intensity={0.5} />
        <Planet ref={planetRef} onClick={handleMoveCat} />
        {
          cats.map(cat => (
            <Cat targetPosition={targetPosition} key={cat._id} texture_name={cat.color} />
          ))
        }
        {user && <Cat targetPosition={targetPosition} key={user._id} texture_name={user.color} />}
      </Canvas>
      <img className="aurorBoreal" src="'../../public/image/aurorBoreal.png" alt="auror boreal" />

      {message && <p>{message}</p>}
    </>
  );
};

export default Home;
