'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Html, Image as DreiImage, RoundedBox, Sparkles, Text } from '@react-three/drei';
import { createContext, Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

export type RoomId = 'hub' | 'education' | 'experience' | 'projects' | 'skills' | 'achievements' | 'contact';

export type WorldItem = {
  eyebrow: string;
  title: string;
  body: string;
  link?: string;
  linkLabel?: string;
};

const InspectContext = createContext<(item: WorldItem) => void>(() => undefined);

export const roomData: Record<RoomId, {
  label: string;
  subtitle: string;
  color: string;
  accent: string;
  position: [number, number, number];
  camera: [number, number, number];
  look: [number, number, number];
}> = {
  hub: { label: 'The Dining Room', subtitle: 'Who I am', color: '#16233a', accent: '#f2bb62', position: [0, 0, 4], camera: [0, 1.72, 10.5], look: [0, 1.7, 3.5] },
  education: { label: 'Education Library', subtitle: 'The foundation', color: '#3b2c24', accent: '#e9c98a', position: [-13, 0, 0], camera: [-13, 1.7, 5.8], look: [-13, 1.8, 0] },
  experience: { label: 'Experience Office', subtitle: 'Ideas became impact', color: '#1f2937', accent: '#79b8ff', position: [13, 0, 0], camera: [13, 1.7, 5.8], look: [13, 1.8, 0] },
  projects: { label: 'GitHub Laboratory', subtitle: 'Ideas become systems', color: '#160f2c', accent: '#9d7cff', position: [0, 0, -10], camera: [0, 1.8, -3.8], look: [0, 1.8, -10] },
  skills: { label: 'Skills Workshop', subtitle: 'The toolbox', color: '#243226', accent: '#a9e087', position: [-13, 0, -14], camera: [-13, 1.7, -8.2], look: [-13, 1.7, -14] },
  achievements: { label: 'Achievement Gallery', subtitle: 'Milestones', color: '#302515', accent: '#ffd365', position: [13, 0, -14], camera: [13, 1.75, -8.2], look: [13, 1.75, -14] },
  contact: { label: 'Contact Lounge', subtitle: 'Leave a connection', color: '#17303a', accent: '#75d5cf', position: [0, 0, -25], camera: [0, 1.7, -19.2], look: [0, 1.6, -25] },
};

const experiences: WorldItem[] = [
  { eyebrow: '2023—2025 · 30+ INITIATIVES', title: 'Mindscape Communication', body: 'Junior Executive, Planning & Project Management. Structured briefs, timelines, content plans, presentations, deliverables, and client follow-up.' },
  { eyebrow: '2022—2023', title: 'Albeliz.com', body: 'Office Assistant, Admin. Maintained financial documentation, administrative records, and accurate web-content operations.' },
  { eyebrow: '2020—2021 · 250+ CLIENTS', title: 'Project Finance Solution', body: 'Communication Head, Admin. Managed client communication and logistics for more than 30 meetings.' },
  { eyebrow: '2020—2021', title: 'CrossRoads Initiative', body: 'Office Administrator. Supported operational activities, internal documentation, and daily coordination.' },
];

const projects: Array<WorldItem & { image?: string; language: string }> = [
  { eyebrow: 'SUPPLY CHAIN ANALYTICS', title: 'SCM Analytics Studio', body: 'A control tower for forecasting, inventory, procurement, logistics, risk, and management reporting.', language: 'Python', image: '/assets/scm-studio.png', link: 'https://github.com/Mah-era/scm-analytics-studio', linkLabel: 'Open repository' },
  { eyebrow: 'DEMAND PLANNING', title: 'ForecastSync', body: 'A guided file-to-forecast workflow with data validation, quality scoring, inventory recommendations, and risk maps.', language: 'TypeScript', image: '/assets/forecastsync.png', link: 'https://github.com/Mah-era/ForecastSync', linkLabel: 'Open repository' },
  { eyebrow: 'DISTRIBUTION OPERATIONS', title: 'SCM Distributor Management', body: 'An ERP-style operational interface spanning orders, inventory, transport, delivery, returns, and cost.', language: 'JavaScript', image: '/assets/distributor-management.png', link: 'https://github.com/Mah-era/scm-distributor-management', linkLabel: 'Open repository' },
  { eyebrow: 'BUSINESS INTELLIGENCE', title: 'InsightBI', body: 'A collaborative BI workspace for ingesting data, modelling relationships, building reports, and sharing insights.', language: 'TypeScript', image: '/assets/insightbi.png', link: 'https://github.com/Mah-era/insightbi', linkLabel: 'Open repository' },
  { eyebrow: 'PRODUCT × OPERATIONS', title: 'FruTea', body: 'A consumer concept connecting brand storytelling with demand, sourcing, inventory, and digital experience.', language: 'HTML', image: '/assets/frutea-site.webp', link: 'https://github.com/Mah-era/frutea', linkLabel: 'Open repository' },
  { eyebrow: 'LEARNING SIMULATION', title: 'Purrfect Supply Chain', body: 'A playable simulation of the bullwhip effect, demand variance, service level, and inventory decisions.', language: 'JavaScript', image: '/assets/purrfect-supply-chain.webp', link: 'https://github.com/Mah-era/cozy-cat-scm-bull-game', linkLabel: 'Open repository' },
  ...[
    ['save-farzu', 'Mini-game collection', 'HTML'], ['PawPaw-World-3D-v1', 'Archived 3D interactive world', 'JavaScript'], ['pawpaw-world', 'Canvas exploration game', 'HTML'], ['pawpaw-power-retro-game', 'Retro browser game', 'JavaScript'], ['scm-distributor-management-frontenddesign', 'Distribution interface concept', 'JavaScript'], ['finance-tracker', 'Personal finance tool', 'JavaScript'], ['cse-coursework', 'Programming coursework archive', 'Python'], ['moodtracker', 'Personal wellbeing tracker', 'JavaScript'], ['focusflow-planner', 'Productivity planning tool', 'JavaScript'],
  ].map(([title, body, language]) => ({ eyebrow: 'MEDIA & CASE STUDY PLACEHOLDER', title, body, language, link: `https://github.com/Mah-era/${title}`, linkLabel: 'Open repository' })),
];

function RoomShell({ room }: { room: RoomId }) {
  const data = roomData[room];
  const [x, , z] = data.position;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, -0.12, 0]} receiveShadow><boxGeometry args={[10, 0.2, 10]} /><meshStandardMaterial color={data.color} roughness={0.72} /></mesh>
      <mesh position={[0, 3.25, -4.9]} receiveShadow><boxGeometry args={[10, 6.5, 0.2]} /><meshStandardMaterial color={data.color} roughness={0.84} /></mesh>
      <mesh position={[-4.9, 3.25, 0]} receiveShadow><boxGeometry args={[0.2, 6.5, 10]} /><meshStandardMaterial color={data.color} roughness={0.84} /></mesh>
      <mesh position={[4.9, 3.25, 0]} receiveShadow><boxGeometry args={[0.2, 6.5, 10]} /><meshStandardMaterial color={data.color} roughness={0.84} /></mesh>
      <mesh position={[0, 6.4, 0]} receiveShadow><boxGeometry args={[10, 0.16, 10]} /><meshStandardMaterial color="#11141b" roughness={0.9} /></mesh>
      <pointLight position={[0, 4.7, 0]} intensity={16} distance={13} color={data.accent} castShadow />
      <mesh position={[0, 5.45, 0]}><cylinderGeometry args={[0.52, 0.72, 0.28, 24]} /><meshStandardMaterial color={data.accent} emissive={data.accent} emissiveIntensity={1.4} /></mesh>
      <Text position={[0, 4.9, -4.72]} fontSize={0.34} color={data.accent} anchorX="center">{data.label.toUpperCase()}</Text>
    </group>
  );
}

