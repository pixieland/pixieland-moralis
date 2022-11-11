import { OrbitControls, Stars, Center, Text, Text3D, MeshReflectorMaterial } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useMemo, useState, Suspense } from 'react';
import Pixi, { pixis } from './Pixi'
import Pixidust from './Power'
import Level, { levels } from './Level'

const randomIndex = (items) => Math.floor(Math.random() * items.length - 1 | 0)
const nextIndex = (items, index) => index < items.length - 1 ? index + 1 : 0

export default function Game() {
  const [play, setPlay] = React.useState(false)
  const [level, setLevel] = React.useState(0)
  const [pixi, setPixi] = React.useState(0)
  const handleKeyDown = useMemo(() => (e) => {
    console.log(e.key)
    if (e.key === ' ') {
      //setPlay(!play)
      setPixi(nextIndex(pixis, pixi))
    }
    if (e.key === 'Enter') {
      setLevel(nextIndex(levels, level))
    }
  }, [play, level])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [play]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLevel(randomIndex(levels))
      setPixi(randomIndex(pixis))
    }, 3000)
    return () => {
      window.clearTimeout(timer)
    };
  }, [level])

  const player = useMemo(() => pixis[pixi], [pixi])

  if(!player) console.log('player',pixi,pixis)
  if(!levels[level]) console.log('level',level,levels)

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      gl={{ antialias: false, alpha: false }}
      mode="concurrent"
      dpr={window.devicePixelRatio}
    >
      <directionalLight intensity={1} />
      <ambientLight intensity={.7} />

      <Scoreboard level={level + 1} pixi={player} position={[0, 6.5, 0]} />

      <Title rotation={[0.8, 0, 0]} position={[0, 5, 2]} />

      <Level level={level + 1} />

      <Stars radius={500} depth={10} count={1000} factor={1} />

      <group>
        <Pixi pixi={player} position={[0, 2, 0]} />
        <Pixidust pixi={player} position={[0, -25, 0]} />
      </group>

      {/* <OrbitControls zoomSpeed={1} /> */}

    </Canvas>
  );
}

function Title(props) {
  return (
    <Center {...props}>
      <Text3D
        curveSegments={32}
        bevelEnabled
        bevelSize={0.04}
        bevelThickness={0.1}
        height={0.5}
        lineHeight={0.5}
        letterSpacing={-0.06}
        size={1.5}
        font="fonts/InterBold.json">
        {"Pixiland"}
        <meshNormalMaterial />
      </Text3D>
    </Center>
  )
}

const fontSize = 0.5
const lineHeight = 0.7

function Scoreboard({ level, pixi, ...props }) {
  return (
    <mesh {...props}>
      <boxBufferGeometry args={[20, 3, 1]} />
      <MeshReflectorMaterial opacity={.1} color="black" />
      <Text position={[-9, 0, 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
        {`Level:\t${level}`}
      </Text>
      <Text position={[-9, -lineHeight, 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
        {`NFT:\t${levels[level - 1].replace('img/bkg/', '').replace('.jpg', '')}`}
      </Text>
      <Text position={[5, 0, 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
        {`Pixi:\t${pixi.color}`}
      </Text>
      <Text position={[5, -lineHeight, 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
        {`Power:\t${pixi.hp}`}
      </Text>
      <Text position={[5, -(lineHeight * 2), 1]} fontSize={fontSize} color="white" anchorX="left" anchorY="middle">
        {`NFT:\t${pixi.image.replace('img/nft/', '').replace('.png', '')}`}
      </Text>
    </mesh>
  )
}
