import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Bounds, Sampler, Edges, Sky, Float, Plane, MeshDistortMaterial, MeshWobbleMaterial, Sparkles, Trail, PointerLockControls, KeyboardControls, useKeyboardControls, useTexture } from "@react-three/drei"
import { CapsuleCollider, CuboidCollider, RigidBody, useRapier, Physics } from "@react-three/rapier"
import Perlin from 'perlin.js'
import { levels } from "./Level"

Perlin.seed(Math.random())

const SPEED = 18
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const rotation = new THREE.Vector3()
const lightgreen = new THREE.Color('lightgreen')
const grassMaterial = new THREE.MeshBasicMaterial({ color: lightgreen })
const grassGeometry = new THREE.ConeGeometry(0.05, 1.0, 2, 20, false, 0, Math.PI)

export default function Game() {
    return (
        <KeyboardControls
            map={[
                { name: "forward", keys: ["ArrowUp", "w", "W"] },
                { name: "backward", keys: ["ArrowDown", "s", "S"] },
                { name: "left", keys: ["ArrowLeft", "a", "A"] },
                { name: "right", keys: ["ArrowRight", "d", "D"] },
                { name: "jump", keys: ["Space"] },
                { name: "shoot", keys: ["t"] },
                { name: "fly", keys: ["f"] },
            ]}>
            <Canvas shadows camera={{ fov: 45 }}>
                <Sky sunPosition={[0, 0, 1]} />
                <ambientLight intensity={0.6} />
                <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
                <Physics gravity={[0, -30, 0]} colliders={false}>
                    <Ground image={"img/log.png"} />
                    <Gallery />
                    <Pixi position={[0, 0, 7]} />
                    <Player>
                        <ImageFrame image={"img/bkg/download (90).jpg"} />
                    </Player>
                    <Swarm count={1000} />
                </Physics>
                <PointerLockControls />
            </Canvas>
        </KeyboardControls>
    )
}

export function Ground({ image, props }) {
    const texture = useTexture(image)
    const { scene } = useThree();
    useEffect(() => {
        scene.fog = new THREE.FogExp2(0, 0.001);
    }, [scene]);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    return (
        <RigidBody {...props} type="fixed" colliders={false}>
            {/* <Grass> */}
                <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
                    <planeGeometry args={[1000, 1000]} />
                    <meshStandardMaterial map={texture} map-repeat={[240, 240]} color="green" />
                </mesh>
            {/* </Grass> */}
            <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
        </RigidBody>
    )
}

const cubeStore = ({
    cubes: [],
    addCube: (x, y, z) => cubeStore.cubes = [...cubeStore.cubes, [x, y, z]]
})

export function Cube(props) {
    const ref = useRef()
    const [hover, set] = useState(null)
    const texture = useTexture("img/log.png")
    const onMove = useCallback((e) => {
        e.stopPropagation()
        set(Math.floor(e.faceIndex / 2))
    }, [])
    const onOut = useCallback(() => set(null), [])
    const onClick = useCallback((e) => {
        e.stopPropagation()
        const { x, y, z } = ref.current.translation()
        const dir = [
            [x + 1, y, z],
            [x - 1, y, z],
            [x, y + 1, z],
            [x, y - 1, z],
            [x, y, z + 1],
            [x, y, z - 1],
        ]
        cubeStore.addCube(...dir[Math.floor(e.faceIndex / 2)])
    }, [])
    return (
        <RigidBody {...props} type="fixed" colliders="cuboid" ref={ref}>
            <mesh receiveShadow castShadow onPointerMove={onMove} onPointerOut={onOut} onClick={onClick}>
                {[...Array(6)].map((_, index) => (
                    <meshStandardMaterial attach={`material-${index}`} key={index} map={texture} color={hover === index ? "hotpink" : "white"} />
                ))}
                <boxGeometry />
            </mesh>
        </RigidBody>
    )
}

export function Swarm({ width = 1024, height = 768, children, count = 50, items = Array(count).fill({}), ...props }) {
    return (
        <group {...props}>
            <mesh position={[0, 25, 0]}>
                {items.map((item, i) => {
                    const position = item.position || [
                        //(Math.random() - 0.5) * width,
                        //(Math.random() + 0.5) * height,
                        //(Math.random() - 0.5) * width,

                        //(20 + Math.random() * width) * (Math.round(Math.random()) ? -1 : 1),
                        //-10 + Math.random() * height,
                        //-5 + Math.random() * 10
                    ]
                    //const factor = Perlin.perlin3(position[0], position[1], position[2])
                    return <Fly key={i} position={position} rotation={[0, position[0] > 0 ? Math.PI : 0, 0]} factor={.5}>
                        <Pixi {...item} />
                    </Fly>
                })}
            </mesh>
        </group>
    )
}

