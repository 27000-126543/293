import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Person } from '@/types';

interface Personnel3DProps {
  person: Person;
  onClick?: () => void;
}

const Personnel3D = ({ person, onClick }: Personnel3DProps) => {
  const groupRef = useRef<any>(null);
  const alertRef = useRef<any>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
    if (alertRef.current && person.isInUnprotectedZone) {
      alertRef.current.rotation.y += 0.02;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      alertRef.current.scale.set(scale, scale, scale);
    }
  });

  const bodyColor = person.isInUnprotectedZone ? '#ff3366' : '#00d4ff';
  const headColor = person.isInUnprotectedZone ? '#ff6666' : '#ffdbac';

  return (
    <group
      ref={groupRef}
      position={[person.position.x, person.position.y, person.position.z]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      {person.isInUnprotectedZone && (
        <mesh ref={alertRef} position={[0, 3, 0]}>
          <ringGeometry args={[0.5, 0.7, 16]} />
          <meshBasicMaterial
            color="#ff3366"
            transparent
            opacity={0.8}
            side={2}
          />
        </mesh>
      )}

      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 1.2, 8]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={bodyColor}
          emissiveIntensity={person.isInUnprotectedZone ? 0.5 : 0.2}
        />
      </mesh>

      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={headColor}
          emissive={person.isInUnprotectedZone ? '#ff3366' : '#000'}
          emissiveIntensity={person.isInUnprotectedZone ? 0.3 : 0}
        />
      </mesh>

      <mesh position={[0, 2.65, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <mesh position={[0.1, 2.65, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#000" />
      </mesh>

      <mesh position={[-0.4, 1.7, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.4, 1.7, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      <mesh position={[-0.15, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.15, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      <Html
        position={[0, 3.5, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap ${
            person.isInUnprotectedZone
              ? 'bg-alert-red/80 text-white animate-blink'
              : 'bg-military-900/90 text-tech-400 border border-tech-500/50'
          }`}
        >
          {person.name}
          <span className="text-xs ml-1 opacity-70">({person.role})</span>
        </div>
      </Html>
    </group>
  );
};

export default Personnel3D;
