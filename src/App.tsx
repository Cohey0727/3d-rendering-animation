import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Model: React.FC = () => {
  const { scene } = useGLTF("/models/sample.glb");
  const rotationRef = useRef(0);

  useFrame(({ camera }) => {
    rotationRef.current += 0.01;
    camera.rotation.set(rotationRef.current, 0, 0);
    console.log("Current Camera Position:", camera.position);
    console.log("Current Camera Rotation:", camera.rotation);
  });

  return <primitive object={scene} />;
};

const App: React.FC = () => {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      camera={{
        position: [0, 0, 500],
        fov: 100,
        rotation: [0, 0, 0],
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default App;
