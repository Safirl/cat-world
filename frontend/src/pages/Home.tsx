import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from '@react-three/fiber';
import Planet from './components/Planet';
import * as THREE from 'three';
import CatModel from './components/Cat';
import { apiRoutes } from "../config/route"

const Home = () => {
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null);
  const planetRef = useRef<THREE.Mesh>(null!)
  const [cats, setCats] = useState([])
  const [user, setUser] = useState()

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

      // if (response.ok) {
      //   setMessage(data.message)
      // }
      // else {
      //   setMessage(data.message || "Échec de la connexion");
      // }
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
      <img className="stars" src="../../public/image/stars.png" alt="stars" />
      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 0, 5] }}>
        <AdaptiveCamera />
        <ambientLight intensity={2.4} color="#C8B3FF" />
        <directionalLight position={[1, 2, 3]} intensity={0.5} />
        <Planet ref={planetRef} onClick={handleMoveCat} />
        {
          cats.map(cat => (
            <CatModel targetPosition={targetPosition} key={cat._id} texture_name={cat.color} />
          ))
        }
        {user && <CatModel targetPosition={targetPosition} key={user._id} texture_name={user.color} />}
      </Canvas>
      <img className="aurorBoreal" src="'../../public/image/aurorBoreal.png" alt="auror boreal" />

      {message && <p>{message}</p>}
    </>
  );
};

export default Home;
