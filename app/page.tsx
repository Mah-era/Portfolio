'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Compass, GitBranch, Info, Map, MousePointer2, Move, Network, X } from 'lucide-react';
import gsap from 'gsap';
import { PortfolioWorld, roomData, type RoomId, type WorldItem } from '@/components/portfolio-world';

const roomOrder: RoomId[] = ['hub', 'education', 'experience', 'projects', 'skills', 'achievements', 'contact'];

const roomNumbers: Record<RoomId, string> = {
  hub: '00', education: '01', experience: '02', projects: '03', skills: '04', achievements: '05', contact: '06',
};

export default function Home() {
  const [room, setRoom] = useState<RoomId>('hub');
  const [started, setStarted] = useState(false);
  const [selected, setSelected] = useState<WorldItem | null>({
    eyebrow: 'WELCOME HOME',
    title: 'Mahera Tasfee',
    body: 'A systems-minded business graduate in the making—combining supply-chain thinking, analytical curiosity, clear communication, and hands-on execution.',
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!started) return;
    gsap.fromTo(flashRef.current, { opacity: 0.6 }, { opacity: 0, duration: 1.1, ease: 'power3.out' });
  }, [room, started]);

  useEffect(() => {
    if (!panelRef.current || !selected) return;
    gsap.fromTo(panelRef.current, { x: 55, opacity: 0, rotateY: -8 }, { x: 0, opacity: 1, rotateY: 0, duration: 0.55, ease: 'power3.out' });
  }, [selected]);

  const travel = (nextRoom: RoomId) => {
    if (nextRoom === room) return;
    setSelected(null);
    setRoom(nextRoom);
  };

  const current = roomData[room];

  return (
    <main className="world-app" style={{ '--room-accent': current.accent } as React.CSSProperties}>
      <div className="world-canvas"><PortfolioWorld room={room} onEnter={travel} onInspect={setSelected} /></div>
      <div className="world-vignette" aria-hidden="true" />
      <div className="world-flash" ref={flashRef} aria-hidden="true" />

      {!started && (
        <section className="entry-sequence">
          <div className="entry-grid" aria-hidden="true" />
          <p className="entry-kicker">A WHIMSICAL WALK THROUGH WORK &amp; WONDER</p>
          <h1>Come inside<br /><span>Mahera&apos;s world.</span></h1>
          <p>Wander through seven warm rooms, meet the ideas on the walls, and discover the thoughtful builder behind the résumé.</p>
          <button type="button" onClick={() => setStarted(true)}><span>Step through the front door</span><ArrowRight size={19} /></button>
          <div className="entry-meta"><span>AN INTERACTIVE HOME</span><span>DESKTOP RECOMMENDED</span><span>EST. 2026</span></div>
        </section>
      )}

      {started && (
        <>
          <header className="world-header">
            <a href="#" className="world-brand" onClick={(event) => { event.preventDefault(); travel('hub'); }}><span>MT</span><div>MAHERA TASFEE<small>A PROFESSIONAL HOME</small></div></a>
            <div className="world-location"><span>YOU ARE IN</span><strong>{current.label}</strong><small>{current.subtitle}</small></div>
            <div className="world-header-links"><a href="https://github.com/Mah-era" target="_blank" rel="noreferrer" aria-label="GitHub"><GitBranch size={17} /></a><a href="https://www.linkedin.com/in/mahera-tasfee/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Network size={17} /></a></div>
          </header>

          <nav className="room-map" aria-label="House rooms">
            <div className="map-label"><Map size={14} /><span>HOME GUIDE</span></div>
            {roomOrder.map((roomId) => (
              <button className={room === roomId ? 'active' : ''} type="button" key={roomId} onClick={() => travel(roomId)}>
                <span>{roomNumbers[roomId]}</span><div><strong>{roomData[roomId].label}</strong><small>{roomData[roomId].subtitle}</small></div><i />
              </button>
            ))}
          </nav>

          <div className="first-person-reticle" aria-hidden="true"><span /><i /></div>

          <div className="movement-hud">
            <div><Move size={15} /><span><strong>W A S D</strong> WANDER AROUND</span></div>
            <div><MousePointer2 size={15} /><span><strong>MOUSE</strong> TAKE IN THE ROOM</span></div>
            <div><Info size={15} /><span><strong>CLICK</strong> OPEN A STORY</span></div>
          </div>

          <div className="room-counter"><span>ROOM</span><strong>{roomNumbers[room]}</strong><div>{roomOrder.map((item) => <i className={item === room ? 'active' : ''} key={item} />)}</div></div>

          {room !== 'hub' && <button className="return-home" type="button" onClick={() => travel('hub')}><ArrowLeft size={15} /> Back to the sunroom</button>}

          {selected && (
            <aside className="object-panel" ref={panelRef}>
              <button className="panel-close" type="button" onClick={() => setSelected(null)} aria-label="Close details"><X size={16} /></button>
              <div className="panel-scan" aria-hidden="true" />
              <p>{selected.eyebrow}</p>
              <h2>{selected.title}</h2>
              <div className="panel-line" />
              <p className="panel-body">{selected.body}</p>
              {selected.link && <a href={selected.link} target="_blank" rel="noreferrer">{selected.linkLabel ?? 'Open link'} <ArrowUpRight size={15} /></a>}
              <small>FOUND IN · {current.label.toUpperCase()}</small>
            </aside>
          )}

          {!selected && <div className="discovery-prompt"><Compass size={16} /> Look around—every floating object has a story</div>}
        </>
      )}
    </main>
  );
}
