'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const dhakaClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Dhaka',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function EntranceClock({
  night,
  at = [0, 5.2, 8.61],
  rotation = [0, 0, 0],
  scale = 1,
}: {
  night: boolean;
  at?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const [time, setTime] = useState(() => dhakaClock.format(new Date()));
  const ornament = useMemo(() => {
    const geometry: THREE.TubeGeometry[] = [];
    for (const side of [-1, 1])
      for (let layer = 0; layer < 11; layer++) {
        const points = Array.from({ length: 97 }, (_, i) => {
          const a = (i / 96) * Math.PI * 2;
          const r = 0.35 + layer * 0.028;
          return new THREE.Vector3(
            side * (1.16 + r * Math.cos(a) + 0.15 * Math.sin(a * 3)),
            r * 0.8 * Math.sin(a) + 0.17 * Math.cos(a * 2 + side),
            -0.025 - layer * 0.002,
          );
        });
        geometry.push(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(points, true),
            96,
            0.007,
            5,
            true,
          ),
        );
      }
    return geometry;
  }, []);
  useEffect(() => () => ornament.forEach((g) => g.dispose()), [ornament]);
  useEffect(() => {
    // Read wall-clock time each tick, never accumulate animation deltas. This also
    // catches up after sleep, tab throttling, or a change to the system clock.
    const sync = () => setTime(dhakaClock.format(new Date()));
    sync();
    const interval = window.setInterval(sync, 250);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('focus', sync);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('focus', sync);
    };
  }, []);
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return (
    <group position={at} rotation={rotation} scale={scale}>
      {ornament.map((geometry, i) => (
        <mesh key={i} geometry={geometry} castShadow>
          <meshStandardMaterial
            color="#242723"
            roughness={0.52}
            metalness={0.25}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.072]} castShadow>
        <circleGeometry args={[0.365, 96]} />
        <meshStandardMaterial color="#232622" roughness={0.7} />
      </mesh>
      {[0.466, 0.707].map((r) => (
        <mesh key={r} position={[0, 0, 0.08]} castShadow>
          <torusGeometry args={[r, r > 0.5 ? 0.016 : 0.007, 8, 96]} />
          <meshStandardMaterial
            color="#242723"
            metalness={0.3}
            roughness={0.48}
          />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => {
        const major = i % 3 === 0;
        return (
          <group key={i} rotation={[0, 0, (-i * Math.PI) / 6]}>
            <mesh position={[0, major ? 0.445 : 0.425, 0.084]}>
              <boxGeometry
                args={[major ? 0.025 : 0.012, major ? 0.135 : 0.09, 0.014]}
              />
              <meshStandardMaterial color={night ? '#c6bca8' : '#292c27'} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0.21, 0.088]}>
        <ringGeometry args={[0.075, 0.086, 48]} />
        <meshBasicMaterial color="#ccb899" />
      </mesh>
      <mesh position={[0, -0.21, 0.088]}>
        <ringGeometry args={[0.045, 0.054, 32]} />
        <meshBasicMaterial color="#ccb899" />
      </mesh>
      {[
        {
          angle: (((hours % 12) + minutes / 60 + seconds / 3600) * Math.PI) / 6,
          length: 0.43,
          width: 0.027,
          color: '#d3ae80',
        },
        {
          angle: ((minutes + seconds / 60) * Math.PI) / 30,
          length: 0.62,
          width: 0.018,
          color: '#d3ae80',
        },
        {
          angle: (seconds * Math.PI) / 30,
          length: 0.63,
          width: 0.005,
          color: '#b48256',
        },
      ].map((hand, i) => (
        <group key={i} rotation={[0, 0, -hand.angle]}>
          <mesh position={[0, hand.length / 2 - 0.035, 0.105 + i * 0.014]}>
            <boxGeometry args={[hand.width, hand.length, 0.01]} />
            <meshBasicMaterial color={hand.color} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0.151]}>
        <sphereGeometry args={[0.025, 16, 10]} />
        <meshStandardMaterial color="#c9ae74" metalness={0.7} />
      </mesh>
    </group>
  );
}

export function RoomDoor({
  index,
  reduced,
  onTravel,
}: {
  index: number;
  reduced: boolean;
  onTravel: () => void;
}) {
  const left = useRef<THREE.Group>(null),
    right = useRef<THREE.Group>(null);
  const requested = useRef(false);
  const leaf = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.03);
    s.lineTo(1.51, 0.03);
    s.lineTo(1.51, 4.21);
    s.absarc(1.51, 2.7, 1.51, Math.PI / 2, Math.PI, false);
    s.closePath();
    const glass = new THREE.Shape();
    glass.moveTo(0.19, 1.1);
    glass.lineTo(1.32, 1.1);
    glass.lineTo(1.32, 2.7 + Math.sqrt(1.32 ** 2 - 0.19 ** 2));
    glass.absarc(1.51, 2.7, 1.32, Math.acos(-0.19 / 1.32), Math.PI, false);
    glass.closePath();
    s.holes.push(new THREE.Path(glass.getPoints(32)));
    return { frame: s, glass };
  }, []);
  useFrame(({ camera }, dt) => {
    const distance = Math.abs(camera.position.z - (-8 - index * 16));
    if (distance > 13) requested.current = false;
    const target = distance < 9.5 || requested.current ? Math.PI * 0.53 : 0;
    if (!left.current || !right.current) return;
    // Doors react to the actual eye position in either direction, including
    // manual scrolling. The final clearance prevents fast scrolling clipping.
    let angle = reduced
      ? target
      : THREE.MathUtils.damp(left.current.rotation.y, target, 4, dt);
    if (distance < 2.5) angle = Math.max(angle, 1.5);
    left.current.rotation.y = angle;
    right.current.rotation.y = -angle;
  });
  return (
    <group
      position={[0, 0, -7.84]}
      onClick={(event) => {
        event.stopPropagation();
        requested.current = true;
        onTravel();
      }}
    >
      {[-1, 1].map((side) => (
        <group
          key={side}
          ref={side === -1 ? left : right}
          position={[side * 1.52, 0, 0]}
        >
          <group scale={[-side, 1, 1]}>
            <mesh castShadow receiveShadow>
              <extrudeGeometry
                args={[
                  leaf.frame,
                  {
                    depth: 0.12,
                    bevelEnabled: true,
                    bevelSize: 0.012,
                    bevelThickness: 0.012,
                    bevelSegments: 3,
                  },
                ]}
              />
              <meshStandardMaterial
                color={index % 2 ? '#766248' : '#8c7654'}
                roughness={0.56}
              />
            </mesh>
            <mesh position={[0, 0, 0.07]}>
              <shapeGeometry args={[leaf.glass]} />
              <meshPhysicalMaterial
                color="#b8c6ad"
                transparent
                opacity={0.17}
                roughness={0.24}
                metalness={0.12}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            {/* Fine reeding and real inset mouldings, rather than a flat slab. */}
            {Array.from({ length: 15 }, (_, i) => {
              const x = 0.23 + i * 0.074;
              const h =
                2.7 + Math.sqrt(Math.max(0, 1.3 ** 2 - (x - 1.51) ** 2)) - 1.16;
              return (
                <mesh key={i} position={[x, 1.13 + h / 2, 0.084]}>
                  <cylinderGeometry args={[0.006, 0.006, h, 5]} />
                  <meshPhysicalMaterial
                    color="#cbd1b7"
                    transparent
                    opacity={0.23}
                    roughness={0.25}
                  />
                </mesh>
              );
            })}
            {[0.1, 1.42].map((x) => (
              <mesh key={x} position={[x, 1.37, 0.135]}>
                <boxGeometry args={[0.027, 2.56, 0.022]} />
                <meshStandardMaterial color="#b39b70" roughness={0.52} />
              </mesh>
            ))}
            <mesh position={[0.76, 0.54, 0.128]}>
              <boxGeometry args={[1.19, 0.75, 0.03]} />
              <meshStandardMaterial color="#6f604b" roughness={0.75} />
            </mesh>
            {[-1, 1].map((side) => (
              <group key={side}>
                <mesh position={[0.76 + side * 0.58, 0.54, 0.16]}>
                  <boxGeometry args={[0.055, 0.77, 0.045]} />
                  <meshStandardMaterial color="#b19b77" />
                </mesh>
                <mesh position={[0.76, 0.54 + side * 0.36, 0.16]}>
                  <boxGeometry args={[1.18, 0.045, 0.045]} />
                  <meshStandardMaterial color="#b19b77" />
                </mesh>
              </group>
            ))}
            {[0.45, 2.25, 3].map((y) => (
              <mesh key={y} position={[0.025, y, 0.075]}>
                <cylinderGeometry args={[0.037, 0.037, 0.17, 12]} />
                <meshStandardMaterial
                  color="#baa073"
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
            ))}
            <mesh position={[1.41, 1.66, 0.144]}>
              <boxGeometry args={[0.084, 0.47, 0.027]} />
              <meshStandardMaterial
                color="#c4ab7d"
                metalness={0.7}
                roughness={0.25}
              />
            </mesh>
            <mesh position={[1.41, 1.65, 0.23]}>
              <capsuleGeometry args={[0.022, 0.31, 4, 8]} />
              <meshStandardMaterial
                color="#dac197"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

export function GardenSky({
  reduced,
  night,
}: {
  reduced: boolean;
  night: boolean;
}) {
  const group = useRef<THREE.Group>(null),
    clouds = useRef<THREE.Group>(null);
  const time = useRef(0);
  useFrame(({ camera }, dt) => {
    if (!reduced) time.current += Math.min(dt, 0.05);
    // Distant sky follows depth only, so it remains beyond every room's garden.
    if (group.current) group.current.position.z = camera.position.z - 18;
    clouds.current?.children.forEach((cloud, i) => {
      const layer = Math.floor(i / 6);
      cloud.position.x =
        -54 +
        ((i * 19 + layer * 11 + time.current * (0.14 + layer * 0.035)) % 120);
    });
  });
  return (
    <group ref={group}>
      <mesh position={[-18, 16, -26]} visible={!night}>
        <sphereGeometry args={[2.25, 32, 24]} />
        <meshBasicMaterial color="#ffe5b0" toneMapped={false} fog={false} />
      </mesh>
      <group position={[-18, 18, -26]} visible={night}>
        <mesh>
          <sphereGeometry args={[1.65, 32, 24]} />
          <meshBasicMaterial color="#d8e3e5" toneMapped={false} fog={false} />
        </mesh>
        {[
          [-0.5, 0.4, 1.48],
          [0.65, -0.2, 1.46],
          [-0.15, -0.8, 1.4],
        ].map((p, i) => (
          <mesh
            key={i}
            position={p as [number, number, number]}
            scale={[1, 0.75, 0.12]}
          >
            <sphereGeometry args={[0.18 + i * 0.05, 16, 10]} />
            <meshBasicMaterial color="#bccdd2" fog={false} />
          </mesh>
        ))}
      </group>
      <group ref={clouds}>
        {Array.from({ length: 18 }, (_, i) => (
          <group
            key={i}
            position={[
              -54 + ((i * 19 + Math.floor(i / 6) * 11) % 120),
              11 + (i % 4) * 3.1,
              -20 - Math.floor(i / 6) * 15,
            ]}
            scale={0.78 + (i % 5) * 0.09}
          >
            {Array.from({ length: 6 }, (_, j) => (
              <mesh
                key={j}
                position={[
                  (j - 2.5) * 2.1,
                  Math.sin(j * 1.9 + i) * 0.5,
                  Math.cos(j * 2.1),
                ]}
                scale={[3.3, 0.55 + (j % 3) * 0.24, 1.7]}
              >
                <sphereGeometry args={[1, 16, 10]} />
                <meshBasicMaterial
                  color={night ? '#637581' : '#f6eedc'}
                  transparent
                  opacity={night ? 0.13 : 0.3}
                  depthWrite={false}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
