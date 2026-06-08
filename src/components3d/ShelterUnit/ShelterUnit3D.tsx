import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { ShelterUnit } from '@/types';

interface ShelterUnit3DProps {
  unit: ShelterUnit;
  isSelected: boolean;
  onClick: () => void;
}

const ShelterUnit3D = ({ unit, isSelected, onClick }: ShelterUnit3DProps) => {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<Mesh>(null);

  const typeColors: Record<string, string> = {
    parking: '#1a3458',
    mall: '#1a4558',
    shelter: '#1a5834',
  };

  const statusColors: Record<string, string> = {
    peacetime: '#00d4ff',
    wartime: '#ff3366',
  };

  useFrame((state, delta) => {
    if (glowRef.current && isSelected) {
      const glowIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      (glowRef.current.material as any).opacity = glowIntensity;
    }
    if (glowRef.current && hovered && !isSelected) {
      (glowRef.current.material as any).opacity = 0.2;
    } else if (glowRef.current && !isSelected) {
      (glowRef.current.material as any).opacity = 0;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[unit.position.x, unit.position.y, unit.position.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, unit.size.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[unit.size.width, unit.size.height, unit.size.depth]} />
        <meshStandardMaterial
          color={typeColors[unit.type]}
          metalness={0.6}
          roughness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh position={[0, unit.size.height + 0.1, 0]}>
        <boxGeometry args={[unit.size.width + 1, 0.2, unit.size.depth + 1]} />
        <meshStandardMaterial
          color={statusColors[unit.status]}
          emissive={statusColors[unit.status]}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh ref={glowRef} position={[0, unit.size.height / 2, 0]}>
        <boxGeometry args={[unit.size.width + 2, unit.size.height + 2, unit.size.depth + 2]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0}
          side={2}
        />
      </mesh>

      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            -unit.size.width / 2 + 2 + i * (unit.size.width / 2),
            unit.size.height / 2,
            unit.size.depth / 2 + 0.05,
          ]}
        >
          <boxGeometry args={[2, unit.size.height * 0.6, 0.1]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      <Html
        position={[0, unit.size.height + 2, 0]}
        center
        distanceFactor={15}
        style={{ pointerEvents: 'none' }}
      >
        <div className="bg-military-900/90 backdrop-blur-sm px-3 py-1.5 rounded border border-tech-500/50 whitespace-nowrap">
          <p className="text-tech-400 font-display text-sm font-bold">{unit.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                unit.status === 'peacetime' ? 'bg-tech-400' : 'bg-alert-red'
              } animate-pulse`}
            />
            <span className="text-xs text-gray-400">
              {unit.status === 'peacetime' ? '平时状态' : '战时状态'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            人数: {unit.currentPopulation}/{unit.capacity}
          </p>
        </div>
      </Html>
    </group>
  );
};

export default ShelterUnit3D;
