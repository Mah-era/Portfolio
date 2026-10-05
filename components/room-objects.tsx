'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

type V3 = [number, number, number];
function Box({
  at = [0, 0, 0],
  size,
  color = '#887353',
}: {
  at?: V3;
  size: V3;
  color?: string;
}) {
  return (
    <mesh position={at} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.62} />
    </mesh>
  );
}
function Brass({
  at,
  radius,
  height,
}: {
  at: V3;
  radius: number;
  height: number;
}) {
  return (
    <mesh position={at} castShadow>
      <cylinderGeometry args={[radius, radius, height, 28]} />
      <meshStandardMaterial color="#b7a17a" metalness={0.65} roughness={0.32} />
    </mesh>
  );
}

function RecordPlayer({ reduced }: { reduced: boolean }) {
  const record = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!reduced && record.current)
      record.current.rotation.y += Math.min(dt, 0.05) * 1.7;
  });
  return (
    <group position={[-0.14, 0, 0]}>
      <Box at={[0, 0.085, 0]} size={[1.22, 0.17, 0.88]} color="#786248" />
      <group ref={record} position={[-0.12, 0.18, 0]}>
        <mesh>
          <cylinderGeometry args={[0.35, 0.35, 0.014, 48]} />
          <meshStandardMaterial color="#333b35" roughness={0.33} />
        </mesh>
        {[0.17, 0.23, 0.28, 0.32].map((r) => (
          <mesh
            key={r}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.011, 0]}
          >
            <torusGeometry args={[r, 0.002, 4, 48]} />
            <meshStandardMaterial color="#626658" />
          </mesh>
        ))}
        <mesh position={[0, 0.012, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.016, 32]} />
          <meshStandardMaterial color="#b9a18a" />
        </mesh>
        <Box
          at={[0.038, 0.022, 0]}
          size={[0.008, 0.004, 0.06]}
          color="#f1e3c7"
        />
      </group>
      <Brass at={[0.45, 0.22, -0.26]} radius={0.065} height={0.12} />
      <group position={[0.45, 0.27, -0.26]} rotation={[0, -0.5, 0]}>
        <Box at={[0, 0, 0.21]} size={[0.026, 0.025, 0.44]} color="#c0b393" />
        <Box
          at={[0, -0.025, 0.44]}
          size={[0.065, 0.055, 0.1]}
          color="#464c40"
        />
      </group>
      {[0, 1].map((i) => (
        <group key={i} position={[0.76, 0.18, -0.19 + i * 0.36]}>
          <Box size={[0.22, 0.36, 0.29]} color="#7b735d" />
          <mesh position={[0, 0, 0.15]}>
            <circleGeometry args={[0.08, 24]} />
            <meshStandardMaterial color="#343d35" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Globe({ reduced }: { reduced: boolean }) {
  const globe = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!reduced && globe.current)
      globe.current.rotation.y += Math.min(dt, 0.05) * 0.085;
  });
  return (
    <group>
      <Brass at={[0, 0.045, 0]} radius={0.3} height={0.09} />
      <Brass at={[0, 0.23, 0]} radius={0.035} height={0.4} />
      <group position={[0, 0.76, 0]} rotation={[0, 0, -0.23]}>
        <mesh>
          <torusGeometry args={[0.51, 0.014, 8, 64]} />
          <meshStandardMaterial color="#b5a07d" metalness={0.65} />
        </mesh>
        <group ref={globe}>
          <mesh>
            <sphereGeometry args={[0.46, 36, 24]} />
            <meshStandardMaterial color="#7d9690" roughness={0.75} />
          </mesh>
          {[-0.3, -0.15, 0, 0.15, 0.3].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry
                args={[Math.sqrt(0.462 ** 2 - y ** 2), 0.002, 4, 48]}
              />
              <meshStandardMaterial color="#b9bc9f" />
            </mesh>
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <mesh key={i} rotation={[0, (i * Math.PI) / 6, 0]}>
              <torusGeometry args={[0.463, 0.002, 4, 48]} />
              <meshStandardMaterial color="#c6c0a0" />
            </mesh>
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <mesh
              key={i}
              rotation={[Math.sin(i * 4.1) * 0.85, i * 2.4, i * 0.5]}
            >
              <sphereGeometry
                args={[0.466, 24, 16, 0, 0.5 + (i % 3) * 0.13, 0.6, 0.47]}
              />
              <meshStandardMaterial
                color="#b9b58f"
                side={THREE.DoubleSide}
                roughness={1}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

function Laptop({ reduced }: { reduced: boolean }) {
  const lines = useRef<THREE.Group>(null),
    cursor = useRef<THREE.Mesh>(null),
    t = useRef(0);
  useFrame((_, dt) => {
    if (!reduced) t.current += Math.min(dt, 0.05);
    lines.current?.children.forEach((line, i) => {
      line.scale.x =
        0.12 +
        THREE.MathUtils.smoothstep(
          (t.current * 0.12 + 1 - i * 0.12) % 1,
          0,
          0.3,
        ) *
          0.88;
    });
    if (cursor.current)
      cursor.current.visible = reduced || Math.sin(t.current * 5) > -0.2;
  });
  return (
    <group rotation={[0, 0.12, 0]}>
      <Box at={[0, 0.023, 0.12]} size={[1.45, 0.046, 0.86]} color="#9b9d8e" />
      {Array.from({ length: 5 }, (_, row) => (
        <group key={row}>
          {Array.from({ length: 12 }, (_, col) => (
            <Box
              key={col}
              at={[-0.59 + col * 0.106, 0.05, -0.15 + row * 0.075]}
              size={[0.085, 0.012, 0.049]}
              color="#5e665b"
            />
          ))}
        </group>
      ))}
      <Box at={[0, 0.05, 0.38]} size={[0.41, 0.007, 0.22]} color="#858d80" />
      <group position={[0, 0.045, -0.31]} rotation={[-0.16, 0, 0]}>
        <Box at={[0, 0.45, 0]} size={[1.45, 0.9, 0.052]} color="#9b9d8e" />
        <Box at={[0, 0.46, 0.028]} size={[1.34, 0.77, 0.008]} color="#293c38" />
        <group ref={lines} position={[-0.57, 0.73, 0.037]}>
          {Array.from({ length: 8 }, (_, i) => (
            <group key={i} position={[(i % 3) * 0.055, -i * 0.073, 0]}>
              <Box
                at={[(0.32 + (i % 3) * 0.16) / 2, 0, 0]}
                size={[0.32 + (i % 3) * 0.16, 0.012, 0.006]}
                color={i % 3 ? '#acc0a3' : '#c5aac5'}
              />
            </group>
          ))}
        </group>
        <mesh ref={cursor} position={[-0.13, 0.15, 0.04]}>
          <planeGeometry args={[0.012, 0.034]} />
          <meshBasicMaterial color="#efdbab" />
        </mesh>
      </group>
    </group>
  );
}

function CoffeeMaker({ reduced }: { reduced: boolean }) {
  const pour = useRef<THREE.Group>(null),
    t = useRef(0);
  useFrame((_, dt) => {
    if (!reduced) t.current += Math.min(dt, 0.05);
    pour.current?.children.forEach((drop, i) => {
      drop.position.y = 0.45 - ((t.current * 0.4 + i * 0.038) % 0.2);
      drop.visible = t.current % 14 < 5;
    });
  });
  return (
    <group>
      <Box at={[0, 0.41, -0.16]} size={[0.64, 0.8, 0.38]} color="#748575" />
      <Box at={[0, 0.035, 0.09]} size={[0.68, 0.07, 0.73]} color="#bcb5a2" />
      <Box at={[0, 0.63, 0.09]} size={[0.65, 0.19, 0.42]} color="#8d9b86" />
      <Brass at={[0, 0.49, 0.22]} radius={0.068} height={0.12} />
      <mesh position={[0.21, 0.65, 0.306]}>
        <circleGeometry args={[0.045, 16]} />
        <meshBasicMaterial color="#c7dda9" />
      </mesh>
      <mesh position={[0, 0.15, 0.23]}>
        <cylinderGeometry args={[0.13, 0.105, 0.2, 28]} />
        <meshStandardMaterial color="#e7dac3" />
      </mesh>
      <mesh position={[0, 0.253, 0.23]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.114, 28]} />
        <meshStandardMaterial color="#815a3e" />
      </mesh>
      <mesh position={[0.148, 0.16, 0.23]}>
        <torusGeometry args={[0.064, 0.016, 8, 20]} />
        <meshStandardMaterial color="#e7dac3" />
      </mesh>
      <group ref={pour} position={[0, 0, 0.22]}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} scale={[0.009, 0.021, 0.009]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#74472d" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Cradle({ reduced }: { reduced: boolean }) {
  const balls = useRef<THREE.Group>(null),
    t = useRef(0);
  useFrame((_, dt) => {
    if (!reduced) t.current += Math.min(dt, 0.05);
    balls.current?.children.forEach((b, i) => {
      const swing = Math.sin(t.current * 2.1);
      b.rotation.z =
        i === 0
          ? Math.max(0, swing) * 0.62
          : i === 4
            ? Math.min(0, swing) * 0.62
            : 0;
    });
  });
  return (
    <group>
      <Box at={[0, 0.035, 0]} size={[1.2, 0.07, 0.66]} color="#7d765f" />
      {[-0.24, 0.24].map((z) => (
        <group key={z}>
          {[-0.52, 0.52].map((x) => (
            <Brass key={x} at={[x, 0.44, z]} radius={0.014} height={0.8} />
          ))}
          <Box at={[0, 0.85, z]} size={[1.08, 0.024, 0.024]} color="#b8ac89" />
        </group>
      ))}
      <group ref={balls} position={[0, 0.84, 0]}>
        {Array.from({ length: 5 }, (_, i) => (
          <group key={i} position={[(i - 2) * 0.182, 0, 0]}>
            {[-1, 1].map((s) => (
              <mesh
                key={s}
                position={[0, -0.24, s * 0.12]}
                rotation={[s * 0.46, 0, 0]}
              >
                <cylinderGeometry args={[0.003, 0.003, 0.535, 5]} />
                <meshStandardMaterial color="#aca88f" />
              </mesh>
            ))}
            <mesh position={[0, -0.49, 0]}>
              <sphereGeometry args={[0.09, 20, 14]} />
              <meshStandardMaterial
                color="#bea579"
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Keepsake({ reduced }: { reduced: boolean }) {
  const medal = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!reduced && medal.current)
      medal.current.rotation.y += Math.min(dt, 0.05) * 0.15;
  });
  return (
    <group>
      <Brass at={[0, 0.065, 0]} radius={0.39} height={0.13} />
      <group ref={medal}>
        <Brass at={[0, 0.28, 0]} radius={0.025} height={0.4} />
        <mesh position={[0, 0.61, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.06, 48]} />
          <meshStandardMaterial
            color="#bc9b61"
            metalness={0.75}
            roughness={0.27}
          />
        </mesh>
        <mesh position={[0, 0.61, 0.036]}>
          <torusGeometry args={[0.18, 0.009, 8, 40]} />
          <meshStandardMaterial color="#e1c590" metalness={0.7} />
        </mesh>
      </group>
      <mesh position={[0, 0.54, 0]}>
        <capsuleGeometry args={[0.37, 0.42, 8, 28]} />
        <meshPhysicalMaterial
          color="#e0e6d5"
          transparent
          opacity={0.09}
          roughness={0.1}
          metalness={0.2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Candle({ reduced }: { reduced: boolean }) {
  const flame = useRef<THREE.Mesh>(null),
    t = useRef(0);
  useFrame((_, dt) => {
    if (!reduced) t.current += Math.min(dt, 0.05);
    if (flame.current) {
      flame.current.scale.set(
        0.025,
        0.065 + Math.sin(t.current * 5.4) * 0.009,
        0.025,
      );
      flame.current.rotation.z = Math.sin(t.current * 3.5) * 0.1;
    }
  });
  return (
    <group position={[0.94, 0, 0.16]}>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.26, 28]} />
        <meshStandardMaterial color="#d4bc98" roughness={0.8} />
      </mesh>
      <mesh ref={flame} position={[0, 0.31, 0]} scale={[0.025, 0.065, 0.025]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshBasicMaterial color="#ffd497" toneMapped={false} />
      </mesh>
    </group>
  );
}

export function RoomObjects({
  index,
  reduced,
}: {
  index: number;
  reduced: boolean;
}) {
  return (
    <group position={[3.8, 0, -2.8]} rotation={[0, -0.18, 0]}>
      {/* A low side console keeps the route and all portfolio exhibits clear. */}
      <Box at={[0, 1, 0]} size={[2.65, 0.08, 1.16]} color="#a99473" />
      {[-1.06, 1.06].map((x) => (
        <group key={x}>
          {[-0.39, 0.39].map((z) => (
            <mesh key={z} position={[x, 0.49, z]}>
              <cylinderGeometry args={[0.035, 0.05, 0.98, 12]} />
              <meshStandardMaterial color="#887253" />
            </mesh>
          ))}
        </group>
      ))}
      <group position={[0, 1.045, 0]}>
        {index === 0 && <RecordPlayer reduced={reduced} />}
        {index === 1 && <Globe reduced={reduced} />}
        {index === 2 && <CoffeeMaker reduced={reduced} />}
        {index === 3 && <Laptop reduced={reduced} />}
        {index === 4 && <Cradle reduced={reduced} />}
        {index === 5 && <Keepsake reduced={reduced} />}
        {index === 6 && <CoffeeMaker reduced={reduced} />}
        {index !== 0 && <Candle reduced={reduced} />}
      </group>
    </group>
  );
}
