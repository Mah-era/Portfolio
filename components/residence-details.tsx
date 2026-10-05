'use client';

import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { LivingAtmosphere } from './living-atmosphere';

type V3 = [number, number, number];

export function KineticSculpture({
  at,
  scale = 1,
  reduced = false,
  variant = 0,
}: {
  at: V3;
  scale?: number;
  reduced?: boolean;
  variant?: number;
}) {
  const rings = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    if (!rings.current || reduced) return;
    rings.current.rotation.y += dt * 0.17;
    rings.current.position.y = 1.65 + Math.sin(clock.elapsedTime * 0.65) * 0.09;
    rings.current.children.forEach((ring, i) => {
      ring.rotation.x =
        Math.sin(clock.elapsedTime * 0.22 + i * 1.1) * 0.6 + i * 0.62;
      ring.rotation.z = clock.elapsedTime * (i % 2 ? 0.09 : -0.08) + i * 0.9;
    });
  });
  return (
    <group position={at} scale={scale}>
      <mesh position={[0, 0.23, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.75, 0.46, 48]} />
        <meshStandardMaterial color="#aa9d82" roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.17, 0.65, 24]} />
        <meshStandardMaterial
          color="#74634b"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>
      <group ref={rings} position={[0, 1.65, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[i * 0.62, 0, i * 0.9]} castShadow>
            <torusGeometry
              args={[0.94 - i * 0.17, 0.055 + i * 0.009, 12, 88]}
            />
            <meshStandardMaterial
              color={
                variant
                  ? ['#41483e', '#ab9470', '#c3b79f'][i]
                  : ['#252b27', '#9f8967', '#363a31'][i]
              }
              metalness={0.48}
              roughness={0.38}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function ReflectingPool({
  reduced,
  night,
}: {
  reduced: boolean;
  night: boolean;
}) {
  const water = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const data = new Uint8Array(64 * 64 * 4);
    for (let y = 0; y < 64; y++)
      for (let x = 0; x < 64; x++) {
        const c =
          128 +
          Math.sin(x * 0.4 + y * 0.2) * 38 +
          Math.cos(y * 0.3 - x * 0.1) * 32;
        const i = (y * 64 + x) * 4;
        data.set([c, c, c, 255], i);
      }
    const t = new THREE.DataTexture(data, 64, 64);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    t.needsUpdate = true;
    return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((_, dt) => {
    if (!reduced) {
      texture.offset.x += dt * 0.018;
      texture.offset.y += dt * 0.01;
    }
  });
  return (
    <group position={[4.8, -0.15, 13.1]}>
      <mesh position={[0, -0.14, 0]} receiveShadow>
        <boxGeometry args={[8.8, 0.45, 6.3]} />
        <meshStandardMaterial color="#647065" roughness={0.5} />
      </mesh>
      <mesh ref={water} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.09, 0]}>
        <planeGeometry args={[8.45, 5.95]} />
        <MeshReflectorMaterial
          resolution={256}
          mirror={0.65}
          blur={[140, 40]}
          mixBlur={1}
          mixStrength={1.5}
          color={night ? '#344945' : '#829c90'}
          metalness={0.25}
          roughness={0.22}
          distortion={0.09}
          distortionMap={texture}
          bumpMap={texture}
          bumpScale={0.045}
          depthScale={0.25}
          minDepthThreshold={0.6}
          maxDepthThreshold={1.4}
        />
      </mesh>
      {[-4.37, 4.37].map((x) => (
        <mesh key={x} position={[x, 0.07, 0]}>
          <boxGeometry args={[0.17, 0.2, 6.5]} />
          <meshStandardMaterial color="#d6c8aa" />
        </mesh>
      ))}
      {[-3.17, 3.17].map((z) => (
        <mesh key={z} position={[0, 0.07, z]}>
          <boxGeometry args={[8.8, 0.2, 0.17]} />
          <meshStandardMaterial color="#d6c8aa" />
        </mesh>
      ))}
    </group>
  );
}