function FloatingDisplay({ position, rotation = [0, 0, 0], item, color, image, scale = 1 }: { position: [number, number, number]; rotation?: [number, number, number]; item: WorldItem; color: string; image?: string; scale?: number }) {
  const [hovered, setHovered] = useState(false);
  const onInspect = useContext(InspectContext);
  return (
    <Float speed={1.5} rotationIntensity={0.09} floatIntensity={0.22}>
      <group position={position} rotation={rotation} scale={scale} onClick={(event) => { event.stopPropagation(); onInspect(item); }} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }} userData={{ item }}>
        <RoundedBox args={[2.55, 1.62, 0.12]} radius={0.08} smoothness={4} castShadow>
          <meshStandardMaterial color={hovered ? color : '#111520'} emissive={color} emissiveIntensity={hovered ? 0.32 : 0.08} metalness={0.35} roughness={0.32} />
        </RoundedBox>
        {image ? <DreiImage url={image} position={[0, 0.12, 0.071]} scale={[2.3, 1.12]} transparent toneMapped={false} /> : (
          <group position={[0, 0.08, 0.072]}>
            <mesh><planeGeometry args={[2.28, 1.08]} /><meshBasicMaterial color={hovered ? '#1f2735' : '#171c27'} /></mesh>
            <Text position={[0, 0.12, 0.01]} fontSize={0.18} maxWidth={1.9} textAlign="center" color="#e8edf7">{item.title}</Text>
            <Text position={[0, -0.22, 0.01]} fontSize={0.08} maxWidth={1.8} textAlign="center" color={color}>{item.eyebrow}</Text>
          </group>
        )}
        <Text position={[0, -0.68, 0.073]} fontSize={0.09} color="#f8fafc" anchorX="center">{hovered ? 'CLICK TO INSPECT' : item.title.toUpperCase()}</Text>
      </group>
    </Float>
  );
}

