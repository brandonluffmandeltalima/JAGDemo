import Head from 'next/head';
import { useEffect, useState } from 'react';

const LOGO = "data:image/png;base64,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";

function miniIcon(type) {
  if (type === 'person') return (<><circle cx="8" cy="5.4" r="3" /><path d="M2.3,15 C2.3,10.6 4.8,9 8,9 C11.2,9 13.7,10.6 13.7,15" /></>);
  if (type === 'scales') return (<><path d="M8,2 L8,14 M3,4.2 L13,4.2" /><path d="M3,4.2 L1,8.4 A2.4,1.8 0 0 0 5,8.4 Z M13,4.2 L11,8.4 A2.4,1.8 0 0 0 15,8.4 Z" /></>);
  if (type === 'court') return (<path d="M1,15 L15,15 M2.5,15 L2.5,7.3 M5.7,15 L5.7,7.3 M8,15 L8,7.3 M10.3,15 L10.3,7.3 M13.5,15 L13.5,7.3 M0.5,7.3 L8,1.3 L15.5,7.3 Z" />);
  if (type === 'doc') return (<><rect x="3" y="1" width="10" height="14" rx="2" /><line x1="5.5" y1="5" x2="10.5" y2="5" /><line x1="5.5" y1="8" x2="10.5" y2="8" /><line x1="5.5" y1="11" x2="9" y2="11" /></>);
  if (type === 'meeting') return (<><rect x="1" y="3" width="14" height="12" rx="2.5" /><line x1="1" y1="6.5" x2="15" y2="6.5" /><line x1="5" y1="1" x2="5" y2="4.5" /><line x1="11" y1="1" x2="11" y2="4.5" /></>);
  if (type === 'flag') return (<><line x1="3" y1="1" x2="3" y2="16" /><path d="M3,2 L14,2 L11,6 L14,10 L3,10" /></>);
  if (type === 'search') return (<><circle cx="7" cy="7" r="5" /><line x1="10.8" y1="10.8" x2="15" y2="15" /></>);
  if (type === 'clock') return (<><circle cx="8" cy="8" r="6.5" /><path d="M8,4.2 L8,8 L11,10" /></>);
  if (type === 'shield') return (<path d="M8,1 L14,3.4 L14,8.2 C14,12 11.4,14.4 8,15.6 C4.6,14.4 2,12 2,8.2 L2,3.4 Z M5.3,8 L7.2,10 L11,6" />);
  if (type === 'inbox') return (<><path d="M1.5,9 L5,9 L6.3,11 L9.7,11 L11,9 L14.5,9" /><path d="M1.5,9 L3,2.5 L13,2.5 L14.5,9 L14.5,13 A1.2,1.2 0 0 1 13.3,14.2 L2.7,14.2 A1.2,1.2 0 0 1 1.5,13 Z" /></>);
  if (type === 'chart') return (<><line x1="2" y1="15" x2="15" y2="15" /><rect x="3" y="10" width="3" height="5" /><rect x="7.5" y="6" width="3" height="9" /><rect x="12" y="3" width="3" height="12" /></>);
  return null;
}

/* ---- Act 2: galaxy knowledge-graph helpers ---- */
const HEX_ANGLES = [-90, -30, 30, 90, 150, 210];
function hexPoint(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function seededRand(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
function buildGalaxy(n, cx, cy) {
  const stars = [];
  const arms = 3;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const arm = i % arms;
    const angle = t * Math.PI * 5 + arm * ((2 * Math.PI) / arms) + (seededRand(i) - 0.5) * 0.6;
    const radius = 28 + t * 430 + (seededRand(i + 500) - 0.5) * 40;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle) * 0.45;
    const isHub = i % 16 === 0;
    const r = isHub ? 3.2 + seededRand(i + 900) * 1.4 : 0.6 + seededRand(i + 900) * 1.5;
    const op = isHub ? 0.75 + seededRand(i + 1300) * 0.25 : 0.2 + seededRand(i + 1300) * 0.55;
    const delay = -(seededRand(i + 1700) * 6).toFixed(2);
    stars.push({ x, y, r, op, delay, isHub });
  }
  return stars;
}
const GALAXY_STARS = buildGalaxy(190, 600, 340);

