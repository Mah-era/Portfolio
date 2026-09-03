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
  hub: { label: 'The Sunroom', subtitle: 'Meet Mahera', color: '#f7d8bb', accent: '#dd765a', position: [0, 0, 4], camera: [0, 1.72, 10.5], look: [0, 1.7, 3.5] },
  education: { label: 'The Reading Room', subtitle: 'Where curiosity grew', color: '#d9b899', accent: '#a05c45', position: [-13, 0, 0], camera: [-13, 1.7, 5.8], look: [-13, 1.8, 0] },
  experience: { label: 'The Blue Study', subtitle: 'Ideas became impact', color: '#b8d7de', accent: '#3e7c8a', position: [13, 0, 0], camera: [13, 1.7, 5.8], look: [13, 1.8, 0] },
  projects: { label: 'The Project Attic', subtitle: 'Ideas become systems', color: '#cfbee5', accent: '#7555a6', position: [0, 0, -10], camera: [0, 1.8, -3.8], look: [0, 1.8, -10] },
  skills: { label: 'The Garden Workshop', subtitle: 'Tools in practice', color: '#bed4b2', accent: '#527851', position: [-13, 0, -14], camera: [-13, 1.7, -8.2], look: [-13, 1.7, -14] },
  achievements: { label: 'The Golden Gallery', subtitle: 'Milestones with meaning', color: '#ecd59b', accent: '#b77930', position: [13, 0, -14], camera: [13, 1.75, -8.2], look: [13, 1.75, -14] },
  contact: { label: 'The Tea Lounge', subtitle: 'Stay for a conversation', color: '#b9ddd1', accent: '#33776d', position: [0, 0, -25], camera: [0, 1.7, -19.2], look: [0, 1.6, -25] },
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

function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}>
    <mesh position={[0, .32, 0]} castShadow><cylinderGeometry args={[.35, .25, .62, 18]} /><meshStandardMaterial color="#c87355" roughness={.8} /></mesh>
    <mesh position={[0, .9, 0]} castShadow><cylinderGeometry args={[.035, .055, 1.1, 10]} /><meshStandardMaterial color="#446d45" /></mesh>
    {[[-.28, .92, 0], [.3, 1.12, .05], [-.12, 1.35, .02], [.16, 1.55, 0]].map((p, i) => <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, i % 2 ? -.45 : .45]} castShadow><sphereGeometry args={[.28, 16, 12]} /><meshStandardMaterial color={i % 2 ? '#668c5b' : '#7ca66b'} roughness={.9} /></mesh>)}
  </group>;
}

function FloorLamp({ position, color = '#f3c570' }: { position: [number, number, number]; color?: string }) {
  return <group position={position}>
    <mesh position={[0, .08, 0]}><cylinderGeometry args={[.28, .34, .16, 24]} /><meshStandardMaterial color="#8c6248" /></mesh>
    <mesh position={[0, 1.4, 0]}><cylinderGeometry args={[.035, .04, 2.7, 12]} /><meshStandardMaterial color="#8c6248" /></mesh>
    <mesh position={[0, 2.72, 0]} castShadow><coneGeometry args={[.52, .82, 24, 1, true]} /><meshStandardMaterial color="#f7e5bd" side={THREE.DoubleSide} roughness={.8} /></mesh>
    <pointLight position={[0, 2.58, 0]} intensity={6} distance={5} color={color} />
  </group>;
}