export function Fly({ factor = .5, children, ...props }) {
    const group = useRef()
    const mesh = useRef()
    //const exp = useExplosion(mesh)
    const [start] = useState(() => Math.random() * 5000)
    const [, key] = useKeyboardControls()
    useFrame((state, delta) => {
        const { shoot } = key
        const t = Math.sin(start + state.clock.elapsedTime)
        group.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
        mesh.current.rotation.x = Math.PI / 2 + (t * Math.PI) / 10
        mesh.current.rotation.y = (t * Math.PI) / 2
        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, t * 50, factor)
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, t * 50, factor)
        mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, t * 10, factor)
        //if (shoot) exp.start()
    })
    return (
        <group ref={group} {...props}>
            <scene name="Scene">
                <group ref={mesh}>
                    {children}
                </group>
            </scene>
        </group>
    )
}

export function Pixi({ image = "img/nft/red.png", power = 100, factor = .1, color = "hotpink", ...props }) {
    const texture = useTexture(image)
    return (
        <mesh {...props}>
            <Float speed={2} floatIntensity={factor}>
                <Plane args={[5, 5]}>
                    <MeshWobbleMaterial
                        attach="material"
                        factor={factor} // Strength, 0 disables the effect (default=1)
                        speed={SPEED} // Speed (default=1)
                        roughness={0}
                        map={texture}
                        transparent
                        side={THREE.DoubleSide}
                    />
                </Plane>
                <Plane args={[5, 5]} rotation-y={.5}>
                    <MeshWobbleMaterial
                        attach="material"
                        factor={factor} // Strength, 0 disables the effect (default=1)
                        speed={SPEED} // Speed (default=1)
                        roughness={0}
                        map={texture}
                        transparent
                        side={THREE.DoubleSide}
                    />
                </Plane>
            </Float>
            <Sparkles count={power} scale={[5, 5, .2]} size={7} color={color} opacity={.5} />
        </mesh>
    )
}

export function Player({ children }) {
    const held = useRef()
    const ref = useRef()
    const [isFlying, flying] = useState(false)
    const rapier = useRapier()
    const { camera } = useThree()
    const [, get] = useKeyboardControls()
    useFrame((state) => {
        const { forward, backward, left, right, jump, fly } = get()
        const velocity = ref.current.linvel()
        const direction = camera.getWorldDirection(rotation)
        // update camera
        camera.position.set(...ref.current.translation())
        // held object
        if (held.current) {
            held.current.rotation.copy(camera.rotation)
            held.current.position.copy(camera.position).add(camera.getWorldDirection(rotation).multiplyScalar(1))
        }
        if (backward - forward) {
            direction.y = 0
            direction.normalize()
            const force = Math.sin((velocity.length() > 1) * state.clock.elapsedTime * 10) / 6
            held.current.rotation.z = THREE.MathUtils.lerp(held.current.rotation.z, force, 0.1)
        } else {
            //held.current.rotation.z = -0.5
            //onPointerMissed={(e) => (held.current.children[0].rotation.z = -0.5)}
        }
        // movement
        frontVector.set(0, 0, backward - forward)
        sideVector.set(left - right, 0, 0)
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(isFlying ? SPEED * 2 : SPEED).applyEuler(camera.rotation)
        ref.current.setLinvel({
            x: isFlying ? THREE.MathUtils.lerp(direction.x, velocity.x, 0.1) : direction.x,
            y: isFlying ? (Math.random() * 5) - 5 : velocity.y,
            z: isFlying ? THREE.MathUtils.lerp(direction.z, velocity.z, 0.1) : direction.z
        })
        // jumping/flying
        const world = rapier.world.raw()
        const ray = world.castRay(new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 }))
        const grounded = ray && ray.collider && Math.abs(ray.toi) <= 13.75
        if (fly) flying(!isFlying)
        if (jump && grounded) ref.current.setLinvel({ x: 0, y: 7.5, z: 0 })
        else if (jump && isFlying) ref.current.setLinvel({ x: 0, y: Math.min(15, velocity.y + 2.5), z: 0 })
        if (isFlying && grounded && direction.y < 1) flying(false)
    })
    return (
        <>
            <RigidBody ref={ref} colliders={false} mass={1} type="dynamic" position={[0, 10, 0]} enabledRotations={[false, false, false]}>
                <CapsuleCollider args={[0.75, 0.5]} />
            </RigidBody>
            <group ref={held} position={[0, 0, 0]}>
                <mesh position={[0.5, -0.5, -0.5]} scale={[.0005, .0005, .0005]}>
                    {children}
                </mesh>
            </group>
        </>
    )
}

