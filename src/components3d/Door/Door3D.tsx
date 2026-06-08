import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { DoorStatus } from '@/types';
import { useShelterStore } from '@/store/useShelterStore';

interface Door3DProps {
  door: DoorStatus;
  onClick?: () => void;
}

const Door3D = ({ door, onClick }: Door3DProps) => {
  const doorRef = useRef<any>(null);
  const { toggleDoor } = useShelterStore();

  useFrame(() => {
    if (doorRef.current) {
      const targetRotation = door.isOpen ? Math.PI / 2.5 : 0;
      doorRef.current.rotation.y += (targetRotation - doorRef.current.rotation.y) * 0.05;
    }
  });

  const getStatusColor = () => {
    if (door.isFault) return '#ff3366';
    if (door.isLocked) return '#ffcc00';
    if (door.isOpen) return '#00ff88';
    return '#00d4ff';
  };

  return (
    <group position={[door.position.x, door.position.y, door.position.z]} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 5.5, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} />
      </mesh>

      <group ref={doorRef} position={[-1.5, 0, 0]}>
        <mesh position={[1.5, 2.5, 0.3]} castShadow>
          <boxGeometry args={[2.8, 5, 0.3]} />
          <meshStandardMaterial
            color={door.isFault ? '#4a2020' : '#2a3a4a'}
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        <mesh position={[1.5, 2.5, 0.5]}>
          <boxGeometry args={[2.6, 4.8, 0.05]} />
          <meshStandardMaterial
            color={getStatusColor()}
            emissive={getStatusColor()}
            emissiveIntensity={door.isFault ? 0.8 : 0.3}
            transparent
            opacity={0.7}
          />
        </mesh>

        <mesh position={[2.5, 2.5, 0.5]}>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
          <meshStandardMaterial color="#888" metalness={0.9} />
        </mesh>
      </group>

      <Html position={[0, 6, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div
          className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-all hover:scale-110 ${
            door.isFault
              ? 'bg-alert-red/30 border border-alert-red text-alert-red'
              : door.isLocked
              ? 'bg-alert-yellow/30 border border-alert-yellow text-alert-yellow'
              : door.isOpen
              ? 'bg-alert-green/30 border border-alert-green text-alert-green'
              : 'bg-tech-500/30 border border-tech-500 text-tech-400'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleDoor(door.id);
          }}
        >
          {door.name}
          <br />
          {door.isFault ? '故障' : door.isLocked ? '锁定' : door.isOpen ? '开启' : '关闭'}
        </div>
      </Html>
    </group>
  );
};

export default Door3D;
