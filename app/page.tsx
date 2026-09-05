'use client';

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  House,
  Pause,
  Play,
  Plus,
  RotateCcw,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  roomData,
  roomItems,
  roomOrder,
  projects,
  type RoomId,
  type WorldItem,
} from '@/lib/portfolio-data';

const World = lazy(() =>
  import('@/components/portfolio-world').then((module) => ({
    default: module.PortfolioWorld,
  })),
);

export default function Home() {
  const journey = useRef(0);
  const [chapter, setChapter] = useState(0),
    [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false),
    [still, setStill] = useState(false);
  const [ready, setReady] = useState(false),
    [fallback, setFallback] = useState(false);
  const [guide, setGuide] = useState(false),
    [stories, setStories] = useState(false);
  const [selected, setSelected] = useState<WorldItem | null>(null);
  const [collection, setCollection] = useState<RoomId | null>(null),
    [resetView, setResetView] = useState(0);
  const [visited, setVisited] = useState<number[]>([]);
  const current = roomOrder[Math.max(0, chapter - 1)],
    data = roomData[current];
  const storyRoom = collection ?? current,
    storyData = roomData[storyRoom];
  const intro = chapter === 0,
    quiet = reduced || still;
  const handleReady = useCallback(() => setReady(true), []);
  const handleFallback = useCallback(() => {
    setFallback(true);
    setReady(true);
    setStories(true);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    change();
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    let tick = 0;
    const scroll = () => {
      cancelAnimationFrame(tick);
      tick = requestAnimationFrame(() => {
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        const p = Math.max(
          0,
          Math.min(7, (window.scrollY / Math.max(1, total)) * 7),
        );
        journey.current = p;
        setProgress(p);
        const c = Math.min(7, Math.floor(p + 0.156));
        setChapter(c);
        if (c > 0) setVisited((old) => (old.includes(c) ? old : [...old, c]));
      });
    };
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    return () => {
      cancelAnimationFrame(tick);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
    };
  }, []);
  const travel = useCallback(
    (next: number) => {
      setGuide(false);
      setStories(false);
      setSelected(null);
      setCollection(null);
      setResetView((v) => v + 1);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: (Math.max(0, Math.min(7, next)) / 7) * total,
        behavior: quiet ? 'instant' : 'smooth',
      });
    },
    [quiet],
  );
  const inspect = useCallback((item: WorldItem) => {
    setStories(false);
    setSelected(item);
  }, []);
  const inspectInWorld = useCallback(
    (item: WorldItem) => {
      setCollection(null);
      inspect(item);
    },
    [inspect],
  );

  return (
    <main
      className={`home-experience ${intro ? 'at-door' : 'inside-home'} ${quiet ? 'quiet-mode' : ''}`}
      style={
        {
          '--accent': data.accent,
          '--room-color': data.color,
          '--progress': `${(progress / 7) * 100}%`,
        } as CSSProperties
      }
    >
      <div className="journey-scroll" aria-hidden="true" />
      <div className="experience-stage">
        <div className="paper-grain" aria-hidden="true" />
        <div className="world-stage">
          <Suspense fallback={null}>
            <World
              resetView={resetView}
              journey={journey}
              chapter={chapter}
              reducedMotion={quiet}
              paused={Boolean(selected) || guide || stories}
              onInspect={inspectInWorld}
              onTravel={travel}
              onReady={handleReady}
              onFallback={handleFallback}
            />
          </Suspense>
        </div>
        <div className="stage-shade" aria-hidden="true" />
        <header className="site-header">
          <button
            type="button"
            className="wordmark"
            onClick={() => travel(0)}
            aria-label="Mahera Tasfee, return to entrance"
          >
            <span className="monogram">MT</span>
            <span>MAHERA TASFEE</span>
          </button>
          <nav className="header-nav" aria-label="Portfolio shortcuts">
            <button type="button" onClick={() => travel(1)}>
              Profile
            </button>
            <button type="button" onClick={() => travel(4)}>
              Projects <span>{projects.length}</span>
            </button>
            <button
              type="button"
              onClick={() => setGuide(true)}
              className="guide-button"
            >
              <Compass size={17} /> Explore rooms
            </button>
          </nav>
          <a
            className="contact-link"
            href="https://www.linkedin.com/in/mahera-tasfee/"
            target="_blank"
            rel="noreferrer"
          >
            Let’s talk <ArrowUpRight size={17} />
          </a>
        </header>

        {intro ? (
          <section className="arrival-copy">
            <div className="eyebrow">PORTFOLIO / 2026</div>
            <h1>
              Mahera
              <br />
              <em>Tasfee.</em>
            </h1>
            <p>
              Connecting business, data, and practical systems through
              thoughtful execution.
            </p>
            <div className="hero-tags">
              <span>Supply chain</span>
              <i>/</i>
              <span>Operations</span>
              <i>/</i>
              <span>Analytics</span>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={() => travel(1)}
            >
              <span>Enter the residence</span>
              <ArrowRight size={21} />
            </button>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setCollection('projects');
                setStories(true);
              }}
            >
              View the project collection <ArrowUpRight size={16} />
            </button>
          </section>
        ) : (
          <section className="chapter-copy" key={current}>
            <p className="eyebrow">
              <span>{String(chapter).padStart(2, '0')} / 07</span>
              <span className="eyebrow-rule" />
              {data.category}
            </p>
            <h1>
              {data.title.split('\n').map((line, i) => (
                <span key={line} className={i ? 'italic-line' : ''}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="chapter-description">{data.subtitle}</p>
            <button
              type="button"
              className="primary-button compact"
              onClick={() => {
                setCollection(null);
                setStories(true);
              }}
            >
              <span>
                {current === 'projects'
                  ? `Explore all ${projects.length} projects`
                  : 'Discover this room'}
              </span>
              <Plus size={19} />
            </button>
            <div className="chapter-location">
              <House size={14} />
              {data.label}
            </div>
          </section>
        )}

        {intro && (
          <div className="architecture-caption">
            <span>THE RESIDENCE</span>
            <p>
              Seven spaces.
              <br />A professional perspective.
            </p>
          </div>
        )}
        {!intro && (
          <div className="room-sign">
            <span>YOU’RE WELCOME IN</span>
            <strong>{data.label}</strong>
            <div>
              <span />
              {roomItems[current].length} stories to discover
            </div>
          </div>
        )}
        <div className="scene-status">
          {!ready
            ? 'Preparing the residence…'
            : fallback
              ? 'Explore the portfolio through the room guide.'
              : intro
                ? 'Scroll to enter. Explore at your own pace.'
                : 'Drag to look 360° · move toward an edge to turn · click to inspect'}
        </div>

        <footer className="journey-footer">
          <div className="scroll-invitation">
            <span className="scroll-icon">
              <ArrowDown size={17} />
            </span>
            <span>
              {intro
                ? 'SCROLL TO ENTER'
                : chapter === 7
                  ? 'THE LOUNGE'
                  : 'SCROLL TO CONTINUE'}
              <small>
                {intro
                  ? 'An interactive portfolio'
                  : `${visited.length} of 7 rooms explored`}
              </small>
            </span>
          </div>
          <nav className="chapter-dots" aria-label="Jump to room">
            {roomOrder.map((id, i) => (
              <button
                type="button"
                key={id}
                className={chapter === i + 1 ? 'active' : ''}
                onClick={() => travel(i + 1)}
                aria-label={`${i + 1}. ${roomData[id].label}`}
                aria-current={chapter === i + 1 ? 'step' : undefined}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <i>{roomData[id].category}</i>
              </button>
            ))}
          </nav>
          <div className="footer-controls">
            {!intro && (
              <button
                type="button"
                className="motion-button reset-view"
                onClick={() => setResetView((v) => v + 1)}
                aria-label="Recenter camera facing forward"
              >
                <RotateCcw size={16} />
                <span>Reset view</span>
              </button>
            )}
            <button
              type="button"
              className="motion-button"
              onClick={() => setStill(!still)}
              disabled={reduced}
              aria-pressed={quiet}
              aria-label={
                reduced
                  ? 'Reduced motion follows your device setting'
                  : quiet
                    ? 'Resume ambient motion'
                    : 'Reduce motion'
              }
            >
              {quiet ? <Play size={16} /> : <Pause size={16} />}
              <span>{quiet ? 'Still' : 'Motion'}</span>
            </button>
            <button
              type="button"
              className="step-button"
              onClick={() => travel(chapter === 7 ? 0 : chapter + 1)}
              aria-label={
                chapter === 7 ? 'Return to entrance' : 'Go to next room'
              }
            >
              {chapter === 7 ? <House size={18} /> : <ArrowRight size={20} />}
            </button>
          </div>
          <div className="journey-progress" aria-hidden="true">
            <span />
          </div>
        </footer>
      </div>

      <Dialog open={guide} onOpenChange={setGuide}>
        <DialogContent className="home-guide">
          <DialogTitle>Explore the residence.</DialogTitle>
          <DialogDescription>
            Move directly to a room, or follow the full walkthrough.
          </DialogDescription>
          <div className="guide-rooms">
            {roomOrder.map((id, i) => (
              <button
                type="button"
                key={id}
                onClick={() => travel(i + 1)}
                style={{ '--tile': roomData[id].color } as CSSProperties}
              >
                <span className="guide-number">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <strong>{roomData[id].label}</strong>
                  <span>{roomData[id].category}</span>
                </div>
                {visited.includes(i + 1) ? (
                  <Check size={19} />
                ) : (
                  <ArrowUpRight size={19} />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => travel(0)}
          >
            <ArrowLeft size={16} /> Back to the front door
          </button>
        </DialogContent>
      </Dialog>

      <Sheet open={stories} onOpenChange={setStories}>
        <SheetContent className="story-sheet">
          <div className="sheet-heading">
            <span className="eyebrow">
              {String(roomOrder.indexOf(storyRoom) + 1).padStart(2, '0')} ·{' '}
              {storyData.category}
            </span>
            <SheetTitle>{storyData.label}</SheetTitle>
            <SheetDescription>
              {storyRoom === 'projects'
                ? 'The complete project collection. Open any project for a closer look.'
                : storyData.subtitle}
            </SheetDescription>
          </div>
          <div className="story-collection">
            {roomItems[storyRoom].map((item, i) => (
              <button
                type="button"
                className={`story-item ${item.image ? 'has-media' : ''}`}
                key={item.title}
                onClick={() => inspect(item)}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={`${item.title} project screenshot`}
                    width={1600}
                    height={1000}
                    loading="lazy"
                    unoptimized
                  />
                ) : storyRoom === 'projects' ? (
                  <div className="media-placeholder">
                    <BookOpen size={28} />
                    <span>Project preview to come</span>
                  </div>
                ) : null}
                <div className="story-item-copy">
                  <span>
                    {String(i + 1).padStart(2, '0')} /{' '}
                    {item.language ?? item.eyebrow}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <i>
                    Open story <ArrowUpRight size={17} />
                  </i>
                </div>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="exhibit-dialog">
          {selected && (
            <>
              {selected.image ? (
                <div className="exhibit-media">
                  <Image
                    src={selected.image}
                    alt={`${selected.title} project screenshot`}
                    width={1600}
                    height={1000}
                    unoptimized
                  />
                </div>
              ) : selected.language ? (
                <div className="exhibit-media empty-preview">
                  <BookOpen size={46} />
                  <span>
                    Space for a screen recording, screenshots,
                    <br />
                    and the story behind this project.
                  </span>
                </div>
              ) : (
                <div className="exhibit-symbol">
                  <BookOpen size={38} strokeWidth={1} />
                </div>
              )}
              <div className="exhibit-copy">
                <p className="eyebrow">{selected.eyebrow}</p>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.body}</DialogDescription>
                {selected.language && (
                  <div className="project-meta">
                    <span>{selected.language}</span>
                    <span>
                      {selected.image
                        ? 'Project preview'
                        : 'Media coming later'}
                    </span>
                  </div>
                )}
                {selected.link && (
                  <a
                    className="primary-button compact"
                    href={selected.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selected.linkLabel ?? 'Open link'}
                    <ArrowUpRight size={18} />
                  </a>
                )}
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    setSelected(null);
                    setStories(true);
                  }}
                >
                  See all stories in this room <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <noscript>
        <div className="no-script">
          <h1>Mahera Tasfee</h1>
          <p>Supply chain, operations, analytics, and digital systems.</p>
          <a href="https://github.com/Mah-era">Explore GitHub</a>
          <a href="https://www.linkedin.com/in/mahera-tasfee/">
            Connect on LinkedIn
          </a>
        </div>
      </noscript>
    </main>
  );
}
