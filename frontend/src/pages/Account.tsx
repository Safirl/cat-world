import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import NavBar from "./components/Navbar";
function CatModel() {
  const { scene } = useGLTF("/3D/cat.glb"); // Charge le modèle

  return <primitive object={scene} scale={1} />;
}

// Précharge le modèle pour optimiser les performances
useGLTF.preload("/3D/cat.glb");
const Account = () => {

    return(
        <>
        <NavBar />
        <div className="containerAccount">

            <Canvas className="canvasAccount"  camera={{ position: [0, 2, 5]  }}>
                <ambientLight intensity={2.4} color="#C8B3FF" />
                <directionalLight position={[1, 2, 3]} intensity={0.5} />
                <CatModel />
            </Canvas>
            <div className="containerAccountInformation">
                <h4>
                    Username
                </h4>
                <div className="friendcode">
                    <p>code ami :</p> 
                    <p>9284NDSZU2</p> 
                    <img src="/image/icons/copy.svg" alt="Copier votre code friend" />
                </div>
                <div className="AddfriendContainer">
                    <p>Ajout d’un(e) ami(e)</p>
                    <input type="text" />
                    <input type="submit" value="Ajoute ton ami(e)" />
                </div>
                <div className="listFriend">
                    <p>Liste d’amis : </p>
                    <div className="containerlistFriend">
                        {/* @todo for each */}
                        <div className="containerFriendFiche">
                            <img src="/image/cat/gingerCat.svg" alt="une image de ton ami(e)" />
                            <p>Billy le chat filou super cool haha</p>
                            <a href="#">
                                <p>Voir le profil</p>
                                <img src="/image/icons/arrow.svg" alt="voir plus" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="buttonEnd">
                    <a href=""><p>Se déconnecter</p></a>
                    <a href=""><p>Supprimer son compte</p></a>
                    <a href=""><p>Mention Légale</p></a>
                </div>
            </div>
        </div>
        </>
        
    )

}

export default Account;