import { useRef, useState, useMemo, useEffect } from 'react'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import { GroupProps, useGraph } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'
import { GLTF } from 'three/examples/jsm/Addons.js'

// Définir le type pour le GLTF
type GLTFResult = GLTF & {
    nodes: {
        body: THREE.SkinnedMesh
        Head: THREE.SkinnedMesh
        Torus: THREE.SkinnedMesh
        Torus_1: THREE.SkinnedMesh
        Bone: THREE.Bone
    }
    materials: {
        Cat_Material: THREE.Material
        Material: THREE.Material
        cloche: THREE.Material
    }
}

// Props du composant
export interface CatProps extends GroupProps {
    targetPosition?: THREE.Vector3;
    color: string;
    defaultAngle?: { theta: number, phi: number }
    _id?: number
    defaultYRotation?: number
    defaultPosition?: THREE.Vector3
}

const Cat = (props: CatProps) => {
    const group = useRef<THREE.Group>(null)
    const { scene, animations } = useGLTF('/3D/cat.glb') as unknown as GLTFResult
    const { actions } = useAnimations(animations, group)
    const [isWalking, setIsWalking] = useState(false);
    // const [currentAngle, setCurrentAngle] = useState({ theta: 0, phi: 0 })
    const [bbox, setBbox] = useState<THREE.Box3>()
    const [size, setSize] = useState<THREE.Vector3>()
    const [radius, setRadius] = useState<number>(0)

    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])

    const { nodes, materials } = useGraph(clone)
    const texture = useTexture(`/textures/cats/${props.color}`);
    texture.colorSpace = "srgb"
    texture.flipY = false
    //Clone material instance.
    materials.Cat_Material = materials.Cat_Material.clone();
    (materials.Cat_Material as THREE.MeshBasicMaterial).map = texture;
    materials.Cat_Material.needsUpdate = true;

    useEffect(() => {
        if (!group.current) return;
        group.current.scale.set(.2, .2, .2)
        setBbox(new THREE.Box3().setFromObject(group.current));
        setSize(new THREE.Vector3());
    }, []);

    useEffect(() => {
        if (!bbox || !size) return;
        bbox.getSize(size);
        setRadius(1.52 + size.x / 2)
        const defaultTheta = props.defaultAngle ? props.defaultAngle.theta : Math.random() * 360
        const defaultPhi = props.defaultAngle ? props.defaultAngle.phi : Math.random() * 360

        setTimeout(() => {
            setPositionAndRotation(Math.PI / 180 * defaultTheta, Math.PI / 180 * defaultPhi, props.defaultYRotation, props.defaultPosition);
        }, 100);
    }, [bbox, size, radius])

    // useFrame((state, delta) => {
    //     // const newTheta = currentAngle.theta + Math.PI / 180 * 1.1;
    //     const newPhi = currentAngle.phi + Math.PI / 180 * 10 * delta;
    //     console.log(currentAngle)
    //     setPositionAndRotation(currentAngle.theta, newPhi);
    // })

    const setPositionAndRotation = (newTheta: number, newPhi: number, newRotation?: number, defaultPosition?: THREE.Vector3) => {
        if (!group.current) return;
        //  theta: Angle autour de l'axe Y (angle theta de x vers z) 
        // ---->x
        // |
        // v z

        //  phi: Angle autour de l'axe Z (angle phi de x vers y) 
        // ^ y
        // |
        // ---->x

        if (defaultPosition) {
            group.current?.position.set(defaultPosition.x, defaultPosition.y, defaultPosition.z)
        }
        else {
            const theta = newTheta //Math.PI / 180 * thetaStep * 360
            const phi = newPhi//Math.PI / 180 * phiStep * 360;
            // setCurrentAngle({ theta, phi })
            const x = radius * Math.cos(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi);
            const z = radius * Math.cos(phi) * Math.sin(theta);

            // Mettre à jour la position du chat
            group.current.position.set(x, y, z);
        }

        if (newRotation) {
            group.current?.rotation.set(0, newRotation, 0)
        }
        else {
            // Aligner le chat vers le centre de la planète
            const planetCenter = new THREE.Vector3(0, 0, 0);
            const direction = new THREE.Vector3().subVectors(planetCenter, group.current.position).normalize();

            // Orienter le chat pour que ses pieds touchent la planète
            const upVector = new THREE.Vector3(0, -1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(upVector, direction);
            group.current.quaternion.copy(quaternion);
        }
    }

    useEffect(() => {
        if (!group.current) {
            console.error("there is no mesh for this cat")
            return;
        }

        if (isWalking) {
            actions['Walk']?.play();
            actions['Idle']?.stop();
        }
        else {
            actions['Idle']?.play();
            actions['Walk']?.stop();
        }
    }, [actions, isWalking])


    return (
        <>
            <group ref={group} {...props} dispose={null}>
                <group name="Scene">
                    <group name="Armature" position={[0.52, 0.332, -0.279]}>
                        <skinnedMesh
                            name="body"
                            geometry={(nodes.body as THREE.Mesh).geometry}
                            material={materials.Cat_Material}
                            skeleton={(nodes.body as THREE.SkinnedMesh).skeleton}
                        />
                        <skinnedMesh
                            name="Head"
                            geometry={(nodes.Head as THREE.Mesh).geometry}
                            material={materials.Cat_Material}
                            skeleton={(nodes.Head as THREE.SkinnedMesh).skeleton}
                        />
                        <group name="NeckLace">
                            <skinnedMesh
                                name="Torus"
                                geometry={(nodes.Torus as THREE.Mesh).geometry}
                                material={materials.Material}
                                skeleton={(nodes.Torus as THREE.SkinnedMesh).skeleton}
                            />
                            <skinnedMesh
                                name="Torus_1"
                                geometry={(nodes.Torus_1 as THREE.Mesh).geometry}
                                material={materials.cloche}
                                skeleton={(nodes.Torus_1 as THREE.SkinnedMesh).skeleton}
                            />
                        </group>
                        <primitive object={nodes.Bone} />
                    </group>
                </group>
            </group>
        </>
    )
}

useGLTF.preload('/public/3D/cat.glb')

export default Cat;