function Bookshelf({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const colors = ['#d96f5f', '#e6b45c', '#5d8d89', '#8269a8', '#7e9d65'];
  return <group position={position} rotation={rotation}>
    <RoundedBox args={[2.55, 3.1, .48]} radius={.06} smoothness={3} position={[0, 1.55, 0]} castShadow><meshStandardMaterial color="#8a5a3c" roughness={.75} /></RoundedBox>
    {[.62, 1.4, 2.18].map((y, shelf) => <group key={y}>
      <mesh position={[0, y, .3]}><boxGeometry args={[2.28, .09, .58]} /><meshStandardMaterial color="#6e452f" /></mesh>
      {Array.from({ length: 8 }).map((_, i) => <mesh key={i} position={[-.94 + i * .27, y + .25, .34]} rotation={[0, 0, (i % 3 - 1) * .04]} castShadow><boxGeometry args={[.18 + (i % 2) * .04, .42 + (i % 3) * .08, .19]} /><meshStandardMaterial color={colors[(i + shelf) % colors.length]} roughness={.8} /></mesh>)}
    </group>)}
  </group>;
}

function Chair({ position, rotation = [0, 0, 0], color = '#d88767' }: { position: [number, number, number]; rotation?: [number, number, number]; color?: string }) {
  return <group position={position} rotation={rotation}>
    <RoundedBox args={[.9, .16, .86]} radius={.08} position={[0, .74, 0]} castShadow><meshStandardMaterial color={color} roughness={.82} /></RoundedBox>
    <RoundedBox args={[.9, .9, .14]} radius={.08} position={[0, 1.18, .36]} castShadow><meshStandardMaterial color={color} roughness={.82} /></RoundedBox>
    {[[-.33, .35, -.3], [.33, .35, -.3], [-.33, .35, .3], [.33, .35, .3]].map((p, i) => <mesh key={i} position={p as [number, number, number]}><cylinderGeometry args={[.035, .045, .7, 8]} /><meshStandardMaterial color="#6c4936" /></mesh>)}
  </group>;
}

function Sofa({ position, color }: { position: [number, number, number]; color: string }) {
  return <group position={position}>
    <RoundedBox args={[3.25, .55, 1.15]} radius={.2} position={[0, .55, 0]} castShadow><meshStandardMaterial color={color} roughness={.95} /></RoundedBox>
    <RoundedBox args={[3.2, 1.08, .38]} radius={.2} position={[0, 1.12, .4]} castShadow><meshStandardMaterial color={color} roughness={.95} /></RoundedBox>
    {[-1.5, 1.5].map(x => <RoundedBox key={x} args={[.34, .72, 1.18]} radius={.15} position={[x, .78, 0]} castShadow><meshStandardMaterial color={color} /></RoundedBox>)}
    {[-.7, .7].map((x, i) => <RoundedBox key={x} args={[.72, .45, .18]} radius={.12} position={[x, 1.17, -.03]}><meshStandardMaterial color={i ? '#f3d8a3' : '#e9a792'} /></RoundedBox>)}
  </group>;
}

function RoomShell({ room }: { room: RoomId }) {
  const data = roomData[room];
  const [x, , z] = data.position;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, -.13, 0]} receiveShadow><boxGeometry args={[10, .24, 10]} /><meshStandardMaterial color="#b88056" roughness={.84} /></mesh>
      {Array.from({ length: 14 }).map((_, i) => <mesh key={i} position={[-4.65 + i * .72, .005, 0]} receiveShadow><boxGeometry args={[.02, .02, 9.7]} /><meshStandardMaterial color="#8e6248" /></mesh>)}
      <mesh position={[0, 3.25, -4.9]} receiveShadow><boxGeometry args={[10, 6.5, .2]} /><meshStandardMaterial color={data.color} roughness={.92} /></mesh>
      <mesh position={[-4.9, 3.25, 0]} receiveShadow><boxGeometry args={[.2, 6.5, 10]} /><meshStandardMaterial color={data.color} roughness={.92} /></mesh>
      <mesh position={[4.9, 3.25, 0]} receiveShadow><boxGeometry args={[.2, 6.5, 10]} /><meshStandardMaterial color={data.color} roughness={.92} /></mesh>
      <mesh position={[0, 6.4, 0]} receiveShadow><boxGeometry args={[10, .16, 10]} /><meshStandardMaterial color="#fff4df" roughness={.95} /></mesh>
      <mesh position={[0, .23, -4.76]}><boxGeometry args={[9.6, .28, .12]} /><meshStandardMaterial color="#f8ecda" /></mesh>
      <RoundedBox args={[5.5, .06, 3.4]} radius={.1} position={[0, .02, -.3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><meshStandardMaterial color={data.accent} opacity={.32} transparent roughness={1} /></RoundedBox>
      <group position={[2.65, 3.28, -4.72]}>
        <mesh><planeGeometry args={[3.15, 2.55]} /><meshStandardMaterial color="#a9d8e8" emissive="#c7eaf2" emissiveIntensity={.25} /></mesh>
        <mesh position={[0, 0, .04]}><boxGeometry args={[.1, 2.7, .1]} /><meshStandardMaterial color="#fff3de" /></mesh>
        <mesh position={[0, 0, .04]}><boxGeometry args={[3.3, .1, .1]} /><meshStandardMaterial color="#fff3de" /></mesh>
        <mesh position={[0, 0, .05]}><ringGeometry args={[.32, .68, 32, 1, 0, Math.PI]} /><meshStandardMaterial color="#fff3de" /></mesh>
      </group>
      <mesh position={[0, 5.3, 0]}><cylinderGeometry args={[.03, .03, 1.5, 10]} /><meshStandardMaterial color="#74523e" /></mesh>
      <mesh position={[0, 4.55, 0]}><sphereGeometry args={[.18, 20, 20]} /><meshStandardMaterial color="#fff1bd" emissive="#ffd889" emissiveIntensity={2} /></mesh>
      <mesh position={[0, 4.82, 0]}><coneGeometry args={[.68, .55, 28, 1, true]} /><meshStandardMaterial color="#f8dfad" side={THREE.DoubleSide} /></mesh>
      <pointLight position={[0, 4.45, 0]} intensity={8} distance={10} color="#ffd99d" castShadow />
      <Text position={[-3.8, 5.35, -4.72]} fontSize={.28} color={data.accent} anchorX="left">{data.label}</Text>
      <Text position={[-3.8, 4.96, -4.72]} fontSize={.115} color="#5f5248" anchorX="left">{data.subtitle.toUpperCase()}</Text>
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
          <meshStandardMaterial color={hovered ? '#fff9ed' : '#f5ead8'} emissive={color} emissiveIntensity={hovered ? .12 : .025} metalness={0.02} roughness={0.6} />
        </RoundedBox>
        {image ? <DreiImage url={image} position={[0, 0.12, 0.071]} scale={[2.3, 1.12]} transparent toneMapped={false} /> : (
          <group position={[0, 0.08, 0.072]}>
            <mesh><planeGeometry args={[2.28, 1.08]} /><meshBasicMaterial color={hovered ? '#fffdf7' : '#fff8e9'} /></mesh>
            <Text position={[0, 0.12, 0.01]} fontSize={0.18} maxWidth={1.9} textAlign="center" color="#3f3630">{item.title}</Text>
            <Text position={[0, -0.22, 0.01]} fontSize={0.08} maxWidth={1.8} textAlign="center" color={color}>{item.eyebrow}</Text>
          </group>
        )}
        <Text position={[0, -0.68, 0.073]} fontSize={0.09} color="#57483e" anchorX="center">{hovered ? 'COME CLOSER' : item.title.toUpperCase()}</Text>
      </group>
    </Float>
  );
}

