import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Sparkles, Shadow, Billboard, Decal } from '@react-three/drei'
import { LayerMaterial, Depth } from 'lamina'
import { useMemo } from 'react'

export function Character({ image, hp = 10 }) {
    const texture = useTexture(image)
    return (
        <Sphere vibrance={hp} scale={[1, 1, .1]}>
            <Decal scale={[2, 2, 5]}>
                <meshPhysicalMaterial
                    clearcoat={1} clearcoatRoughness={0} roughness={0} toneMapped={false}
                    transparent
                    depthTest={false}
                    map={texture}
                    alphaTest={0.3}
                    polygonOffset={true}
                    polygonOffsetFactor={-10}
                />
            </Decal>
        </Sphere>
    )
}

function Sphere({ size = 1, vibrance = 15, color = '#0fff', emissive, glow, children, ...props }) {
    const sphere = useRef()
    const r = useMemo(() => Math.random(), [])

    useFrame((state, dt) => {
        //sphere.current.rotation.y += Math.min(Math.random(),0.01)
        // if (dt > r) {
        //     sphere.current.rotation.y += 0.01
        // }
    })

    return (
        <mesh {...props} rotation={[0, 0, 0]} ref={sphere}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshPhysicalMaterial clearcoat={1} clearcoatRoughness={0} transmission={1} thickness={0.9} roughness={0} toneMapped={false} emissive={emissive || color} envMapIntensity={0.2} />
            {/* <Glow scale={size * 1.2} near={-25} color={glow || emissive || color} /> */}
            <Sparkles count={vibrance} scale={size * 2} size={6} speed={0.4} />
            <Shadow rotation={[-Math.PI / 2, 0, 0]} scale={size} position={[0, -size, 0]} color={emissive} opacity={0.5} />
            {children}
        </mesh>
    )
}

const Glow = ({ color, scale = 0.5, near = -2, far = 1.4 }) => (
    <Billboard>
        <mesh>
            <circleGeometry args={[2 * scale, 16]} />
            <LayerMaterial
                transparent
                depthWrite={false}
                blending={THREE.CustomBlending}
                blendEquation={THREE.AddEquation}
                blendSrc={THREE.SrcAlphaFactor}
                blendDst={THREE.DstAlphaFactor}>
                <Depth colorA={color} colorB="black" alpha={1} mode="normal" near={near * scale} far={far * scale} origin={[0, 0, 0]} />
                <Depth colorA={color} colorB="black" alpha={0.5} mode="add" near={-40 * scale} far={far * 1.2 * scale} origin={[0, 0, 0]} />
                <Depth colorA={color} colorB="black" alpha={1} mode="add" near={-15 * scale} far={far * 0.7 * scale} origin={[0, 0, 0]} />
                <Depth colorA={color} colorB="black" alpha={1} mode="add" near={-10 * scale} far={far * 0.68 * scale} origin={[0, 0, 0]} />
            </LayerMaterial>
        </mesh>
    </Billboard>
)

function LoopOverInstancedBufferAttribute({ children, buffer }) {
    if (!buffer) return null
    //const [m] = React.useState(() => new Matrix4())
    const m = new THREE.Matrix4()
    return [...new Array(buffer.count)].map((_, i) => {
        const p = new THREE.Vector3()
        const q = new THREE.Quaternion()
        const r = new THREE.Euler()
        const s = new THREE.Vector3()

        m.fromArray(buffer.array, i * 16)
        m.decompose(p, q, s)
        r.setFromQuaternion(q)

        return children({ key: i, position: p, rotation: r, scale: s })
    })
}

  // const StampedMesh = React.forwardRef(({ image, count = 150, children, ...props }, m) => {
  //   //  function StampedMesh({ image, count = 50, children, ...props }) {
  //   //const m = useRef()
  //   const texture = useTexture(image)
  //   const transform = React.useCallback(({ dummy, position, normal }) => {
  //     const p = new THREE.Vector3()
  //     p.copy(position)
  //     const r = new THREE.Euler()
  //     r.x = Math.random() * Math.PI
  //     dummy.position.copy(position)
  //     dummy.rotation.copy(r)
  //     dummy.lookAt(p.add(normal))
  //   }, [])
  //   const bufferAttribute = useSurfaceSampler(m, count, transform)
  //   return (
  //     <>
  //       <mesh ref={m} {...props}>
  //         {children}
  //       </mesh>
  //       <LoopOverInstancedBufferAttribute buffer={bufferAttribute}>
  //         {({ ...props }) => (
  //           <Decal mesh={m} {...props}>
  //             <meshPhysicalMaterial
  //               roughness={0.2}
  //               transparent
  //               depthTest={false}
  //               map={texture}
  //               alphaTest={0}
  //               polygonOffset={true}
  //               polygonOffsetFactor={-10}
  //             />
  //           </Decal>
  //         )}
  //       </LoopOverInstancedBufferAttribute>
  //     </>
  //   )
  // })