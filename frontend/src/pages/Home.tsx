import { useEffect, useRef, useState } from "react";
import { Canvas } from '@react-three/fiber';
import Planet from './components/Planet';
import * as THREE from 'three';
import Cat from './components/Cat';
import { apiRoutes } from "../config/route"
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CatProps } from './components/Cat'
import "../style/home.scss"

const Home = () => {
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null);
  const planetRef = useRef<THREE.Mesh>(null!)
  const [cats, setCats] = useState<CatProps[]>([])
  const [user, setUser] = useState<{ _id: string, color: string }>()
  const [message, setMessage] = useState("");
  const cameraControlRef = useRef<OrbitControlsImpl | null>(null);

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
    fetchUser();
    fetchFriends();
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const main = document.getElementById('main');
      if (!main) return;
      if (cameraControlRef.current) {
        const camera = cameraControlRef.current.object;
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.aspect = main.offsetWidth / main.offsetHeight;
          camera.updateProjectionMatrix();
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>
      <img className="stars" src="/image/starsBackground.svg" alt="stars" />
      <Canvas camera={{ position: [0, 0, 5] }}>
        <OrbitControls
          ref={cameraControlRef}
          enableRotate={true}
          enableZoom={true}
          enableDamping={true}
          minDistance={3}
          maxDistance={9}
        />
        <ambientLight intensity={1.5} color="#C8B3FF" />
        <directionalLight position={[1, 2, 3]} intensity={1} />
        <Planet
          ref={planetRef}
          onClick={handleMoveCat}
        />
        {
          cats &&
          cats.map(cat => (
            <Cat {...(targetPosition && { targetPosition })} key={cat._id} color={cat.color} />
          ))
        }
        {user && (
          <Cat
            key={user._id}
            color={user.color}
            {...(targetPosition && { targetPosition })}
          />
        )}

      </Canvas>
      {message && <p>{message}</p>}
    </>
  );
};

export default Home;