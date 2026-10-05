'use client';

import { useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Calico } from './calico-resident';

type V3 = [number, number, number];
const skin = '#ad7755',
  hair = '#252522',
  linen = '#292d2a',
  trouser = '#252926';
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
      <sphereGeometry args={[1, 32, 24]} />
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
function SoftProfile({
  rings,
  color,
  at = [0, 0, 0],
  depth = 1,
}: {
  rings: [number, number][];
  color: string;
  at?: V3;
  depth?: number;
}) {
  const geometry = useMemo(() => {
    const curve = new THREE.SplineCurve(
      rings.map(([r, y]) => new THREE.Vector2(r, y)),
    );
    const g = new THREE.LatheGeometry(curve.getPoints(32), 32);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i),
        z = p.getZ(i);
      const fold = Math.sin(Math.atan2(z, x) * 9 + y * 11) * 0.025;
      p.setXYZ(i, x * (1 + fold), y, z * depth * (1 + fold));
    }
    g.computeVertexNormals();
    return g;
  }, [rings, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh position={at} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}
const shirtProfile: [number, number][] = [
  [0, 0.94],
  [0.197, 0.95],
  [0.211, 1.04],
  [0.185, 1.18],
  [0.215, 1.34],
  [0.214, 1.39],
  [0.18, 1.43],
  [0.074, 1.46],
  [0.063, 1.44],
];
const thighProfile: [number, number][] = [
  [0, 0.04],
  [0.095, 0.02],
  [0.106, -0.1],
  [0.101, -0.24],
  [0.087, -0.39],
  [0.085, -0.45],
  [0, -0.46],
];
const calfProfile: [number, number][] = [
  [0, 0.03],
  [0.087, 0.02],
  [0.086, -0.1],
  [0.088, -0.23],
  [0.095, -0.36],
  [0.092, -0.41],
  [0, -0.42],
];
function HairLocks() {
  const locks = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const a = (i / 48) * Math.PI * 1.62 + 0.56;
        return new THREE.CatmullRomCurve3([
          new THREE.Vector3(
            Math.sin(a) * 0.06,
            0.147,
            Math.cos(a) * 0.05 - 0.025,
          ),
          new THREE.Vector3(
            Math.sin(a) * 0.137,
            0.07,
            Math.cos(a) * 0.115 - 0.026,
          ),
          new THREE.Vector3(
            Math.sin(a) * 0.147,
            -0.058,
            Math.cos(a) * 0.109 - 0.035,
          ),
          new THREE.Vector3(
            Math.sin(a) * (0.143 + (i % 3) * 0.009),
            -0.15 - (i % 4) * 0.012,
            Math.cos(a) * 0.09 - 0.027,
          ),
        ]);
      }),
    [],
  );
  return (
    <group>
      {locks.map((curve, i) => (
        <mesh key={i} castShadow>
          <tubeGeometry args={[curve, 24, 0.008 + (i % 3) * 0.002, 8, false]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? '#34332b' : hair}
            roughness={0.82}
          />
        </mesh>
      ))}
    </group>
  );
}

