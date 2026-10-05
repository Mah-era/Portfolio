'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoomObjects } from './room-objects';
type V3 = [number, number, number];

function OpenBook({
  at,
  reduced,
  index,
}: {
  at: V3;
  reduced: boolean;
  index: number;
}) {
  const pages = useRef<THREE.Group>(null);
  const time = useRef(index * 1.7);
  const sheet = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.43, 0.61, 14, 4);
    g.translate(0.215, 0, 0);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++)
      p.setZ(i, Math.sin((p.getX(i) / 0.43) * Math.PI) * 0.035);
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => sheet.dispose(), [sheet]);
  useFrame((_, dt) => {
    if (!reduced) time.current += Math.min(dt, 0.05);
    pages.current?.children.forEach((page, i) => {
      // A page turns slowly, rests, and the next follows. The book stays on its table.
      const phase = (time.current * 0.11 + i / 5) % 1;
      const progress = THREE.MathUtils.smoothstep(phase, 0.18, 0.68);
      page.rotation.y = -progress * Math.PI;
      page.position.z = 0.007 + i * 0.001;
    });
  });
  return (
    <group position={at} rotation={[-Math.PI / 2, 0, -0.2]}>
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.94, 0.66, 0.028]} />
        <meshStandardMaterial
          color={index % 2 ? '#687462' : '#92756a'}
          roughness={0.92}
        />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.23, 0, 0]}>
            <boxGeometry args={[0.44, 0.62, 0.025]} />
            <meshStandardMaterial color="#eee3c8" />
          </mesh>
          {Array.from({ length: 10 }, (_, i) => (
            <mesh key={i} position={[side * 0.23, -0.24 + i * 0.05, 0.014]}>
              <planeGeometry args={[0.3 - (i % 3) * 0.03, 0.003]} />
              <meshBasicMaterial color="#aeaa96" />
            </mesh>
          ))}
        </group>
      ))}
      <group ref={pages}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} geometry={sheet}>
            <meshStandardMaterial
              color={i % 2 ? '#eee4cc' : '#f5ecd8'}
              side={THREE.DoubleSide}
              roughness={1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function DeskFan({ at, reduced }: { at: V3; reduced: boolean }) {
  const head = useRef<THREE.Group>(null),
    blades = useRef<THREE.Group>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    if (reduced) return;
    time.current += Math.min(dt, 0.05);
    if (head.current)
      head.current.rotation.y = Math.sin(time.current * 0.32) * 0.5;
    if (blades.current) blades.current.rotation.z -= dt * 9;
  });
  return (
    <group position={at} scale={0.8}>
      <mesh position={[0, 0.035, 0]} scale={[1, 0.25, 0.75]}>
        <sphereGeometry args={[0.3, 20, 10]} />
        <meshStandardMaterial color="#8e9b8c" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.55, 12]} />
        <meshStandardMaterial color="#8f886e" metalness={0.6} />
      </mesh>
      <group ref={head} position={[0, 0.67, 0]}>
        {[0.16, 0.26, 0.36].map((r) => (
          <mesh key={r} position={[0, 0, 0.06]}>
            <torusGeometry args={[r, 0.008, 5, 48]} />
            <meshStandardMaterial color="#abac95" metalness={0.6} />
          </mesh>
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i * Math.PI) / 6]}
            position={[0, 0, 0.062]}
          >
            <boxGeometry args={[0.006, 0.71, 0.008]} />
            <meshStandardMaterial color="#aaa88f" metalness={0.6} />
          </mesh>
        ))}
        <group ref={blades}>
          {[0, 1, 2].map((i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
              <mesh
                position={[0.13, 0.11, 0]}
                scale={[0.22, 0.105, 0.018]}
                rotation={[0, 0, 0.6]}
              >
                <sphereGeometry args={[1, 12, 8]} />
                <meshStandardMaterial
                  color="#8b9b8d"
                  metalness={0.25}
                  roughness={0.4}
                />
              </mesh>
            </group>
          ))}
        </group>
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.057, 16, 10]} />
          <meshStandardMaterial color="#bfb38c" metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function Tea({ at, reduced }: { at: V3; reduced: boolean }) {
  const steam = useRef<THREE.Group>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    if (!reduced) time.current += Math.min(dt, 0.05);
    const t = time.current;
    steam.current?.children.forEach((wisp, i) => {
      const p = (t * 0.12 + i / 8) % 1;
      wisp.position.set(
        Math.sin(t * 0.6 + i) * p * 0.055,
        p * 0.55,
        Math.cos(t * 0.5 + i) * p * 0.035,
      );
      wisp.scale.set(0.018 + p * 0.06, 0.055 + p * 0.05, 0.018 + p * 0.045);
      if (
        wisp instanceof THREE.Mesh &&
        wisp.material instanceof THREE.MeshBasicMaterial
      )
        wisp.material.opacity = Math.sin(p * Math.PI) * 0.11;
    });
  });
  return (
    <group position={at}>
      <mesh position={[0, 0.014, 0]}>
        <cylinderGeometry args={[0.2, 0.18, 0.026, 28]} />
        <meshStandardMaterial color="#ddd2b7" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.105, 0]}>
        <cylinderGeometry args={[0.12, 0.095, 0.18, 28]} />
        <meshStandardMaterial color="#ded5c1" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.103, 28]} />
        <meshStandardMaterial color="#755339" roughness={0.28} />
      </mesh>
      <mesh position={[0.135, 0.12, 0]}>
        <torusGeometry args={[0.06, 0.016, 8, 20]} />
        <meshStandardMaterial color="#ded5c1" />
      </mesh>
      <group ref={steam} position={[0, 0.21, 0]}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial
              color="#f5efe3"
              transparent
              opacity={0.05}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function DashboardScreen({ reduced }: { reduced: boolean }) {
  const bars = useRef<THREE.Group>(null),
    cursor = useRef<THREE.Mesh>(null),
    time = useRef(0);
  useFrame((_, dt) => {
    if (!reduced) time.current += Math.min(dt, 0.05);
    bars.current?.children.forEach((bar, i) => {
      const height =
        0.12 + (1 + Math.sin(time.current * 0.35 + i * 0.8)) * 0.18;
      bar.scale.y = height;
      bar.position.y = -0.4 + height / 2;
    });
    if (cursor.current)
      cursor.current.position.x = -0.88 + ((time.current * 0.08) % 0.55);
  });
  return (
    <group position={[-3.9, 1.86, -1.176]}>
      <mesh>
        <planeGeometry args={[2.15, 1.17]} />
        <meshBasicMaterial color="#293b38" />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-0.65, 0.37 - i * 0.12, 0.005]}>
          <planeGeometry args={[0.64 - (i % 3) * 0.11, 0.015]} />
          <meshBasicMaterial color={i % 2 ? '#8caa99' : '#bbb297'} />
        </mesh>
      ))}
      <mesh ref={cursor} position={[-0.85, -0.38, 0.009]}>
        <planeGeometry args={[0.045, 0.032]} />
        <meshBasicMaterial color="#ddc898" />
      </mesh>
      <group ref={bars}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[0.05 + i * 0.16, 0, 0.008]}>
            <planeGeometry args={[0.1, 1]} />
            <meshBasicMaterial color={i % 2 ? '#b6bfa4' : '#b3a0bd'} />
          </mesh>
        ))}
      </group>
      <mesh position={[0.46, -0.44, 0.008]}>
        <planeGeometry args={[1.03, 0.012]} />
        <meshBasicMaterial color="#728981" />
      </mesh>
    </group>
  );
}

