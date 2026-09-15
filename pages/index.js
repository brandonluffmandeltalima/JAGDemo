import Head from 'next/head';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // section rail: active state + progress fill
      const railDots = document.querySelectorAll('.rail-dot');
      const railFill = document.getElementById('railFill');
      const railSections = Array.from(railDots).map(d => document.getElementById(d.dataset.sec)).filter(Boolean);

      function updateRail(){
        const scrollPos = window.scrollY + window.innerHeight * 0.4;
        let activeIdx = 0;
        railSections.forEach((sec, i) => { if(sec.offsetTop <= scrollPos) activeIdx = i; });
        railDots.forEach((d,i) => d.classList.toggle('active', i === activeIdx));
        railFill.style.height = (activeIdx / (railSections.length - 1) * 100) + '%';
      }
      window.addEventListener('scroll', updateRail, { passive:true });
      updateRail();

      // header state on scroll
      const header = document.getElementById('siteHeader');
      function onHeaderScroll(){
        header.classList.toggle('scrolled', window.scrollY > 30);
      }
      window.addEventListener('scroll', onHeaderScroll);

      // generic reveal-on-scroll
      const revealEls = document.querySelectorAll('.reveal');
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16 });
      revealEls.forEach(el => revealObserver.observe(el));

      // loop diagram draw-on-scroll
      const loopSection = document.getElementById('loopSection');
      const loopObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            loopSection.classList.add('in');
            loopObserver.unobserve(loopSection);
          }
        });
      }, { threshold: 0.35 });
      loopObserver.observe(loopSection);

      // pipeline stagger
      const pipeline = document.getElementById('pipeline');
      const cards = pipeline.querySelectorAll('.task-card');
      cards.forEach((c, i) => { c.style.transitionDelay = (i * 70) + 'ms'; });
      const pipelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            pipeline.classList.add('in');
            pipelineObserver.unobserve(pipeline);
          }
        });
      }, { threshold: 0.1 });
      pipelineObserver.observe(pipeline);

      // cleanup on unmount / hot-reload
      return () => {
        window.removeEventListener('scroll', updateRail);
        window.removeEventListener('scroll', onHeaderScroll);
        revealObserver.disconnect();
        loopObserver.disconnect();
        pipelineObserver.disconnect();
      };
  }, []);

  return (
    <>
      <Head>
        <title>Delta Lima — Decision-Centered Design</title>
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
        <a href="#unit" className="rail-dot" data-sec="unit"><span>The fundamental unit</span></a>
        <a href="#problem" className="rail-dot" data-sec="problem"><span>The problem</span></a>
        <a href="#framework" className="rail-dot" data-sec="framework"><span>What we do</span></a>
        <a href="#loopSection" className="rail-dot" data-sec="loopSection"><span>The two engines</span></a>
        <a href="#practice" className="rail-dot" data-sec="practice"><span>In practice</span></a>
        <a href="#otjag" className="rail-dot" data-sec="otjag"><span>Army OTJAG</span></a>
        <a href="#roi" className="rail-dot" data-sec="roi"><span>Why it pays off</span></a>
        <a href="#contact" className="rail-dot" data-sec="contact"><span>Contact</span></a>
      </nav>

      <header id="siteHeader">
        <div className="wrap">
          <div className="logo">
            <img className="logo-mark" src="data:image/png;base64,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" alt="Delta Lima" />
            <span className="logo-word">Delta Lima</span>
          </div>
          <nav className="links">
            <a href="#framework">Framework</a>
            <a href="/case-study-otjag">OTJAG</a>
            <a href="#roi">Why it works</a>
            <a href="/live-demo" className="nav-cta">Demo</a>
          </nav>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="kicker">DECISION SCIENCE FOR MISSION-CRITICAL ORGANIZATIONS</div>
            <h1 className="hero-headline">Your organization is a system of <em>decisions</em>.<br/>We optimize the system.</h1>
            <p className="hero-sub">Strip away the org chart and the tech stack and what's left running your organization is a graph of decisions and permutations, repeated thousands of times a week. That's the only layer of a business precise enough to track, measure, and optimize — so it's what Delta Lima designs AI systems around.</p>
            <div className="hero-actions">
              <a href="#framework" className="btn-primary">See the framework</a>
              <a href="#otjag" className="btn-ghost">Read the OTJAG engagement</a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <svg viewBox="0 0 460 600">
              {/* background field: the wider space of un-optimized permutations */}
              <g className="net-scatter">
                <circle cx="18" cy="30" r="2"/><circle cx="55" cy="14" r="1.6"/><circle cx="110" cy="8" r="2"/>
                <circle cx="180" cy="20" r="1.6"/><circle cx="250" cy="10" r="2"/><circle cx="300" cy="30" r="1.6"/>
                <circle cx="360" cy="14" r="2"/><circle cx="420" cy="35" r="1.8"/><circle cx="445" cy="90" r="2"/>
                <circle cx="10" cy="120" r="1.8"/><circle cx="435" cy="150" r="1.6"/><circle cx="10" cy="200" r="2"/>
                <circle cx="440" cy="230" r="1.8"/><circle cx="15" cy="280" r="1.6"/><circle cx="445" cy="310" r="2"/>
                <circle cx="150" cy="350" r="1.6"/><circle cx="300" cy="180" r="1.8"/><circle cx="380" cy="420" r="2"/>
                <circle cx="30" cy="450" r="1.6"/><circle cx="415" cy="480" r="1.8"/><circle cx="200" cy="540" r="2"/>
                <circle cx="120" cy="560" r="1.6"/><circle cx="330" cy="560" r="1.8"/><circle cx="60" cy="520" r="1.6"/>
                <circle cx="400" cy="550" r="2"/><circle cx="250" cy="60" r="1.6"/><circle cx="160" cy="130" r="1.6"/>
                <circle cx="390" cy="330" r="1.6"/><circle cx="80" cy="360" r="1.8"/><circle cx="270" cy="440" r="1.6"/>
              </g>

              {/* dense mesh of possible permutations */}
              <g className="net-mesh">
                <path className="net-line" d="M40,60 L140,50" /><path className="net-line" d="M140,50 L230,90" />
                <path className="net-line" d="M40,60 L70,150" /><path className="net-line" d="M70,150 L140,50" />
                <path className="net-line" d="M230,90 L320,60" /><path className="net-line" d="M320,60 L390,120" />
                <path className="net-line" d="M230,90 L260,180" /><path className="net-line" d="M260,180 L70,150" />
                <path className="net-line" d="M390,120 L410,210" /><path className="net-line" d="M410,210 L340,260" />
                <path className="net-line" d="M260,180 L340,260" /><path className="net-line" d="M70,150 L100,240" />
                <path className="net-line" d="M100,240 L60,320" /><path className="net-line" d="M100,240 L180,290" />
                <path className="net-line" d="M180,290 L260,180" /><path className="net-line" d="M180,290 L340,260" />
                <path className="net-line" d="M340,260 L370,350" /><path className="net-line" d="M60,320 L130,380" />
                <path className="net-line" d="M130,380 L180,290" /><path className="net-line" d="M130,380 L220,420" />
                <path className="net-line" d="M220,420 L370,350" /><path className="net-line" d="M370,350 L330,440" />
                <path className="net-line" d="M220,420 L260,500" /><path className="net-line" d="M330,440 L260,500" />
                <path className="net-line" d="M60,320 L20,410" /><path className="net-line" d="M20,410 L90,470" />
                <path className="net-line" d="M90,470 L220,420" /><path className="net-line" d="M140,50 L180,10" />
                <path className="net-line" d="M320,60 L360,20" /><path className="net-line" d="M390,120 L430,90" />
                <path className="net-line" d="M410,210 L445,190" /><path className="net-line" d="M370,350 L410,370" />
                <path className="net-line" d="M330,440 L380,460" /><path className="net-line" d="M260,500 L280,545" />
                <path className="net-line" d="M20,410 L15,455" /><path className="net-line" d="M90,470 L70,515" />
                <path className="net-line" d="M40,60 L15,25" /><path className="net-line" d="M100,240 L60,220" />
              </g>

              {/* four sequential resolved decisions */}
              <path className="net-line resolved path1" d="M40,60 L140,50 L230,90 L320,60 L390,120 L410,210 L340,260" />
              <path className="net-line resolved path2" d="M70,150 L260,180 L180,290 L130,380 L220,420 L370,350 L330,440" />
              <path className="net-line resolved path3" d="M100,240 L60,320 L20,410 L90,470 L220,420 L260,500" />
              <path className="net-line resolved path4" d="M140,50 L230,90 L260,180 L340,260 L410,210" />

              {/* nodes */}
              <circle className="net-node pulse" cx="40" cy="60" r="5" style={{animationDelay: '.1s'}}/>
              <circle className="net-node pulse" cx="140" cy="50" r="4.5" style={{animationDelay: '.4s'}}/>
              <circle className="net-node pulse" cx="230" cy="90" r="5" style={{animationDelay: '.7s'}}/>
              <circle className="net-node pulse" cx="320" cy="60" r="4.5" style={{animationDelay: '.2s'}}/>
              <circle className="net-node pulse" cx="390" cy="120" r="5" style={{animationDelay: '.9s'}}/>
              <circle className="net-node pulse" cx="410" cy="210" r="4.5" style={{animationDelay: '.5s'}}/>
              <circle className="net-node pulse" cx="70" cy="150" r="5" style={{animationDelay: '.3s'}}/>
              <circle className="net-node pulse" cx="260" cy="180" r="5" style={{animationDelay: '.8s'}}/>
              <circle className="net-node pulse" cx="100" cy="240" r="5" style={{animationDelay: '.6s'}}/>
              <circle className="net-node pulse" cx="180" cy="290" r="4.5" style={{animationDelay: '1s'}}/>
              <circle className="net-node pulse" cx="60" cy="320" r="4.5" style={{animationDelay: '.2s'}}/>
              <circle className="net-node pulse" cx="20" cy="410" r="4" style={{animationDelay: '.6s'}}/>
              <circle className="net-node pulse" cx="90" cy="470" r="4.5" style={{animationDelay: '1.1s'}}/>
              <circle className="net-node pulse" cx="130" cy="380" r="4.5" style={{animationDelay: '.4s'}}/>
              <circle className="net-node pulse" cx="220" cy="420" r="5" style={{animationDelay: '.9s'}}/>
              <circle className="net-node pulse" cx="370" cy="350" r="4.5" style={{animationDelay: '.3s'}}/>
              <circle className="net-node pulse" cx="340" cy="260" r="5" style={{animationDelay: '.7s'}}/>
              <circle className="net-node pulse" cx="330" cy="440" r="4.5" style={{animationDelay: '1s'}}/>
              <circle className="net-node pulse" cx="260" cy="500" r="5" style={{animationDelay: '.5s'}}/>
              <circle className="net-node pulse" cx="180" cy="10" r="3.5" style={{animationDelay: '.8s'}}/>
              <circle className="net-node pulse" cx="360" cy="20" r="3.5" style={{animationDelay: '.5s'}}/>
              <circle className="net-node pulse" cx="430" cy="90" r="3.5" style={{animationDelay: '.2s'}}/>

              {/* resolved endpoints */}
              <circle className="net-node final f1" cx="340" cy="260" r="7"/>
              <circle className="net-node final f2" cx="330" cy="440" r="7"/>
              <circle className="net-node final f3" cx="260" cy="500" r="7"/>
              <circle className="net-node final f4" cx="410" cy="210" r="5.5"/>

              {/* idle traveling signals */}
              <circle r="3.2" fill="#54D6CA" opacity="0.9">
                <animateMotion dur="5s" begin="4.2s" repeatCount="indefinite"
                  path="M40,60 L140,50 L230,90 L320,60 L390,120 L410,210 L340,260" />
              </circle>
              <circle r="2.6" fill="#EFAD4E" opacity="0.85">
                <animateMotion dur="6.2s" begin="5.5s" repeatCount="indefinite"
                  path="M100,240 L60,320 L20,410 L90,470 L220,420 L260,500" />
              </circle>
            </svg>

            <div className="net-endtag" style={{left: '73.9%', top: '43.3%'}}>optimized</div>
            <div className="net-caption">every path is a decision. every decision is measurable.</div>
            <div className="net-legend">
              <span><i className="dot amber"/> hypothesis stage</span>
              <span><i className="dot teal"/> validated by evidence</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE FUNDAMENTAL UNIT ================= */}
      <section className="section unit" id="unit">
        <div className="wrap">
          <div className="section-label reveal">01 — The Fundamental Unit</div>
          <div className="unit-grid">
            <h2 className="section-title reveal" style={{maxWidth: '640px'}}>Every workflow is a graph of decisions. We optimize the graph.</h2>
            <div className="unit-icon reveal" aria-hidden="true">
              <svg viewBox="0 0 120 90">
                <path className="net-line" d="M15,20 L55,10 L95,25" /><path className="net-line" d="M55,10 L50,50" />
                <path className="net-line" d="M15,20 L20,55" /><path className="net-line" d="M20,55 L50,50" />
                <path className="net-line" d="M50,50 L95,25" /><path className="net-line" d="M20,55 L60,78" />
                <path className="net-line" d="M50,50 L60,78" /><path className="net-line" d="M95,25 L100,60" />
                <path className="net-line resolved" style={{stroke: 'var(--teal)', strokeDasharray: '260', strokeDashoffset: '0', filter: 'drop-shadow(0 0 5px rgba(69,201,190,.5))'}} d="M15,20 L55,10 L95,25 L100,60" />
                <circle className="net-node pulse" cx="15" cy="20" r="4"/><circle className="net-node pulse" cx="55" cy="10" r="3.5" style={{animationDelay: '.3s'}}/>
                <circle className="net-node pulse" cx="95" cy="25" r="4" style={{animationDelay: '.6s'}}/><circle className="net-node pulse" cx="50" cy="50" r="3.5" style={{animationDelay: '.9s'}}/>
                <circle className="net-node pulse" cx="20" cy="55" r="3.5" style={{animationDelay: '.2s'}}/><circle className="net-node pulse" cx="60" cy="78" r="3.5" style={{animationDelay: '.5s'}}/>
                <circle cx="100" cy="60" r="6" fill="var(--teal)"/>
              </svg>
            </div>
          </div>

          <div className="unit-text reveal">
            <p>Strip away the org chart, the software stack, and the process documents. What's actually running your organization is a system of decisions — made over and over, by different people, under different conditions, thousands of times a week. Each one is a small permutation: this input, this context, this choice.</p>
            <p>That system of permutations is the only layer of a business precise enough to be tracked, measured, and optimized. Everything else — the interfaces, the platforms, the dashboards people check — is scaffolding built around it.</p>
            <p className="unit-emph">So we don't start with technology. We start by mapping the decision graph — the recurring choices that actually drive outcomes — and design AI systems around improving the nodes that matter most.</p>
          </div>
        </div>
      </section>

      {/* ================= THE PROBLEM ================= */}
      <section className="section problem" id="problem">
        <div className="wrap">
          <div className="section-label reveal">02 — The Problem</div>
          <p className="problem-quote reveal">Requirements get defined. Data gets integrated. The system goes live. Then it hits real operations — and quietly, people start routing around it. <span className="accent">The models run. The pipelines deliver data. The failure is organizational.</span></p>

          <div className="problem-cols">
            <div className="reveal">
              <span className="num">WHY IT HAPPENS</span>
              <p>Traditional software assumes determinism — define the requirement, build the feature, confirm it works. AI is fundamentally different: probabilistic, and dependent on how people actually behave. A model can be technically accurate and still change nothing, because behavior change was never part of the design.</p>
            </div>
            <div className="reveal">
              <span className="num">WHAT THAT COSTS</span>
              <p>By the time the mismatch is visible, the program is eighteen months in and the contract is structured around delivery milestones, not outcomes. The organization is left maintaining a system, rather than relying on one.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHAT DCD IS ================= */}
      <section className="section" id="framework">
        <div className="wrap">
          <div className="section-label reveal">03 — What We Do</div>
          <div className="dcd-lede">
            <div className="reveal">
              <h2 className="section-title">Decision-Centered Design builds AI systems around one question: do the decisions get better?</h2>
              <div className="dcd-lede-text">
                <p>Not whether the system is technically accurate, or fully built out. Whether the decisions that drive mission outcomes actually improve — and whether that improvement can be demonstrated, not assumed.</p>
                <p>DCD is tool-agnostic. It applies to analytics platforms, automation, AI models, and information architecture alike. The starting question never changes: which decisions matter most, and what would it look like if those decisions consistently produced better results?</p>
              </div>
            </div>
            <div className="dcd-panel reveal">
              <div className="dcd-panel-label">THE METHOD, APPLIED TWICE</div>
              <p className="dcd-question">"Which decisions matter most — and what would it look like if they consistently produced better results?"</p>
              <div className="dcd-panel-footer">Applied strategically, before architecture is chosen. Applied operationally, once real users are working under real conditions.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ADAPT / TACTIC LOOP ================= */}
      <section className="section loop-section" id="loopSection">
        <div className="wrap">
          <div className="section-label reveal">04 — The Two Engines</div>
          <h2 className="section-title reveal">Strategy sets the hypothesis. Execution tests it. Evidence rewrites the strategy.</h2>
          <p className="section-intro reveal">Most AI programs fail on sequencing: technology gets picked before anyone agrees what it needs to accomplish. DCD runs on two engines that keep strategy and execution in a permanent feedback loop.</p>

          <div className="loop-grid">
            <div className="loop-diagram reveal">
              <svg viewBox="0 0 360 300">
                <defs>
                  <marker id="dotAmber" markerWidth="8" markerHeight="8" refX="4" refY="4">
                    <circle cx="4" cy="4" r="3.5" fill="#E8A33D"/>
                  </marker>
                  <marker id="dotTeal" markerWidth="8" markerHeight="8" refX="4" refY="4">
                    <circle cx="4" cy="4" r="3.5" fill="#45C9BE"/>
                  </marker>
                </defs>

                <path className="loop-path top animated" d="M132,54 C 250,30 328,90 328,150" markerEnd="url(#dotAmber)" />
                <path className="loop-path bottom animated" d="M228,246 C 110,270 32,210 32,150" markerEnd="url(#dotTeal)" />

                <text className="loop-arrow-label top" x="248" y="52">hypothesis →</text>
                <text className="loop-arrow-label bottom" x="78" y="264">← evidence</text>

                <rect className="loop-node-box" x="16" y="22" width="150" height="64" rx="4"/>
                <text className="loop-label-title" x="91" y="52" textAnchor="middle">ADAPT</text>
                <text className="loop-label-sub" x="91" y="70" textAnchor="middle">STRATEGIC ENGINE</text>

                <rect className="loop-node-box" x="194" y="214" width="150" height="64" rx="4"/>
                <text className="loop-label-title" x="269" y="244" textAnchor="middle">TACTIC</text>
                <text className="loop-label-sub" x="269" y="262" textAnchor="middle">EXECUTION ENGINE</text>
              </svg>
            </div>

            <div className="engine-cards">
              <div className="engine-card adapt reveal">
                <h3>ADAPT <span className="tag">BEFORE ANYTHING IS BUILT</span></h3>
                <p>Starts with the recurring, high-stakes decisions that determine whether the organization is effective — not the technology. Stakeholder alignment comes before architecture. Every initiative is tied to a hypothesis that specifies, in advance, what will change and how that change will be measured.</p>
              </div>
              <div className="engine-card tactic reveal">
                <h3>TACTIC <span className="tag">ONCE WORK BEGINS</span></h3>
                <p>Treats deployment as the start of learning, not the finish line. Small increments go into real operating environments — not sandboxes tuned to make the tool look good. Time-to-decision, override rates, and consistency across teams are instrumented from day one. A pilot that can't fail isn't a test.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRACTICE EXAMPLE ================= */}
      <section className="section section-tight" id="practice">
        <div className="wrap">
          <div className="section-label reveal">05 — In Practice</div>
          <h2 className="section-title reveal">"The model generates accurate text" is not a hypothesis. It's untestable.</h2>

          <div className="practice-grid">
            <div className="reveal practice-note">
              <p>Take a common goal: use AI to accelerate document drafting. DCD rejects the surface-level version of that hypothesis outright. <strong>An accurate model is not the same as a faster, better decision.</strong> The real hypothesis has to name what changes, and by how much — then track each outcome independently, because each one tells you something different about where the system is actually working.</p>
              <p style={{marginTop: '16px'}}>When a hypothesis fails — drafting time improves but errors don't, or adoption is high but revision cycles stay flat — that's not explained away. It's information. It shows exactly where the design didn't fit the real decision environment.</p>
            </div>

            <div className="hypothesis-card reveal">
              <div className="hypothesis-head">
                <div>
                  <span className="tag">HYPOTHESIS</span>
                  <p>AI-assisted document drafting</p>
                </div>
              </div>
              <div className="metric-row">
                <div className="metric"><div className="m-label">Drafting time</div><div className="m-value">↓ measured, not assumed</div></div>
                <div className="metric"><div className="m-label">Revision cycles</div><div className="m-value">tracked independently</div></div>
                <div className="metric"><div className="m-label">Error rate, final docs</div><div className="m-value">instrumented pre-launch</div></div>
                <div className="metric"><div className="m-label">Staff time reallocated</div><div className="m-value">production → judgment work</div></div>
              </div>
              <div className="hypothesis-foot">Metrics are defined before deployment — never assembled afterward to justify the investment.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OTJAG ================= */}
      <section className="section otjag" id="otjag">
        <div className="wrap">
          <div className="section-label reveal">06 — Applied: U.S. Army OTJAG</div>
          <div className="otjag-top">
            <div className="reveal">
              <div className="otjag-emblem-row">
                <svg className="otjag-emblem" viewBox="0 0 64 64" aria-hidden="true">
                  <polygon points="32,4 39,24 60,24 43,37 49,58 32,45 15,58 21,37 4,24 25,24"
                    fill="none" stroke="#E8A33D" strokeWidth="1.6"/>
                  <path d="M20,44 Q32,36 44,44 M32,20 L32,44 M24,26 L40,26" stroke="#45C9BE" strokeWidth="1.3" fill="none"/>
                </svg>
                <div>
                  <div className="otjag-badge">Active engagement</div>
                  <span className="otjag-emblem-label">U.S. ARMY — OFFICE OF THE JUDGE ADVOCATE GENERAL</span>
                </div>
              </div>
              <h2 className="section-title" style={{maxWidth: '100%'}}>Modernizing Army legal operations, one tested decision at a time.</h2>
            </div>
            <div className="otjag-desc reveal">
              <p>Delta Lima is supporting U.S. Army OTJAG on a strategic engagement to modernize legal operations with AI, data science, and human-centered design — aligned to the DoD CDAO AI Adoption Strategy, the Army Data Plan, and the Unified Data Reference Architecture.</p>
              <p>We ran structured Decision-Centered Design workshops with cross-functional OTJAG stakeholders to map the decisions that actually drive outcomes, the data behind them, and where AI could help. Those sessions surfaced <strong style={{color: 'var(--text)'}}>12+ high-value use cases</strong> — from intelligent legal document retrieval to AI-assisted research and knowledge automation.</p>
              <div className="align-list">
                <span className="align-chip">Current-State Architecture Assessment</span>
                <span className="align-chip">Organizational Research Report</span>
                <span className="align-chip">Governance &amp; Management Framework</span>
                <span className="align-chip">Data Maturity Blueprint</span>
              </div>
            </div>
          </div>

          <div className="pipeline" id="pipeline">
            <div className="pipeline-head">
              <h3>What we're building</h3>
              <span>The highest-value decisions in the pipeline, for the attorneys who make them</span>
            </div>

            <div className="priority-cols">
              <div className="task-card">
                <h5>Redaction Automation</h5>
                <p>Safeguards PII and PHI — including the details of defendants and minors — with consistent, policy-140a-compliant redactions across every case, replacing manual review that varied by reviewer.</p>
                <div className="task-stats">
                  <div className="tstat"><span className="tstat-label">Time saved <em>· target</em></span><span className="tstat-value">~75%</span></div>
                  <div className="tstat"><span className="tstat-label">Accuracy <em>· target</em></span><span className="tstat-value">~90% fewer missed redactions</span></div>
                </div>
              </div>
              <div className="task-card">
                <h5>R/S Memo Generation</h5>
                <p>Drafts legal strategy memoranda from structured case inputs, giving attorneys a strong first framing of their arguments instead of a blank page.</p>
                <div className="task-stats">
                  <div className="tstat"><span className="tstat-label">Time saved <em>· target</em></span><span className="tstat-value">Full day → ~30 min</span></div>
                  <div className="tstat"><span className="tstat-label">Consistency <em>· target</em></span><span className="tstat-value">~40% fewer revision cycles</span></div>
                </div>
              </div>
              <div className="task-card">
                <h5>Deposition Analysis</h5>
                <p>Ingests transcripts and generates first-draft summaries, question outlines, and issue maps for attorneys to review — not to replace their judgment, but to stop them starting from zero.</p>
                <div className="task-stats">
                  <div className="tstat"><span className="tstat-label">Review time <em>· target</em></span><span className="tstat-value">~60% reduction</span></div>
                  <div className="tstat"><span className="tstat-label">Coverage <em>· target</em></span><span className="tstat-value">~95% of key issues flagged</span></div>
                </div>
              </div>
            </div>
            <p className="stats-disclaimer">Time-saved and accuracy figures are projected engagement targets, not yet independently measured — they'll be replaced with validated results as each tool clears TACTIC's evidence gates.</p>

            <div className="metric-strip reveal">
              <div className="metric-cell">
                <div className="metric-num">12<span className="unit">+</span></div>
                <div className="metric-desc">High-value AI use cases identified and prioritized through DCD workshops with OTJAG stakeholders.</div>
              </div>
              <div className="metric-cell">
                <div className="metric-num">1,000<span className="unit">+</span> pg</div>
                <div className="metric-desc">Scanned, unsearchable case files per claim that redaction and search tooling now targets directly.</div>
              </div>
              <div className="metric-cell">
                <div className="metric-num">3</div>
                <div className="metric-desc">Attorney-facing decisions in active build, chosen for mission value, not ease of delivery.</div>
              </div>
              <div className="metric-cell">
                <div className="metric-num">Evidence-gated</div>
                <div className="metric-desc">Every tool above ships with behavioral metrics instrumented before deployment, per TACTIC.</div>
              </div>
            </div>

            <a className="case-study-link" href="case-study-otjag">
              <span>Read the full OTJAG case study</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.4"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* ================= ROI ================= */}
      <section className="section section-tight" id="roi">
        <div className="wrap">
          <div className="section-label reveal">07 — Why It Pays Off</div>
          <div className="roi-grid">
            <div className="reveal">
              <h2 className="section-title" style={{maxWidth: '100%'}}>Most AI programs bet that value follows features. We make ROI a design input, not a hoped-for outcome.</h2>
              <p className="section-intro" style={{maxWidth: '100%'}}>Programs that fail to show return share a pattern: they build features and assume value follows, measure model accuracy and assume decisions improve, scale systems and assume people adopt them. None of those assumptions hold reliably.</p>
            </div>
            <div className="roi-list reveal">
              <div className="roi-item"><span className="ri-mark">01</span><p><strong>Problems surface early</strong>, when they're cheap to fix — not eighteen months in, once institutional momentum makes them expensive to touch.</p></div>
              <div className="roi-item"><span className="ri-mark">02</span><p><strong>Alignment happens up front</strong>, cutting the requirement churn that inflates program costs when everyone was quietly solving a different problem.</p></div>
              <div className="roi-item"><span className="ri-mark">03</span><p><strong>Adoption is built in, not bolted on</strong> — systems that genuinely reduce effort get used without a change-management campaign behind them.</p></div>
              <div className="roi-item"><span className="ri-mark">04</span><p><strong>The capability compounds</strong> — organizations build the habit of tying investment to outcomes, and the infrastructure to prove the connection holds.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section" id="contact">
        <div className="wrap cta-inner">
          <div className="reveal">
            <h2>A capable system that changes nothing is still a failure. Let's design one that doesn't.</h2>
            <p>If your organization is investing in AI and wants to know — with evidence — whether it's actually changing how decisions get made, that's the conversation we have.</p>
            <div className="cta-actions">
              <a href="mailto:hello@deltalima.com" className="btn-primary">Start a conversation</a>
              <a href="#framework" className="btn-ghost">Revisit the framework</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footer-row">
          <div className="logo">
            <img className="logo-mark" src="data:image/png;base64,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" alt="Delta Lima" style={{width: '22px', height: '22px'}} />
            <span className="logo-word">Delta Lima</span>
          </div>
          <div className="footer-links">
            <a href="#framework">Framework</a>
            <a href="#otjag">OTJAG</a>
            <a href="#contact">Contact</a>
          </div>
          <span className="fine">© 2026 Delta Lima. Decision-Centered Design.</span>
        </div>
      </footer>
    </>
  );
}