import React from 'react'
import { useGLTF, useAnimations, useTexture } from '@react-three/drei'
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
interface CatProps extends GroupProps {
    targetPosition: THREE.Vector3 | null;
    texture_name: string;
}

const Cat = (props: CatProps) => {
    const group = React.useRef<THREE.Group>(null)
    const { scene, animations } = useGLTF('/3D/cat.glb') as unknown as GLTFResult
    const { actions } = useAnimations(animations, group)
    const [isWalking, setIsWalking] = React.useState(false);

    const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])

    const { nodes, materials } = useGraph(clone)
    const texture = useTexture(`/textures/cats/${props.texture_name}`);
    // materials.Cat_Material.map = texture;

    React.useEffect(() => {
        if (!group.current) return;
        group.current.scale.set(.2, .2, .2)

        const bbox = new THREE.Box3().setFromObject(group.current)
        const size = new THREE.Vector3();
        bbox.getSize(size);

        setTimeout(() => {
            if (!group.current) return;
            const radius = 1.52 + size.x / 2;

            // Générer un point aléatoire sur une sphère
            const theta = Math.random() * Math.PI * 2; // Angle autour de l'axe Y
            const phi = Math.acos(2 * Math.random() - 1); // Angle vertical (pour éviter un biais de densité)

            // Convertir en coordonnées cartésiennes
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            // Mettre à jour la position du chat
            group.current.position.set(x, y, z);

            // Aligner le chat vers le centre de la planète
            const planetCenter = new THREE.Vector3(0, 0, 0);
            const direction = new THREE.Vector3().subVectors(planetCenter, group.current.position).normalize();

            // Orienter le chat pour que ses pieds touchent la planète
            const upVector = new THREE.Vector3(0, -1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(upVector, direction);
            group.current.quaternion.copy(quaternion);
        }, 100);

    }, [])

    React.useEffect(() => {
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
                            geometry={nodes.body.geometry}
                            material={materials.Cat_Material}
                            skeleton={nodes.body.skeleton}
                        />
                        <skinnedMesh
                            name="Head"
                            geometry={nodes.Head.geometry}
                            material={materials.Cat_Material}
                            skeleton={nodes.Head.skeleton}
                        />
                        <group name="NeckLace">
                            <skinnedMesh
                                name="Torus"
                                geometry={nodes.Torus.geometry}
                                material={materials.Material}
                                skeleton={nodes.Torus.skeleton}
                            />
                            <skinnedMesh
                                name="Torus_1"
                                geometry={nodes.Torus_1.geometry}
                                material={materials.cloche}
                                skeleton={nodes.Torus_1.skeleton}
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