const bookPositions: V3[] = [
  [-3.03, 0.88, 1.2],
  [4.6, 0.88, 0.65],
  [4.55, 1.22, -1.7],
  [-4.1, 1.22, -0.9],
  [-3, 1.23, -1.1],
  [4.9, 0.88, 3.7],
  [-2.7, 0.88, 1.6],
];
export function LivingAtmosphere({
  reduced,
  index,
}: {
  reduced: boolean;
  night: boolean;
  index: number;
}) {
  const at = bookPositions[index];
  return (
    <group>
      <RoomObjects index={index} reduced={reduced} />
      {index === 2 && <DashboardScreen reduced={reduced} />}
      {index === 5 && (
        <group position={[4.8, 0, 3.7]}>
          <mesh position={[0, 0.81, 0]}>
            <cylinderGeometry args={[0.75, 0.75, 0.12, 32]} />
            <meshStandardMaterial color="#b5a484" />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.14, 0.24, 0.8, 20]} />
            <meshStandardMaterial color="#8e7b60" />
          </mesh>
        </group>
      )}
      <OpenBook at={at} reduced={reduced} index={index} />
      <Tea at={[at[0] - 0.54, at[1], at[2] + 0.08]} reduced={reduced} />
      {[2, 3, 4].includes(index) && (
        <DeskFan
          at={index === 3 ? [4.5, 1.22, -1] : [-5.1, 1.23, -1]}
          reduced={reduced}
        />
      )}
    </group>
  );
}
