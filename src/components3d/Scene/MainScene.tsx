import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';
import ShelterUnit3D from '../ShelterUnit/ShelterUnit3D';
import Door3D from '../Door/Door3D';
import Ventilation3D from '../Ventilation/Ventilation3D';
import Personnel3D from '../Personnel/Personnel3D';
import Warehouse3D from '../Warehouse/Warehouse3D';
import PathEffects from '../Effects/PathEffects';
import Ground from './Ground';
import Lights from './Lights';
import { useShelterStore } from '@/store/useShelterStore';
import { usePersonnelStore } from '@/store/usePersonnelStore';
import { useEmergencyStore } from '@/store/useEmergencyStore';

const MainScene = () => {
  const { units, doorStatus, ventilationStatus, selectedUnitId, selectObject } = useShelterStore();
  const { personnel } = usePersonnelStore();
  const { currentPlan } = useEmergencyStore();

  return (
    <Canvas
      shadows
      camera={{ position: [0, 80, 60], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => selectObject(null, null)}
    >
      <color attach="background" args={['#050a14']} />
      <fog attach="fog" args={['#050a14', 50, 150]} />

      <Lights />
      <Ground />

      <Suspense fallback={null}>
        {units.map((unit) => (
          <ShelterUnit3D
            key={unit.id}
            unit={unit}
            isSelected={selectedUnitId === unit.id && useShelterStore.getState().selectedObjectType === 'shelter'}
            onClick={() => selectObject('shelter', unit.id)}
          />
        ))}

        {doorStatus.map((door) => (
          <Door3D key={door.id} door={door} onClick={() => selectObject('door', door.id)} />
        ))}

        {ventilationStatus.map((vent) => (
          <Ventilation3D key={vent.id} ventilation={vent} />
        ))}

        <Warehouse3D position={[0, 0, -25]} onClick={() => selectObject('warehouse', 'w1')} />

        {personnel.map((person) => (
          <Personnel3D key={person.id} person={person} onClick={() => selectObject('personnel', person.id)} />
        ))}

        {currentPlan?.paths.map((path) => (
          <PathEffects key={path.id} path={path} />
        ))}
      </Suspense>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={20}
        maxDistance={120}
        maxPolarAngle={Math.PI / 2.1}
      />

      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
};

export default MainScene;
