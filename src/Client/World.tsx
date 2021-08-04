export const World = () => (
  <>
    <Ground />

    <mesh position={[-1, 0.4, 0]} castShadow receiveShadow>
      <boxBufferGeometry args={[1, 0.8, 1]} />
      <meshStandardMaterial color="darkgreen" />
    </mesh>

    <mesh position={[-1, 0.45, -2]} castShadow receiveShadow>
      <boxBufferGeometry args={[2, 0.9, 1.2]} />
      <meshStandardMaterial color="limegreen" />
    </mesh>
  </>
);

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
    <planeBufferGeometry args={[1000, 1000]} />
    <meshStandardMaterial color="#eee" />
  </mesh>
);