function Portal({ position, rotation = [0, 0, 0], room, onEnter }: { position: [number, number, number]; rotation?: [number, number, number]; room: RoomId; onEnter: (room: RoomId) => void }) {
  const [hovered, setHovered] = useState(false);
  const data = roomData[room];
  return (
    <group position={position} rotation={rotation} onClick={(event) => { event.stopPropagation(); onEnter(room); }} onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}>
      <RoundedBox args={[2.45, 3.55, .28]} radius={.18} smoothness={5} castShadow><meshStandardMaterial color="#8a5a3d" roughness={.72} /></RoundedBox>
      <RoundedBox args={[2.05, 3.12, .12]} radius={.14} smoothness={5} position={[0, 0, .18]}><meshStandardMaterial color={hovered ? '#fff2cd' : data.color} emissive={data.accent} emissiveIntensity={hovered ? .13 : .02} roughness={.84} /></RoundedBox>
      <mesh position={[.72, -.1, .31]}><sphereGeometry args={[.09, 18, 18]} /><meshStandardMaterial color="#d49b35" metalness={.5} roughness={.35} /></mesh>
      <Text position={[0, .25, .31]} fontSize={.18} maxWidth={1.5} textAlign="center" color="#4e4037">{data.label}</Text>
      <Text position={[0, -.12, .31]} fontSize={.09} color={data.accent}>{hovered ? 'OPEN THE DOOR →' : data.subtitle.toUpperCase()}</Text>
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
        <Chair position={[-2.8, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#d7846a" />
        <Chair position={[2.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#d7846a" />
        <Plant position={[4, 0, 2.9]} scale={1.15} />
        <FloorLamp position={[-4.05, 0, 2.85]} />
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
  return <group><RoomShell room="education" /><Bookshelf position={[-16.4, 0, 2.8]} /><Plant position={[-9.3, 0, 3.1]} /><FloorLamp position={[-10.1, 0, -2.6]} />{items.map((item, index) => <FloatingDisplay key={item.title} position={[-15.7 + index * 2.7, 2.15 + (index % 2) * 0.45, -0.8]} rotation={[0, 0.08 * (index - 1), 0]} item={item} color="#a05c45" />)}</group>;
}

function ExperienceRoom() {
  return <group><RoomShell room="experience" /><RoundedBox args={[3.4, .18, 1.4]} radius={.08} position={[13, .78, 2.1]} castShadow><meshStandardMaterial color="#8d6549" /></RoundedBox><Chair position={[13, 0, 3.15]} color="#5f8e97" /><Plant position={[16.5, 0, 2.8]} /><FloorLamp position={[9.25, 0, 2.8]} color="#ffe0a5" />{experiences.map((item, index) => <FloatingDisplay key={item.title} position={[10.6 + (index % 2) * 3.05, 1.75 + Math.floor(index / 2) * 1.95, -0.8]} rotation={[0, index % 2 ? -0.08 : 0.08, 0]} item={item} color="#3e7c8a" scale={0.92} />)}</group>;
}

function ProjectsRoom() {
  return <group><RoomShell room="projects" /><Plant position={[-4, 0, -6.7]} /><Plant position={[4, 0, -6.7]} scale={.8} /><FloorLamp position={[-4.1, 0, -12.6]} color="#d8bdff" />{projects.map((item, index) => { const col = index % 5; const row = Math.floor(index / 5); return <FloatingDisplay key={item.title} position={[-3.75 + col * 1.88, 4.5 - row * 1.67, -14.35]} item={item} image={item.image} color="#7555a6" scale={0.66} />; })}</group>;
}

function SkillsRoom() {
  const items: WorldItem[] = [
    { eyebrow: 'ANALYSE', title: 'Decision Intelligence', body: 'Excel, Power BI, data cleaning, forecasting, KPI reporting, and dashboard design.' },
    { eyebrow: 'OPERATE', title: 'Supply-Chain Thinking', body: 'Demand planning, process mapping, inventory logic, project coordination, and Notion workflows.' },
    { eyebrow: 'COMMUNICATE', title: 'Stakeholder Clarity', body: 'Client follow-up, presentations, structured documentation, debate, and team communication.' },
    { eyebrow: 'BUILD', title: 'Digital Prototyping', body: 'React, Next.js, TypeScript, Python, Streamlit, Pandas, SQL, and SQLite.' },
  ];
  return <group><RoomShell room="skills" /><Bookshelf position={[-16.6, 0, -10.8]} /><Plant position={[-9.4, 0, -11]} scale={1.2} /><RoundedBox args={[3.7, .22, 1.25]} radius={.1} position={[-13, .9, -11]}><meshStandardMaterial color="#8b6544" /></RoundedBox>{items.map((item, index) => <FloatingDisplay key={item.title} position={[-15.4 + (index % 2) * 3.15, 1.85 + Math.floor(index / 2) * 2.05, -14.5]} item={item} color="#527851" scale={0.94} />)}</group>;
}

function AchievementRoom() {
  const items: WorldItem[] = [
    { eyebrow: 'LEADERSHIP · 2025—PRESENT', title: 'Vice President', body: 'North South University Debate Club. Tournament direction, team leadership, and competitive communication under pressure.' },
    { eyebrow: 'EXECUTION', title: '30+ Initiatives', body: 'Planned and coordinated digital marketing and content initiatives across corporate and development-sector clients.' },
    { eyebrow: 'COMMUNICATION', title: '250+ Client Interactions', body: 'Professional communication, structured follow-up, and meeting coordination at meaningful scale.' },
  ];
  return <group><RoomShell room="achievements" /><Plant position={[9.2, 0, -10.7]} /><FloorLamp position={[16.7, 0, -10.8]} />{[10.2, 13, 15.8].map((x, i) => <group key={x}><mesh position={[x, .55, -13.9]}><cylinderGeometry args={[.52, .66, 1.1, 20]} /><meshStandardMaterial color="#f4ead7" /></mesh><mesh position={[x, 1.2, -13.9]} rotation={[0, 0, i % 2 ? .2 : -.2]}><dodecahedronGeometry args={[.34]} /><meshStandardMaterial color="#d7a240" metalness={.35} roughness={.35} /></mesh></group>)}{items.map((item, index) => <FloatingDisplay key={item.title} position={[10.2 + index * 2.8, 2.4 + (index === 1 ? 0.5 : 0), -14.4]} item={item} color="#b77930" scale={.9} />)}</group>;
}

function ContactRoom() {
  const items: WorldItem[] = [
    { eyebrow: 'PROFESSIONAL NETWORK', title: 'LinkedIn', body: 'Connect for graduate, management trainee, supply-chain, planning, operations, and analytics opportunities.', link: 'https://www.linkedin.com/in/mahera-tasfee/', linkLabel: 'Open LinkedIn' },
    { eyebrow: 'SOURCE ARCHIVE', title: 'GitHub', body: 'Explore all public projects, prototypes, simulations, and experiments.', link: 'https://github.com/Mah-era', linkLabel: 'Open GitHub' },
    { eyebrow: 'LOCATION', title: 'Dhaka, Bangladesh', body: 'Available for graduate and management trainee opportunities in 2026.' },
  ];
  return <group><RoomShell room="contact" /><Sofa position={[0, 0, -22.1]} color="#6e9f91" /><Plant position={[3.8, 0, -22]} scale={1.15} /><FloorLamp position={[-3.9, 0, -22]} color="#fff0b4" />{items.map((item, index) => <FloatingDisplay key={item.title} position={[-2.9 + index * 2.9, 2.45 + (index === 1 ? 0.5 : 0), -25.4]} item={item} color="#33776d" scale={.9} />)}</group>;
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
      <color attach="background" args={['#cce5ed']} /><fog attach="fog" args={['#dcebf0', 18, 47]} />
      <hemisphereLight intensity={1.35} color="#fff8e8" groundColor="#8f705f" /><ambientLight intensity={.65} /><directionalLight position={[8, 12, 9]} intensity={2.2} color="#fff1cc" castShadow shadow-mapSize={[1024, 1024]} />
      <Sparkles count={115} scale={[42, 12, 48]} size={1.8} speed={.3} opacity={.34} color="#fff3c4" />
      <Hub onEnter={onEnter} onInspect={onInspect} /><EducationRoom /><ExperienceRoom /><ProjectsRoom /><SkillsRoom /><AchievementRoom /><ContactRoom />
      <Portal position={[-8, 1.7, -5]} rotation={[0, Math.PI / 2, 0]} room="skills" onEnter={onEnter} />
      <Portal position={[8, 1.7, -5]} rotation={[0, -Math.PI / 2, 0]} room="achievements" onEnter={onEnter} />
      <Portal position={[0, 1.7, -19.8]} room="contact" onEnter={onEnter} />
      <ContactShadows position={[0, .01, 2]} opacity={.24} scale={35} blur={3} far={15} color="#644937" />
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
