import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useWarehouseStore } from '@/store/useWarehouseStore';

interface Warehouse3DProps {
  position: [number, number, number];
}

const Warehouse3D = ({ position }: Warehouse3DProps) => {
  const groupRef = useRef<any>(null);
  const { lowStockMaterials, materials } = useWarehouseStore();
  const hasLowStock = lowStockMaterials.length > 0;

  useFrame((state) => {
    if (groupRef.current && hasLowStock) {
      const pulse = 0.95 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      groupRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[15, 6, 12]} />
        <meshStandardMaterial
          color={hasLowStock ? '#5a3a1a' : '#1a3458'}
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[0, 6.1, 0]}>
        <boxGeometry args={[16, 0.3, 13]} />
        <meshStandardMaterial
          color={hasLowStock ? '#ff6b35' : '#00d4ff'}
          emissive={hasLowStock ? '#ff6b35' : '#00d4ff'}
          emissiveIntensity={hasLowStock ? 0.5 : 0.3}
        />
      </mesh>

      {hasLowStock && (
        <mesh position={[0, 10, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff6b35" transparent opacity={0.8} />
        </mesh>
      )}

      <mesh position={[0, 2, 6.05]} castShadow>
        <boxGeometry args={[4, 4, 0.2]} />
        <meshStandardMaterial
          color="#2a3a4a"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[-0.5, 2.5, 6.2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#888" metalness={0.9} />
      </mesh>

      {[-5, 0, 5].map((x, i) => (
        <mesh key={i} position={[x, 3, -5.9]}>
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      <Html position={[0, 8, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div
          className={`px-3 py-1.5 rounded font-display font-bold whitespace-nowrap ${
            hasLowStock
              ? 'bg-alert-orange/80 text-white border border-alert-orange animate-blink'
              : 'bg-military-900/90 text-tech-400 border border-tech-500/50'
          }`}
        >
          战备物资仓库
          {hasLowStock && (
            <span className="ml-2 text-xs">
              ⚠️ {lowStockMaterials.length} 种物资库存不足
            </span>
          )}
        </div>
      </Html>

      <Html position={[0, 2, 8]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="bg-military-900/80 px-2 py-1 rounded text-xs text-gray-300 border border-tech-500/30">
          共 {materials.length} 类物资
        </div>
      </Html>
    </group>
  );
};

export default Warehouse3D;
