export const Room = () => (
  <group name="room">
    <Ground />

    <mesh position={[-1, 0.4, 0]} castShadow receiveShadow>
      <boxBufferGeometry args={[1, 0.8, 1]} />
      <meshStandardMaterial color="darkgreen" />
    </mesh>

    <mesh position={[-1, 0.45, -2]} castShadow receiveShadow>
      <boxBufferGeometry args={[2, 0.9, 1.2]} />
      <meshStandardMaterial color="limegreen" />
    </mesh>

    <mesh position={[2, 1.75, -5]} castShadow receiveShadow>
      <boxBufferGeometry args={[8, 2.5, 0.1]} />
      <meshStandardMaterial color="#bbb" />
    </mesh>
  </group>
);

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
    <planeBufferGeometry args={[1000, 1000]} />
    <meshStandardMaterial color="#eee" />
  </mesh>
);
