import React, { Suspense, useLayoutEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";
import { Parallax } from "./components";

type ModelProps = {
  rotationY: number;
};
const Model: React.FC<ModelProps> = (props) => {
  const { rotationY } = props;
  const { scene } = useGLTF("/models/sample.glb");
  const groupRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY;
    }
  }, [rotationY]);

  return <primitive ref={groupRef} object={scene} />;
};

const App: React.FC = () => {
  return (
    <Parallax frame={4}>
      {(progress) => {
        return (
          <div
            id="canvas-container"
            style={{
              position: "relative",
              width: "100vw",
              height: "100vh",
            }}
          >
            {progress}
            <Canvas
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              camera={{ position: [0, 0, 1000], fov: 75 }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <Model rotationY={progress * Math.PI * 4} />
              </Suspense>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
            </Canvas>
            <div
              id="canvas-overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0,
              }}
            />
          </div>
        );
      }}
    </Parallax>
  );
};

export default App;
