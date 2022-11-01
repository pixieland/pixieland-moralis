import * as THREE from 'three'
import { cloneElement, useEffect, useRef, forwardRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { Sampler, ComputedAttribute } from '@react-three/drei'
import { Depth, LayerMaterial } from 'lamina'
import { Abstract } from 'lamina/vanilla'
import Perlin from 'perlin.js'
import WindLayer from './WindLayer'

Perlin.seed(Math.random())
extend({ WindLayer })

const transform = ({ position, normal, dummy: object }) => {
    object.scale.setScalar(Math.random() * 0.0075)
    object.position.copy(position)
    object.lookAt(normal.add(position))
    object.rotation.y += Math.random() - 0.5 * (Math.PI * 0.5)
    object.rotation.x += Math.random() - 0.5 * (Math.PI * 0.5)
    object.rotation.z += Math.random() - 0.5 * (Math.PI * 0.5)
    object.updateMatrix()
    return object
}

export function Grass({ strands = 50000, ...props }) {
    const geomRef = useRef()
    const meshRef = useRef(null)
    const windLayer = useRef(null)

    useEffect(() => {
        meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
        meshRef.current.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5))
    }, [])

    useFrame(() => (windLayer.current.time += 0.005))

    return (
        <>
            <mesh ref={geomRef}>
                <planeGeometry args={[100, 100, 10]}>
                    <ComputedAttribute name="density" compute={computeFlowerDensity} usage={THREE.StaticReadUsage} />
                </planeGeometry>
            </mesh>
            {/* <BlobGeometry ref={geomRef} children={children} /> */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, strands]} {...props}>
                <coneGeometry args={[0.05, 1.0, 2, 20, false, 0, Math.PI]} />
                <LayerMaterial side={THREE.DoubleSide} lighting="standard" envMapIntensity={1}>
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
                </LayerMaterial>
            </instancedMesh>
            <group>
                <Sampler
                    transform={(props) => {
                        const object = transform(props)
                        const n = Perlin.simplex3(...props.position.clone().multiplyScalar(5).toArray())
                        object.scale.setScalar(THREE.MathUtils.mapLinear(n, -1, 1, 0.3, 1) * 0.1)
                        return object
                    }}
                    mesh={geomRef}
                    instances={meshRef}
                />
            </group>
        </>
    )
}

const computeFlowerDensity = (geometry) => {
    const position = geometry.getAttribute('position')
    const density = []
    const vertex = new THREE.Vector3()
    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i)
        const p = vertex.clone().multiplyScalar(1)
        const n = Perlin.simplex3(...p.toArray())
        let m = THREE.MathUtils.mapLinear(n, -1, 1, 0, 1)
        if (m > 0.15) m = 0
        density.push(m)
    }
    return new THREE.Float32BufferAttribute(density, 1)
}

const BlobGeometry = forwardRef(({ children }, ref) => {
    const geom = useRef()

    useEffect(() => {
        const vertex = new THREE.Vector3()
        const normal = new THREE.Vector3()
        let newPositionAttribute = []
        const positionAttribute = geom.current.getAttribute('position')
        const normalAttribute = geom.current.getAttribute('normal')
        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i)
            normal.fromBufferAttribute(normalAttribute, i)
            const v = vertex.multiplyScalar(0.5)
            const n = Perlin.simplex3(...v.toArray())
            vertex.add(normal.multiplyScalar(n * 0.3))
            newPositionAttribute.push(vertex.x, vertex.y, vertex.z)
        }
        geom.current.setAttribute('position', new THREE.Float32BufferAttribute(newPositionAttribute, 3))
        geom.current.attributes.position.needsUpdate = true
        geom.current.computeVertexNormals()
    }, [])

    return (
        <mesh ref={ref}>
            {/* {cloneElement(children, {
                ref: geom, children: [
                    <ComputedAttribute name="density" compute={computeFlowerDensity} usage={THREE.StaticReadUsage} />
                ]
            })} */}
            <planeGeometry args={[100, 100, 10]} ref={geom}>
                <ComputedAttribute name="density" compute={computeFlowerDensity} usage={THREE.StaticReadUsage} />
            </planeGeometry>
            <meshBasicMaterial color="#221600" />
        </mesh>
    )
})