function Portal({ position, rotation = [0, 0, 0], room, onEnter }: { position: [number, number, number]; rotation?: [number, number, number]; room: RoomId; onEnter: (room: RoomId) => void }) {
  const [hovered, setHovered] = useState(false);
  const data = roomData[room];
  return (
    <group position={position} rotation={rotation} onClick={(event) => { event.stopPropagation(); onEnter(room); }} onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}>
      <RoundedBox args={[2.3, 3.4, 0.24]} radius={0.08} smoothness={4} castShadow><meshStandardMaterial color={hovered ? data.accent : '#101622'} emissive={data.accent} emissiveIntensity={hovered ? 0.44 : 0.09} metalness={0.45} roughness={0.3} /></RoundedBox>
      <mesh position={[0, 0, 0.14]}><planeGeometry args={[1.85, 2.95]} /><meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.35} /></mesh>
      <Text position={[0, 0.2, 0.17]} fontSize={0.2} maxWidth={1.5} textAlign="center" color="#ffffff">{data.label.toUpperCase()}</Text>
      <Text position={[0, -0.18, 0.17]} fontSize={0.1} color={data.accent}>{hovered ? 'ENTER →' : data.subtitle.toUpperCase()}</Text>
    </group>
  );
}

function Hub({ onEnter, onInspect }: { onEnter: (room: RoomId) => void; onInspect: (item: WorldItem) => void }) {
  return (
    <group>
      <RoomShell room="hub" />
      <group position={[0, 0, 4]}>
        <RoundedBox args={[4.8, 0.22, 2.1]} radius={0.12} smoothness={4} position={[0, 1.02, 0]} castShadow><meshStandardMaterial color="#7d5336" roughness={0.38} /></RoundedBox>
        {[[-1.9, 0.48, -0.62], [1.9, 0.48, -0.62], [-1.9, 0.48, 0.62], [1.9, 0.48, 0.62]].map((p, i) => <mesh position={p as [number, number, number]} key={i} castShadow><boxGeometry args={[0.17, 0.95, 0.17]} /><meshStandardMaterial color="#4c3023" /></mesh>)}
        <FloatingDisplay position={[0, 2.25, -0.25]} rotation={[-0.12, 0, 0]} color="#f2bb62" scale={1.12} item={{ eyebrow: 'SUPPLY CHAIN · OPERATIONS · ANALYTICS', title: 'Mahera Tasfee', body: 'A systems-minded BBA candidate who combines commercial awareness, clear communication, analytical curiosity, and hands-on execution.' }} />
        <Portal position={[-3.55, 1.7, -4.72]} room="education" onEnter={onEnter} />
        <Portal position={[3.55, 1.7, -4.72]} room="experience" onEnter={onEnter} />
        <Portal position={[0, 1.7, -4.72]} room="projects" onEnter={onEnter} />
      </group>
    </group>
  );
}

