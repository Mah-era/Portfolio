'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';

type V3 = [number, number, number];

function Form({
  at = [0, 0, 0],
  scale = [1, 1, 1],
  color,
  rotation = [0, 0, 0],
}: {
  at?: V3;
  scale?: V3;
  color: string;
  rotation?: V3;
}) {
  return (
    <mesh
      position={at}
      scale={scale}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 20, 14]} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  );
}

function Limb({
  length,
  radius,
  color,
  at = [0, 0, 0],
}: {
  length: number;
  radius: number;
  color: string;
  at?: V3;
}) {
  return (
    <mesh position={at} castShadow>
      <capsuleGeometry
        args={[radius, Math.max(0.001, length - radius * 2), 6, 12]}
      />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function Thread({
  from,
  to,
  color,
  radius = 0.002,
}: {
  from: V3;
  to: V3;
  color: string;
  radius?: number;
}) {
  const a = useMemo(() => new THREE.Vector3(...from), [from]);
  const b = useMemo(() => new THREE.Vector3(...to), [to]);
  const midpoint = a.clone().add(b).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    b.clone().sub(a).normalize(),
  );
  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, a.distanceTo(b), 5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

const coatColor = (x: number, y: number, z: number) =>
  z < -0.22 && y > 0.48
    ? '#aa764f'
    : x > 0.18 && z < -0.16 && y < 0.49
      ? '#49483d'
      : '#ece2ce';

function FurCoat() {
  const tufts = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 40, 28);
    const p = g.attributes.position;
    const colors = new Float32Array(p.count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const nx = p.getX(i),
        ny = p.getY(i),
        nz = p.getZ(i);
      const x = nx * (0.25 + 0.018 * Math.cos(nz * 4));
      const y = ny * 0.244 + 0.43,
        z = nz * 0.48 - 0.04;
      p.setXYZ(i, x, y, z);
      color.set(coatColor(x, y, z));
      colors.set([color.r, color.g, color.b], i * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);

  useEffect(() => {
    if (!tufts.current) return;
    const dummy = new THREE.Object3D();
    const normal = new THREE.Vector3(),
      up = new THREE.Vector3(0, 1, 0);
    const color = new THREE.Color();
    for (let i = 0; i < 950; i++) {
      const y = 1 - (2 * (i + 0.5)) / 950,
        angle = i * 2.399963;
      const radius = Math.sqrt(1 - y * y);
      const nx = Math.cos(angle) * radius,
        nz = Math.sin(angle) * radius;
      const x = nx * 0.251,
        py = y * 0.244 + 0.43,
        z = nz * 0.477 - 0.04;
      normal.set(nx, y * 0.55 - 0.13, nz * 0.55).normalize();
      dummy.position.set(x, py, z);
      dummy.quaternion.setFromUnitVectors(up, normal);
      dummy.scale.set(1, 0.65 + (i % 7) * 0.12, 1);
      dummy.updateMatrix();
      tufts.current.setMatrixAt(i, dummy.matrix);
      tufts.current.setColorAt(i, color.set(coatColor(x, py, z)));
    }
    tufts.current.instanceMatrix.needsUpdate = true;
    if (tufts.current.instanceColor)
      tufts.current.instanceColor.needsUpdate = true;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <instancedMesh ref={tufts} args={[undefined, undefined, 950]}>
        <coneGeometry args={[0.004, 0.06, 4]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
    </group>
  );
}

function FluidTail({ reduced }: { reduced: boolean }) {
  const phase = useRef(0);
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1, 14, 36);
    g.deleteAttribute('uv');
    const colors = new Float32Array(g.attributes.position.count * 3);
    const color = new THREE.Color();
    for (let row = 0; row <= 36; row++) {
      for (let col = 0; col <= 14; col++) {
        color.set(
          row / 36 > 0.8 ? '#4e4a3c' : row / 36 > 0.4 ? '#b47f53' : '#946340',
        );
        colors.set([color.r, color.g, color.b], (row * 15 + col) * 3);
      }
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    if (!reduced) phase.current += dt;
    const liveGeometry = mesh.current.geometry;
    const p = liveGeometry.attributes.position;
    for (let row = 0; row <= 36; row++) {
      const t = row / 36;
      const radius = (0.045 + Math.sin(t * Math.PI) * 0.052) * (1 - t * 0.8);
      for (let col = 0; col <= 14; col++) {
        const angle = (col / 14) * Math.PI * 2;
        p.setXYZ(
          row * 15 + col,
          Math.sin(phase.current * 0.85 + t * 2.5) * 0.14 * t +
            Math.cos(angle) * radius,
          0.09 + Math.sin(t * 1.8) * 0.46 + Math.sin(angle) * radius,
          -t * 0.91,
        );
      }
    }
    p.needsUpdate = true;
    liveGeometry.computeVertexNormals();
  });

  return (
    <mesh ref={mesh} geometry={geometry} position={[0, 0.48, -0.43]} castShadow>
      <meshStandardMaterial
        vertexColors
        roughness={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function Calico({
  speed,
  reduced,
}: {
  speed: RefObject<number>;
  reduced: boolean;
}) {
  const legs = useRef<(THREE.Group | null)[]>([]);
  const head = useRef<THREE.Group>(null),
    body = useRef<THREE.Group>(null);
  const phase = useRef(0);
  useFrame((_, dt) => {
    if (reduced) return;
    phase.current += dt;
    const t = phase.current,
      walk = Math.min(1, speed.current / 0.5);
    legs.current.forEach((leg, i) => {
      if (leg)
        leg.rotation.x =
          Math.sin(t * 7 + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.32 * walk;
    });
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.8) * 0.18;
      head.current.rotation.x = Math.sin(t * 1.3) * 0.025;
    }
    if (body.current) {
      body.current.position.y = Math.sin(t * 14) * 0.006 * walk;
      body.current.rotation.z = Math.sin(t * 7) * 0.015 * walk;
    }
  });

  return (
    <group scale={0.9}>
      <group ref={body}>
        <FurCoat />
        <group ref={head} position={[0, 0.54, 0.43]}>
          <Form scale={[0.18, 0.17, 0.156]} color="#f1e8d7" />
          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh
                position={[side * 0.128, 0.157, -0.02]}
                rotation={[0, 0, -side * 0.25]}
                castShadow
              >
                <coneGeometry args={[0.075, 0.17, 3]} />
                <meshStandardMaterial
                  color={side < 0 ? '#775337' : '#ad7b55'}
                  roughness={1}
                />
              </mesh>
              <Form
                at={[side * 0.125, 0.168, 0.007]}
                scale={[0.037, 0.062, 0.01]}
                rotation={[0, 0, -side * 0.25]}
                color="#c99782"
              />
              <Form
                at={[side * 0.084, 0.022, 0.124]}
                scale={[0.077, 0.078, 0.034]}
                color="#35372c"
              />
              <Form
                at={[side * 0.069, 0.026, 0.154]}
                scale={[0.03, 0.031, 0.012]}
                color="#a9ac65"
              />
              <Form
                at={[side * 0.069, 0.026, 0.165]}
                scale={[0.009, 0.027, 0.006]}
                color="#20261e"
              />
              <Form
                at={[side * 0.062, 0.035, 0.17]}
                scale={[0.004, 0.006, 0.003]}
                color="#fff3d4"
              />
              <Form
                at={[side * 0.037, -0.055, 0.157]}
                scale={[0.054, 0.047, 0.027]}
                color="#f6edda"
              />
              {[-1, 0, 1].map((j) => (
                <Thread
                  key={j}
                  from={[side * 0.055, -0.064 + j * 0.009, 0.177]}
                  to={[side * 0.25, -0.053 + j * 0.038, 0.17]}
                  color="#c5c3ad"
                  radius={0.0015}
                />
              ))}
            </group>
          ))}
          <Form
            at={[0, 0.101, 0.092]}
            scale={[0.04, 0.07, 0.05]}
            color="#b27b50"
          />
          <Form
            at={[0, 0.006, 0.146]}
            scale={[0.027, 0.087, 0.025]}
            color="#efe6d0"
          />
          <Form
            at={[0, -0.054, 0.188]}
            scale={[0.025, 0.016, 0.012]}
            color="#b68f7d"
          />
        </group>
        <mesh position={[0, 0.48, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.144, 0.013, 8, 28]} />
          <meshStandardMaterial color="#796743" />
        </mesh>
        <Form
          at={[0, 0.365, 0.47]}
          scale={[0.026, 0.032, 0.018]}
          color="#b99d61"
        />
        <FluidTail reduced={reduced} />
      </group>
      {[-1, 1].flatMap((side, i) =>
        [-0.28, 0.27].map((z, j) => (
          <group
            key={side + ',' + z}
            ref={(el) => {
              legs.current[i * 2 + j] = el;
            }}
            position={[side * 0.155, 0.4, z]}
          >
            <Limb
              at={[0, -0.14, 0]}
              length={0.29}
              radius={0.067}
              color={i === 1 && j === 0 ? '#444236' : '#eee5d0'}
            />
            <Form
              at={[0, -0.33, 0.034]}
              scale={[0.078, 0.052, 0.106]}
              color="#eee5d0"
            />
          </group>
        )),
      )}
    </group>
  );
}
