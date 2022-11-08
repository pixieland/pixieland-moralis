import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useMemo, useState, Suspense } from 'react';
import Pixi, { pixis } from './Pixi'
import Pixidust from './Power'
import Level, { levels } from './Level'

export default function Game() {
  const [play, setPlay] = React.useState(false)
  const [level, setLevel] = React.useState(Math.random() * levels.length | 1)
  const [pixi, setPixi] = React.useState(Math.random() * pixis.length | 1)
  const nextLevel = useMemo(() => () => {
    if (level + 1 <= levels.length) {
      setLevel(level + 1)
    } else {
      setLevel(1)
    }
    setPixi(Math.random() * pixis.length | 1)
  }, [level])
  const handleKeyDown = useMemo(() => (e) => {
    console.log(e.key)
    if (e.key === ' ') {
      //setPlay(!play)
      setPixi(Math.random() * pixis.length | 1)
    }
    if (e.key === 'Enter') {
      nextLevel()
    }
  }, [play, level])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [play]);

  useEffect(() => {
    const timer = setTimeout(() => nextLevel(), 3000)
    return () => {
      window.clearTimeout(timer)
    };
  }, [level])

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      gl={{ antialias: false, alpha: false }}
      mode="concurrent"
      dpr={window.devicePixelRatio}
    >
      <color attach="background" args={["black"]} />
      <directionalLight intensity={1} />
      <ambientLight intensity={.7} />

      <Level level={level} />

      <Stars radius={500} depth={10} count={1000} factor={1} />

      <group>
        <Pixi pixi={pixis[pixi-1]} position={[0, 2, 0]} />
        <Pixidust pixi={pixis[pixi-1]} position={[0, -25, 0]} />
      </group>

      {/* <OrbitControls zoomSpeed={1} /> */}

    </Canvas>
  );
}