function EducationRoom() {
  const items: WorldItem[] = [
    { eyebrow: 'EXPECTED 2026', title: 'North South University', body: 'Bachelor of Business Administration. Major in Supply Chain Management and Marketing.' },
    { eyebrow: '2025—PRESENT', title: 'Independent Research Exposure', body: 'Literature review and problem framing across FMCG, AIoT, RMG, operations, and supply-chain management.' },
    { eyebrow: 'FOUNDATION', title: 'Commercial + Operational Thinking', body: 'An interdisciplinary foundation connecting demand, marketing, information, resources, and execution.' },
  ];
  return <group>{<RoomShell room="education" />}{items.map((item, index) => <FloatingDisplay key={item.title} position={[-15.7 + index * 2.7, 2.15 + (index % 2) * 0.45, -0.8]} rotation={[0, 0.08 * (index - 1), 0]} item={item} color="#e9c98a" />)}</group>;
}

function ExperienceRoom() {
  return <group>{<RoomShell room="experience" />}{experiences.map((item, index) => <FloatingDisplay key={item.title} position={[10.6 + (index % 2) * 3.05, 1.75 + Math.floor(index / 2) * 1.95, -0.8]} rotation={[0, index % 2 ? -0.08 : 0.08, 0]} item={item} color="#79b8ff" scale={0.92} />)}</group>;
}

function ProjectsRoom() {
  return <group>{<RoomShell room="projects" />}{projects.map((item, index) => { const col = index % 5; const row = Math.floor(index / 5); return <FloatingDisplay key={item.title} position={[-3.75 + col * 1.88, 4.5 - row * 1.67, -14.35]} item={item} image={item.image} color="#9d7cff" scale={0.66} />; })}</group>;
}

function SkillsRoom() {
  const items: WorldItem[] = [
    { eyebrow: 'ANALYSE', title: 'Decision Intelligence', body: 'Excel, Power BI, data cleaning, forecasting, KPI reporting, and dashboard design.' },
    { eyebrow: 'OPERATE', title: 'Supply-Chain Thinking', body: 'Demand planning, process mapping, inventory logic, project coordination, and Notion workflows.' },
    { eyebrow: 'COMMUNICATE', title: 'Stakeholder Clarity', body: 'Client follow-up, presentations, structured documentation, debate, and team communication.' },
    { eyebrow: 'BUILD', title: 'Digital Prototyping', body: 'React, Next.js, TypeScript, Python, Streamlit, Pandas, SQL, and SQLite.' },
  ];
  return <group><RoomShell room="skills" />{items.map((item, index) => <FloatingDisplay key={item.title} position={[-15.4 + (index % 2) * 3.15, 1.85 + Math.floor(index / 2) * 2.05, -14.5]} item={item} color="#a9e087" scale={0.94} />)}</group>;
}

function AchievementRoom() {
  const items: WorldItem[] = [
    { eyebrow: 'LEADERSHIP · 2025—PRESENT', title: 'Vice President', body: 'North South University Debate Club. Tournament direction, team leadership, and competitive communication under pressure.' },
    { eyebrow: 'EXECUTION', title: '30+ Initiatives', body: 'Planned and coordinated digital marketing and content initiatives across corporate and development-sector clients.' },
    { eyebrow: 'COMMUNICATION', title: '250+ Client Interactions', body: 'Professional communication, structured follow-up, and meeting coordination at meaningful scale.' },
  ];
  return <group><RoomShell room="achievements" />{items.map((item, index) => <FloatingDisplay key={item.title} position={[10.2 + index * 2.8, 2.1 + (index === 1 ? 0.65 : 0), -14.4]} item={item} color="#ffd365" />)}</group>;
}

function ContactRoom() {
  const items: WorldItem[] = [
    { eyebrow: 'PROFESSIONAL NETWORK', title: 'LinkedIn', body: 'Connect for graduate, management trainee, supply-chain, planning, operations, and analytics opportunities.', link: 'https://www.linkedin.com/in/mahera-tasfee/', linkLabel: 'Open LinkedIn' },
    { eyebrow: 'SOURCE ARCHIVE', title: 'GitHub', body: 'Explore all public projects, prototypes, simulations, and experiments.', link: 'https://github.com/Mah-era', linkLabel: 'Open GitHub' },
    { eyebrow: 'LOCATION', title: 'Dhaka, Bangladesh', body: 'Available for graduate and management trainee opportunities in 2026.' },
  ];
  return <group><RoomShell room="contact" />{items.map((item, index) => <FloatingDisplay key={item.title} position={[-2.9 + index * 2.9, 2.2 + (index === 1 ? 0.5 : 0), -25.4]} item={item} color="#75d5cf" />)}</group>;
}

