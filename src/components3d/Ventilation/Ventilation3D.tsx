import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { VentilationStatus } from '@/types';

interface Ventilation3DProps {
  ventilation: VentilationStatus;
}

const Ventilation3D = ({ ventilation }: Ventilation3DProps) => {
  const fanRef = useRef<any>(null);
  const { shelterId, isRunning, fanSpeed, isFilterMode } = ventilation;

  useFrame((state, delta) => {
    if (fanRef.current && isRunning) {
      fanRef.current.rotation.z += delta * (fanSpeed / 10);
    }
  });

  const xOffset = shelterId === 's1' ? -15 : shelterId === 's2' ? 15 : 0;
  const zOffset = shelterId === 's3' ? 15 : -10;

  return (
    <group position={[xOffset, 6, zOffset]}>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 3, 16]} />
        <meshStandardMaterial
          color={isFilterMode ? '#4a2020' : '#1a3458'}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 0.3, 16]} />
        <meshStandardMaterial
          color={isFilterMode ? '#ff3366' : '#00d4ff'}
          emissive={isFilterMode ? '#ff3366' : '#00d4ff'}
          emissiveIntensity={isRunning ? 0.5 : 0.2}
        />
      </mesh>

      <group ref={fanRef} position={[0, 0, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} rotation={[0, 0, (Math.PI / 3) * i]} position={[0, 0, 0]}>
            <boxGeometry args={[0.2, 1.2, 0.1]} />
            <meshStandardMaterial
              color={isRunning ? '#00ff88' : '#666'}
              emissive={isRunning ? '#00ff88' : '#000'}
              emissiveIntensity={isRunning ? 0.3 : 0}
              metalness={0.8}
            />
          </mesh>
        ))}
      </group>

      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.7} roughness={0.5} />
      </mesh>

      <Html position={[0, 3, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div
          className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
            isFilterMode
              ? 'bg-alert-red/30 border border-alert-red text-alert-red'
              : isRunning
              ? 'bg-alert-green/30 border border-alert-green text-alert-green'
              : 'bg-gray-600/30 border border-gray-500 text-gray-400'
          }`}
        >
          {isFilterMode ? '滤毒模式' : '通风模式'}
          <br />
          转速: {fanSpeed}%
        </div>
      </Html>
    </group>
  );
};

export default Ventilation3D;