export function Gallery({ items = Array(10).fill("img/forest.png"), radius = items.length, ...props }) {
    const frames = useMemo(() => {
        const curve = new THREE.EllipseCurve(0, 0, radius, radius)
        const points = curve.getPoints(items.length - 1)
        return points.map(({ x, y }, index) => ({
            position: [x, 2, y],
            rotation: [0, Math.PI / 2.5, 0],
            url: items[index]
        }))
    }, [items])
    return (
        <group {...props}>
            {frames.map((frame, i) => (
                <mesh key={i} position={frame.position} rotation={frame.rotation} scale={[.005, .005, .005]}>
                    <ImageFrame image={frame.url} />
                </mesh>
            ))}
        </group>
    )
}

function ImageFrame({ image, q = new THREE.Quaternion(), p = new THREE.Vector3(), ...props }) {
    const texture = useTexture(image)
    const { camera } = useThree()
    const frame = useRef()
    useEffect(() => {
        p.set(0, 0, 5.5)
        q.identity()
    })
    useFrame((state, dt) => {
        frame.current.lookAt(camera.position)
        //rotation.y = Math.min(0,camera.rotation.y - (Math.PI / 2.5))
        //frame.current.getWorldPosition(p)
        //frame.current.getWorldQuaternion(q)
    })
    return (

        <group ref={frame} rotation-y={1} {...props}>
            <mesh>
                <planeGeometry args={[1100, 1100, 5, 5]} />
                <meshStandardMaterial color="Goldenrod" side={THREE.DoubleSide} />
                {/* <MeshWobbleMaterial
                    attach="material"
                    factor={.03} // Strength, 0 disables the effect (default=1)
                    speed={2} // Speed (default=1)
                    roughness={2}
                    color="Goldenrod"
                    side={THREE.DoubleSide}
                /> */}
            </mesh>
            <mesh position={[0, 5, 10]}>
                <planeGeometry args={[1024, 768, 1, 1]} />
                {/* <meshStandardMaterial map={texture} /> */}
                <MeshWobbleMaterial
                    attach="material"
                    factor={.03} // Strength, 0 disables the effect (default=1)
                    speed={2} // Speed (default=1)
                    roughness={0}
                    map={texture}
                    transparent
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>

    )
}

const transform = ({ position, normal, sampledMesh: mesh, dummy: object }) => {
    object.scale.setScalar(Math.random() * 0.0075)
    const worldPosition = mesh.localToWorld(position)
    object.position.copy(worldPosition)
    object.lookAt(normal.clone().add(position))
    object.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
    object.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
    object.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
    object.updateMatrix()
    return object
}

export function Grass({ strands = 10, children, ...props }) {
    //const geomRef = useRef()
    const meshRef = useRef(null)
    const windLayer = useRef(null)
    const items = useMemo(() => new Array(strands).fill(0).map(d => ({
        offset: new THREE.Vector3(Math.random() - .5, -1, Math.random() - .5),
        scale: 1
    })), [strands])
    const [particles] = useState(items)
    const dummy = useMemo(() => new THREE.Object3D())

    useEffect(() => {
        //meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))

        particles.forEach((particle, i) => {
            const { offset, scale } = particle
            dummy.position.copy(offset.multiplyScalar(scale))
            //dummy.scale.set(scale, scale, scale)
            //dummy.rotation.set(Math.sin(Math.random()) * Math.PI, Math.sin(Math.random()) * Math.PI, Math.cos(Math.random()) * Math.PI)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [particles])

    //useFrame(() => (windLayer.current.time += 0.005))

    return (
        <group {...props}>
            <Sampler
                transform={(props) => {
                    const object = transform(props)
                    const n = Perlin.simplex3(...props.position.clone().multiplyScalar(5).toArray())
                    object.scale.setScalar(THREE.MathUtils.mapLinear(n, -1, 1, .3, 1) * 0.1)
                    return object
                }}
                instances={meshRef}>
                {children}
            </Sampler>
            <instancedMesh ref={meshRef} args={[grassGeometry, grassMaterial, strands]} />
            {/* <coneGeometry args={[0.05, 1.0, 2, 20, false, 0, Math.PI]} /> */}
            {/* <LayerMaterial side={THREE.DoubleSide} lighting="standard" envMapIntensity={1}>
                    <Depth colorA="#221600" colorB="#ade266" near={0.14} far={1.52} mapping="world" />
                    {<windLayer
                        args={[{ mode: 'multiply' }]}
                        colorA="#ffffff"
                        colorB="#acf5ce"
                        noiseScale={10}
                        noiseStrength={5}
                        length={1.2}
                        sway={0.5}
                        ref={windLayer}
                    />}
                </LayerMaterial> */}
        </group>
    )
}