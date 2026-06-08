import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

const Ground = () => {
  const gridRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.y = -0.01;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#0a1628"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200, 100, 100]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.02}
        />
      </mesh>
    </group>
  );
};

export default Ground;