function CameraController({ room }: { room: RoomId }) {
  const keys = useRef<Record<string, boolean>>({});
  const offset = useRef(new THREE.Vector3());
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => { offset.current.set(0, 0, 0); }, [room]);
  useEffect(() => {
    const down = (event: KeyboardEvent) => { keys.current[event.key.toLowerCase()] = true; };
    const up = (event: KeyboardEvent) => { keys.current[event.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);
  useFrame((state, delta) => {
    const speed = delta * 2.2;
    if (keys.current.w || keys.current.arrowup) offset.current.z -= speed;
    if (keys.current.s || keys.current.arrowdown) offset.current.z += speed;
    if (keys.current.a || keys.current.arrowleft) offset.current.x -= speed;
    if (keys.current.d || keys.current.arrowright) offset.current.x += speed;
    offset.current.x = THREE.MathUtils.clamp(offset.current.x, -2.1, 2.1);
    offset.current.z = THREE.MathUtils.clamp(offset.current.z, -1.7, 1.7);
    const data = roomData[room];
    const destination = new THREE.Vector3(...data.camera).add(offset.current);
    state.camera.position.lerp(destination, 1 - Math.exp(-delta * 2.6));
    lookAt.set(data.look[0] + state.pointer.x * 1.65, data.look[1] + state.pointer.y * 0.95, data.look[2]);
    const direction = lookAt.clone().sub(state.camera.position).normalize();
    const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(), direction, new THREE.Vector3(0, 1, 0)));
    state.camera.quaternion.slerp(targetQuaternion, 1 - Math.exp(-delta * 3.8));
  });
  return null;
}

function World({ room, onEnter, onInspect }: { room: RoomId; onEnter: (room: RoomId) => void; onInspect: (item: WorldItem) => void }) {
  return (
    <InspectContext.Provider value={onInspect}>
      <color attach="background" args={['#070a10']} /><fog attach="fog" args={['#070a10', 15, 45]} />
      <ambientLight intensity={0.6} /><directionalLight position={[8, 12, 6]} intensity={1.4} color="#dce7ff" castShadow shadow-mapSize={[1024, 1024]} />
      <Sparkles count={90} scale={[42, 12, 48]} size={1.4} speed={0.25} opacity={0.22} color="#b9c9ff" />
      <Hub onEnter={onEnter} onInspect={onInspect} /><EducationRoom /><ExperienceRoom /><ProjectsRoom /><SkillsRoom /><AchievementRoom /><ContactRoom />
      <Portal position={[-8, 1.7, -5]} rotation={[0, Math.PI / 2, 0]} room="skills" onEnter={onEnter} />
      <Portal position={[8, 1.7, -5]} rotation={[0, -Math.PI / 2, 0]} room="achievements" onEnter={onEnter} />
      <Portal position={[0, 1.7, -19.8]} room="contact" onEnter={onEnter} />
      <ContactShadows position={[0, 0.01, 2]} opacity={0.45} scale={35} blur={2.4} far={15} />
      <CameraController room={room} />
    </InspectContext.Provider>
  );
}

export function PortfolioWorld({ room, onEnter, onInspect }: { room: RoomId; onEnter: (room: RoomId) => void; onInspect: (item: WorldItem) => void }) {
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: roomData.hub.camera, fov: 58, near: 0.1, far: 100 }} gl={{ antialias: true, powerPreference: 'high-performance' }} onPointerMissed={() => onInspect({ eyebrow: 'EXPLORE', title: roomData[room].label, body: roomData[room].subtitle })}>
      <Suspense fallback={<Html center><div className="world-loading">Building the house…</div></Html>}><World room={room} onEnter={onEnter} onInspect={onInspect} /></Suspense>
    </Canvas>
  );
}

export { projects };
