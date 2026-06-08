const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} color="#4a90a4" />

      <directionalLight
        position={[50, 50, 25]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />

      <pointLight position={[-30, 8, -20]} intensity={0.5} color="#00d4ff" distance={30} />
      <pointLight position={[30, 8, -20]} intensity={0.5} color="#00d4ff" distance={30} />
      <pointLight position={[0, 8, 20]} intensity={0.5} color="#00d4ff" distance={30} />
      <pointLight position={[0, 8, -30]} intensity={0.5} color="#ff6b35" distance={30} />

      <pointLight position={[-15, 3, -10]} intensity={0.3} color="#00ff88" distance={15} />
      <pointLight position={[15, 3, -10]} intensity={0.3} color="#00ff88" distance={15} />
      <pointLight position={[0, 3, 15]} intensity={0.3} color="#00ff88" distance={20} />
    </>
  );
};

export default Lights;
