import Cat from "./Cat"
import { Canvas } from "@react-three/fiber"
import * as THREE from 'three'

// Props du composant
export interface CatCloseViewProps {
    color: string;
}

const CatCloseView = (props: CatCloseViewProps) => {
    if (props.color == "") return(<></>);
    return (
        <Canvas className="canvasAccount" camera={{ position: [0, 2, 5] }}>
            <ambientLight intensity={2.4} color="#C8B3FF" />
            <directionalLight position={[1, 2, 3]} intensity={0.5} />
            {props.color && (
                <Cat
                    color={props.color}
                    defaultYRotation={Math.PI}
                    defaultPosition={new THREE.Vector3(0, 1.6, 4)}
                />
            )}
        </Canvas>
    )
}

export default CatCloseView;