export function Portal({
  at,
  width = 4.6,
  color = '#d7c7a9',
}: {
  at: V3;
  width?: number;
  color?: string;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const r = 1.55;
    s.moveTo(-width / 2, 0);
    s.lineTo(-r, 0);
    s.lineTo(-r, 2.8);
    s.absarc(0, 2.8, r, Math.PI, 0, true);
    s.lineTo(r, 0);
    s.lineTo(width / 2, 0);
    s.lineTo(width / 2, 6);
    s.lineTo(-width / 2, 6);
    s.closePath();
    return s;
  }, [width]);
  return (
    <group position={at}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.45,
              bevelEnabled: true,
              bevelSize: 0.04,
              bevelThickness: 0.04,
              bevelSegments: 2,
            },
          ]}
        />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      <mesh position={[0, 2.8, 0.5]}>
        <torusGeometry args={[1.58, 0.025, 8, 60, Math.PI]} />
        <meshStandardMaterial
          color="#a08a62"
          metalness={0.65}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

export function RoomAccents({
  index,
  reduced,
  night,
}: {
  index: number;
  reduced: boolean;
  night: boolean;
}) {
  const sculpture = useRef<THREE.Group>(null);
  const pendants = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (reduced) return;
    if (sculpture.current)
      sculpture.current.rotation.y = clock.elapsedTime * 0.12;
    if (pendants.current)
      pendants.current.rotation.z = Math.sin(clock.elapsedTime * 0.4) * 0.018;
  });
  const colors = [
    '#a46340',
    '#627057',
    '#486c70',
    '#b99555',
    '#71815d',
    '#ad7d42',
    '#977760',
  ];
  return (
    <group>
      <KineticCanopy reduced={reduced} index={index} />
      <LivingAtmosphere reduced={reduced} night={night} index={index} />
      <MovingCurtain reduced={reduced} />
      {/* Recessed ceiling with timber fins and warm indirect light. */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 6.79, 5.76, 0]}>
            <boxGeometry args={[0.055, 0.08, 15.7]} />
            <meshBasicMaterial color="#ffe5b5" />
          </mesh>
          {Array.from({ length: 18 }, (_, i) =>
            side === 1 &&
            -7.5 + i * 0.85 > -0.1 &&
            -7.5 + i * 0.85 < 3.7 ? null : (
              <mesh
                key={i}
                position={[side * 6.86, 3.1, -7.5 + i * 0.85]}
                castShadow
              >
                <boxGeometry args={[0.08, 5.8, 0.07]} />
                <meshStandardMaterial color="#a48b64" roughness={0.65} />
              </mesh>
            ),
          )}
        </group>
      ))}
      <group ref={pendants} position={[0, 5.7, -2.8]}>
        {[-1, 0, 1].map((x, i) => (
          <group key={x} position={[x * 1.8, 0, (i % 2) * 1.5]}>
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.009, 0.009, 1, 8]} />
              <meshStandardMaterial color="#5d513f" />
            </mesh>
            <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.68, 0.026, 10, 64]} />
              <meshStandardMaterial
                color="#e0bb7a"
                emissive="#ffd08a"
                emissiveIntensity={1.5}
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>
      <group position={[-6.7, 3.6, 0.7]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[4.2, 3.4]} />
          <meshStandardMaterial color="#d4c3a0" />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <circleGeometry args={[1.25, 64]} />
          <meshStandardMaterial color={colors[index]} />
        </mesh>
        <mesh position={[0.45, 0.25, 0.035]}>
          <circleGeometry args={[0.96, 64]} />
          <meshStandardMaterial color="#d4c3a0" />
        </mesh>
        {[-0.8, -0.4, 0, 0.4, 0.8].map((y) => (
          <mesh key={y} position={[0, y, 0.04]}>
            <boxGeometry args={[3.5, 0.012, 0.01]} />
            <meshStandardMaterial color="#9e8e70" />
          </mesh>
        ))}
      </group>
      {index !== 3 && (
        <group position={[5.8, 0, 2]}>
          <KineticSculpture
            at={[0, 0, 0]}
            scale={index === 5 ? 1.1 : 0.7}
            reduced={reduced}
            variant={index % 2}
          />
        </group>
      )}
      {index === 3 && (
        <group ref={sculpture} position={[0, 4.7, -3.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.45, 0.025, 8, 90]} />
            <meshStandardMaterial
              color="#d5b976"
              emissive="#b17e39"
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i * Math.PI) / 3) * 1.45,
                Math.sin(i * 2) * 0.2,
                Math.sin((i * Math.PI) / 3) * 1.45,
              ]}
            >
              <icosahedronGeometry args={[0.1, 1]} />
              <meshStandardMaterial
                color="#cfad67"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      )}
      {/* Long sunlight stripes make the window depth visible without extra lights. */}
      {!night &&
        Array.from({ length: 7 }, (_, i) => (
          <mesh
            key={i}
            position={[2 - i * 0.7, 0.026, 1]}
            rotation={[-Math.PI / 2, 0, -0.55]}
          >
            <planeGeometry args={[0.26, 7]} />
            <meshBasicMaterial
              color="#ffdf9c"
              transparent
              opacity={0.095}
              depthWrite={false}
            />
          </mesh>
        ))}
    </group>
  );
}