function Mahera({
  speed,
  reduced,
}: {
  speed: React.RefObject<number>;
  reduced: boolean;
}) {
  const torso = useRef<THREE.Group>(null),
    head = useRef<THREE.Group>(null);
  const legs = useRef<(THREE.Group | null)[]>([]),
    arms = useRef<(THREE.Group | null)[]>([]),
    knees = useRef<(THREE.Group | null)[]>([]),
    elbows = useRef<(THREE.Group | null)[]>([]),
    ankles = useRef<(THREE.Group | null)[]>([]),
    eyes = useRef<(THREE.Group | null)[]>([]);
  const phase = useRef(0);
  useFrame(({ clock }, rawDt) => {
    if (reduced) return;
    const dt = Math.min(rawDt, 0.05);
    // Distance-driven steps keep the gait in sync with acceleration and arrival.
    phase.current += dt * speed.current * ((Math.PI * 2) / 0.72);
    const walk = Math.min(1, speed.current / 0.38),
      t = phase.current,
      idle = clock.elapsedTime;
    if (torso.current) {
      torso.current.position.y = (1 - Math.cos(t * 2)) * walk * 0.006;
      torso.current.rotation.z = Math.sin(t) * walk * 0.022;
      torso.current.rotation.y = Math.sin(t) * walk * 0.035;
      torso.current.scale.y = 1 + Math.sin(idle * 1.7) * 0.002;
    }
    if (head.current) {
      head.current.rotation.y = Math.sin(idle * 0.43) * 0.16;
      head.current.rotation.z = Math.sin(idle * 0.31) * 0.025;
      head.current.rotation.x = Math.sin(idle * 0.6) * 0.025;
    }
    const blink = idle % 4.7;
    eyes.current.forEach((eye) => {
      if (eye)
        eye.scale.y =
          blink < 0.17 ? Math.max(0.08, Math.abs(blink - 0.085) / 0.085) : 1;
    });
    legs.current.forEach((leg, i) => {
      const cycle = (t / (Math.PI * 2) + i * 0.5) % 1;
      const swing = Math.max(0, (cycle - 0.6) / 0.4);
      const forward =
        (cycle < 0.6 ? 1 - cycle / 0.3 : -Math.cos(swing * Math.PI)) *
        0.18 *
        walk;
      const lift = Math.sin(swing * Math.PI) * 0.07 * walk;
      const vertical = 0.846 - lift;
      const reach = Math.min(0.859, Math.hypot(vertical, forward));
      const knee =
        Math.PI -
        Math.acos(
          THREE.MathUtils.clamp(
            (0.43 ** 2 * 2 - reach ** 2) / (2 * 0.43 ** 2),
            -1,
            1,
          ),
        );
      const hip = Math.atan2(-forward, vertical) - knee / 2;
      if (leg)
        leg.rotation.x = THREE.MathUtils.damp(leg.rotation.x, hip, 18, dt);
      if (knees.current[i])
        knees.current[i]!.rotation.x = THREE.MathUtils.damp(
          knees.current[i]!.rotation.x,
          knee,
          18,
          dt,
        );
      if (ankles.current[i])
        ankles.current[i]!.rotation.x =
          -hip - knee + Math.sin(swing * Math.PI * 2) * 0.12 * walk;
      if (elbows.current[i])
        elbows.current[i]!.rotation.x =
          -0.15 - Math.max(0, Math.sin(t + i * Math.PI)) * 0.12 * walk;
    });
    arms.current.forEach((arm, i) => {
      if (arm)
        arm.rotation.x =
          Math.sin(t + i * Math.PI) * 0.24 * walk +
          Math.sin(idle * 0.7 + i) * 0.025;
    });
  });
  return (
    <group>
      <group ref={torso}>
        {/* Adult proportions and a simple charcoal outfit, informed by the supplied photo. */}
        <SoftProfile rings={shirtProfile} color={linen} depth={0.66} />
        <mesh
          position={[0, 1.452, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1, 0.72, 1]}
        >
          <torusGeometry args={[0.07, 0.008, 8, 40]} />
          <meshStandardMaterial color="#41433c" roughness={0.96} />
        </mesh>
        <Limb at={[0, 1.48, 0]} length={0.16} radius={0.063} color={skin} />
        <group ref={head} position={[0, 1.66, 0]}>
          <Form scale={[0.13, 0.18, 0.125]} color={skin} />
          <Form
            at={[0, -0.062, 0.028]}
            scale={[0.105, 0.11, 0.109]}
            color={skin}
          />
          <Form
            at={[0, 0.035, -0.055]}
            scale={[0.152, 0.19, 0.113]}
            color={hair}
          />
          <HairLocks />
          {[-1, 1].map((side) => (
            <group key={side}>
              <Form
                at={[side * 0.139, -0.033, -0.029]}
                scale={[0.047, 0.167, 0.103]}
                rotation={[0, 0, side * 0.1]}
                color={hair}
              />
              <Form
                at={[side * 0.112, -0.147, -0.047]}
                scale={[0.079, 0.082, 0.08]}
                rotation={[0, 0, side * -0.42]}
                color={hair}
              />
              <Form
                at={[side * 0.139, -0.046, 0.008]}
                scale={[0.022, 0.039, 0.025]}
                color={skin}
              />
              <mesh
                position={[side * 0.145, -0.086, 0.019]}
                rotation={[0, Math.PI / 2, 0]}
              >
                <torusGeometry args={[0.018, 0.003, 6, 18]} />
                <meshStandardMaterial
                  color="#cbae77"
                  metalness={0.65}
                  roughness={0.35}
                />
              </mesh>
              <group
                position={[side * 0.05, 0.005, 0.112]}
                ref={(el) => {
                  eyes.current[side < 0 ? 0 : 1] = el;
                }}
              >
                <Form
                  at={[0, 0, 0]}
                  scale={[0.026, 0.014, 0.011]}
                  color="#322820"
                />
                <Form
                  at={[-side * 0.002, 0.001, 0.009]}
                  scale={[0.009, 0.01, 0.006]}
                  color="#151914"
                />
                <Form
                  at={[-side * 0.005 + 0.003, 0.005, 0.013]}
                  scale={[0.003, 0.003, 0.002]}
                  color="#f7ead5"
                />
              </group>
              <Form
                at={[side * 0.05, 0.035, 0.112]}
                scale={[0.033, 0.007, 0.009]}
                rotation={[0, 0, -side * 0.12]}
                color={hair}
              />
            </group>
          ))}
          <Form
            at={[-0.045, 0.127, 0.039]}
            scale={[0.135, 0.077, 0.115]}
            rotation={[0, 0, 0.42]}
            color={hair}
          />
          <Form
            at={[-0.11, 0.065, 0.053]}
            scale={[0.065, 0.115, 0.075]}
            rotation={[0, 0, -0.42]}
            color={hair}
          />
          <Form
            at={[0.098, 0.102, 0.012]}
            scale={[0.063, 0.091, 0.107]}
            rotation={[0, 0, 0.35]}
            color={hair}
          />
          <Form
            at={[0, -0.03, 0.127]}
            scale={[0.021, 0.034, 0.025]}
            color="#b7805c"
          />
          <Form
            at={[0, -0.081, 0.12]}
            scale={[0.037, 0.012, 0.012]}
            color="#714735"
          />
          <Form
            at={[0, -0.076, 0.128]}
            scale={[0.023, 0.004, 0.003]}
            color="#edd8be"
          />
        </group>
        {[-1, 1].map((side, i) => (
          <group
            key={side}
            ref={(el) => {
              arms.current[i] = el;
            }}
            position={[side * 0.211, 1.38, 0]}
            rotation={[0, 0, side * 0.1]}
          >
            <Form
              at={[side * 0.015, -0.115, 0]}
              scale={[0.083, 0.157, 0.084]}
              color={linen}
            />
            <Limb
              at={[side * 0.024, -0.232, 0.005]}
              length={0.19}
              radius={0.048}
              color={skin}
            />
            <group
              ref={(el) => {
                elbows.current[i] = el;
              }}
              position={[side * 0.023, -0.285, 0]}
              rotation={[-0.15, 0, 0]}
            >
              <Form
                at={[0, -0.11, 0]}
                scale={[0.043, 0.143, 0.043]}
                color={skin}
              />
              <Form
                at={[0, -0.244, 0.002]}
                scale={[0.041, 0.059, 0.025]}
                color={skin}
              />
              {[0, 1, 2, 3].map((f) => (
                <Limb
                  key={f}
                  at={[
                    (f - 1.5) * 0.013,
                    -0.29 + Math.abs(f - 1.5) * 0.008,
                    0.006,
                  ]}
                  radius={0.009}
                  length={0.069 - Math.abs(f - 1.5) * 0.008}
                  color={skin}
                />
              ))}
              <Form
                at={[-side * 0.042, -0.247, 0.011]}
                rotation={[0, 0, side * 0.35]}
                scale={[0.014, 0.037, 0.017]}
                color={skin}
              />
              {i === 1 && (
                <mesh position={[0, -0.204, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.039, 0.007, 8, 24]} />
                  <meshStandardMaterial color="#cfbe98" roughness={0.55} />
                </mesh>
              )}
            </group>
          </group>
        ))}
      </group>
      {[-1, 1].map((side, i) => (
        <group
          key={side}
          ref={(el) => {
            legs.current[i] = el;
          }}
          position={[side * 0.105, 0.95, 0]}
        >
          <SoftProfile rings={thighProfile} color={trouser} depth={1.06} />
          <group
            ref={(el) => {
              knees.current[i] = el;
            }}
            position={[0, -0.43, 0]}
          >
            <SoftProfile rings={calfProfile} color={trouser} depth={0.93} />
            <group
              position={[0, -0.43, 0]}
              ref={(el) => {
                ankles.current[i] = el;
              }}
            >
              <Form
                at={[0, -0.003, 0.057]}
                scale={[0.083, 0.052, 0.138]}
                color="#a28c70"
              />
              <Form
                at={[0, -0.039, 0.054]}
                scale={[0.084, 0.014, 0.14]}
                color="#d2c4a7"
              />
              {[0, 1, 2, 3].map((lace) => (
                <Form
                  key={lace}
                  at={[0, 0.038 - lace * 0.003, 0.025 + lace * 0.024]}
                  scale={[0.049, 0.004, 0.004]}
                  color="#e8ddc8"
                  rotation={[0, lace % 2 ? 0.12 : -0.12, 0]}
                />
              ))}
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

// Routes stay in the open central area, clear of seating, wall exhibits and door frames.
const stops: V3[] = [
  [-2, -0, -4.8],
  [1.6, 0, -4.2],
  [2.25, 0, -1.4],
  [0.7, 0, 1.3],
  [-1.8, 0, 0.4],
  [-2.1, 0, -2.1],
];
function Walker({
  kind,
  active,
  reduced,
}: {
  kind: 'person' | 'cat';
  active: number;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null),
    speed = useRef(0),
    time = useRef(0);
  const goal = useRef(new THREE.Vector3()),
    pause = useRef(0),
    last = useRef(-1);
  const random = useRef(kind === 'person' ? 381 : 913);
  const directionRef = useRef(new THREE.Vector3());
  const select = useCallback(() => {
    random.current = (random.current * 1664525 + 1013904223) >>> 0;
    let i = random.current % stops.length;
    if (i === last.current) i = (i + 2) % stops.length;
    last.current = i;
    goal.current.set(...stops[i]);
    if (kind === 'person') goal.current.x *= 0.82;
    if (kind === 'cat') {
      goal.current.x *= 0.8;
      goal.current.z += 0.5;
    }
  }, [kind]);
  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(
        kind === 'person' ? -1.6 : 1.2,
        0,
        kind === 'person' ? -3.1 : -1.2,
      );
      ref.current.rotation.y = kind === 'person' ? 0.65 : -0.7;
    }
    select();
    pause.current = kind === 'person' ? 1.8 : 0;
  }, [active, kind, select]);
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const direction = directionRef.current;
    if (!ref.current || reduced) {
      speed.current = 0;
      return;
    }
    time.current += dt;
    if (pause.current > 0) {
      pause.current -= dt;
      speed.current = THREE.MathUtils.damp(speed.current, 0, 6, dt);
      return;
    }
    direction.copy(goal.current).sub(ref.current.position);
    direction.y = 0;
    if (direction.length() < 0.09) {
      select();
      pause.current =
        kind === 'person'
          ? 2.5 + (random.current % 25) / 10
          : 0.7 + (random.current % 13) / 10;
      return;
    }
    const desired = Math.atan2(direction.x, direction.z);
    const delta = Math.atan2(
      Math.sin(desired - ref.current.rotation.y),
      Math.cos(desired - ref.current.rotation.y),
    );
    speed.current = THREE.MathUtils.damp(
      speed.current,
      (kind === 'person'
        ? 0.4 * Math.min(1, direction.length() / 0.65)
        : 0.55) * Math.max(0.08, Math.cos(delta)),
      3,
      dt,
    );
    ref.current.rotation.y += delta * Math.min(1, dt * 3);
    ref.current.position.addScaledVector(
      direction.set(
        Math.sin(ref.current.rotation.y),
        0,
        Math.cos(ref.current.rotation.y),
      ),
      speed.current * dt,
    );
  });
  return (
    <group position={[0, 0.02, -active * 16]}>
      <group ref={ref}>
        {kind === 'person' ? (
          <Mahera speed={speed} reduced={reduced} />
        ) : (
          <Calico speed={speed} reduced={reduced} />
        )}
      </group>
    </group>
  );
}
export function Residents({
  active,
  reduced,
}: {
  active: number;
  reduced: boolean;
}) {
  return (
    <>
      <Walker kind="person" active={active} reduced={reduced} />
      <Walker kind="cat" active={active} reduced={reduced} />
    </>
  );
}
