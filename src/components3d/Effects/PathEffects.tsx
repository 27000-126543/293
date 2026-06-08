import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ShelterPath } from '@/types';

interface PathEffectsProps {
  path: ShelterPath;
}

const colorMap: Record<string, string> = {
  green: '#00ff88',
  blue: '#00d4ff',
  yellow: '#ffcc00',
  red: '#ff3366',
};

const PathEffects = ({ path }: PathEffectsProps) => {
  const lineRef = useRef<any>(null);
  const glowRef = useRef<any>(null);
  const particlesRef = useRef<any>(null);

  const curve = useMemo(() => {
    const points = path.points.map(
      (p) => new THREE.Vector3(p.x, p.y + 0.2, p.z)
    );
    return new THREE.CatmullRomCurve3(points);
  }, [path.points]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.15, 8, false);
  }, [curve]);

  const glowGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.3, 8, false);
  }, [curve]);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      const t = i / 50;
      const point = curve.getPointAt(t);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
    return positions;
  }, [curve]);

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }

    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const offset = (state.clock.elapsedTime * 0.05) % 1;
      for (let i = 0; i < 50; i++) {
        const t = ((i / 50) + offset) % 1;
        const point = curve.getPointAt(t);
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y + Math.sin(state.clock.elapsedTime * 3 + i) * 0.1;
        positions[i * 3 + 2] = point.z;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const color = colorMap[path.color];

  return (
    <group>
      <mesh ref={glowRef} geometry={glowGeometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={lineRef} geometry={tubeGeometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.3}
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

export default PathEffects;