function nearestStars(px, py, stars, count) {
  return [...stars]
    .map((s) => ({ s, d: (s.x - px) ** 2 + (s.y - py) ** 2 }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map((o) => o.s);
}
function buildGalaxyEdges(stars, neighborCount, maxDist) {
  const edges = [];
  for (let i = 0; i < stars.length; i++) {
    const nCount = stars[i].isHub ? neighborCount + 4 : neighborCount;
    const dist = stars[i].isHub ? maxDist * 1.6 : maxDist;
    const dists = stars
      .map((s, j) => (j === i ? null : { j, d: Math.hypot(s.x - stars[i].x, s.y - stars[i].y) }))
      .filter(Boolean)
      .sort((a, b) => a.d - b.d)
      .slice(0, nCount);
    dists.forEach(({ j, d }) => {
      if (d < dist) edges.push({ x1: stars[i].x, y1: stars[i].y, x2: stars[j].x, y2: stars[j].y, hub: stars[i].isHub || stars[j].isHub });
    });
  }
  return edges;
}
const GALAXY_EDGES = buildGalaxyEdges(GALAXY_STARS, 3, 115);
const CORE_A_LINKS = nearestStars(330, 340, GALAXY_STARS, 6);
const CORE_B_LINKS = nearestStars(870, 340, GALAXY_STARS, 6);

/* modern "card behind node" — icon + two lines of text anchored to a satellite point.
   Card is built in a fixed local coordinate system, then the WHOLE group (box + text)
   is scaled together via the outer transform, so text always scales with its box. */
function renderNodeCard(px, py, dir, icon, name, sub, tier, scale) {
  const s = scale || 1;
  const w = 214, h = 48, r = 11, gap = 30;
  let cx, cy;
  if (dir === 'top') { cx = -w / 2; cy = -gap - h; }
  else if (dir === 'bottom') { cx = -w / 2; cy = gap; }
  else if (dir === 'left') { cx = -gap - w; cy = -h / 2; }
  else { cx = gap; cy = -h / 2; }
  const connX2 = dir === 'top' || dir === 'bottom' ? 0 : dir === 'left' ? cx + w : cx;
  const connY2 = dir === 'top' ? cy + h : dir === 'bottom' ? cy : 0;
  const iconR = 15;
  const iconCx = cx + 13 + iconR;
  const iconCy = cy + h / 2;
  return (
    <g className={`node-card ${tier || ''}`} transform={`translate(${px},${py}) scale(${s})`}>
      <line className="nc-connector" x1="0" y1="0" x2={connX2} y2={connY2} />
      <rect className="nc-bg" x={cx} y={cy} width={w} height={h} rx={r} />
      <circle className="nc-icon-bg" cx={iconCx} cy={iconCy} r={iconR} />
      <g transform={`translate(${iconCx - 7.5},${iconCy - 7.5})`} className="nc-icon">{miniIcon(icon)}</g>
      <text className="nc-name" x={iconCx + iconR + 9} y={cy + 20} textAnchor="start">{name}</text>
      <text className="nc-sub" x={iconCx + iconR + 9} y={cy + 35} textAnchor="start">{sub}</text>
    </g>
  );
}

/* an expanded "node inspector" card — shows a full property table for one example node,
   to make the node/property distinction concrete for non-technical viewers */
/* ---- Act 1: one unified, human-readable annotation style across all three sources ---- */
function renderDetail(icon, label, value, kind) {
  return (
    <span className={`ann-card ann-${kind}`}>
      <span className="ann-card-icon"><svg viewBox="0 0 16 16" fill="none">{miniIcon(icon)}</svg></span>
      <span className="ann-card-text">
        <span className="ann-card-label">{label}</span>
        <span className="ann-card-value">{value}</span>
      </span>
    </span>
  );
}
function renderConnection(text) {
  return (
    <span className="ann-card ann-rel">
      <span className="ann-card-icon ann-rel-icon"><svg viewBox="0 0 16 16" fill="none"><path d="M2,8 L11,8 M7,4.3 L11,8 L7,11.7" /></svg></span>
      <span className="ann-card-text">
        <span className="ann-card-label">Connection</span>
        <span className="ann-card-value">{text}</span>
      </span>
    </span>
  );
}

/* ---- Act 3: small "graph query" visualization — shows the traversal behind each solution ---- */
function renderGraphQuery(steps) {
  const gap = 108;
  const width = gap * (steps.length - 1) + 76;
  const midY = 34;
  const pathD = steps.map((_, i) => `${i === 0 ? 'M' : 'L'}${38 + i * gap},${midY}`).join(' ');
  return (
    <svg className="graph-query-svg" viewBox={`0 0 ${width} 74`} preserveAspectRatio="xMidYMid meet">
      <path className="gq-edge" d={pathD} />
      <circle r="3.2" className="gq-dot">
        <animateMotion dur="2.4s" repeatCount="indefinite" path={pathD} />
      </circle>
      {steps.map((s, i) => (
        <g key={i} transform={`translate(${38 + i * gap},${midY})`} className={`gq-node gq-${s.kind}`}>
          <circle className="gq-node-bg" r="17" />
          <g transform="translate(-7.5,-7.5)" className="gq-node-icon">{miniIcon(s.icon)}</g>
          <text className="gq-node-label" y="30" textAnchor="middle">{s.label}</text>
        </g>
      ))}
    </svg>
  );
}

function renderPropertyCard(px, py, dir) {
  const w = 236, headerH = 34, rowH = 20, pad = 12;
  const rows = [
    ['ROLE', 'Defense Counsel'],
    ['ACTIVE CASES', '2'],
    ['BAR ID', 'NC-88214'],
    ['ADMITTED', '2019'],
  ];
  const h = headerH + rows.length * rowH + pad;
  const gap = 34;
  let cx, cy;
  if (dir === 'left') { cx = -gap - w; cy = -h / 2; }
  else if (dir === 'right') { cx = gap; cy = -h / 2; }
  else if (dir === 'top') { cx = -w / 2; cy = -gap - h; }
  else { cx = -w / 2; cy = gap; }
  const connX2 = dir === 'left' ? cx + w : dir === 'right' ? cx : 0;
  const connY2 = dir === 'top' ? cy + h : dir === 'bottom' ? cy : 0;
  return (
    <g className="node-card prop-card" transform={`translate(${px},${py})`}>
      <line className="nc-connector" x1="0" y1="0" x2={connX2} y2={connY2} />
      <rect className="prop-card-bg" x={cx} y={cy} width={w} height={h} rx="13" />
      <path className="prop-card-header" d={`M${cx},${cy + 13} A13,13 0 0 1 ${cx + 13},${cy} L${cx + w - 13},${cy} A13,13 0 0 1 ${cx + w},${cy + 13} L${cx + w},${cy + headerH} L${cx},${cy + headerH} Z`} />
      <line className="prop-card-hr" x1={cx} y1={cy + headerH} x2={cx + w} y2={cy + headerH} />
      <circle className="nc-icon-bg" cx={cx + 25} cy={cy + headerH / 2} r="13" />
      <g transform={`translate(${cx + 25 - 6.5},${cy + headerH / 2 - 6.5}) scale(.9)`} className="nc-icon">{miniIcon('person')}</g>
      <text className="prop-card-name" x={cx + 46} y={cy + headerH / 2 + 4.5}>CPT Sarah Chen</text>
      <text className="prop-card-type" x={cx + w - 12} y={cy + headerH / 2 + 4.5} textAnchor="end">PERSON NODE</text>
      {rows.map(([k, v], i) => (
        <g key={i}>
          <text className="prop-card-key" x={cx + 14} y={cy + headerH + 15 + i * rowH}>{k}</text>
          <text className="prop-card-val" x={cx + w - 14} y={cy + headerH + 15 + i * rowH} textAnchor="end">{v}</text>
        </g>
      ))}
    </g>
  );
}

const CLUSTER_A_DATA = [
  { icon: 'meeting', name: 'Pretrial Conference', sub: 'Sep 14, 10:00 · Meeting' },
  { icon: 'doc', name: 'Discovery Order #4471', sub: 'Order · Document' },
  { icon: 'person', name: 'MAJ David Kim', sub: 'Trial Counsel · Attorney' },
  { icon: 'scales', name: 'Art. 128 — Assault', sub: 'Charge' },
  { icon: 'court', name: 'Fort Bragg GCM', sub: 'Venue · Court' },
  { icon: 'person', name: 'CPT Sarah Chen', sub: 'Defense Counsel · Attorney' },
];
const CLUSTER_B_DATA = [
  { icon: 'meeting', name: 'Suppression Hearing', sub: 'Sep 21, 09:00 · Meeting' },
  { icon: 'doc', name: 'Search Warrant #2091', sub: 'Order · Document' },
  { icon: 'person', name: 'CPT Elena Ruiz', sub: 'Trial Counsel · Attorney' },
  { icon: 'scales', name: 'Art. 92 — Failure to Obey', sub: 'Charge' },
  { icon: 'court', name: 'Fort Hood GCM', sub: 'Venue · Court' },
  { icon: 'person', name: 'CPT Sarah Chen', sub: 'Defense Counsel · Attorney' },
];

function renderMiniCluster(cx, cy, r, data, caseLabel, caseSub, tier) {
  const pts = HEX_ANGLES.map((a) => hexPoint(cx, cy, r, a));
  return (
    <g className={`mini-cluster ${tier}`}>
      {pts.map((p, i) => (
        <path key={'spoke' + i} className="mc-spoke" d={`M${cx},${cy} L${p.x},${p.y}`} />
      ))}
      <rect className={`mc-case ${tier}`} x={cx - 72} y={cy - 24} width="144" height="48" rx="9" />
      <text className="mc-case-name" x={cx} y={cy - 3} textAnchor="middle">{caseLabel}</text>
      <text className="mc-case-sub" x={cx} y={cy + 15} textAnchor="middle">{caseSub}</text>
      {pts.map((p, i) => {
        const angle = HEX_ANGLES[i];
        const dir = angle === -90 ? 'top' : angle === 90 ? 'bottom' : angle === 150 || angle === 210 ? 'left' : 'right';
        return (
          <g key={'sat' + i}>
            <circle className="mc-node" cx={p.x} cy={p.y} r="6" />
            {renderNodeCard(p.x, p.y, dir, data[i].icon, data[i].name, data[i].sub, tier, 0.62)}
          </g>
        );
      })}
    </g>
  );
}

const ACTIVE_ITEMS = [
  { icon: 'shield', title: 'Redaction Automation', desc: 'Consistent, policy-140a-compliant redaction of PII/PHI across every case file.' },
  { icon: 'doc', title: 'PDF Flattening Automation', desc: 'Flattens 1,000+ fillable XFA forms per case for e-discovery.' },
  { icon: 'search', title: 'TRACKS Toolkit', desc: "Makes the helpdesk's TRACKS knowledge base actually searchable." },
];

const BACKLOG_ITEMS = [
  { icon: 'search', title: 'PDF Search Assistant', desc: 'Makes disorganized, scanned case PDFs — often 1,000+ pages — actually searchable.' },
  { icon: 'inbox', title: 'Discovery File Management', desc: 'Automates classification and clustering of new case materials.' },
  { icon: 'search', title: 'Search-Term Automation', desc: 'Generates case-specific discovery search terms from complaint text.' },
  { icon: 'doc', title: 'Fact Finding Automation', desc: 'Parses discovery files to answer specific field requests.' },
  { icon: 'doc', title: 'Legal Document Summarization', desc: 'Expedites discovery review with summaries at the point of read.' },
  { icon: 'inbox', title: 'Case Intake Automation', desc: 'Automates manual data entry when a new case opens in JAGCNet.' },
  { icon: 'doc', title: 'Automated Data Entry', desc: 'Enters documents into CMS systems and drafts case-note updates.' },
  { icon: 'court', title: 'Case Document Creation', desc: "Drafts and formats documents to a specific court or venue's requirements." },
  { icon: 'flag', title: 'Deposition Analysis', desc: 'First-draft summaries, question outlines, and issue maps from transcripts.' },
  { icon: 'inbox', title: 'Email Ingestion', desc: 'Populates the knowledge graph from attorney email and Teams activity.' },
  { icon: 'doc', title: 'Case Notes — Email Summarization', desc: "Weekly structured summaries of an attorney's email correspondence." },
  { icon: 'clock', title: 'Calendar Tracker', desc: 'Extracts dates from emails and filings into standardized reminders.' },
  { icon: 'clock', title: 'Case Timeline Creation', desc: 'Assembles a standardized, visual case timeline from every data source.' },
  { icon: 'doc', title: 'SharePoint Ingestion', desc: 'Builds the ingestion pipeline linking SharePoint into the knowledge graph.' },
  { icon: 'flag', title: 'Initial Response Letters', desc: 'Automates litigation-hold letters — creation, tracking, and archival.' },
  { icon: 'search', title: 'Case Retrieval Automation', desc: 'Finds case-relevant historical data by relationship, not by folder.' },
  { icon: 'doc', title: 'R/S Memo Generation', desc: 'Drafts legal strategy memoranda from structured case inputs.' },
  { icon: 'chart', title: 'Case Cost Analysis', desc: 'Consolidates invoices and time entries into audit-ready cost reports.' },
  { icon: 'scales', title: 'Case Advisor', desc: 'Classifies case type and risk from intake data, with explainability built in.' },
];

export default function CaseStudyOTJAG() {
  const [backlogPage, setBacklogPage] = useState(0);
  const [graphScene, setGraphScene] = useState(0);
  const [activeSource, setActiveSource] = useState('sp');
  useEffect(() => {
    const id = setInterval(() => setGraphScene((s) => (s + 1) % 3), 4000);
    return () => clearInterval(id);
  }, []);
  const BACKLOG_PAGE_SIZE = 6;
  const backlogPageCount = Math.ceil(BACKLOG_ITEMS.length / BACKLOG_PAGE_SIZE);
  const backlogVisible = BACKLOG_ITEMS.slice(backlogPage * BACKLOG_PAGE_SIZE, backlogPage * BACKLOG_PAGE_SIZE + BACKLOG_PAGE_SIZE);
  useEffect(() => {
    // section rail
    const railDots = document.querySelectorAll('.rail-dot');
    const railFill = document.getElementById('railFill');
    const railSections = Array.from(railDots).map(d => document.getElementById(d.dataset.sec)).filter(Boolean);
    function updateRail(){
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      let activeIdx = 0;
      railSections.forEach((sec, i) => { if(sec.offsetTop <= scrollPos) activeIdx = i; });
      railDots.forEach((d,i) => d.classList.toggle('active', i === activeIdx));
      if (railFill) railFill.style.height = (activeIdx / (railSections.length - 1) * 100) + '%';
    }
    window.addEventListener('scroll', updateRail, { passive:true });
    updateRail();

    const header = document.getElementById('siteHeader');
    function onHeaderScroll(){ header.classList.toggle('scrolled', window.scrollY > 30); }
    window.addEventListener('scroll', onHeaderScroll);

    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    const actEls = document.querySelectorAll('.act');
    const actObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          actObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -15% 0px' });
    actEls.forEach(el => actObserver.observe(el));

    return () => {
      window.removeEventListener('scroll', updateRail);
      window.removeEventListener('scroll', onHeaderScroll);
      revealObserver.disconnect();
      actObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Head>
        <title>OTJAG Case Study — Delta Lima</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340;9..144,420;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="grid-field"></div>

      <nav className="rail" id="rail" aria-label="Page sections">
        <div className="rail-line"><div className="rail-line-fill" id="railFill"></div></div>
        <a href="#overview" className="rail-dot" data-sec="overview"><span>Overview</span></a>
        <a href="#act1" className="rail-dot" data-sec="act1"><span>Where data lives</span></a>
        <a href="#act2" className="rail-dot" data-sec="act2"><span>Knowledge graph</span></a>
        <a href="#act3" className="rail-dot" data-sec="act3"><span>Built for attorneys</span></a>
        <a href="#directory" className="rail-dot" data-sec="directory"><span>Full directory</span></a>
        <a href="#scope" className="rail-dot" data-sec="scope"><span>Engagement scope</span></a>
        <a href="#contact" className="rail-dot" data-sec="contact"><span>Contact</span></a>
      </nav>

      <header id="siteHeader">
        <div className="wrap">
          <a href="/" className="logo">
            <img className="logo-mark" src={LOGO} alt="Delta Lima" />
            <span className="logo-word">Delta Lima</span>
          </a>
          <nav className="links">
            <a href="/#framework">Framework</a>
            <a href="/case-study-otjag">OTJAG</a>
            <a href="/#roi">Why it works</a>
            <a href="/live-demo" className="nav-cta">Demo</a>
          </nav>
        </div>
      </header>

      <section className="section cs-hero" id="overview">
        <div className="wrap">
          <div className="cs-hero-copy">
            <a href="/#otjag" className="cs-back">← Back to Delta Lima</a>
            <div className="kicker">CASE STUDY — U.S. ARMY OFFICE OF THE JUDGE ADVOCATE GENERAL</div>
            <h1>One knowledge graph. <em>Every</em> decision runs through it.</h1>
            <p className="cs-sub">OTJAG's legal knowledge lived in three disconnected systems — SharePoint, attorney inboxes, and Teams channels — each with its own structure and its own blind spots. Delta Lima built the ingestion and knowledge-graph layer that unifies them, and the pipeline of AI-assisted decisions now sequenced on top of it.</p>
            <a href="/live-demo" className="cs-hero-demo-btn">Check out the demo →</a>
          </div>

          <div className="cs-hero-visual" aria-hidden="true">
            <svg className="hero-flow-svg" viewBox="0 0 480 320">
              {/* converging paths: sources -> graph db */}
              <path className="hf-path sp" d="M74,60 C150,60 190,110 246,150" />
              <path className="hf-path tm" d="M74,160 C150,160 190,160 236,160" />
              <path className="hf-path em" d="M74,260 C150,260 190,210 246,170" />
              {/* graph db -> solution */}
              <path className="hf-path out" d="M292,160 C330,160 360,160 402,160" />

              {/* SharePoint source */}
              <g transform="translate(40,60)">
                <g className="hf-source-inner sp">
                  <rect className="hf-node-bg sp" x="-24" y="-24" width="48" height="48" rx="14" />
                  <text className="hf-badge-letter" x="0" y="8" textAnchor="middle">S</text>
                  <text className="hf-label" x="0" y="42" textAnchor="middle">SharePoint</text>
                </g>
              </g>

              {/* Teams source */}
              <g transform="translate(40,160)">
                <g className="hf-source-inner tm">
                  <rect className="hf-node-bg tm" x="-24" y="-24" width="48" height="48" rx="14" />
                  <text className="hf-badge-letter" x="0" y="8" textAnchor="middle">T</text>
                  <text className="hf-label" x="0" y="42" textAnchor="middle">Teams</text>
                </g>
              </g>

              {/* Outlook source */}
              <g transform="translate(40,260)">
                <g className="hf-source-inner em">
                  <rect className="hf-node-bg em" x="-24" y="-24" width="48" height="48" rx="14" />
                  <text className="hf-badge-letter" x="0" y="8" textAnchor="middle">O</text>
                  <text className="hf-label" x="0" y="42" textAnchor="middle">Outlook</text>
                </g>
              </g>

              {/* knowledge graph db */}
              <g transform="translate(266,160)">
                <g className="hf-db-inner">
                  <circle className="hf-db-glow" r="52" fill="url(#hfDbGlow)" />
                  <ellipse className="hf-db-shape" cx="0" cy="-14" rx="30" ry="10" />
                  <path className="hf-db-shape" d="M-30,-14 L-30,14 A30,10 0 0 0 30,14 L30,-14" />
                  <ellipse className="hf-db-shape" cx="0" cy="14" rx="30" ry="10" />
                  <circle className="hf-mini-node" cx="-10" cy="-2" r="3.4" />
                  <circle className="hf-mini-node" cx="8" cy="4" r="3.4" />
                  <circle className="hf-mini-node" cx="0" cy="-10" r="3" />
                  <line className="hf-mini-edge" x1="-10" y1="-2" x2="8" y2="4" />
                  <line className="hf-mini-edge" x1="-10" y1="-2" x2="0" y2="-10" />
                  <line className="hf-mini-edge" x1="8" y1="4" x2="0" y2="-10" />
                </g>
                <text className="hf-db-label" x="0" y="46" textAnchor="middle">Knowledge Graph</text>
              </g>

              {/* solution output */}
              <g transform="translate(420,160)">
                <g className="hf-solution-inner">
                  <circle className="hf-node-bg out" r="26" />
                  <g className="hf-icon" transform="translate(-8,-9)">
                    <rect x="0" y="0" width="16" height="18" rx="1.5" />
                    <path className="hf-check" d="M4,9 L7,12 L13,5" />
                  </g>
                  <text className="hf-label" x="0" y="42" textAnchor="middle">Decision</text>
                </g>
              </g>

              <defs>
                <radialGradient id="hfDbGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style={{ stopColor: 'var(--teal)', stopOpacity: 0.35 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--teal)', stopOpacity: 0 }} />
                </radialGradient>
              </defs>

              {/* traveling data dots, looping */}
              <circle r="3" className="hf-dot sp"><animateMotion dur="3.2s" repeatCount="indefinite" path="M74,60 C150,60 190,110 246,150" /></circle>
              <circle r="3" className="hf-dot tm"><animateMotion dur="2.8s" begin="0.4s" repeatCount="indefinite" path="M74,160 C150,160 190,160 236,160" /></circle>
              <circle r="3" className="hf-dot em"><animateMotion dur="3.4s" begin="0.8s" repeatCount="indefinite" path="M74,260 C150,260 190,210 246,170" /></circle>
              <circle r="3.4" className="hf-dot out"><animateMotion dur="2.2s" begin="1.2s" repeatCount="indefinite" path="M292,160 C330,160 360,160 402,160" /></circle>
            </svg>
            <div className="hero-flow-caption">Ingest → Graph → Decision</div>
          </div>
        </div>
      </section>

      <section className="act act1" id="act1">
        <div className="wrap">
          <div className="case-badge reveal">Case example: United States v. Martinez</div>
          <div className="act-head reveal">
            <div className="act-eyebrow">01 — WHERE THE DATA LIVES</div>
            <h2 className="act-title">Three systems. Three formats. Zero shared structure.</h2>
            <p className="act-sub">Every case generates documents in SharePoint, conversations in Teams, and correspondence in email — each system blind to what the other two contain. The colored words are what gets pulled out automatically; the cards below each message are what that becomes.</p>
          </div>

          <div className="source-tabs-hint">Click a source to see what it looks like →</div>
          <div className="source-tabs">
            <button type="button" className={`source-tab${activeSource === 'sp' ? ' active' : ''}`} onClick={() => setActiveSource('sp')}>
              <span className="source-tab-badge sp">S</span>
              <span className="source-tab-text"><strong>SharePoint</strong><em>Case files &amp; filings</em></span>
              <span className="source-tab-chevron">›</span>
            </button>
            <button type="button" className={`source-tab${activeSource === 'tm' ? ' active' : ''}`} onClick={() => setActiveSource('tm')}>
              <span className="source-tab-badge tm">T</span>
              <span className="source-tab-text"><strong>Teams</strong><em>Channels &amp; chats</em></span>
              <span className="source-tab-chevron">›</span>
            </button>
            <button type="button" className={`source-tab${activeSource === 'em' ? ' active' : ''}`} onClick={() => setActiveSource('em')}>
              <span className="source-tab-badge em">O</span>
              <span className="source-tab-text"><strong>Outlook</strong><em>Attorney correspondence</em></span>
              <span className="source-tab-chevron">›</span>
            </button>
          </div>

          <div className={`source-panel-solo src-${activeSource}`}>
            {activeSource === 'sp' && (
              <div className="doc-mock">
                <div className="doc-mock-titlebar">
                  <span className="doc-mock-dot"></span> Discovery_Order_4471.docx
                  <span className="doc-mock-filetype">DOCX</span>
                </div>
                <div className="doc-mock-body">
                  <p className="doc-text">
                    IN THE GENERAL COURT-MARTIAL, Fort Bragg, North Carolina — United States v. <span className="doc-hl h1">SPC Michael Martinez<i className="hl-num">1</i></span>, <span className="doc-hl h2">Case No. 4471<i className="hl-num">2</i></span>. <strong>ORDER ON DISCOVERY.</strong> Pursuant to <span className="doc-hl h8">R.C.M. 701<i className="hl-num">8</i></span>, the accused is charged under <span className="doc-hl h3">Article 128, UCMJ<i className="hl-num">3</i></span> (Assault Consummated by a Battery), to be tried before the <span className="doc-hl h4">Fort Bragg General Court-Martial<i className="hl-num">4</i></span>, <span className="doc-hl h5">Presiding Judge COL Patricia Hayes<i className="hl-num">5</i></span>. The Government shall produce all discoverable materials, including witness statements and the deposition transcript of <span className="doc-hl h7">J. Rivera<i className="hl-num">7</i></span>, no later than <span className="doc-hl h6">20 September 2026<i className="hl-num">6</i></span> — fourteen days from this order. Defense counsel shall file any objection to the scope of discovery within <span className="doc-hl h9">seven days of receipt<i className="hl-num">9</i></span>; failure to comply may result in sanctions under <span className="doc-hl h8">R.C.M. 905<i className="hl-num">8</i></span>.
                  </p>
                  <div className="doc-props">
                    <div className="doc-prop p1"><i className="hl-num n-amber">1</i>{renderDetail('person', 'Defendant', 'SPC M. Martinez', 'person')}</div>
                    <div className="doc-prop p2"><i className="hl-num n-teal">2</i>{renderDetail('doc', 'Case ID', '#4471', 'doc')}</div>
                    <div className="doc-prop p3"><i className="hl-num n-teal">3</i>{renderDetail('scales', 'Charge', 'Art. 128 — Assault', 'doc')}</div>
                    <div className="doc-prop p4"><i className="hl-num n-blue">4</i>{renderDetail('court', 'Venue', 'Fort Bragg GCM', 'place')}</div>
                    <div className="doc-prop p5"><i className="hl-num n-amber">5</i>{renderDetail('person', 'Judge', 'COL P. Hayes', 'person')}</div>
                    <div className="doc-prop p6"><i className="hl-num n-violet">6</i>{renderDetail('meeting', 'Discovery due', 'Sep 20, 2026', 'date')}</div>
                    <div className="doc-prop p7"><i className="hl-num n-amber">7</i>{renderDetail('person', 'Witness', 'J. Rivera', 'person')}</div>
                    <div className="doc-prop p8"><i className="hl-num n-teal">8</i>{renderDetail('doc', 'Governing rule', 'R.C.M. 701, 905', 'doc')}</div>
                    <div className="doc-prop p9"><i className="hl-num n-violet">9</i>{renderDetail('meeting', 'Objection due', '7 days after receipt', 'date')}</div>
                  </div>
                  <div className="doc-props doc-props-rel">
                    {renderConnection('Martinez is charged under Article 128')}
                  </div>
                </div>
              </div>
            )}

            {activeSource === 'tm' && (
              <div className="chat-mock chat-mock-solo">
                <div className="chat-msg annotated">
                  <span className="chat-avatar av-jt">JT</span>
                  <div className="chat-bubble">
                    <div className="chat-bubble-head"><strong>JAG-2 Team</strong><span className="chat-time">9:02 AM</span></div>
                    <p>Can you review the <mark className="chat-highlight hl-case">Martinez</mark> motion by Friday? Trial's coming up fast.</p>
                    <div className="ann-row">
                      {renderDetail('doc', 'Case', '#4471', 'doc')}
                      {renderDetail('doc', 'Motion', 'Review by Friday', 'doc')}
                    </div>
                  </div>
                </div>
                <div className="chat-msg annotated">
                  <span className="chat-avatar av-sc">SC</span>
                  <div className="chat-bubble">
                    <div className="chat-bubble-head"><strong>CPT Chen</strong><span className="chat-time">9:14 AM</span></div>
                    <p>On it. Pretrial conference got moved to <mark className="chat-highlight hl-meet">Sep 14, 10:00</mark> — <mark className="chat-highlight hl-place">court room 2</mark>.</p>
                    <div className="ann-row">
                      {renderDetail('meeting', 'Meeting', 'Sep 14, 10:00', 'date')}
                      {renderDetail('person', 'Attorney', 'CPT Chen · Defense', 'person')}
                      {renderDetail('court', 'Location', 'Court Room 2', 'place')}
                      {renderConnection('Chen represents Martinez')}
                    </div>
                  </div>
                </div>
                <div className="chat-msg annotated">
                  <span className="chat-avatar av-tt">TT</span>
                  <div className="chat-bubble">
                    <div className="chat-bubble-head"><strong>Trial Team</strong><span className="chat-time">10:47 AM</span></div>
                    <p>Deposition transcript for <mark className="chat-highlight hl-doc">J. Rivera</mark> just landed in the shared folder.</p>
                    <div className="ann-row">
                      {renderDetail('doc', 'Document', 'Deposition — Rivera', 'doc')}
                      {renderConnection('Deposition is evidence in Case #4471')}
                    </div>
                  </div>
                </div>
                <div className="chat-msg annotated">
                  <span className="chat-avatar av-kn">KN</span>
                  <div className="chat-bubble">
                    <div className="chat-bubble-head"><strong>K. Nguyen</strong><span className="chat-time">1:20 PM</span></div>
                    <p>Discovery Order is signed — <mark className="chat-highlight hl-meet">14-day clock</mark> starts today.</p>
                    <div className="ann-row">
                      {renderDetail('person', 'Case Support', 'K. Nguyen', 'person')}
                      {renderDetail('meeting', 'Deadline', 'Sep 20', 'date')}
                    </div>
                  </div>
                </div>
                <div className="chat-msg annotated">
                  <span className="chat-avatar av-dk">DK</span>
                  <div className="chat-bubble">
                    <div className="chat-bubble-head"><strong>MAJ Kim</strong><span className="chat-time">2:03 PM</span></div>
                    <p><mark className="chat-highlight hl-att">Judge Hayes</mark> wants a status update before the 14th. Defense, can you confirm?</p>
                    <div className="ann-row">
                      {renderDetail('person', 'Attorney', 'MAJ Kim · Trial Counsel', 'person')}
                      {renderDetail('person', 'Judge', 'COL Hayes', 'person')}
                    </div>
                  </div>
                </div>
                <div className="chat-msg annotated">
                  <span className="chat-avatar av-sc">SC</span>
                  <div className="chat-bubble">
                    <div className="chat-bubble-head"><strong>CPT Chen</strong><span className="chat-time">2:11 PM</span></div>
                    <p>Confirmed. Rivera's statement also references leaving <mark className="chat-highlight hl-place">the barracks</mark> around <mark className="chat-highlight hl-meet">9:15 PM</mark>.</p>
                    <div className="ann-row">
                      {renderDetail('doc', 'Testimony', "Rivera's statement", 'doc')}
                      {renderDetail('meeting', 'Time referenced', '9:15 PM', 'date')}
                      {renderDetail('court', 'Location', 'The barracks', 'place')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSource === 'em' && (
              <div className="email-mock email-mock-solo">
                <div className="email-item annotated">
                  <span className="email-avatar">DK</span>
                  <div className="email-body">
                    <div className="email-row email-top"><span className="email-from">MAJ David Kim</span><span className="email-time">Mon 8:14 AM</span></div>
                    <div className="email-row email-subject">RE: <mark className="chat-highlight hl-case">Martinez</mark> deposition scheduling</div>
                    <div className="email-preview">Confirming the deposition of J. Rivera for <mark className="chat-highlight hl-meet">Tuesday at 0900</mark>. Please ensure the defense has reviewed Discovery Order #4471 beforehand.</div>
                    <div className="ann-row">
                      {renderDetail('person', 'Attorney', 'MAJ Kim · Trial Counsel', 'person')}
                      {renderDetail('doc', 'Document', 'Discovery Order #4471', 'doc')}
                      {renderDetail('meeting', 'Scheduled', 'Tue, 0900', 'date')}
                      {renderConnection('Kim prosecutes Case #4471')}
                    </div>
                  </div>
                </div>
                <div className="email-item annotated">
                  <span className="email-avatar av-neutral">FB</span>
                  <div className="email-body">
                    <div className="email-row email-top"><span className="email-from">Clerk, Fort Bragg</span><span className="email-time">Mon 9:02 AM</span></div>
                    <div className="email-row email-subject">FW: <mark className="chat-highlight hl-meet">Discovery Order</mark> — action required</div>
                    <div className="email-preview">Please acknowledge receipt by end of week. Discoverable materials are due back to the court no later than September 20th.</div>
                    <div className="ann-row">
                      {renderDetail('meeting', 'Deadline', 'Sep 20', 'date')}
                      {renderDetail('person', 'Court clerk', 'Fort Bragg', 'person')}
                    </div>
                  </div>
                </div>
                <div className="email-item annotated">
                  <span className="email-avatar av-sc">SC</span>
                  <div className="email-body">
                    <div className="email-row email-top"><span className="email-from">CPT Sarah Chen</span><span className="email-time">Tue 7:41 AM</span></div>
                    <div className="email-row email-subject">Deposition prep — Rivera transcript</div>
                    <div className="email-preview">Rivera's statement places him at <mark className="chat-highlight hl-place">the barracks</mark> until around <mark className="chat-highlight hl-meet">9:15 PM</mark> the night in question.</div>
                    <div className="ann-row">
                      {renderDetail('doc', 'Testimony', "Rivera's statement", 'doc')}
                      {renderDetail('meeting', 'Time referenced', '9:15 PM', 'date')}
                      {renderDetail('court', 'Location', 'The barracks', 'place')}
                    </div>
                  </div>
                </div>
                <div className="email-item annotated">
                  <span className="email-avatar av-neutral">CH</span>
                  <div className="email-body">
                    <div className="email-row email-top"><span className="email-from">Chambers of COL Hayes</span><span className="email-time">Tue 11:15 AM</span></div>
                    <div className="email-row email-subject">Notice — status conference confirmed</div>
                    <div className="email-preview">Pretrial status conference for Case #4471 on <mark className="chat-highlight hl-meet">September 14th at 10:00</mark>, <mark className="chat-highlight hl-place">Court Room 2</mark>.</div>
                    <div className="ann-row">
                      {renderDetail('meeting', 'Meeting', 'Sep 14', 'date')}
                      {renderDetail('person', 'Judge', 'COL Hayes', 'person')}
                      {renderDetail('court', 'Location', 'Court Room 2', 'place')}
                      {renderConnection('Hayes presides over Case #4471')}
                    </div>
                  </div>
                </div>
                <div className="email-item annotated">
                  <span className="email-avatar">DK</span>
                  <div className="email-body">
                    <div className="email-row email-top"><span className="email-from">MAJ David Kim</span><span className="email-time">Wed 3:30 PM</span></div>
                    <div className="email-row email-subject">Sanctions motion — status</div>
                    <div className="email-preview">Following up on the Article 128 charge and defense's discovery scope request.</div>
                    <div className="ann-row">
                      {renderDetail('scales', 'Charge', 'Art. 128 — Assault', 'doc')}
                      {renderDetail('doc', 'Motion', 'Discovery scope objection', 'doc')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="seam"><svg width="40" height="70" viewBox="0 0 40 70">
          <line className="seam-line" x1="20" y1="0" x2="20" y2="70" />
          <circle className="seam-dot" cx="20" cy="0" r="4">
            <animate attributeName="cy" values="0;70;0" dur="3.2s" repeatCount="indefinite" />
          </circle>
        </svg></div>
      </section>

      {/* ================= ACT 2: KNOWLEDGE GRAPH ================= */}
      <section className="act act2" id="act2">
        <div className="wrap">
          <div className="act-head reveal">
            <div className="act-eyebrow">02 — THE KNOWLEDGE GRAPH</div>
            <h2 className="act-title">Every fact becomes a node. Every connection becomes an edge.</h2>
            <p className="act-sub">This is the same case, restructured — attorneys, court, charges, documents, and meetings, all linked by the relationships that matter. Watch what happens as more cases join: each one is structured the same way, and at real scale, this is one graph holding every case the office has ever touched.</p>
          </div>

          <div className="graph-wrap">
            <svg viewBox="40 -40 1070 800">
              {/* ---------------- SCENE 1: one case, fully mapped ---------------- */}
              <g className={`scene scene1${graphScene === 0 ? ' active' : ''}`}>
                <path className="g-spoke" d="M600,350 L600,90" />
                <path className="g-spoke" d="M600,350 L803,188" />
                <path className="g-spoke" d="M600,350 L854,408" />
                <path className="g-spoke" d="M600,350 L713,584" />
                <path className="g-spoke" d="M600,350 L487,584" />
                <path className="g-spoke" d="M600,350 L346,408" />
                <path className="g-spoke" d="M600,350 L397,188" />

                <path className="g-cross" d="M803,188 L346,408" />
                <path className="g-cross" d="M397,188 L854,408" />
                <path className="g-cross" d="M600,90 L346,408" />

                <rect className="g-center" x="480" y="308" width="240" height="84" rx="12" />
                <text className="g-center-label" x="600" y="350" textAnchor="middle">U.S. v. Martinez</text>
                <text className="g-center-sub" x="600" y="374" textAnchor="middle">CASE</text>

                <circle className="g-node" cx="600" cy="90" r="8" />
                <circle className="g-node" cx="803" cy="188" r="8" />
                <circle className="g-node" cx="854" cy="408" r="8" />
                <circle className="g-node" cx="713" cy="584" r="8" />
                <circle className="g-node" cx="487" cy="584" r="8" />
                <circle className="g-node" cx="346" cy="408" r="8" />
                <circle className="g-node" cx="397" cy="188" r="8" />

                {renderNodeCard(600, 90, 'top', 'meeting', 'Pretrial Conference', 'Sep 14, 10:00 · Meeting', 'tierA', 1)}
                {renderNodeCard(803, 188, 'right', 'doc', 'Discovery Order #4471', 'Order · Document', 'tierA', 1)}
                {renderNodeCard(854, 408, 'right', 'person', 'MAJ David Kim', 'Trial Counsel · Attorney', 'tierA', 1)}
                {renderNodeCard(713, 584, 'bottom', 'scales', 'Art. 128 — Assault', 'Charge', 'tierA', 1)}
                {renderNodeCard(487, 584, 'bottom', 'court', 'Fort Bragg GCM', 'Venue · Court', 'tierA', 1)}
                {renderPropertyCard(346, 408, 'left')}
                <text className="prop-card-callout" x="194" y="330" textAnchor="middle">↑ every node carries its own properties</text>
                {renderNodeCard(397, 188, 'left', 'doc', 'Deposition — J. Rivera', 'Transcript · Document', 'tierA', 1)}

                <text className="scene-caption" x="600" y="740" textAnchor="middle">1 case in the graph — every attorney, filing, and deadline linked</text>
              </g>

              {/* ---------------- SCENE 2: two cases, connected by shared counsel ---------------- */}
              <g className={`scene scene2${graphScene === 1 ? ' active' : ''}`}>
                {renderMiniCluster(330, 340, 78, CLUSTER_A_DATA, 'U.S. v. Martinez', 'Case #4471', 'tierA')}
                {renderMiniCluster(870, 340, 78, CLUSTER_B_DATA, 'U.S. v. Alvarez', 'Case #4483', 'tierB')}
                <text className="scene-caption" x="600" y="740" textAnchor="middle">2 cases in the graph — structured the same way, ready to connect</text>
              </g>

              {/* ---------------- SCENE 3: the galaxy — graph at scale, fully interconnected ---------------- */}
              <g className={`scene scene3${graphScene === 2 ? ' active' : ''}`}>
                <g className="galaxy">
                  {GALAXY_EDGES.map((e, i) => (
                    <line key={'ge' + i} className={`galaxy-edge${e.hub ? ' hub-edge' : ''}`} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
                  ))}
                  {CORE_A_LINKS.map((s, i) => (
                    <line key={'ca' + i} className="galaxy-edge core-edge tierA" x1="330" y1="340" x2={s.x} y2={s.y} />
                  ))}
                  {CORE_B_LINKS.map((s, i) => (
                    <line key={'cb' + i} className="galaxy-edge core-edge tierB" x1="870" y1="340" x2={s.x} y2={s.y} />
                  ))}
                  {GALAXY_STARS.map((s, i) => (
                    <circle key={i} cx={s.x} cy={s.y} r={s.r} className={`galaxy-star${s.isHub ? ' hub-star' : ''}`} style={{ opacity: s.op, animationDelay: `${s.delay}s` }} />
                  ))}
                </g>
                <circle className="mc-node core tierA" cx="330" cy="340" r="11" />
                <text className="mc-core-label" x="330" y="314" textAnchor="middle">U.S. v. Martinez</text>
                <circle className="mc-node core tierB" cx="870" cy="340" r="11" />
                <text className="mc-core-label" x="870" y="314" textAnchor="middle">U.S. v. Alvarez</text>
                <text className="scene-caption" x="600" y="740" textAnchor="middle">At real scale: one graph, holding every case the office has ever touched</text>
              </g>
            </svg>

            <div className="scene-dots">
              <button type="button" className={`scene-dot-btn${graphScene === 0 ? ' active' : ''}`} onClick={() => setGraphScene(0)}>
                <span className="scene-dot" /><span className="scene-dot-label">1 case</span>
              </button>
              <button type="button" className={`scene-dot-btn${graphScene === 1 ? ' active' : ''}`} onClick={() => setGraphScene(1)}>
                <span className="scene-dot" /><span className="scene-dot-label">2 cases</span>
              </button>
              <button type="button" className={`scene-dot-btn${graphScene === 2 ? ' active' : ''}`} onClick={() => setGraphScene(2)}>
                <span className="scene-dot" /><span className="scene-dot-label">At scale</span>
              </button>
            </div>
          </div>
        </div>

        <div className="seam"><svg width="40" height="70" viewBox="0 0 40 70">
          <line className="seam-line" x1="20" y1="0" x2="20" y2="70" />
          <circle className="seam-dot" cx="20" cy="0" r="4">
            <animate attributeName="cy" values="0;70;0" dur="3.2s" repeatCount="indefinite" />
          </circle>
        </svg></div>
      </section>

      {/* ================= ACT 3: SOLUTIONS ================= */}
      <section className="act act3" id="act3">
        <div className="wrap">
          <div className="act-head reveal">
            <div className="act-eyebrow">03 — BUILT FOR ATTORNEYS</div>
            <h2 className="act-title">One graph traversal. Zero digging through three systems.</h2>
            <p className="act-sub">Every fact these tools use already lives in the graph, connected. Instead of an attorney searching SharePoint, then Teams, then their inbox, the graph resolves it in a single query — and hands the result straight into the work.</p>
            <a href="/live-demo" className="act3-live-link">Run this pipeline yourself, live →</a>
          </div>

          <div className="solutions-grid">
            <div className="solution-panel">
              <h4>R/S Memo Generation</h4>
              <div className="solution-tagline">Turns a graph query into a first-draft legal memo</div>
              <div className="example-status">In backlog</div>

              <div className="graph-query">
                {renderGraphQuery([
                  { icon: 'doc', label: 'Case #4471', kind: 'doc' },
                  { icon: 'person', label: 'Chen', kind: 'person' },
                  { icon: 'scales', label: 'Art. 128', kind: 'doc' },
                  { icon: 'court', label: 'Ft. Bragg', kind: 'place' },
                  { icon: 'meeting', label: 'Sep 14', kind: 'date' },
                ])}
                <div className="graph-query-caption">5 connected facts · 1 graph query</div>
              </div>
              <div className="gq-arrow">↓</div>

              <div className="memo-mock">
                <div className="memo-mock-title">MEMORANDUM FOR RECORD</div>
                <div className="memo-mock-re">RE: U.S. v. <mark className="mk mk-case">Martinez</mark> — Case #4471</div>
                <p className="memo-line ml-1">1. The defense, represented by <mark className="mk mk-att">CPT Sarah Chen</mark>, will contest the <mark className="mk mk-charge">Article 128</mark> charge at the upcoming <mark className="mk mk-court">Fort Bragg General Court-Martial</mark>.</p>
                <p className="memo-line ml-2">2. All discoverable materials, including the Rivera deposition, must be reviewed before the pretrial conference on <mark className="mk mk-meet">Sep 14</mark>.</p>
                <p className="memo-line ml-3">3. Recommend focusing cross-examination on the timeline discrepancy flagged in trial counsel's notes.</p>
              </div>
              <div className="mock-legend"><span className="mock-legend-swatch"></span> Highlighted text = pulled directly from the graph, not typed by a person</div>

              <p>No searching SharePoint for the order, Teams for the schedule, and email for the attorney of record — the graph already linked them. This is the first draft an attorney edits, not starts.</p>
            </div>

            <div className="solution-panel">
              <h4>Deposition Analysis</h4>
              <div className="solution-tagline">Cross-checks new testimony against the graph in real time</div>
              <div className="example-status">In backlog</div>

              <div className="graph-query">
                {renderGraphQuery([
                  { icon: 'doc', label: 'Deposition', kind: 'doc' },
                  { icon: 'person', label: 'Rivera', kind: 'person' },
                  { icon: 'doc', label: 'Discovery #4471', kind: 'doc' },
                ])}
                <div className="graph-query-caption">3 connected facts · 1 graph query</div>
              </div>
              <div className="gq-arrow">↓</div>

              <div className="transcript-mock">
                <div className="scan-bar"></div>
                <p className="tx-line tx-1"><span className="tx-q">Q:</span> Describe your whereabouts on the evening of March 3rd.</p>
                <p className="tx-line tx-2"><span className="tx-a">A:</span> I was at the barracks until about <mark className="mk mk-time">9:15 PM</mark>, then walked toward the mess hall.</p>
                <p className="tx-line tx-3"><span className="tx-q">Q:</span> Did you see the defendant at that time?</p>
                <p className="tx-line tx-4"><span className="tx-a">A:</span> No — not until <mark className="mk mk-time">closer to 10 PM</mark>, near the parking area.</p>
              </div>
              <div className="issue-mock">
                <div className="issue-row ir-1"><span className="issue-dot"></span><span>Timeline conflict — witness places self at barracks until 9:15 PM; cross-check vs. Discovery Order #4471</span></div>
                <div className="issue-row ir-2"><span className="issue-dot"></span><span>Sighting gap — no contact with defendant until ~10 PM</span></div>
                <div className="issue-row ir-3"><span className="issue-dot"></span><span>Corroboration needed — mess hall route unconfirmed by other witnesses</span></div>
              </div>

              <p>The graph already knows every date and name tied to this case, so new testimony gets checked against it the moment it lands — not weeks later during trial prep.</p>
            </div>

            <div className="solution-panel">
              <h4>Case Advisor</h4>
              <div className="solution-tagline">Scores risk from the graph and shows exactly why</div>
              <div className="example-status">In backlog</div>

              <div className="graph-query">
                {renderGraphQuery([
                  { icon: 'scales', label: 'Art. 128', kind: 'doc' },
                  { icon: 'doc', label: 'Discovery #4471', kind: 'doc' },
                  { icon: 'court', label: 'Ft. Bragg', kind: 'place' },
                ])}
                <div className="graph-query-caption">3 connected facts · 1 graph query</div>
              </div>
              <div className="gq-arrow">↓</div>

              <div className="reasoning-mock">
                <div className="reason-row rr-1"><span className="check ok">✓</span>Charge type: Article 128 — violent offense category</div>
                <div className="reason-row rr-2"><span className="check ok">✓</span>Venue: Fort Bragg GCM — standard proceeding</div>
                <div className="reason-row rr-3"><span className="check ok">✓</span>Discovery: Order #4471 active, 14-day window</div>
                <div className="reason-row rr-4 flag"><span className="check warn">⚑</span>Flag: timeline inconsistency noted in correspondence</div>
              </div>
              <div className="risk-result">
                <svg viewBox="0 0 120 66" className="risk-gauge-mini">
                  <path className="sol-gauge-bg" d="M10,60 A50,50 0 0 1 110,60" />
                  <path className="sol-gauge-fill" d="M10,60 A50,50 0 0 1 110,60" />
                </svg>
                <div className="risk-label">ELEVATED</div>
              </div>

              <p>No dashboard pulling from five spreadsheets — the same three connected nodes traversed above are what the score is built on, so every factor traces back to a real document.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FULL DIRECTORY ================= */}
      <section className="section problem" id="directory">
        <div className="wrap">
          <div className="section-label reveal">04 — The Full Pipeline</div>
          <h2 className="section-title reveal">Every decision currently in motion.</h2>
          <p className="section-intro reveal">22 decisions, mapped through DCD workshops with OTJAG stakeholders and prioritized by mission value. Three are in active build; the rest are sequenced in the backlog behind them.</p>

          <div className="directory-note reveal">
            <h3>Status, as of this build</h3>
            <span>3 active · 19 backlog</span>
          </div>

          <div className="dir-group reveal">
            <div className="dir-group-head"><span className="dir-dot active"></span><h4>In Active Build</h4><span>3</span></div>
            <div className="dir-grid">
              {ACTIVE_ITEMS.map((item, i) => (
                <div className="dir-card dir-card-active" key={i}>
                  <div className="dir-card-icon"><svg viewBox="0 0 16 16" fill="none">{miniIcon(item.icon)}</svg></div>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dir-group reveal">
            <div className="dir-group-head"><span className="dir-dot backlog"></span><h4>Backlog</h4><span>19</span></div>
            <div className="dir-grid">
              {backlogVisible.map((item, i) => (
                <div className="dir-card" key={backlogPage * BACKLOG_PAGE_SIZE + i}>
                  <div className="dir-card-icon"><svg viewBox="0 0 16 16" fill="none">{miniIcon(item.icon)}</svg></div>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="dir-pagination">
              <button
                type="button"
                className="dir-page-btn"
                onClick={() => setBacklogPage((p) => Math.max(0, p - 1))}
                disabled={backlogPage === 0}
              >← Prev</button>
              <div className="dir-page-dots">
                {Array.from({ length: backlogPageCount }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    className={`dir-page-dot${i === backlogPage ? ' active' : ''}`}
                    onClick={() => setBacklogPage(i)}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="dir-page-btn"
                onClick={() => setBacklogPage((p) => Math.min(backlogPageCount - 1, p + 1))}
                disabled={backlogPage === backlogPageCount - 1}
              >Next →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ENGAGEMENT SCOPE ================= */}
      <section className="section section-tight" id="scope">
        <div className="wrap">
          <div className="section-label reveal">05 — Engagement Scope</div>
          <h2 className="section-title reveal">Built on the same framework as everything else we ship.</h2>

          <div className="scope-grid">
            <div className="reveal">
              <p>This engagement runs on Decision-Centered Design, aligned to the DoD CDAO AI Adoption Strategy, the Army Data Plan, and the Unified Data Reference Architecture. We led structured DCD workshops with cross-functional OTJAG stakeholders to map the decisions that actually drive outcomes — that process is what surfaced the 22 use cases behind this pipeline.</p>
              <p>Every tool above is instrumented before deployment, not audited after the fact — the same TACTIC discipline described in our framework applies here without exception.</p>
              <a href="/#framework" className="btn-ghost">Read the full framework →</a>
            </div>
            <div className="reveal">
              <div className="align-list">
                <span className="align-chip">Current-State Architecture Assessment</span>
                <span className="align-chip">Organizational Research Report</span>
                <span className="align-chip">Governance &amp; Management Framework</span>
                <span className="align-chip">Data Maturity Blueprint</span>
                <span className="align-chip">Future-State Technical Architecture</span>
                <span className="align-chip">Hypothesis-Driven Data Strategy Roadmap</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section" id="contact">
        <div className="wrap cta-inner">
          <div className="reveal">
            <h2>Want the same rigor applied to your organization's decisions?</h2>
            <p>This is what Decision-Centered Design looks like end to end — from mapping the decisions that matter to instrumenting the evidence that proves they got better.</p>
            <div className="cta-actions">
              <a href="/live-demo" className="btn-primary">Try the live pipeline →</a>
              <a href="mailto:hello@deltalima.com" className="btn-ghost">Start a conversation</a>
            </div>
          </div>
        </div>
      </section>


      <footer>
        <div className="wrap footer-row">
          <a href="/" className="logo">
            <img className="logo-mark" src={LOGO} alt="Delta Lima" style={{width: '22px', height: '22px'}} />
            <span className="logo-word">Delta Lima</span>
          </a>
          <div className="footer-links">
            <a href="/#framework">Framework</a>
            <a href="/case-study-otjag">OTJAG</a>
            <a href="/#contact">Contact</a>
          </div>
          <span className="fine">© 2026 Delta Lima. Decision-Centered Design.</span>
        </div>
      </footer>
    </>
  );
}