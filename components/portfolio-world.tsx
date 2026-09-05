'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  Html,
  Image as SceneImage,
  RoundedBox,
  Sparkles,
  Text,
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
import {
  roomData,
  roomItems,
  roomOrder,
  type RoomId,
  type WorldItem,
} from '@/lib/portfolio-data';

type V3 = [number, number, number];
type WorldProps = {
  resetView: number;
  journey: RefObject<number>;
  chapter: number;
  reducedMotion: boolean;
  paused: boolean;
  onInspect: (item: WorldItem) => void;
  onTravel: (index: number) => void;
  onReady: () => void;
  onFallback: () => void;
};
const wood = '#69513f',
  cream = '#f0ece2',
  blue = '#414b4b';
const LookContext = createContext<RefObject<boolean> | null>(null);
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
      <meshStandardMaterial color={color} roughness={0.78} />
    </RoundedBox>
  ) : (
    <mesh position={at} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} />
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
        <meshStandardMaterial color={color} />
      </mesh>
      <Arch at={[0, 0, 0.3]} />
    </group>
  );
}
function Plant({
  at,
  scale = 1,
  color = '#677361',
  pot = '#969081',
}: {
  at: V3;
  scale?: number;
  color?: string;
  pot?: string;
}) {
  return (
    <group position={at} scale={scale}>
      <Cylinder
        at={[0, 0.35, 0]}
        radius={0.32}
        bottom={0.3}
        height={0.7}
        color={pot}
      />
      <Cylinder at={[0, 0.66, 0]} radius={0.335} height={0.1} color={pot} />
      <Cylinder at={[0, 1.3, 0]} radius={0.035} height={1.35} color="#566049" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <group
          key={i}
          position={[0, 0.87 + i * 0.2, 0]}
          rotation={[0, i * 2.4, 0.45]}
        >
          <Ball
            at={[0.24, 0.15, 0]}
            size={0.34}
            scale={[0.45, 1.6, 0.14]}
            color={i % 2 ? color : '#89917b'}
          />
        </group>
      ))}
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
  color = '#a69c87',
}: {
  at: V3;
  rotation?: V3;
  color?: string;
}) {
  return (
    <group position={at} rotation={rotation}>
      <Block
        at={[0, 0.54, 0]}
        size={[3.7, 0.5, 1.5]}
        round={0.08}
        color={color}
      />
      <Block
        at={[0, 1.15, -0.55]}
        size={[3.6, 1, 0.25]}
        round={0.07}
        color={color}
      />
      {[-1.65, 1.65].map((x) => (
        <Block
          key={x}
          at={[x, 0.85, 0]}
          size={[0.2, 0.65, 1.5]}
          round={0.05}
          color={color}
        />
      ))}
      {[-0.82, 0.82].map((x, i) => (
        <Block
          key={x}
          at={[x, 1.15, -0.22]}
          rotation={[0.16, 0, i ? 0.2 : -0.16]}
          size={[0.72, 0.64, 0.25]}
          round={0.13}
          color={i ? '#827c6b' : '#d8d2c2'}
        />
      ))}
      {[-1.3, 1.3].map((x) => (
        <Cylinder
          key={x}
          at={[x, 0.16, 0]}
          radius={0.08}
          height={0.3}
          color={wood}
        />
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
      <Block size={[3.6, 3.8, 0.08]} color="#444d48" />
      <mesh position={[0, 0, 0.048]}>
        <planeGeometry args={[3.45, 3.65]} />
        <meshStandardMaterial
          color="#b8c5c3"
          metalness={0.2}
          roughness={0.21}
        />
      </mesh>
      {[-0.58, 0.58].map((x) => (
        <Block
          key={x}
          at={[x, 0, 0.08]}
          size={[0.045, 3.68, 0.055]}
          color="#444d48"
        />
      ))}
      <Block at={[0, -0.58, 0.08]} size={[3.5, 0.045, 0.055]} color="#444d48" />
      <Block at={[0, -1.93, 0.13]} size={[3.75, 0.09, 0.34]} color="#d3d0c3" />
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
        speed={reduced ? 0 : 1.3}
        floatIntensity={reduced ? 0 : 0.055}
        rotationIntensity={0}
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
          {item.image ? (
            <Suspense fallback={null}>
              <SceneImage
                url={item.image}
                position={[0, 0.18, 0.092]}
                scale={small ? [1.82, 0.95] : [2.65, 1.45]}
                toneMapped={false}
              />
            </Suspense>
          ) : (
            <>
              <Text
                position={[0, small ? 0.16 : 0.25, 0.1]}
                fontSize={small ? 0.18 : 0.25}
                maxWidth={small ? 1.65 : 2.48}
                lineHeight={1.15}
                textAlign="center"
                color="#2e332f"
              >
                {item.title}
              </Text>
              <Text
                position={[0, small ? -0.35 : -0.42, 0.1]}
                fontSize={0.1}
                maxWidth={small ? 1.7 : 2.5}
                textAlign="center"
                color={accent}
              >
                {item.eyebrow}
              </Text>
            </>
          )}
          <Text
            position={[-(small ? 0.86 : 1.29), small ? -0.59 : -0.9, 0.105]}
            anchorX="left"
            fontSize={0.1}
            color={accent}
          >
            {String(index + 1).padStart(2, '0')}
          </Text>
          <Text
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
          </Text>
        </group>
      </Float>
    </group>
  );
}
function RoomShell({ room, index }: { room: RoomId; index: number }) {
  const data = roomData[room];
  return (
    <group>
      <Block at={[0, -0.17, 0]} size={[14, 0.3, 16]} color="#c6c1b4" />
      {Array.from({ length: 18 }, (_, i) => (
        <Block
          key={i}
          at={[-6.6 + i * 0.77, 0.002, 0]}
          size={[0.022, 0.006, 15.9]}
          color="#b4b0a4"
        />
      ))}
      {[-7, 7].map((x) => (
        <group key={x}>
          <Block at={[x, 3, 0]} size={[0.22, 6, 16]} color={data.color} />
          <Block
            at={[x * 0.985, 0.65, 0]}
            size={[0.25, 1.3, 16]}
            color={cream}
          />
          <Block
            at={[x * 0.977, 1.34, 0]}
            size={[0.3, 0.09, 16]}
            color="#c8c1b1"
          />
          {[-6, -3, 0, 3, 6].map((z) => (
            <group key={z}>
              <Block
                at={[x * 0.964, 0.66, z]}
                size={[0.03, 0.9, 2.6]}
                color="#cbc7bb"
              />
              <Block
                at={[x * 0.958, 0.66, z]}
                size={[0.03, 0.77, 2.42]}
                color={cream}
              />
            </group>
          ))}
        </group>
      ))}
      <ArchWall z={-8} color={data.color} />
      <Block at={[0, 6.05, 0]} size={[14, 0.12, 16]} color="#e8e4d9" />
      {room !== 'projects' && (
        <Window at={[6.83, 3.5, 1.8]} rotation={[0, -Math.PI / 2, 0]} />
      )}
      {room !== 'education' && room !== 'projects' && (
        <Window at={[-6.83, 3.5, 2.1]} rotation={[0, Math.PI / 2, 0]} />
      )}
      {[-5.1, 5.1].map((x) => (
        <Block
          key={x}
          at={[x, 5.9, 0]}
          size={[0.22, 0.28, 16]}
          color="#877660"
        />
      ))}
      <Text
        position={[0, 5.1, -7.63]}
        fontSize={0.25}
        letterSpacing={0.04}
        color={data.ink}
      >
        {index === 6
          ? 'THANK YOU FOR VISITING'
          : roomData[roomOrder[index + 1]].label.toUpperCase()}
      </Text>
      <pointLight
        position={[0, 4, 0]}
        color="#fff7e8"
        intensity={9}
        distance={15}
        decay={2}
      />
      {room !== 'skills' && (
        <group position={[0, 5.35, -2]}>
          <Cylinder
            at={[0, 0.4, 0]}
            radius={0.025}
            height={1}
            color="#99896c"
          />
          <mesh>
            <sphereGeometry args={[0.45, 24, 16]} />
            <meshStandardMaterial
              color="#e9e1cb"
              emissive="#fff4d9"
              emissiveIntensity={0.45}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.54, 0.065, 10, 32]} />
            <meshStandardMaterial color="#99896c" />
          </mesh>
        </group>
      )}
    </group>
  );
}
function Room({
  index,
  reduced,
  onInspect,
  onTravel,
}: {
  index: number;
  reduced: boolean;
  onInspect: (item: WorldItem) => void;
  onTravel: (index: number) => void;
}) {
  const room = roomOrder[index],
    data = roomData[room],
    items = roomItems[room];
  const suppressClick = useContext(LookContext);
  return (
    <group position={[0, 0, -index * 16]}>
      <RoomShell room={room} index={index} />
      <Rug
        at={[0, 0, -1]}
        color={room === 'hub' ? '#bcb7a7' : '#c6c1b3'}
        radius={2.65}
      />
      {room === 'hub' && (
        <>
          <Sofa at={[-4, 0.0, -1]} rotation={[0, 0.38, 0]} />
          <Table at={[-3.6, 0, 1.15]} round />
          <Flowers at={[-3.6, 0.89, 1.15]} />
          <Lamp at={[-5.7, 0, -3]} />
          <Plant at={[5.45, 0, 3.3]} scale={1.25} />
          <Shelf at={[6.6, 0, -3.8]} rotation={[0, -Math.PI / 2, 0]} />
          <Mobile at={[0, 5.5, -1]} reduced={reduced} />
        </>
      )}
      {room === 'education' && (
        <>
          <Shelf at={[-6.6, 0, -3.8]} rotation={[0, Math.PI / 2, 0]} />
          <Shelf at={[6.6, 0, -3.8]} rotation={[0, -Math.PI / 2, 0]} />
          <Sofa at={[-4.5, 0, 0.6]} color="#998775" rotation={[0, 0.7, 0]} />
          <Lamp at={[-5.8, 0, -2]} />
          <Table at={[4.5, 0, 0.2]} round />
          <Books at={[3.9, 0.87, 0.2]} count={4} />
          <Plant at={[5.7, 0, 3.7]} />
        </>
      )}
      {room === 'experience' && (
        <>
          <Table at={[-3.9, 0, -1]} />
          <Table at={[4, 0, -2]} />
          <Block
            at={[-3.9, 1.9, -1.3]}
            size={[2.4, 1.45, 0.15]}
            color={blue}
            round={0.1}
          />
          <Block
            at={[-3.9, 1.86, -1.2]}
            size={[2.16, 1.18, 0.03]}
            color="#bfc7c3"
          />
          <Books at={[2.5, 1.22, -2]} count={6} />
          <Lamp at={[-5.9, 0, 2.5]} color="#c0b59e" />
          <Plant at={[5.8, 0, 3.4]} pot={blue} />
        </>
      )}
      {room === 'projects' && (
        <>
          <Table at={[-4.4, 0, -1]} />
          <Table at={[4.4, 0, -1]} />
          <Mobile at={[0, 5.5, -2]} reduced={reduced} />
          <Plant at={[-5.7, 0, 4]} />
          <Plant at={[5.7, 0, 4]} pot={blue} />
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
          <Table at={[-4, 0, -1.1]} />
          <Flowers at={[-4, 1.23, -1.1]} />
          <Plant at={[-5.8, 0, 2.7]} scale={1.6} />
          <Plant at={[5.5, 0, 3.5]} scale={1.5} />
          <Plant at={[4.5, 0, -4.4]} scale={1.8} />
          <Shelf at={[-6.6, 0, -3.8]} rotation={[0, Math.PI / 2, 0]} />
          <mesh position={[0, 5.975, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5.2, 12]} />
            <meshBasicMaterial color="#e1e7e1" side={THREE.DoubleSide} />
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
                at={[x, 0.7, -1]}
                radius={0.68}
                height={1.4}
                color={cream}
              />
              <Cylinder
                at={[x, 1.48, -1]}
                radius={0.4}
                height={0.16}
                color="#998464"
              />
              <mesh position={[x, 2, -1]} rotation={[0, 0.4, 0.1]}>
                <torusKnotGeometry args={[0.3, 0.095, 64, 10]} />
                <meshStandardMaterial
                  color={i ? '#b6a17a' : '#60685f'}
                  metalness={0.4}
                  roughness={0.3}
                />
              </mesh>
            </group>
          ))}
          <Plant at={[5.8, 0, 4]} />
          <Lamp at={[-5.8, 0, 3.5]} />
        </>
      )}
      {room === 'contact' && (
        <>
          <Sofa at={[-4.4, 0, -0.8]} rotation={[0, 0.5, 0]} color="#b4ada0" />
          <Sofa at={[4.4, 0, -0.8]} rotation={[0, -0.5, 0]} color="#b4ada0" />
          <Table at={[-3.3, 0, 1.65]} round />
          <Flowers at={[-3.3, 0.87, 1.65]} color="#ddd2b9" />
          <Lamp at={[-5.8, 0, -4]} color="#c9bca2" />
          <Plant at={[5.8, 0, 3.8]} scale={1.4} />
        </>
      )}
      {items.map((item, i) => {
        const many = room === 'projects',
          side = i % 2 === 0 ? -1 : 1;
        const at: V3 = many
          ? i < 6
            ? [side * 4.3, 1.35 + Math.floor(i / 2) * 1.85, -7.42]
            : [side * 6.75, 2.55, 4.8 - Math.floor((i - 6) / 2) * 2.7]
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
          position={[0, 1.6, -7.7]}
          onClick={(e) => {
            e.stopPropagation();
            if (!suppressClick?.current) onTravel(index + 2);
          }}
        >
          <mesh>
            <ringGeometry args={[0.2, 0.24, 32]} />
            <meshBasicMaterial color={data.accent} transparent opacity={0.8} />
          </mesh>
          <Text position={[0, -0.47, 0.02]} fontSize={0.14} color={data.ink}>
            CONTINUE →
          </Text>
        </group>
      )}
    </group>
  );
}
function Exterior({
  journey,
  reduced,
}: {
  journey: RefObject<number>;
  reduced: boolean;
}) {
  const door = useRef<THREE.Group>(null);
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
      <Block at={[0, -0.48, 1]} size={[18, 0.55, 22]} color="#bbb7aa" />
      <Block at={[0, -0.16, 10.7]} size={[5.4, 0.15, 6]} color="#d7d3c7" />
      {[8.9, 10.1, 11.3, 12.5].map((z) => (
        <Block
          key={z}
          at={[0, -0.055, z]}
          size={[3.1, 0.08, 0.98]}
          color="#e5e1d5"
        />
      ))}
      {[-4.3, 4.3].map((x) => (
        <Block key={x} at={[x, 3, 8]} size={[5.4, 6, 0.32]} color="#dbd7cb" />
      ))}
      <Block at={[0, 5.45, 8]} size={[3.2, 1.1, 0.32]} color="#dbd7cb" />
      <Block at={[0, 6.15, 0]} size={[15.2, 0.32, 17.4]} color="#dedbd1" />
      <Block at={[0, 5.94, 8.5]} size={[15.2, 0.12, 0.48]} color="#6d6250" />
      <Block at={[0, 5.7, 9.15]} size={[5, 0.16, 2]} color="#797261" />
      <group position={[-1.58, 0, 8.19]} ref={door}>
        <Block at={[1.58, 2.45, 0]} size={[3.12, 4.9, 0.2]} color="#6e5943" />
        {Array.from({ length: 13 }, (_, i) => (
          <Block
            key={i}
            at={[0.13 + i * 0.235, 2.45, 0.11]}
            size={[0.015, 4.88, 0.018]}
            color="#524736"
          />
        ))}
        <Block at={[2.82, 2.1, 0.21]} size={[0.045, 1, 0.1]} color="#b7ae99" />
      </group>
      <Window at={[-4.45, 3.25, 8.2]} />
      <Window at={[4.45, 3.25, 8.2]} />
      <Text
        position={[-5.8, 0.75, 8.21]}
        anchorX="left"
        fontSize={0.21}
        letterSpacing={0.09}
        color="#595c53"
      >
        MAHERA TASFEE
      </Text>
      <Text
        position={[-5.8, 0.4, 8.21]}
        anchorX="left"
        fontSize={0.09}
        letterSpacing={0.08}
        color="#75786b"
      >
        SUPPLY CHAIN / OPERATIONS / ANALYTICS
      </Text>
      {[-6.2, 6.2].map((x) => (
        <group key={x}>
          <Block at={[x, 0.4, 10]} size={[1.8, 0.8, 1.35]} color="#8e8c7d" />
          <Plant
            at={[x, 0.75, 10]}
            scale={1.55}
            color="#69715d"
            pot="#8e8c7d"
          />
        </group>
      ))}
      <Block at={[5.1, 0.4, 12]} size={[2.7, 0.12, 0.7]} color="#8b7e68" />
      {[-0.9, 0.9].map((x) => (
        <Block
          key={x}
          at={[5.1 + x, 0.18, 12]}
          size={[0.09, 0.35, 0.6]}
          color="#55594d"
        />
      ))}
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
        yaw.current -= dx * 0.004;
        pitch.current = THREE.MathUtils.clamp(
          pitch.current - dy * 0.0035,
          -1.35,
          1.35,
        );
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
      const t = THREE.MathUtils.smoothstep(p, 0, 1);
      if (t < 0.6) {
        const a = t / 0.6;
        pos.set(12 * (1 - a), 9 - 6.8 * a, 21 - 10.5 * a);
      } else {
        const a = (t - 0.6) / 0.4;
        pos.set(0, 2.2 - 0.35 * a, 10.5 - 5 * a);
      }
      target.set(0, 2.25 - 0.4 * t, -1);
    } else {
      const span = p - 1,
        local = span - Math.floor(span),
        sway = reducedMotion ? 0 : Math.sin(local * Math.PI * 2) * 0.32;
      pos.set(sway, 1.85, 5.5 - span * 16).add(offset.current);
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
      const fov = state.size.width < 700 ? (p < 1 ? 57 : 72) : p < 1 ? 43 : 65;
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
  return (
    <LookContext.Provider value={suppressClick}>
      <color attach="background" args={['#ebe8df']} />
      <fog attach="fog" args={['#ebe8df', 25, 62]} />
      <ambientLight intensity={0.85} />
      <hemisphereLight color="#fff8e5" groundColor="#8c7051" intensity={1.3} />
      <primitive object={sunlightTarget} position={[0, 0, -active * 16]} />
      <directionalLight
        target={sunlightTarget}
        position={[8, 15, 12 - active * 16]}
        intensity={3}
        color="#fff4d9"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-normalBias={0.04}
      />
      {props.chapter < 2 && (
        <Exterior journey={props.journey} reduced={props.reducedMotion} />
      )}
      {roomOrder.map(
        (_, i) =>
          Math.abs(i - active) <= 2 && (
            <Room
              key={i}
              index={i}
              reduced={props.reducedMotion || props.paused}
              onInspect={props.onInspect}
              onTravel={props.onTravel}
            />
          ),
      )}
      {!props.reducedMotion && (
        <Sparkles
          count={22}
          scale={[13, 5, 22]}
          position={[0, 2, -active * 16]}
          size={1.3}
          speed={0.16}
          color="#fffdf3"
          opacity={0.25}
        />
      )}
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
function WebGLFallback({ onFallback }: { onFallback: () => void }) {
  useEffect(() => {
    onFallback();
  }, [onFallback]);
  return (
    <div className="webgl-fallback">
      Explore the portfolio through the room guide.
    </div>
  );
}
export function PortfolioWorld(props: WorldProps) {
  return (
    <WorldBoundary onFallback={props.onFallback}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [12, 9, 21], fov: 43, near: 0.08, far: 90 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        fallback={<WebGLFallback onFallback={props.onFallback} />}
      >
        <Suspense
          fallback={
            <Html center>
              <div className="scene-loading">Opening the front door…</div>
            </Html>
          }
        >
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </WorldBoundary>
  );
}