function KineticCanopy({
  reduced,
  index,
}: {
  reduced: boolean;
  index: number;
}) {
  const petals = useRef<THREE.InstancedMesh>(null);
  const phase = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, dt) => {
    if (!petals.current) return;
    if (!reduced) phase.current += dt;
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2 + phase.current * 0.1;
      const r = 1.45 + Math.sin(phase.current * 0.5 + i * 0.37) * 0.18;
      dummy.position.set(
        Math.cos(a) * r,
        Math.sin(a * 2 + phase.current * 0.75) * 0.3,
        Math.sin(a) * r,
      );
      dummy.rotation.set(
        Math.PI / 2 + Math.sin(phase.current * 0.6 + i * 0.4) * 0.5,
        a,
        phase.current * 0.15,
      );
      dummy.scale.set(0.12, 0.36, 0.015);
      dummy.updateMatrix();
      petals.current.setMatrixAt(i, dummy.matrix);
    }
    petals.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group position={[0, 4.6, -0.6]}>
      <instancedMesh ref={petals} args={[undefined, undefined, 22]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial
          color={index % 2 ? '#a88657' : '#cfb382'}
          metalness={0.8}
          roughness={0.28}
        />
      </instancedMesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.35, 0]}>
        <torusGeometry args={[1.46, 0.013, 8, 90]} />
        <meshStandardMaterial
          color="#b89b6c"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 1.1, 0.66, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.64, 5]} />
          <meshStandardMaterial color="#a48c65" />
        </mesh>
      ))}
    </group>
  );
}

function MovingCurtain({ reduced }: { reduced: boolean }) {
  const phase = useRef(0);
  const fabric = useMemo(() => new THREE.PlaneGeometry(1.25, 4.4, 18, 26), []);
  useEffect(() => () => fabric.dispose(), [fabric]);
  useFrame((_, dt) => {
    if (reduced && phase.current > 0) return;
    phase.current += dt;
    const p = fabric.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        loose = (2.2 - y) / 4.4;
      p.setZ(
        i,
        Math.sin(x * 23) * 0.09 +
          Math.sin(phase.current * 0.8 + y * 1.8 + x * 2) * 0.17 * loose,
      );
    }
    p.needsUpdate = true;
    fabric.computeVertexNormals();
  });
  return (
    <group position={[6.62, 3.25, 1.8]} rotation={[0, -Math.PI / 2, 0]}>
      {[-2.08, 2.08].map((x) => (
        <mesh key={x} geometry={fabric} position={[x, 0, 0]}>
          <meshStandardMaterial
            color="#e5dfd1"
            roughness={1}
            side={THREE.DoubleSide}
            transparent
            opacity={0.82}
          />
        </mesh>
      ))}
    </group>
  );
}
