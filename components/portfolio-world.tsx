'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  Html,
  RoundedBox,
  Environment,
  Lightformer,
} from '@react-three/drei';
import {
  Component,
  createContext,
  useContext,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import * as THREE from 'three';
import { Residents } from './residents';
import { LavenderForest } from './lavender-forest';
import { EntranceClock, GardenSky, RoomDoor } from './house-life';
import {
  roomData,
  roomItems,
  roomOrder,
  type RoomId,
  type WorldItem,
} from '@/lib/portfolio-data';

// Relative to the current document so the font works at localhost and under
// the GitHub Pages project path (/Portfolio/).
const sceneFont = './fonts/scene.woff2';
function SceneText(props: any) {
  // Troika's worker-based SDF text can fail on static Pages runtimes where
  // worker module scope has no window. Labels are duplicated in the accessible
  // HTML guide, so keep this visual layer non-blocking and worker-free.
  void props;
  return null;
}
import {
  KineticSculpture,
  Portal,
  ReflectingPool,
  RoomAccents,
} from './residence-details';

type V3 = [number, number, number];
type WorldProps = {
  compact: boolean;
  resetView: number;
  journey: RefObject<number>;
  chapter: number;
  reducedMotion: boolean;
  paused: boolean;
  night: boolean;
  onInspect: (item: WorldItem) => void;
  onTravel: (index: number) => void;
  onReady: () => void;
  onFallback: () => void;
};
const wood = '#947e60',
  cream = '#f0ece2',
  blue = '#414b4b';
const LookContext = createContext<RefObject<boolean> | null>(null);
// Small shared procedural surface: no downloaded textures or extra requests.
const surface = (() => {
  const pixels = new Uint8Array(64 * 64 * 4);
  for (let i = 0; i < 64 * 64; i++) {
    const n =
      180 + Math.floor(((Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1) * 35);
    pixels.set([n, n, n, 255], i * 4);
  }
  const texture = new THREE.DataTexture(pixels, 64, 64);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  texture.needsUpdate = true;
  return texture;
})();
function Block({
  at = [0, 0, 0],
  size,
  color,
  rotation = [0, 0, 0],
  round = 0,
  ...props
}: {
  at?: V3;
  size: V3;
  color: string;
  rotation?: V3;
  round?: number;
}) {
  return round ? (
    <RoundedBox
      position={at}
      args={size}
      radius={round}
      smoothness={3}
      rotation={rotation}
      castShadow
      receiveShadow
      {...props}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.72}
        bumpMap={surface}
        bumpScale={0.018}
      />
    </RoundedBox>
  ) : (
    <mesh position={at} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
        bumpMap={surface}
        bumpScale={0.025}
      />
    </mesh>
  );
}
function Ball({
  at,
  size = 1,
  color,
  scale = [1, 1, 1],
}: {
  at: V3;
  size?: number;
  color: string;
  scale?: V3;
}) {
  return (
    <mesh position={at} scale={scale} castShadow>
      <sphereGeometry args={[size, 20, 14]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}
function Cylinder({
  at,
  radius,
  height,
  color,
  bottom,
}: {
  at: V3;
  radius: number;
  height: number;
  color: string;
  bottom?: number;
}) {
  return (
    <mesh position={at} castShadow receiveShadow>
      <cylinderGeometry args={[radius, bottom ?? radius, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}
function Arch({ at, color = cream }: { at: V3; color?: string }) {
  return (
    <group position={at}>
      <mesh position={[0, 2.7, 0]} castShadow>
        <torusGeometry args={[1.68, 0.065, 10, 36, Math.PI]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[-1.72, 1.72].map((x) => (
        <Block
          key={x}
          at={[x, 1.35, 0]}
          size={[0.13, 2.7, 0.13]}
          color={color}
        />
      ))}
    </group>
  );
}
function ArchWall({ z, color }: { z: number; color: string }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-7, 0);
    s.lineTo(-1.58, 0);
    s.lineTo(-1.58, 2.7);
    s.absarc(0, 2.7, 1.58, Math.PI, 0, true);
    s.lineTo(1.58, 0);
    s.lineTo(7, 0);
    s.lineTo(7, 6);
    s.lineTo(-7, 6);
    s.closePath();
    return s;
  }, []);
  return (
    <group position={[0, 0, z]}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, { depth: 0.22, bevelEnabled: false }]} />
        <meshStandardMaterial
          color={color}
          roughness={0.92}
          bumpMap={surface}
          bumpScale={0.042}
        />
      </mesh>
      <Arch at={[0, 0, 0.3]} />
    </group>
  );
}
function Flowers({ at, color = '#d9d2bc' }: { at: V3; color?: string }) {
  return (
    <group position={at}>
      <Cylinder
        at={[0, 0.21, 0]}
        radius={0.2}
        bottom={0.14}
        height={0.42}
        color={blue}
      />
      {[0, 1, 2].map((i) => (
        <group
          key={i}
          position={[(i - 1) * 0.17, 0.4, 0]}
          rotation={[0, 0, (i - 1) * 0.2]}
        >
          <Cylinder
            at={[0, 0.3, 0]}
            radius={0.017}
            height={0.6}
            color="#69705a"
          />
          <Ball
            at={[0, 0.66, 0]}
            size={0.16}
            scale={[1, 1.4, 1]}
            color={i % 2 ? '#e0daca' : color}
          />
        </group>
      ))}
    </group>
  );
}
function Lamp({ at, color = '#dad2bc' }: { at: V3; color?: string }) {
  return (
    <group position={at}>
      <Cylinder at={[0, 0.08, 0]} radius={0.43} height={0.16} color="#3b3933" />
      <Cylinder at={[0, 1.55, 0]} radius={0.045} height={3} color="#82755b" />
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[0.54, 0.68, 32, 1, true]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <Ball at={[0, 2.83, 0]} size={0.18} color="#f6f0dd" />
      <pointLight
        position={[0, 2.75, 0]}
        color="#ffe0a5"
        intensity={3}
        distance={5}
      />
    </group>
  );
}
function Sofa({
  at,
  rotation = [0, 0, 0],
  color = '#d1bda0',
}: {
  at: V3;
  rotation?: V3;
  color?: string;
}) {
  const rail = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.8, 0.9, 0.6),
        new THREE.Vector3(-1.8, 1.4, -0.35),
        new THREE.Vector3(-1.3, 1.6, -0.72),
        new THREE.Vector3(0, 1.65, -0.78),
        new THREE.Vector3(1.3, 1.6, -0.72),
        new THREE.Vector3(1.8, 1.4, -0.35),
        new THREE.Vector3(1.8, 0.9, 0.6),
      ]),
    [],
  );
  const throwGeometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.83, 1.65, 18, 32);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      p.setZ(
        i,
        Math.sin(p.getX(i) * 28) * 0.014 + (y < -0.25 ? (y + 0.25) * 0.7 : 0),
      );
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => throwGeometry.dispose(), [throwGeometry]);
  return (
    <group position={at} rotation={rotation}>
      <Block
        at={[0, 0.42, 0]}
        size={[3.8, 0.2, 1.5]}
        color="#906b43"
        round={0.08}
      />
      {[-1.55, 1.55].map((x) =>
        [-0.5, 0.5].map((z) => (
          <mesh
            key={x + ',' + z}
            position={[x, 0.25, z]}
            rotation={[0, 0, -Math.sign(x) * 0.07]}
            castShadow
          >
            <cylinderGeometry args={[0.065, 0.095, 0.5, 12]} />
            <meshStandardMaterial color="#916b43" roughness={0.72} />
          </mesh>
        )),
      )}
      <mesh castShadow>
        <tubeGeometry args={[rail, 64, 0.065, 10, false]} />
        <meshStandardMaterial color="#ba945e" roughness={0.62} />
      </mesh>
      {Array.from({ length: 25 }, (_, i) => {
        const x = -1.6 + i * 0.134;
        return (
          <mesh
            key={i}
            position={[x, 1.09, -0.7 - Math.cos(x) * 0.03]}
            castShadow
          >
            <cylinderGeometry args={[0.018, 0.018, 1.03, 6]} />
            <meshStandardMaterial color="#a88654" roughness={0.9} />
          </mesh>
        );
      })}
      {Array.from({ length: 12 }, (_, i) => (
        <Block
          key={i}
          at={[0, 0.64 + i * 0.075, -0.71]}
          size={[3.3, 0.022, 0.022]}
          color={i % 2 ? '#c3a373' : '#b79562'}
        />
      ))}
      {[-1.79, 1.79].map((x) => (
        <group key={x}>
          <mesh
            position={[x, 0.87, 0]}
            rotation={[0, Math.PI / 2, 0]}
            castShadow
          >
            <torusGeometry args={[0.62, 0.052, 10, 40, Math.PI]} />
            <meshStandardMaterial color="#ba945e" roughness={0.65} />
          </mesh>
          {Array.from({ length: 10 }, (_, i) => (
            <mesh key={i} position={[x, 0.8, -0.53 + i * 0.117]}>
              <cylinderGeometry args={[0.013, 0.013, 0.66, 6]} />
              <meshStandardMaterial color="#c3a373" />
            </mesh>
          ))}
        </group>
      ))}
      {[-1.14, 0, 1.14].map((x, i) => (
        <group key={x}>
          <Block
            at={[x, 0.7, 0.07]}
            size={[1.1, 0.35, 1.25]}
            color="#e8ddc8"
            round={0.14}
          />
          <Block
            at={[x, 1.19, -0.42]}
            rotation={[-0.17, 0, (i - 1) * 0.045]}
            size={[1.06, 0.85, 0.29]}
            color={color}
            round={0.14}
          />
        </group>
      ))}
      {[-1.1, 1.05].map((x, i) => (
        <group
          key={x}
          position={[x, 1.13, -0.13]}
          rotation={[-0.15, 0, i ? 0.17 : -0.2]}
        >
          <Block
            size={[0.61, 0.61, 0.2]}
            color={i ? '#b46e48' : '#e9d9b8'}
            round={0.1}
          />
          {[-0.16, 0, 0.16].map((y) => (
            <Block
              key={y}
              at={[0, y, 0.106]}
              rotation={[0, 0, i ? 0.1 : -0.1]}
              size={[0.42, 0.026, 0.006]}
              color={i ? '#e3c5a0' : '#77644a'}
            />
          ))}
        </group>
      ))}
      <mesh
        geometry={throwGeometry}
        position={[-0.4, 0.93, 0.36]}
        rotation={[-Math.PI / 2, 0, 0.02]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#a56444"
          roughness={1}
          side={THREE.DoubleSide}
          bumpMap={surface}
          bumpScale={0.035}
        />
      </mesh>
      {Array.from({ length: 13 }, (_, i) => (
        <mesh
          key={i}
          position={[-0.78 + i * 0.06, 0.3, 0.89]}
          rotation={[0.12, 0, 0]}
        >
          <cylinderGeometry args={[0.007, 0.007, 0.19, 5]} />
          <meshStandardMaterial color="#bc8c67" />
        </mesh>
      ))}
    </group>
  );
}
function Books({ at, count = 8 }: { at: V3; count?: number }) {
  return (
    <group position={at}>
      {Array.from({ length: count }, (_, i) => (
        <Block
          key={i}
          at={[i * 0.21, 0.3 + (i % 3) * 0.035, 0]}
          size={[0.16, 0.6 + (i % 3) * 0.07, 0.36]}
          rotation={[0, 0, i === count - 1 ? -0.16 : 0]}
          color={['#a2957b', '#8b725b', '#58615e', '#8e9581', '#d4cabb'][i % 5]}
        />
      ))}
    </group>
  );
}
function Shelf({ at, rotation = [0, 0, 0] }: { at: V3; rotation?: V3 }) {
  return (
    <group position={at} rotation={rotation}>
      <Block at={[0, 2, 0]} size={[3.3, 4, 0.35]} color="#514332" />
      {[-1.6, 1.6].map((x) => (
        <Block key={x} at={[x, 2, 0.22]} size={[0.14, 4, 0.7]} color={wood} />
      ))}
      {[0.3, 1.25, 2.2, 3.15].map((y, i) => (
        <group key={y}>
          <Block at={[0, y, 0.23]} size={[3.3, 0.12, 0.75]} color="#957c5c" />
          <Books at={[-1.35, y + 0.06, 0.25]} count={i % 2 ? 10 : 12} />
        </group>
      ))}
    </group>
  );
}
function Table({ at, round = false }: { at: V3; round?: boolean }) {
  return (
    <group position={at}>
      {round ? (
        <Cylinder
          at={[0, 0.78, 0]}
          radius={1.1}
          height={0.16}
          color="#ab9e83"
        />
      ) : (
        <Block
          at={[0, 1.12, 0]}
          size={[3.9, 0.18, 1.5]}
          color="#74624d"
          round={0.08}
        />
      )}
      {(round ? [-0.5, 0.5] : [-1.5, 1.5]).map((x) => (
        <Block
          key={x}
          at={[x, 0.5, 0]}
          size={[0.15, 1, round ? 0.7 : 1.1]}
          color="#484436"
        />
      ))}
    </group>
  );
}
function Window({ at, rotation = [0, 0, 0] }: { at: V3; rotation?: V3 }) {
  return (
    <group position={at} rotation={rotation}>
      {[-1.82, 1.82].map((x) => (
        <Block key={x} at={[x, 0, 0]} size={[0.1, 3.9, 0.18]} color="#666f5b" />
      ))}
      {[-1.9, 1.9].map((y) => (
        <Block key={y} at={[0, y, 0]} size={[3.7, 0.1, 0.18]} color="#666f5b" />
      ))}
      <mesh position={[0, 0, 0.048]}>
        <planeGeometry args={[3.45, 3.65]} />
        <meshStandardMaterial
          color="#b8c5c3"
          metalness={0.2}
          roughness={0.21}
          transparent
          opacity={0.055}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {[0].map((x) => (
        <Block
          key={x}
          at={[x, 0, 0.08]}
          size={[0.045, 3.68, 0.055]}
          color="#444d48"
        />
      ))}
      <Block
        at={[0, -1.93, 0.19]}
        size={[3.86, 0.12, 0.48]}
        color="#b7a58b"
        round={0.025}
      />
      <group position={[-1.46, -1.85, 0.2]}>
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.13, 24, 16]} />
          <meshStandardMaterial color="#8c9381" roughness={0.8} />
        </mesh>
        <Cylinder
          at={[0, 0.3, 0]}
          radius={0.053}
          height={0.16}
          color="#8c9381"
        />
        {[-1, 0, 1].map((i) => (
          <group key={i} rotation={[i * 0.12, 0, i * 0.14]}>
            <Cylinder
              at={[0, 0.52, 0]}
              radius={0.006}
              height={0.44}
              color="#6f8064"
            />
            {[0, 1, 2].map((j) => (
              <Ball
                key={j}
                at={[(j % 2 ? 1 : -1) * 0.04, 0.43 + j * 0.09, 0]}
                size={0.035}
                scale={[1.3, 0.48, 0.7]}
                color="#7e8d72"
              />
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
function Rug({
  at,
  color,
  radius = 2.4,
}: {
  at: V3;
  color: string;
  radius?: number;
}) {
  return (
    <group position={at}>
      <Cylinder
        at={[0, 0.025, 0]}
        radius={radius}
        height={0.035}
        color={color}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.048, 0]}>
        <ringGeometry args={[radius - 0.18, radius - 0.12, 64]} />
        <meshStandardMaterial color={cream} />
      </mesh>
    </group>
  );
}
function Mobile({ at, reduced }: { at: V3; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current && !reduced)
      ref.current.rotation.y = clock.elapsedTime * 0.15;
  });
  return (
    <group position={at} ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.035, 8, 50]} />
        <meshStandardMaterial color="#a39372" metalness={0.5} roughness={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <group
          key={i}
          position={[Math.cos(i * 1.256) * 1.8, 0, Math.sin(i * 1.256) * 1.8]}
        >
          <Cylinder
            at={[0, -0.4 - (i % 2) * 0.15, 0]}
            radius={0.012}
            height={0.8 + (i % 2) * 0.3}
            color="#a39372"
          />
          <mesh position={[0, -0.92 - (i % 2) * 0.3, 0]} rotation={[0, 0, 0.4]}>
            <octahedronGeometry args={[0.22]} />
            <meshStandardMaterial
              color={['#9e957f', '#bbb199', '#696f66'][i % 3]}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
function Exhibit({
  at,
  rotation = [0, 0, 0],
  item,
  index,
  accent,
  reduced,
  onInspect,
  small = false,
}: {
  at: V3;
  rotation?: V3;
  item: WorldItem;
  index: number;
  accent: string;
  reduced: boolean;
  onInspect: (item: WorldItem) => void;
  small?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const suppressClick = useContext(LookContext);
  useEffect(
    () => () => {
      document.body.style.cursor = '';
    },
    [],
  );
  return (
    <group position={at} rotation={rotation}>
      <Float
        speed={reduced ? 0 : 1.7}
        floatIntensity={reduced ? 0 : 0.42}
        rotationIntensity={reduced ? 0 : 0.08}
      >
        <group
          scale={hover ? 1.035 : 1}
          onClick={(e) => {
            e.stopPropagation();
            if (!suppressClick?.current) onInspect(item);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHover(false);
            document.body.style.cursor = '';
          }}
        >
          <Block
            size={[small ? 2 : 2.9, small ? 1.48 : 2.15, 0.16]}
            color={hover ? '#e5dfcd' : cream}
            round={0.1}
          />
          <Block
            at={[0, 0, -0.1]}
            size={[small ? 2.12 : 3.04, small ? 1.6 : 2.3, 0.13]}
            color={accent}
            round={0.08}
          />
          {false ? (
            <>
              <SceneText
                position={[0, small ? 0.16 : 0.25, 0.1]}
                fontSize={small ? 0.18 : 0.25}
                maxWidth={small ? 1.65 : 2.48}
                lineHeight={1.15}
                textAlign="center"
                color="#2e332f"
              >
                {item.title}
              </SceneText>
              <SceneText
                position={[0, small ? -0.35 : -0.42, 0.1]}
                fontSize={0.1}
                maxWidth={small ? 1.7 : 2.5}
                textAlign="center"
                color={accent}
              >
                {item.eyebrow}
              </SceneText>
            </>
          ) : null}
          <SceneText
            position={[-(small ? 0.86 : 1.29), small ? -0.59 : -0.9, 0.105]}
            anchorX="left"
            fontSize={0.1}
            color={accent}
          >
            {String(index + 1).padStart(2, '0')}
          </SceneText>
          <SceneText
            position={[small ? 0.86 : 1.29, small ? -0.59 : -0.9, 0.105]}
            anchorX="right"
            fontSize={0.1}
            maxWidth={small ? 1.4 : 2.2}
            color="#66675e"
          >
            {hover
              ? 'OPEN STORY ↗'
              : item.image
                ? item.title
                : 'A CLOSER LOOK ↗'}
          </SceneText>
        </group>
      </Float>
    </group>
  );
}
function RoomShell({
  room,
  index,
  night,
}: {
  room: RoomId;
  index: number;
  night: boolean;
}) {
  const palettes = [
    '#d6d0c2',
    '#b8beb0',
    '#c9c8ba',
    '#d2cbbd',
    '#c1c5b7',
    '#d4ccbd',
    '#d3c8b9',
  ];
  const wall = palettes[index];
  return (
    <group>
      <mesh position={[0, -0.17, 0]} receiveShadow>
        <boxGeometry args={[14, 0.3, 16]} />
        <meshStandardMaterial
          color={index === 1 ? '#af9c7f' : '#c9c4b6'}
          roughness={0.72}
          metalness={0.02}
          bumpMap={surface}
          bumpScale={0.025}
        />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => (
        <Block
          key={i}
          at={[-7 + i * 2, 0, 0]}
          size={[0.012, 0.004, 16]}
          color="#b0a389"
        />
      ))}
      {[-6, -2, 2, 6].map((z) => (
        <Block
          key={z}
          at={[0, 0, z]}
          size={[14, 0.004, 0.012]}
          color="#b0a389"
        />
      ))}
      {[-7, 7].map((x) => (
        <group key={x}>
          {x < 0 ? (
            <Block at={[x, 3, 0]} size={[0.2, 6, 16]} color={wall} />
          ) : (
            <>
              <Block at={[x, 3, -4]} size={[0.2, 6, 8]} color={wall} />
              <Block at={[x, 3, 5.8]} size={[0.2, 6, 4.4]} color={wall} />
              <Block
                at={[x, 0.625, 1.8]}
                size={[0.2, 1.25, 3.6]}
                color={wall}
              />
              <Block
                at={[x, 5.525, 1.8]}
                size={[0.2, 0.95, 3.6]}
                color={wall}
              />
            </>
          )}
          <Block
            at={[x * 0.98, 0.15, 0]}
            size={[0.12, 0.3, 16]}
            color="#8c7857"
          />
          <Block at={[x * 0.98, 5.65, 0]} size={[0.32, 0.7, 16]} color={wall} />
        </group>
      ))}
      {index === 6 ? (
        <Block at={[0, 3, -7.89]} size={[14, 6, 0.22]} color={wall} />
      ) : (
        <ArchWall z={-8} color={wall} />
      )}
      {/* Deep layered reveal gives the corridor a rhythmic, architectural silhouette. */}
      {index < 6 && (
        <group position={[0, 0, -7.63]}>
          <Arch at={[0, 0, 0]} color="#655f51" />
          <Arch at={[0, 0, 0.16]} color="#d5cebd" />
        </group>
      )}
      <Block at={[-4.7, 6.03, 0]} size={[4.6, 0.15, 16]} color="#dbcbb0" />
      <Block at={[4.7, 6.03, 0]} size={[4.6, 0.15, 16]} color="#dbcbb0" />
      <mesh position={[0, 6.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.8, 16]} />
        <meshBasicMaterial
          color={night ? '#18282f' : '#d7ddd0'}
          side={THREE.DoubleSide}
        />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <Block
          key={i}
          at={[0, 5.99, -7.5 + i * 1.65]}
          size={[4.8, 0.12, 0.07]}
          color="#88765b"
        />
      ))}
      <Window at={[6.83, 3.15, 1.8]} rotation={[0, -Math.PI / 2, 0]} />
      {index < 6 && (
        <SceneText
          position={[0, 5.22, -7.6]}
          fontSize={0.18}
          letterSpacing={0.17}
          color="#6e604a"
        >
          {roomData[roomOrder[index + 1]].label.toUpperCase()}
        </SceneText>
      )}
      <SceneText
        position={[-6.15, 5.12, -7.58]}
        fontSize={0.45}
        color="#867355"
      >
        {String(index + 1).padStart(2, '0')}
      </SceneText>
      <pointLight
        position={[0, 4, 1]}
        color="#fff0cf"
        intensity={18}
        distance={17}
        decay={2}
      />
      <pointLight
        position={[-4, 3, -5]}
        color="#f7d49b"
        intensity={6}
        distance={8}
      />
    </group>
  );
}
function Room({
  index,
  reduced,
  night,
  onInspect,
  onTravel,
}: {
  index: number;
  reduced: boolean;
  night: boolean;
  onInspect: (item: WorldItem) => void;
  onTravel: (index: number) => void;
}) {
  const room = roomOrder[index],
    data = roomData[room],
    items = roomItems[room];
  const suppressClick = useContext(LookContext);
  return (
    <group position={[0, 0, -index * 16]}>
      <RoomShell room={room} index={index} night={night} />
      <RoomAccents index={index} reduced={reduced} night={night} />
      {index > 0 && (
        <group position={[0, 0.34, 0]}>
          <LavenderForest reduced={reduced} night={night} windowBed />
        </group>
      )}
      {index < 6 && (
        <RoomDoor
          index={index}
          reduced={reduced}
          onTravel={() => {
            if (!suppressClick?.current) onTravel(index + 2);
          }}
        />
      )}
      <Rug
        at={[0, 0, -1]}
        color={room === 'hub' ? '#bcb7a7' : '#c6c1b3'}
        radius={2.65}
      />
      {room === 'hub' && (
        <>
          <Sofa at={[-4, 0.0, -1]} rotation={[0, 0.38, 0]} />
          <Table at={[-3.6, 0, -2.2]} round />
          <Flowers at={[-3.6, 0.89, -2.2]} />
          <Lamp at={[-5.7, 0, -3]} />

          <Shelf at={[6.6, 0, -3.8]} rotation={[0, -Math.PI / 2, 0]} />
          <Mobile at={[0, 5.5, -1]} reduced={reduced} />
        </>
      )}
      {room === 'education' && (
        <>
          <Shelf at={[-6.6, 0, -3.8]} rotation={[0, Math.PI / 2, 0]} />
          <Shelf at={[6.6, 0, -3.8]} rotation={[0, -Math.PI / 2, 0]} />
          <Sofa at={[-4.5, 0, -2.8]} color="#998775" rotation={[0, 0.7, 0]} />
          <Lamp at={[-5.8, 0, -2]} />
          <Table at={[-3.8, 0, -0.9]} round />
          <Books at={[-4.4, 0.87, -0.9]} count={4} />
        </>
      )}
      {room === 'experience' && (
        <>
          <Table at={[-3.9, 0, -3.2]} />
          <Table at={[4, 0, -5.3]} />
          <Block
            at={[-3.9, 1.9, -3.5]}
            size={[2.4, 1.45, 0.15]}
            color={blue}
            round={0.1}
          />
          <Block
            at={[-3.9, 1.86, -3.4]}
            size={[2.16, 1.18, 0.03]}
            color="#bfc7c3"
          />
          <Books at={[2.5, 1.22, -5.3]} count={6} />
          <Lamp at={[-5.9, 0, -4.8]} color="#c0b59e" />
        </>
      )}
      {room === 'projects' && (
        <>
          <Table at={[-4.4, 0, -3.2]} />
          <Table at={[4.4, 0, -5.3]} />
          <Mobile at={[0, 5.5, -2]} reduced={reduced} />

          <Lamp at={[5.8, 0, -6]} color="#c2c7c3" />
          {[-6, -2, 2, 6].map((z) => (
            <Block
              key={z}
              at={[0, 5.85, z]}
              size={[14, 0.22, 0.22]}
              color={wood}
            />
          ))}
        </>
      )}
      {room === 'skills' && (
        <>
          <Table at={[-4, 0, -3.3]} />
          <Flowers at={[-4, 1.23, -3.3]} />

          <Shelf at={[-6.6, 0, -3.8]} rotation={[0, Math.PI / 2, 0]} />
          <mesh position={[0, 5.975, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5.2, 12]} />
            <meshBasicMaterial
              color={night ? '#18282f' : '#e1e7e1'}
              side={THREE.DoubleSide}
            />
          </mesh>
          {[-2.65, 2.65].map((x) => (
            <Block
              key={x}
              at={[x, 5.88, 0]}
              size={[0.1, 0.15, 12.2]}
              color="#747e6c"
            />
          ))}
          {[-6, 0, 6].map((z) => (
            <Block
              key={z}
              at={[0, 5.88, z]}
              size={[5.4, 0.15, 0.1]}
              color="#747e6c"
            />
          ))}
        </>
      )}
      {room === 'achievements' && (
        <>
          <Mobile at={[0, 5.5, -1]} reduced={reduced} />
          {[-4.6, 4.6].map((x, i) => (
            <group key={x}>
              <Cylinder
                at={[x, 0.7, -5.4]}
                radius={0.68}
                height={1.4}
                color={cream}
              />
              <Cylinder
                at={[x, 1.48, -5.4]}
                radius={0.4}
                height={0.16}
                color="#998464"
              />
              <mesh position={[x, 2, -5.4]} rotation={[0, 0.4, 0.1]}>
                <torusKnotGeometry args={[0.3, 0.095, 64, 10]} />
                <meshStandardMaterial
                  color={i ? '#b6a17a' : '#60685f'}
                  metalness={0.4}
                  roughness={0.3}
                />
              </mesh>
            </group>
          ))}

          <Lamp at={[-5.8, 0, -3.2]} />
        </>
      )}
      {room === 'contact' && (
        <>
          <Sofa at={[-4.4, 0, -4.2]} rotation={[0, 0.5, 0]} color="#b4ada0" />
          <Sofa at={[4.4, 0, -5.3]} rotation={[0, -0.5, 0]} color="#b4ada0" />
          <Table at={[-3.3, 0, -2]} round />
          <Flowers at={[-3.3, 0.87, -2]} color="#ddd2b9" />
          <Lamp at={[-5.8, 0, -4]} color="#c9bca2" />
        </>
      )}
      {items.map((item, i) => {
        const many = room === 'projects',
          side = i % 2 === 0 ? -1 : 1;
        const at: V3 = many
          ? i < 6
            ? [side * 4.3, 1.35 + Math.floor(i / 2) * 1.85, -7.42]
            : [
                side * 6.75,
                2.55,
                i === 9 ? 6.9 : 4.8 - Math.floor((i - 6) / 2) * 2.7,
              ]
          : [side * 4.3, 2.1 + Math.floor(i / 2) * 2.45, -7.4];
        const rotation: V3 =
          many && i >= 6 ? [0, (-side * Math.PI) / 2, 0] : [0, 0, 0];
        return (
          <Exhibit
            key={item.title}
            at={at}
            rotation={rotation}
            item={item}
            index={i}
            accent={data.accent}
            reduced={reduced}
            onInspect={onInspect}
            small={many}
          />
        );
      })}
      {index < 6 && (
        <group
          position={[0, 1.6, -7.59]}
          onClick={(e) => {
            e.stopPropagation();
            if (!suppressClick?.current) onTravel(index + 2);
          }}
        >
          <mesh>
            <ringGeometry args={[0.2, 0.24, 32]} />
            <meshBasicMaterial color={data.accent} transparent opacity={0.8} />
          </mesh>
          <SceneText
            position={[0, -0.47, 0.02]}
            fontSize={0.14}
            color={data.ink}
          >
            CONTINUE →
          </SceneText>
        </group>
      )}
      {index === 6 && (
        <group
          position={[0, 2.25, -7.58]}
          onClick={(event) => {
            event.stopPropagation();
            if (!suppressClick?.current) onTravel(0);
          }}
        >
          <mesh>
            <planeGeometry args={[3.1, 1.1]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <SceneText
            position={[0, 0, 0.01]}
            fontSize={0.38}
            letterSpacing={0.06}
            color="#42463b"
          >
            go front
          </SceneText>
        </group>
      )}
    </group>
  );
}
function Exterior({
  journey,
  reduced,
  night,
}: {
  journey: RefObject<number>;
  reduced: boolean;
  night: boolean;
}) {
  const door = useRef<THREE.Group>(null);
  const doorShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(3.04, 0);
    s.lineTo(3.04, 2.8);
    s.absarc(1.52, 2.8, 1.52, 0, Math.PI, false);
    s.lineTo(0, 0);
    return s;
  }, []);
  useFrame((_, dt) => {
    if (door.current)
      door.current.rotation.y = reduced
        ? journey.current > 0.12
          ? -1.65
          : 0
        : THREE.MathUtils.damp(
            door.current.rotation.y,
            journey.current > 0.12 ? -1.65 : 0,
            3,
            dt,
          );
  });
  return (
    <group>
      <EntranceClock night={night} />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.53, 4]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color={night ? '#7b8070' : '#d6ceb8'}
          roughness={0.95}
        />
      </mesh>
      <Block
        at={[0, -0.35, 4]}
        size={[22, 0.35, 26]}
        color="#c6b99a"
        round={0.12}
      />
      <Block
        at={[-3.3, -0.11, 11.5]}
        size={[8.8, 0.2, 9]}
        color="#dfd1b1"
        round={0.1}
      />
      {[13.6, 14.9, 16.2, 17.5].map((z, i) => (
        <Block
          key={z}
          at={[-3.3, -0.18 - i * 0.07, z]}
          size={[7.5 + i * 0.5, 0.16, 1.4]}
          color="#d8c9a8"
          round={0.06}
        />
      ))}
      <ReflectingPool reduced={reduced} night={night} />
      <KineticSculpture at={[5.6, 0, 13]} scale={1.4} reduced={reduced} />
      {[-4.6, 0, 4.6].map((x) => (
        <Portal key={x} at={[x, 0, 8]} />
      ))}
      {/* The outer portals are glazed; the central arch is the working front door. */}
      {[-4.6, 4.6].map((x) => (
        <group key={x} position={[x, 0, 8.15]}>
          <mesh position={[0, 2.25, 0]}>
            <planeGeometry args={[3.08, 4.5]} />
            <meshPhysicalMaterial
              color="#b7c5b6"
              transparent
              opacity={0.22}
              metalness={0.4}
              roughness={0.05}
              side={THREE.DoubleSide}
            />
          </mesh>
          {[-0.78, 0, 0.78].map((dx) => (
            <Block
              key={dx}
              at={[dx, 2.05, 0.3]}
              size={[0.035, 4.05, 0.04]}
              color="#6f715c"
            />
          ))}
          <Block
            at={[0, 1.15, 0.3]}
            size={[3.08, 0.035, 0.04]}
            color="#6f715c"
          />
        </group>
      ))}
      <group position={[-1.52, 0, 8.2]} ref={door}>
        <mesh castShadow>
          <extrudeGeometry
            args={[
              doorShape,
              {
                depth: 0.15,
                bevelEnabled: true,
                bevelSize: 0.025,
                bevelThickness: 0.025,
                bevelSegments: 2,
              },
            ]}
          />
          <meshStandardMaterial
            color="#775237"
            roughness={0.62}
            bumpMap={surface}
            bumpScale={0.045}
          />
        </mesh>
        {Array.from({ length: 16 }, (_, i) => {
          const x = 0.09 + i * 0.19;
          const h = 2.8 + Math.sqrt(Math.max(0, 1.52 ** 2 - (x - 1.52) ** 2));
          return (
            <Block
              key={i}
              at={[x, h / 2, 0.17]}
              size={[0.035, h - 0.03, 0.028]}
              color="#99734c"
            />
          );
        })}
        <mesh position={[2.67, 1.94, 0.26]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.18, 0.035, 10, 32, Math.PI * 1.65]} />
          <meshStandardMaterial
            color="#d9bb7c"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
      <Block
        at={[0, 6.13, 8.25]}
        size={[14.2, 0.24, 1]}
        color="#ded2b6"
        round={0.06}
      />
      <Block at={[0, 6.08, 0]} size={[14.4, 0.15, 16]} color="#c4b28e" />
      {/* A floating pergola, lifted clear of the masonry. */}
      {Array.from({ length: 24 }, (_, i) => (
        <Block
          key={i}
          at={[-7.3 + i * 0.635, 6.6, 6.4]}
          size={[0.13, 0.16, 6.2]}
          color="#92754f"
        />
      ))}
      {[-6.9, 6.9].map((x) => (
        <Block
          key={x}
          at={[x, 6.42, 6.4]}
          size={[0.12, 0.2, 6.3]}
          color="#b09a73"
        />
      ))}

      <group position={[-5, 0, 11.3]} rotation={[0, 0.25, 0]}>
        <Sofa at={[0, 0, 0]} color="#c8b898" />
        <Table at={[0.2, 0, 1.65]} round />
      </group>
      <SceneText
        position={[-3.12, 1.65, 8.5]}
        fontSize={0.3}
        letterSpacing={0.03}
        color="#725f43"
      >
        mt.
      </SceneText>
      <SceneText
        position={[-3.12, 1.22, 8.5]}
        fontSize={0.075}
        letterSpacing={0.12}
        color="#725f43"
      >
        THE RESIDENCE
      </SceneText>
      {[-2.3, 2.3].map((x) => (
        <group key={x} position={[x, 2.8, 8.54]}>
          <mesh>
            <capsuleGeometry args={[0.065, 0.52, 4, 12]} />
            <meshStandardMaterial
              color="#ffe3a6"
              emissive="#ffd08a"
              emissiveIntensity={2.3}
            />
          </mesh>
          <pointLight
            color="#ffc475"
            intensity={night ? 5 : 1.5}
            distance={5}
          />
        </group>
      ))}
      <pointLight
        position={[0, 3, 9.5]}
        color="#f2b56f"
        intensity={night ? 12 : 2}
        distance={16}
      />
    </group>
  );
}
function CameraRig({
  journey,
  paused,
  reducedMotion,
  onReady,
  resetView,
  suppressClick,
}: Pick<
  WorldProps,
  'journey' | 'paused' | 'reducedMotion' | 'onReady' | 'resetView'
> & { suppressClick: RefObject<boolean> }) {
  const { gl } = useThree();
  const eased = useRef(0),
    keys = useRef<Record<string, boolean>>({}),
    offset = useRef(new THREE.Vector3());
  const yaw = useRef(0),
    pitch = useRef(0);
  const input = useRef({
    inside: false,
    pressed: false,
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    distance: 0,
    touch: false,
    startX: 0,
    startY: 0,
    gesture: 'pending' as 'pending' | 'look' | 'scroll',
  });
  const pos = useMemo(() => new THREE.Vector3(), []),
    target = useMemo(() => new THREE.Vector3(), []),
    look = useMemo(() => new THREE.Vector3(0, 2, 0), []);
  const q = useMemo(() => new THREE.Quaternion(), []),
    m = useMemo(() => new THREE.Matrix4(), []),
    up = useMemo(() => new THREE.Vector3(0, 1, 0), []),
    zero = useMemo(() => new THREE.Vector3(), []);
  const previous = useRef(0);
  useEffect(() => {
    onReady();
  }, [onReady]);
  useEffect(() => {
    yaw.current = 0;
    pitch.current = 0;
    input.current.inside = false;
  }, [resetView]);
  useEffect(() => {
    const canvas = gl.domElement;
    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect(),
        v = input.current;
      v.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      v.y = 1 - ((e.clientY - rect.top) / rect.height) * 2;
      v.inside = true;
      if (v.pressed && !paused) {
        const dx = e.clientX - v.lastX,
          dy = e.clientY - v.lastY;
        v.distance += Math.abs(dx) + Math.abs(dy);
        if (v.distance > 5) {
          suppressClick.current = true;
          canvas.style.cursor = 'grabbing';
        }
        if (v.touch && v.gesture === 'pending') {
          const travelX = Math.abs(e.clientX - v.startX);
          const travelY = Math.abs(e.clientY - v.startY);
          if (Math.max(travelX, travelY) > 7)
            v.gesture = travelX > travelY ? 'look' : 'scroll';
        }
        // Vertical gestures remain native scrolling; only deliberate sideways
        // swipes engage the camera, so walking doesn't also tilt the room.
        if (!v.touch || v.gesture === 'look') {
          yaw.current -= dx * (v.touch ? 0.006 : 0.004);
          pitch.current = THREE.MathUtils.clamp(
            pitch.current - dy * 0.0035,
            -1.35,
            1.35,
          );
        }
      }
      v.lastX = e.clientX;
      v.lastY = e.clientY;
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType !== 'touch') return;
      Object.assign(input.current, {
        pressed: true,
        lastX: e.clientX,
        lastY: e.clientY,
        distance: 0,
        touch: e.pointerType === 'touch',
        startX: e.clientX,
        startY: e.clientY,
        gesture: 'pending',
      });
      suppressClick.current = false;
    };
    const release = () => {
      input.current.pressed = false;
      canvas.style.cursor = '';
    };
    const leave = () => {
      input.current.inside = false;
      release();
    };
    const keydown = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).closest(
          'input,textarea,select,button,a,[role="dialog"]',
        )
      )
        return;
      keys.current[e.key.toLowerCase()] = true;
    };
    const keyup = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    const reset = () => {
      keys.current = {};
      input.current.inside = false;
      release();
    };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointerleave', leave);
    canvas.addEventListener('pointercancel', reset);
    window.addEventListener('pointerup', release);
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    window.addEventListener('blur', reset);
    return () => {
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('pointercancel', reset);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      window.removeEventListener('blur', reset);
    };
  }, [gl, paused, suppressClick]);
  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05),
      wanted = journey.current;
    eased.current = reducedMotion
      ? wanted
      : THREE.MathUtils.damp(eased.current, wanted, 5, dt);
    const p = eased.current,
      moving = Math.abs(previous.current - p) > 0.001;
    previous.current = p;
    if (moving || paused) offset.current.lerp(zero, 1 - Math.exp(-dt * 5));
    if (moving) {
      yaw.current = Math.atan2(Math.sin(yaw.current), Math.cos(yaw.current));
      yaw.current = THREE.MathUtils.damp(yaw.current, 0, 6, dt);
      pitch.current = THREE.MathUtils.damp(pitch.current, 0, 6, dt);
    }
    if (!paused && p > 0.97 && !moving) {
      const v = input.current;
      // Holding near an edge continues the turn; dragging gives direct, unlimited 360° control.
      if (v.inside && !v.pressed && !v.touch && !reducedMotion) {
        const edgeX = Math.max(0, (Math.abs(v.x) - 0.72) / 0.28);
        const edgeY = Math.max(0, (Math.abs(v.y) - 0.8) / 0.2);
        yaw.current -= Math.sign(v.x) * edgeX * 1.25 * dt;
        pitch.current = THREE.MathUtils.clamp(
          pitch.current + Math.sign(v.y) * edgeY * 0.85 * dt,
          -1.35,
          1.35,
        );
      }
      const forward = (keys.current.w ? 1 : 0) - (keys.current.s ? 1 : 0),
        side = (keys.current.d ? 1 : 0) - (keys.current.a ? 1 : 0);
      offset.current.x +=
        (-Math.sin(yaw.current) * forward + Math.cos(yaw.current) * side) *
        dt *
        1.4;
      offset.current.z +=
        (-Math.cos(yaw.current) * forward - Math.sin(yaw.current) * side) *
        dt *
        1.4;
      offset.current.x = THREE.MathUtils.clamp(offset.current.x, -1.0, 1.0);
      offset.current.z = THREE.MathUtils.clamp(offset.current.z, -1.7, 0.8);
    }
    if (p < 1) {
      const portrait = state.size.width / state.size.height < 0.85;
      const t = THREE.MathUtils.smoothstep(p, 0, 1);
      if (t < 0.6) {
        const a = t / 0.6;
        const idle = reducedMotion
          ? 0
          : Math.sin(state.clock.elapsedTime * 0.13) * 0.65 * (1 - a);
        pos.set(
          (portrait ? 6 : 13) * (1 - a) + idle,
          (portrait ? 4.6 : 5.8) - (portrait ? 2.4 : 3.6) * a,
          (portrait ? 28 : 25) - (portrait ? 17.5 : 14.5) * a,
        );
      } else {
        const a = (t - 0.6) / 0.4;
        pos.set(0, 2.2 - 0.35 * a, 10.5 - 6.3 * a);
      }
      target.set(
        (portrait ? -1.2 : -3.6) * (1 - t),
        2.55 - 0.7 * t,
        7.5 - 8.5 * t,
      );
    } else {
      const span = p - 1,
        local = span - Math.floor(span),
        sway = reducedMotion ? 0 : Math.sin(local * Math.PI * 2) * 0.32;
      const breath =
        reducedMotion || paused
          ? 0
          : Math.sin(state.clock.elapsedTime * 0.7) * 0.012;
      pos.set(sway, 1.85 + breath, 4.2 - span * 16).add(offset.current);
      target.set(
        pos.x - Math.sin(yaw.current) * 10 * Math.cos(pitch.current),
        pos.y + Math.sin(pitch.current) * 10,
        pos.z - Math.cos(yaw.current) * 10 * Math.cos(pitch.current),
      );
    }
    state.camera.position.copy(pos);
    look.lerp(target, 1 - Math.exp(-dt * 12));
    m.lookAt(pos, look, up);
    q.setFromRotationMatrix(m);
    state.camera.quaternion.slerp(q, 1 - Math.exp(-dt * 12));
    if (state.camera instanceof THREE.PerspectiveCamera) {
      const narrow = state.size.width / state.size.height < 0.85;
      const fov = narrow ? (p < 1 ? 60 : 74) : p < 1 ? 48 : 68;
      state.camera.fov = THREE.MathUtils.damp(state.camera.fov, fov, 5, dt);
      state.camera.updateProjectionMatrix();
    }
  });
  return null;
}
function Scene(props: WorldProps) {
  const active = Math.max(0, props.chapter - 1);
  const sunlightTarget = useMemo(() => new THREE.Object3D(), []);
  const suppressClick = useRef(false);
  const sun = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const sky = useMemo(() => new THREE.Color(), []);
  const lightColor = useMemo(() => new THREE.Color(), []);
  useFrame((state, dt) => {
    sky.set(props.night ? '#223138' : '#dadcd1');
    if (state.scene.background instanceof THREE.Color)
      state.scene.background.lerp(sky, 1 - Math.exp(-dt * 2));
    if (state.scene.fog instanceof THREE.Fog)
      state.scene.fog.color.copy(state.scene.background as THREE.Color);
    if (sun.current) {
      lightColor.set(props.night ? '#a6c5eb' : '#ffe7bf');
      sun.current.color.lerp(lightColor, 1 - Math.exp(-dt * 2));
      sun.current.intensity = THREE.MathUtils.damp(
        sun.current.intensity,
        props.night ? 0.18 : 2.8,
        2,
        dt,
      );
    }
    if (ambient.current)
      ambient.current.intensity = THREE.MathUtils.damp(
        ambient.current.intensity,
        props.night ? 0.16 : 0.52,
        2,
        dt,
      );
  });
  return (
    <LookContext.Provider value={suppressClick}>
      <color attach="background" args={['#d8d8c4']} />
      <fog attach="fog" args={['#d8d8c4', 35, 95]} />
      <GardenSky
        reduced={props.reducedMotion || props.paused}
        night={props.night}
      />
      {props.chapter < 3 && (
        <LavenderForest
          reduced={props.reducedMotion || props.paused}
          night={props.night}
        />
      )}
      <ambientLight ref={ambient} intensity={0.7} />
      <hemisphereLight
        color={props.night ? '#91a6bb' : '#eaf0df'}
        groundColor={props.night ? '#55402d' : '#99704c'}
        intensity={props.night ? 0.22 : 0.85}
      />
      <group>
        <Lightformer
          form="rect"
          intensity={3}
          color="#fff0cd"
          scale={[12, 10, 1]}
          position={[-8, 8, 8]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#dbe8ec"
          scale={[10, 10, 1]}
          position={[8, 3, -4]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={2}
          color="#ffdf9b"
          scale={8}
          position={[0, 10, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
      <primitive object={sunlightTarget} position={[0, 0, -active * 16]} />
      <directionalLight
        ref={sun}
        target={sunlightTarget}
        position={[-9, 13, 15 - active * 16]}
        intensity={3.5}
        color="#ffe1a0"
        castShadow
        shadow-mapSize={props.compact ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-normalBias={0.04}
      />
      {props.chapter < 2 && (
        <Exterior
          journey={props.journey}
          reduced={props.reducedMotion || props.paused}
          night={props.night}
        />
      )}
      {roomOrder.map(
        (_, i) =>
          Math.abs(i - active) <= 1 && (
            <Room
              key={i}
              index={i}
              reduced={props.reducedMotion || props.paused}
              night={props.night}
              onInspect={props.onInspect}
              onTravel={props.onTravel}
            />
          ),
      )}
      <group visible={active <= 1}>
        <Residents
          active={0}
          reduced={props.reducedMotion || props.paused || active > 1}
        />
      </group>
      <CameraRig {...props} suppressClick={suppressClick} />
    </LookContext.Provider>
  );
}
class WorldBoundary extends Component<
  { children: ReactNode; onFallback: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFallback();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function WebGLFallback() {
  return (
    <div className="webgl-fallback">
      Explore the portfolio through the room guide.
    </div>
  );
}
export function PortfolioWorld(props: WorldProps) {
  return (
    <WorldBoundary onFallback={props.onFallback}>
      <div className="world-access-fallback" aria-hidden="true">
        <span>Interactive residence</span>
        <strong>Use the room guide below to explore Mahera’s work.</strong>
        <small>
          WebGL is unavailable in this browser, so the accessible portfolio
          guide is active.
        </small>
      </div>
      <Canvas
        shadows="percentage"
        dpr={props.compact ? 1 : [1, 1.5]}
        camera={{ position: [13, 5.8, 25], fov: 48, near: 0.08, far: 150 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        fallback={<WebGLFallback />}
      >
        <Scene {...props} />
      </Canvas>
    </WorldBoundary>
  );
}
