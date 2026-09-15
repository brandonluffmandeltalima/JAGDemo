import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Zap, FileText, CheckCircle, Network, ChevronDown, ChevronUp, Filter, Tag, GitBranch, Sparkles, Scale, Search, Gauge, AlertTriangle } from 'lucide-react';
import * as d3 from "d3-force";

const LOGO = "data:image/png;base64,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";
export default function LiveDemoPage() {
  const [processing, setProcessing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(null); // classification | ner | graph | summary | complete
  const [expandedEntities, setExpandedEntities] = useState({});
  const [entityPage, setEntityPage] = useState(0);
  const ENTITY_PAGE_SIZE = 6;
  const [sourcePage, setSourcePage] = useState(0);
  const SOURCE_PAGE_SIZE = 3;
  const [classificationRevealCount, setClassificationRevealCount] = useState(0);
  const [typedMemo, setTypedMemo] = useState('');
  const [memoTyping, setMemoTyping] = useState(false);

  const classificationRef = useRef(null);
  const sourcesAnnotatedRef = useRef(null);
  const graphRef = useRef(null);
  const solutionsRef = useRef(null);

  const STAGE_ORDER = ['classification', 'ner', 'graph', 'summary', 'complete'];
  const stageAtLeast = (s) => pipelineStep && STAGE_ORDER.indexOf(pipelineStep) >= STAGE_ORDER.indexOf(s);
  const annotationsReady = stageAtLeast('ner');

  // Measure the real site header so sticky/scroll offsets line up beneath it
  useEffect(() => {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const setHeaderHeight = () => {
      document.documentElement.style.setProperty('--live-header-h', `${header.getBoundingClientRect().height}px`);
    };
    setHeaderHeight();
    function onHeaderScroll(){ header.classList.toggle('scrolled', window.scrollY > 30); setHeaderHeight(); }
    window.addEventListener('scroll', onHeaderScroll);
    window.addEventListener('resize', setHeaderHeight);
    return () => {
      window.removeEventListener('scroll', onHeaderScroll);
      window.removeEventListener('resize', setHeaderHeight);
    };
  }, []);

  useEffect(() => { setEntityPage(0); }, [pipelineStep]);

  const toggleEntityExpansion = (idx) => {
    setExpandedEntities((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // ---- one deliberate scroll per stage, not a fight with the user's own scrolling ----
  useEffect(() => {
    const refs = { classification: classificationRef, ner: sourcesAnnotatedRef, graph: graphRef, summary: solutionsRef };
    const target = refs[pipelineStep];
    if (!target) return;
    const id = setTimeout(() => {
      target.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(id);
  }, [pipelineStep]);

  const MEMO_TEXT = "MEMORANDUM FOR RECORD\n\nRE: U.S. v. Martinez \u2014 Case #4471\n\n1. The defense, represented by CPT Sarah Chen, will contest the Article 128 charge at the upcoming Fort Bragg General Court-Martial, COL Patricia Hayes presiding.\n\n2. All discoverable materials, including the Rivera deposition, must be reviewed before the pretrial conference on September 14 at 10:00.\n\n3. Trial Counsel MAJ David Kim confirms discovery materials are due back to the court by September 20, 2026.";

  useEffect(() => {
    if (pipelineStep !== 'summary') return;
    setMemoTyping(true);
    setTypedMemo('');
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTypedMemo(MEMO_TEXT.slice(0, i));
      if (i >= MEMO_TEXT.length) {
        clearInterval(id);
        setMemoTyping(false);
        setPipelineStep('complete');
        setProcessing(false);
      }
    }, 24);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipelineStep]);

  // ---- classification reveals items one at a time, and STAYS revealed afterward ----
  useEffect(() => {
    if (pipelineStep === 'classification') {
      let count = 0;
      setClassificationRevealCount(0);
      const id = setInterval(() => {
        count += 1;
        setClassificationRevealCount(count);
        if (count >= ALL_ITEMS.length) clearInterval(id);
      }, 550);
      return () => clearInterval(id);
    }
    // once we've moved on, make sure everything already classified stays visible
    if (pipelineStep && STAGE_ORDER.indexOf(pipelineStep) > STAGE_ORDER.indexOf('classification')) {
      setClassificationRevealCount(ALL_ITEMS.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipelineStep]);

  const runPipeline = () => {
    setProcessing(true);
    setSourcePage(0);
    setPipelineStep('classification');
    setTimeout(() => setPipelineStep('ner'), 5200);
    setTimeout(() => setPipelineStep('graph'), 9200);
    setTimeout(() => setPipelineStep('summary'), 12600);
  };

  // ---- entity colors, shared across highlighting + graph + entity cards ----
  const ENTITY_COLORS = { PERSON: '#EFAD4E', DATE: '#9C8FF2', CASE: '#54D6CA', COURT: '#FB7185', JUDGE: '#38BDF8', STATUTE: '#818CF8' };

  const highlightText = (text, terms) => {
    if (!annotationsReady) return text;
    const found = [];
    terms.forEach((t) => {
      const idx = text.indexOf(t.match);
      if (idx !== -1) found.push({ ...t, start: idx, end: idx + t.match.length });
    });
    found.sort((a, b) => a.start - b.start);
    const clean = [];
    let lastEnd = -1;
    found.forEach((m) => { if (m.start >= lastEnd) { clean.push(m); lastEnd = m.end; } });
    const nodes = [];
    let cursor = 0;
    clean.forEach((m, i) => {
      if (m.start > cursor) nodes.push(text.slice(cursor, m.start));
      nodes.push(
        <mark key={i} className="src-highlight" style={{ '--hl-color': ENTITY_COLORS[m.type] }}>
          {text.slice(m.start, m.end)}
        </mark>
      );
      cursor = m.end;
    });
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
  };

  // ---- one unified list of every source item (documents, messages, emails) ----
  const ALL_ITEMS = [
    {
      id: 'sp1', source: 'SharePoint', type: 'doc', label: 'Discovery_Order_4471.docx', confidence: 97,
      text: "IN THE GENERAL COURT-MARTIAL, Fort Bragg, North Carolina \u2014 United States v. SPC Michael Martinez, Case No. 4471. ORDER ON DISCOVERY. Pursuant to R.C.M. 701, the accused is charged under Article 128, UCMJ (Assault Consummated by a Battery), to be tried before the Fort Bragg General Court-Martial, Presiding Judge COL Patricia Hayes. The Government shall produce all discoverable materials, including the deposition transcript of J. Rivera, no later than 20 September 2026.",
      terms: [
        { match: 'SPC Michael Martinez', type: 'PERSON' },
        { match: 'Case No. 4471', type: 'CASE' },
        { match: 'Article 128, UCMJ', type: 'STATUTE' },
        { match: 'Fort Bragg General Court-Martial', type: 'COURT' },
        { match: 'COL Patricia Hayes', type: 'JUDGE' },
        { match: 'J. Rivera', type: 'PERSON' },
        { match: '20 September 2026', type: 'DATE' }
      ]
    },
    {
      id: 'sp2', source: 'SharePoint', type: 'doc', label: 'Motion_to_Compel_4471.docx', confidence: 89,
      text: "Defense counsel CPT Sarah Chen hereby moves to compel production of all unit taskings referenced in the Government's discovery response for Case No. 4471. The motion is set for hearing alongside the pretrial conference on September 14, 2026.",
      terms: [
        { match: 'CPT Sarah Chen', type: 'PERSON' },
        { match: 'Case No. 4471', type: 'CASE' },
        { match: 'September 14, 2026', type: 'DATE' }
      ]
    },
    {
      id: 'tm1', source: 'Teams', type: 'chat', label: 'CPT Sarah Chen', sub: 'JAG-2 Trial Team', initials: 'SC', time: '9:14 AM', confidence: 93,
      text: 'Pretrial conference got moved to Sep 14, 10:00 \u2014 court room 2.',
      terms: [{ match: 'Sep 14, 10:00', type: 'DATE' }]
    },
    {
      id: 'tm2', source: 'Teams', type: 'chat', label: 'Trial Team', sub: 'JAG-2 Trial Team', initials: 'TT', time: '10:47 AM', confidence: 88,
      text: 'Deposition transcript for J. Rivera just landed in the shared folder.',
      terms: [{ match: 'J. Rivera', type: 'PERSON' }]
    },
    {
      id: 'tm3', source: 'Teams', type: 'chat', label: 'MAJ David Kim', sub: 'JAG-2 Trial Team', initials: 'DK', time: '2:03 PM', confidence: 91,
      text: 'Judge Hayes wants a status update before the 14th.',
      terms: [{ match: 'Judge Hayes', type: 'JUDGE' }]
    },
    {
      id: 'em1', source: 'Email', type: 'email', label: 'RE: Martinez deposition scheduling', from: 'MAJ David Kim <d.kim@army.mil>', to: 'CPT Sarah Chen <s.chen@army.mil>', confidence: 96,
      text: 'Confirming the deposition of J. Rivera for Tuesday at 0900. Please ensure the defense has reviewed Discovery Order #4471 beforehand.',
      terms: [{ match: 'J. Rivera', type: 'PERSON' }, { match: 'Discovery Order #4471', type: 'CASE' }]
    },
    {
      id: 'em2', source: 'Email', type: 'email', label: 'Sanctions motion \u2014 status', from: 'MAJ David Kim <d.kim@army.mil>', to: 'CPT Sarah Chen <s.chen@army.mil>', confidence: 85,
      text: "Following up on the Article 128 charge and the defense's discovery scope request. No objection filed yet.",
      terms: [{ match: 'Article 128', type: 'STATUTE' }]
    }
  ];

  const SP_ITEMS = ALL_ITEMS.filter((i) => i.source === 'SharePoint');
  const TM_ITEMS = ALL_ITEMS.filter((i) => i.source === 'Teams');
  const EM_ITEMS = ALL_ITEMS.filter((i) => i.source === 'Email');

  const renderItemBody = (item) => {
    if (item.type === 'doc') {
      return (
        <>
          <div className="doc-preview-titlebar">
            <span className="doc-preview-dot"></span> {item.label}
            <span className="doc-preview-filetype">DOCX</span>
          </div>
          <p className="doc-preview-text">{highlightText(item.text, item.terms)}</p>
        </>
      );
    }
    if (item.type === 'chat') {
      return (
        <>
          <div className="chat-preview-bubble-head"><strong>{item.label}</strong><span>{item.time}</span></div>
          <p>{highlightText(item.text, item.terms)}</p>
        </>
      );
    }
    return (
      <>
        <div className="email-preview-row"><span>From:</span> {item.from}</div>
        <div className="email-preview-row"><span>To:</span> {item.to}</div>
        <div className="email-preview-divider"></div>
        <p className="email-preview-body">{highlightText(item.text, item.terms)}</p>
      </>
    );
  };

  // ---- merged results, as if the graph had ingested all three sources together ----
  const MERGED_ENTITIES = [
    { text: 'SPC Michael Martinez', type: 'PERSON', color: ENTITY_COLORS.PERSON, source: 'SharePoint', properties: { Role: 'Defendant', Case: '#4471' } },
    { text: 'Case No. 4471', type: 'CASE', color: ENTITY_COLORS.CASE, source: 'SharePoint', properties: { Charge: 'Article 128', Venue: 'Fort Bragg GCM' } },
    { text: 'Article 128, UCMJ', type: 'STATUTE', color: ENTITY_COLORS.STATUTE, source: 'SharePoint', properties: { Description: 'Assault Consummated by a Battery' } },
    { text: 'Fort Bragg General Court-Martial', type: 'COURT', color: ENTITY_COLORS.COURT, source: 'SharePoint', properties: { Location: 'Fort Bragg, NC' } },
    { text: 'COL Patricia Hayes', type: 'JUDGE', color: ENTITY_COLORS.JUDGE, source: 'SharePoint', properties: { Role: 'Presiding Judge' } },
    { text: 'CPT Sarah Chen', type: 'PERSON', color: ENTITY_COLORS.PERSON, source: 'Teams', properties: { Role: 'Defense Counsel' } },
    { text: 'Sep 14, 2026 \u2014 10:00', type: 'DATE', color: ENTITY_COLORS.DATE, source: 'Teams', properties: { Event: 'Pretrial Conference' } },
    { text: 'J. Rivera', type: 'PERSON', color: ENTITY_COLORS.PERSON, source: 'Teams', properties: { Role: 'Witness' } },
    { text: 'MAJ David Kim', type: 'PERSON', color: ENTITY_COLORS.PERSON, source: 'Email', properties: { Role: 'Trial Counsel' } },
    { text: 'Discovery Order #4471', type: 'CASE', color: ENTITY_COLORS.CASE, source: 'Email', properties: { Status: 'Pending review' } },
    { text: '20 September 2026', type: 'DATE', color: ENTITY_COLORS.DATE, source: 'SharePoint', properties: { Event: 'Discovery deadline' } }
  ];

  const RELATIONSHIPS = [
    { from: 'CPT Sarah Chen', to: 'SPC Michael Martinez', label: 'REPRESENTS' },
    { from: 'MAJ David Kim', to: 'Case No. 4471', label: 'PROSECUTES' },
    { from: 'SPC Michael Martinez', to: 'Article 128, UCMJ', label: 'CHARGED UNDER' },
    { from: 'Case No. 4471', to: 'Fort Bragg General Court-Martial', label: 'VENUE' },
    { from: 'COL Patricia Hayes', to: 'Case No. 4471', label: 'PRESIDES OVER' },
    { from: 'J. Rivera', to: 'Case No. 4471', label: 'WITNESS IN' },
    { from: 'Case No. 4471', to: 'Sep 14, 2026 \u2014 10:00', label: 'SCHEDULED FOR' }
  ];

  const GRAPH_DATA = {
    nodes_added: MERGED_ENTITIES.map((e) => ({ id: e.text, label: e.text, type: e.type })),
    relationships: RELATIONSHIPS.map((r) => ({ from: r.from, to: r.to, relation: r.label }))
  };

  const visibleEntities = MERGED_ENTITIES.slice(entityPage * ENTITY_PAGE_SIZE, entityPage * ENTITY_PAGE_SIZE + ENTITY_PAGE_SIZE);
  const entityPageCount = Math.ceil(MERGED_ENTITIES.length / ENTITY_PAGE_SIZE);

  const visibleSources = ALL_ITEMS.slice(sourcePage * SOURCE_PAGE_SIZE, sourcePage * SOURCE_PAGE_SIZE + SOURCE_PAGE_SIZE);
  const sourcePageCount = Math.ceil(ALL_ITEMS.length / SOURCE_PAGE_SIZE);

  return (
    <div className="app-container">
      <Head>
        <title>Live Pipeline {'\u2014'} Delta Lima</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340;9..144,420;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="grid-field"></div>

      <header id="siteHeader">
        <div className="wrap">
          <a href="/" className="logo">
            <img className="logo-mark" src={LOGO} alt="Delta Lima" />
            <span className="logo-word">Delta Lima</span>
          </a>
          <nav className="links">
            <a href="/case-studies/otjag#framework">Framework</a>
            <a href="/case-studies/otjag#otjag">OTJAG</a>
            <a href="/case-studies/otjag#roi">Why it works</a>
            <a href="/case-studies/otjag#contact" className="nav-cta">Talk to us</a>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="mvp-container">

          {pipelineStep && (
            <div className="fixed-progress-bar">
              <div className="pipeline-progress">
                <div className="pipeline-track">
                  <div
                    className="pipeline-track-fill"
                    style={{ width: `${{ classification: 0, ner: 33.3, graph: 66.6, summary: 100, complete: 100 }[pipelineStep] || 0}%` }}
                  ></div>
                </div>
                <div className={`progress-step ${pipelineStep === 'classification' ? 'active' : stageAtLeast('ner') ? 'complete' : ''}`}>
                  <div className="progress-icon"><Filter size={18} /></div>
                  <span>Classification</span>
                </div>
                <div className={`progress-step ${pipelineStep === 'ner' ? 'active' : stageAtLeast('graph') ? 'complete' : ''}`}>
                  <div className="progress-icon"><Tag size={18} /></div>
                  <span>NER</span>
                </div>
                <div className={`progress-step ${pipelineStep === 'graph' ? 'active' : stageAtLeast('summary') ? 'complete' : ''}`}>
                  <div className="progress-icon"><GitBranch size={18} /></div>
                  <span>Graph Update</span>
                </div>
                <div className={`progress-step ${pipelineStep === 'summary' ? 'active' : pipelineStep === 'complete' ? 'complete' : ''}`}>
                  <div className="progress-icon"><Sparkles size={18} /></div>
                  <span>Solutions</span>
                </div>
              </div>
            </div>
          )}

          <div className="mvp-header">
            <div className="mvp-icon-wrap">
              <Network className="mvp-icon" />
            </div>
            <div className="mvp-header-text">
              <h2 className="mvp-title">Live Knowledge Graph Pipeline</h2>
              <p className="mvp-subtitle">SharePoint, Teams, and Email — processed together into one graph</p>
            </div>
            <div className="mvp-source-badges">
              <span className="mvp-source-badge sp" title="SharePoint">S</span>
              <span className="mvp-source-badge tm" title="Teams">T</span>
              <span className="mvp-source-badge em" title="Email">E</span>
            </div>
          </div>

          {/* ---- three fixed, realistic source previews — hover any item to preview it ---- */}
          <div className="sources-preview-grid">
            <div className="source-preview-card sp-preview">
              <div className="source-preview-head">
                <span className="source-preview-badge sp">S</span>
                <div>
                  <h4>SharePoint</h4>
                  <span className="source-preview-tag">Case files &amp; filings</span>
                </div>
              </div>
              <div className="source-item-list">
                {SP_ITEMS.map((item) => (
                  <div className="source-item" tabIndex={0} key={item.id}>
                    <FileText size={14} className="source-item-icon" />
                    <span className="source-item-name">{item.label}</span>
                    <div className="source-item-preview">{renderItemBody(item)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="source-preview-card tm-preview">
              <div className="source-preview-head">
                <span className="source-preview-badge tm">T</span>
                <div>
                  <h4>Teams</h4>
                  <span className="source-preview-tag">Channels &amp; chats</span>
                </div>
              </div>
              <div className="source-item-list">
                {TM_ITEMS.map((item) => (
                  <div className="source-item" tabIndex={0} key={item.id}>
                    <span className="source-item-avatar">{item.initials}</span>
                    <span className="source-item-name">{item.label} <span className="source-item-sub">{'\u00b7'} {item.sub}</span></span>
                    <div className="source-item-preview">{renderItemBody(item)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="source-preview-card em-preview">
              <div className="source-preview-head">
                <span className="source-preview-badge em">E</span>
                <div>
                  <h4>Email</h4>
                  <span className="source-preview-tag">Attorney correspondence</span>
                </div>
              </div>
              <div className="source-item-list">
                {EM_ITEMS.map((item) => (
                  <div className="source-item" tabIndex={0} key={item.id}>
                    <span className="source-item-icon email-dot"></span>
                    <span className="source-item-name">{item.label}</span>
                    <div className="source-item-preview">{renderItemBody(item)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="run-pipeline-row">
            <button className={`process-button ${processing ? 'processing' : ''}`} onClick={runPipeline} disabled={processing}>
              {processing ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Process All Sources
                </>
              )}
            </button>
            <p className="run-pipeline-hint">Hover any item above to preview it. Runs the same pipeline from the case study — on all three sources, at once.</p>
          </div>

          {/* ---- results ---- */}
          {stageAtLeast('classification') && (
            <div className="results-card classification-card" ref={classificationRef}>
              <h3 className="results-title">Classification</h3>
              <div className="classification-grid">
                {ALL_ITEMS.map((item, idx) => (
                  <div className={`classification-row${idx < classificationRevealCount ? ' revealed' : ''}`} key={item.id}>
                    <span className="classification-source-tag">{item.source}</span>
                    <span className="classification-item-label">{item.label}</span>
                    <div className="classification-right">
                      <span className="confidence-score">{item.confidence}% confidence</span>
                      <span className="classification-badge relevant"><CheckCircle size={13} /> Relevant</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stageAtLeast('ner') && (
            <div className="results-card sources-annotated-card" ref={sourcesAnnotatedRef}>
              <div className="entities-card-head">
                <h3 className="results-title">Named Entity Recognition (NER)</h3>
                <span className="entities-count">{ALL_ITEMS.length} items across 3 systems</span>
              </div>
              <p className="ner-section-hint">Highlights below are <strong>entities</strong>. Under each item: the <strong>properties</strong> pulled from it, and any <strong>relationships</strong> it contributes to the graph.</p>
              <div className="annotated-source-list">
                {visibleSources.map((item) => {
                  const itemRels = RELATIONSHIPS.filter((r) => item.terms.some((t) => t.match === r.from || t.match === r.to));
                  return (
                  <div className="annotated-source-item" key={item.id}>
                    <div className="annotated-source-item-tag">
                      <span className={`mini-source-badge ${item.source === 'SharePoint' ? 'sp' : item.source === 'Teams' ? 'tm' : 'em'}`}>
                        {item.source === 'SharePoint' ? 'S' : item.source === 'Teams' ? 'T' : 'E'}
                      </span>
                      {item.source}
                    </div>
                    <div className="annotated-source-item-body">{renderItemBody(item)}</div>
                    <div className="ner-extract-section">
                      <div className="ner-extract-label">Properties extracted</div>
                      <div className="ner-extract-row">
                        {item.terms.map((t, i) => (
                          <span key={i} className="ner-extract-chip" style={{ '--hl-color': ENTITY_COLORS[t.type] }}>
                            <span className="ner-extract-type">{t.type}</span>{t.match}
                          </span>
                        ))}
                      </div>
                      {itemRels.length > 0 && (
                        <>
                          <div className="ner-extract-label">Relationships contributed</div>
                          <div className="ner-extract-row">
                            {itemRels.map((r, i) => (
                              <span key={i} className="ner-rel-chip">{r.from} <em>{r.label}</em> {r.to}</span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
              {sourcePageCount > 1 && (
                <div className="entities-pagination">
                  <button type="button" className="entities-page-btn" onClick={() => setSourcePage((p) => Math.max(0, p - 1))} disabled={sourcePage === 0}>← Prev</button>
                  <div className="entities-page-dots">
                    {Array.from({ length: sourcePageCount }).map((_, i) => (
                      <button type="button" key={i} className={`entities-page-dot${i === sourcePage ? ' active' : ''}`} onClick={() => setSourcePage(i)} aria-label={`Page ${i + 1}`} />
                    ))}
                  </div>
                  <button type="button" className="entities-page-btn" onClick={() => setSourcePage((p) => Math.min(sourcePageCount - 1, p + 1))} disabled={sourcePage >= sourcePageCount - 1}>Next →</button>
                </div>
              )}
            </div>
          )}

          {stageAtLeast('ner') && (
            <div className="results-card entities-card">
              <div className="entities-card-head">
                <h3 className="results-title">Extracted Entities with Properties</h3>
                <span className="entities-count">{MERGED_ENTITIES.length} total, from 3 sources</span>
              </div>
              <div className="entities-list-enhanced">
                {visibleEntities.map((entity, sliceIdx) => {
                  const idx = entityPage * ENTITY_PAGE_SIZE + sliceIdx;
                  return (
                    <div key={idx} className="entity-card-enhanced" style={{ borderLeftColor: entity.color }}>
                      <div className="entity-header-enhanced">
                        <div className="entity-main-info">
                          <span className="entity-text-enhanced">{entity.text}</span>
                          <span className="entity-source-tag">{entity.source}</span>
                        </div>
                        <button className="entity-expand-btn" onClick={() => toggleEntityExpansion(idx)}>
                          {expandedEntities[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {expandedEntities[idx] && (
                        <div className="entity-properties">
                          <strong>Properties:</strong>
                          <ul>
                            {Object.entries(entity.properties).map(([key, value], pidx) => (
                              <li key={pidx}>
                                <span className="prop-key">{key}:</span>
                                <span className="prop-value">{value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {entityPageCount > 1 && (
                <div className="entities-pagination">
                  <button type="button" className="entities-page-btn" onClick={() => setEntityPage((p) => Math.max(0, p - 1))} disabled={entityPage === 0}>← Prev</button>
                  <div className="entities-page-dots">
                    {Array.from({ length: entityPageCount }).map((_, i) => (
                      <button type="button" key={i} className={`entities-page-dot${i === entityPage ? ' active' : ''}`} onClick={() => setEntityPage(i)} aria-label={`Page ${i + 1}`} />
                    ))}
                  </div>
                  <button type="button" className="entities-page-btn" onClick={() => setEntityPage((p) => Math.min(entityPageCount - 1, p + 1))} disabled={entityPage >= entityPageCount - 1}>Next →</button>
                </div>
              )}
            </div>
          )}

          {stageAtLeast('ner') && (
            <div className="results-card relationships-card">
              <h3 className="results-title">Detected Relationships</h3>
              <div className="relationships-list-enhanced">
                {RELATIONSHIPS.map((r, i) => (
                  <div className="relationship-card-enhanced" key={i}>
                    <div className="relationship-main">
                      <span className="rel-node">{r.from}</span>
                      <span className="rel-arrow">→</span>
                      <span className="rel-type">{r.label}</span>
                      <span className="rel-arrow">→</span>
                      <span className="rel-node">{r.to}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stageAtLeast('graph') && (
            <div className="graph-section" ref={graphRef}>
              <GraphVisualization graphData={GRAPH_DATA} />
            </div>
          )}

          {stageAtLeast('summary') && (
            <div className="results-card solutions-section" ref={solutionsRef}>
              <h3 className="results-title solutions-title">OTJAG Solutions</h3>

              <div className="solution-card-mvp solution-memo">
                <div className="solution-card-side">
                  <div className="solution-icon-mvp"><Scale size={22} /></div>
                  <h4>Risk/Strategy Memo</h4>
                  <p className="solution-tagline-mvp">Auto-drafted the moment the graph updates \u2014 the attorney edits, doesn't start from a blank page.</p>
                  <div className="solution-meta-chips">
                    <span className="solution-meta-chip">5 facts pulled from the graph</span>
                    <span className="solution-meta-chip">0 searches across 3 systems</span>
                  </div>
                </div>
                <div className="solution-card-main">
                  <div className="memo-drafting-indicator">
                    <span className="memo-drafting-dot"></span> Drafting from the graph{'\u2026'}
                  </div>
                  <div className="memo-output memo-output-full">
                    {typedMemo}
                    {memoTyping && <span className="typing-cursor">|</span>}
                  </div>
                </div>
              </div>

              <div className="solution-card-mvp solution-dep">
                <div className="solution-card-side">
                  <div className="solution-icon-mvp"><Search size={22} /></div>
                  <h4>Deposition Analysis</h4>
                  <p className="solution-tagline-mvp">Every new line of testimony is cross-checked against the graph the moment it's read.</p>
                  <div className="solution-meta-chips">
                    <span className="solution-meta-chip">2 flags raised</span>
                    <span className="solution-meta-chip">Checked vs. Discovery #4471</span>
                  </div>
                </div>
                <div className="solution-card-main">
                  <div className="dep-scan-mock dep-scan-mock-full">
                    <div className="dep-scan-sweep"></div>
                    <p className="dep-line"><span className="dep-q">Q:</span> Describe your whereabouts on the evening of March 3rd.</p>
                    <p className="dep-line"><span className="dep-a">A:</span> I was at the barracks until about <mark className="dep-mark">9:15 PM</mark>, then walked toward the mess hall.</p>
                    <p className="dep-line dep-line-2"><span className="dep-q">Q:</span> Did you see the defendant at that time?</p>
                    <p className="dep-line dep-line-2"><span className="dep-a">A:</span> No \u2014 not until <mark className="dep-mark">closer to 10 PM</mark>, near the parking area.</p>
                  </div>
                  <div className="dep-issue-row dep-issue-1">
                    <AlertTriangle size={14} />
                    Timeline conflict \u2014 witness places self at barracks until 9:15 PM; cross-check vs. Discovery Order #4471
                  </div>
                  <div className="dep-issue-row dep-issue-2">
                    <AlertTriangle size={14} />
                    Sighting gap \u2014 no contact with defendant until ~10 PM
                  </div>
                </div>
              </div>

              <div className="solution-card-mvp solution-risk">
                <div className="solution-card-side">
                  <div className="solution-icon-mvp"><Gauge size={22} /></div>
                  <h4>Case Risk Advisor</h4>
                  <p className="solution-tagline-mvp">Scored from the same connected nodes shown above \u2014 not a hidden formula.</p>
                  <div className="solution-meta-chips">
                    <span className="solution-meta-chip">3 factors weighed</span>
                    <span className="solution-meta-chip">1 flag surfaced</span>
                  </div>
                </div>
                <div className="solution-card-main solution-risk-main">
                  <div className="risk-gauge-wrap">
                    <svg className="risk-gauge-mvp" viewBox="0 0 130 72">
                      <path className="risk-gauge-bg" d="M12,64 A53,53 0 0 1 118,64" />
                      <path className="risk-gauge-fill" d="M12,64 A53,53 0 0 1 118,64" />
                    </svg>
                    <div className="risk-label-mvp">ELEVATED</div>
                  </div>
                  <div className="risk-reasons-mvp">
                    <div className="risk-reason-row ok reason-1"><CheckCircle size={14} /> Charge: Article 128 \u2014 violent offense category</div>
                    <div className="risk-reason-row ok reason-2"><CheckCircle size={14} /> Venue: Fort Bragg GCM \u2014 standard proceeding</div>
                    <div className="risk-reason-row ok reason-3"><CheckCircle size={14} /> Discovery: Order #4471 active, 14-day window</div>
                    <div className="risk-reason-row warn reason-4"><AlertTriangle size={14} /> Flag: timeline inconsistency noted in correspondence</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function GraphVisualization({ graphData }) {
  const containerRef = useRef(null);
  const simulationRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [hoverNode, setHoverNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 1100, height: 620 });

  const NODE_RADIUS = 30;
  const MARGIN = 50; // prevent clipping at edges

  const entityAccent = {
    PERSON: "#EFAD4E",
    LOCATION: "#3E8EF7",
    DATE: "#9C8FF2",
    CASE: "#54D6CA",
    COURT: "#FB7185",
    JUDGE: "#38BDF8",
    MOTION: "#FB923C",
    HEARING: "#E879F9",
    PARTY_ENTITY: "#34D399",
    STATUTE: "#818CF8",
    LEGAL_ISSUE: "#C084FC",
    PRECEDENT: "#A3E635",
    CONTRACT: "#22D3EE",
    CLAUSE: "#A8A29E",
    EVIDENCE: "#FACC15"
  };

  /* ---------- resize ---------- */
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height
      });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------- build graph ---------- */
useEffect(() => {
  if (!graphData) return;

  const nodeMap = new Map(); // keyed by canonical id only

  graphData.nodes_added.forEach((n, i) => {
    const angle = (i / graphData.nodes_added.length) * 2 * Math.PI;
    const nodeObj = {
      id: n.id || n.label,
      label: n.label,
      type: n.type,
      x: dimensions.width / 2 + Math.cos(angle) * 200,
      y: dimensions.height / 2 + Math.sin(angle) * 200
    };
    nodeMap.set(nodeObj.id, nodeObj);
  });

  // Build a separate lookup by label for relationship resolution
  const labelMap = new Map();
  nodeMap.forEach(n => labelMap.set(n.label.toLowerCase(), n));

  const findNode = (key) => {
    if (!key) return null;
    // 1. exact id match
    if (nodeMap.has(key)) return nodeMap.get(key);
    // 2. exact label match (case-insensitive)
    if (labelMap.has(key.toLowerCase())) return labelMap.get(key.toLowerCase());
    // 3. label contains key OR key contains label — pick longest match to avoid false positives
    let best = null;
    let bestLen = 0;
    nodeMap.forEach(n => {
      const nl = n.label.toLowerCase();
      const kl = key.toLowerCase();
      if ((nl.includes(kl) || kl.includes(nl)) && nl.length > bestLen) {
        best = n;
        bestLen = nl.length;
      }
    });
    return best;
  };

  const builtLinks = graphData.relationships
    .map(r => {
      const source = findNode(r.from);
      const target = findNode(r.to);
      if (!source || !target || source.id === target.id) return null;
      return { source, target, label: r.relation || r.type || "RELATED_TO" };
    })
    .filter(Boolean);

  // Deduplicate links (same source+target pair)
  const seen = new Set();
  const dedupedLinks = builtLinks.filter(l => {
    const key = `${l.source.id}__${l.target.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  setNodes([...nodeMap.values()]);
  setLinks(dedupedLinks);
}, [graphData, dimensions]);

  /* ---------- force simulation ---------- */
  useEffect(() => {
    if (!nodes.length) return;

    simulationRef.current?.stop();

    simulationRef.current = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id(d => d.id)
          .distance(160)
          .strength(0.9)
      )
      .force("charge", d3.forceManyBody().strength(-420))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
      )
      .force("collision", d3.forceCollide().radius(NODE_RADIUS + 22))
      .force("xBound", d3.forceX(dimensions.width / 2).strength(0.1))
      .force("yBound", d3.forceY(dimensions.height / 2).strength(0.1))
      .alpha(1)
      .restart();

    simulationRef.current.on("tick", () => {
  nodes.forEach(n => {
    n.x = Math.max(MARGIN, Math.min(dimensions.width - MARGIN, n.x));
    n.y = Math.max(MARGIN, Math.min(dimensions.height - MARGIN, n.y));
  });
  setNodes([...nodes]);
  setLinks([...links]);
});

    return () => simulationRef.current?.stop();
  }, [nodes.length, links.length, dimensions]);

  return (
    <div ref={containerRef} className="graph-shell">
      <header className="graph-header">
        <h2>Knowledge Graph</h2>
      </header>
      <svg className="graph-svg" width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        {/* ----- edges ----- */}
        <g>
          {links.map((l, i) => {
            const active =
              hoverNode &&
              (l.source.id === hoverNode || l.target.id === hoverNode);

            return (
              <g key={i}>
                <line
                  x1={l.source.x}
                  y1={l.source.y}
                  x2={l.target.x}
                  y2={l.target.y}
                  className={`edge ${active ? "active" : ""}`}
                />
                <text
                  x={(l.source.x + l.target.x) / 2}
                  y={(l.source.y + l.target.y) / 2 - 4}
                  className="edge-label"
                >
                  {l.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ----- nodes ----- */}
        <g>
          {nodes.map(n => {
            const accent = entityAccent[n.type] || '#94a3b8';
            const hovered = hoverNode === n.id;

            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                onMouseEnter={() => setHoverNode(n.id)}
                onMouseLeave={() => setHoverNode(null)}
                className={`node ${hovered ? "hovered" : ""}`}
              >
                <circle className="halo" r={NODE_RADIUS + 8} style={{ fill: accent }} />
                <circle className="core" r={NODE_RADIUS} stroke={accent} />

                <text y={NODE_RADIUS + 12} textAnchor="middle">
                  {n.label.length > 16 ? n.label.slice(0, 14) + "…" : n.label}
                </text>
                <text y={NODE_RADIUS + 26} textAnchor="middle" className="sub" style={{ fill: accent }}>
                  {n.type}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

    </div>
  );
}