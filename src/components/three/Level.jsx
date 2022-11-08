import * as THREE from 'three'
import { useFrame } from '@react-three/fiber';
import React, { useRef, useMemo } from 'react';
import { useTexture } from '@react-three/drei'

export const levels = [
    "img/bkg/download (28).jpg",
    "img/bkg/download (29).jpg",
    "img/bkg/download (30).jpg",
    "img/bkg/download (31).jpg",
    "img/bkg/download (32).jpg",
    "img/bkg/download (33).jpg",
    "img/bkg/download (34).jpg",
    "img/bkg/download (35).jpg",
    "img/bkg/download (36).jpg",
    "img/bkg/download (37).jpg",
    "img/bkg/download (38).jpg",
    "img/bkg/download (39).jpg",
    "img/bkg/download (40).jpg",
    "img/bkg/download (41).jpg",
    "img/bkg/download (42).jpg",
    "img/bkg/download (43).jpg",
    "img/bkg/download (44).jpg",
    "img/bkg/download (45).jpg",
    "img/bkg/download (46).jpg",
    "img/bkg/download (47).jpg",
    "img/bkg/download (48).jpg",
    "img/bkg/download (49).jpg",
    "img/bkg/download (50).jpg",
    "img/bkg/download (51).jpg",
    "img/bkg/download (52).jpg",
    "img/bkg/download (53).jpg",
    "img/bkg/download (54).jpg",
    "img/bkg/download (55).jpg",
    "img/bkg/download (56).jpg",
    "img/bkg/download (57).jpg",
    "img/bkg/download (58).jpg",
    "img/bkg/download (59).jpg",
    "img/bkg/download (60).jpg",
    "img/bkg/download (61).jpg",
    "img/bkg/download (62).jpg",
    "img/bkg/download (63).jpg",
    "img/bkg/download (64).jpg",
    "img/bkg/download (65).jpg",
    "img/bkg/download (66).jpg",
    "img/bkg/download (67).jpg",
    "img/bkg/download (68).jpg",
    "img/bkg/download (69).jpg",
    "img/bkg/download (70).jpg",
    "img/bkg/download (71).jpg",
    "img/bkg/download (72).jpg",
    "img/bkg/download (73).jpg",
    "img/bkg/download (74).jpg",
    "img/bkg/download (75).jpg",
    "img/bkg/download (76).jpg",
    "img/bkg/download (77).jpg",
    "img/bkg/download (78).jpg",
    "img/bkg/download (79).jpg",
    "img/bkg/download (80).jpg",
    "img/bkg/download (81).jpg",
    "img/bkg/download (82).jpg",
    "img/bkg/download (83).jpg",
    "img/bkg/download (84).jpg",
    "img/bkg/download (85).jpg",
    "img/bkg/download (86).jpg",
    "img/bkg/download (87).jpg",
    "img/bkg/download (88).jpg",
    "img/bkg/download (89).jpg",
    "img/bkg/download (90).jpg",
    "img/bkg/download (91).jpg",
    "img/bkg/download (92).jpg",
    "img/bkg/download (93).jpg",
    "img/bkg/download (1).jpg",
    "img/bkg/download (2).jpg",
    "img/bkg/download (3).jpg",
    "img/bkg/download (9).jpg",
    "img/bkg/download (10).jpg",
    "img/bkg/download (11).jpg",
    "img/bkg/download (12).jpg",
    "img/bkg/download (13).jpg",
    "img/bkg/download (14).jpg",
    "img/bkg/download (15).jpg",
    "img/bkg/download (16).jpg",
    "img/bkg/download (17).jpg",
    "img/bkg/download (18).jpg",
    "img/bkg/download (19).jpg",
    "img/bkg/download (21).jpg",
    "img/bkg/download (22).jpg",
    "img/bkg/download (23).jpg",
    "img/bkg/download (24).jpg"
]

export default function Tube({ level = 1, speed = .1 }) {
    const image = useMemo(() => levels[level - 1], [level])
    return (
        <group>
            <Log image={image} speed={speed} position={[0, 0, -2000]} rotation={[-190, 31, 0]} />
            <ImageFrame image={image} position={[0, 0, -990]} />
        </group>
    )
}

function Log({ image, speed = .005, ...props }) {
    const tube = useRef()

    const texture = useTexture(image, () => {
        tube.current.position.z = -2000
    })

    useFrame(({ mouse, viewport }, elapsedTime) => {

        if (tube.current.position.z < 0) {
            tube.current.position.z = THREE.MathUtils.lerp(tube.current.position.z, 1, speed)
        } else {
            tube.current.position.z = THREE.MathUtils.lerp(tube.current.position.z, -1, -speed)
        }
    })

    return (
        <group>
            <ambientLight intensity={0.75} />
            <fog attach="fog" args={['#272730', 16, 30]} />
            <mesh ref={tube} {...props}>
                <cylinderGeometry args={[200, 200, 5000, 200, 10, true, 20, 4.75]} />
                {/* <meshStandardMaterial color="SaddleBrown" side={THREE.BackSide} roughness={2} opacity={.1} /> */}
                <meshStandardMaterial side={THREE.BackSide} roughness={10} map={texture} />
            </mesh>
        </group>
    )
}

function ImageFrame({ image, speed = .005, ticks = 1, ...props }) {
    const texture = useTexture(image)
    const frame = useRef()
    useFrame(({ mouse, viewport }, elapsedTime) => {
        ticks--
        //if (ticks === 0) {
        //    ticks = 1
        //}
        frame.current.scale.x = THREE.MathUtils.lerp(frame.current.scale.x, 1, speed)
        frame.current.scale.y = THREE.MathUtils.lerp(frame.current.scale.y, 1, speed)
    })
    return (

        <group ref={frame} {...props}>
            <mesh>
                <planeGeometry args={[1100, 1100, 5, 5]} />
                <meshStandardMaterial color="DarkSlateGray" />
            </mesh>
            <mesh>
                <planeGeometry args={[1024, 1024, 1, 1]} />
                <meshStandardMaterial map={texture} color="goldenrod" />
            </mesh>
        </group>

    )
}