
import React, { useState } from 'react';
import { Mail, Database, BarChart3, Send, AlertCircle, GitBranch, Users, FileText, Binary, Layers, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function MVPPage() {
  const [activeView, setActiveView] = useState('mvp');
  const [processingMode, setProcessingMode] = useState('single');
  const [processing, setProcessing] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [useRealAPI, setUseRealAPI] = useState(false);
  const [results, setResults] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(null);
  const [showBatchSummary, setShowBatchSummary] = useState(false);
const [typedSummary, setTypedSummary] = useState('');
const [summaryLoading, setSummaryLoading] = useState(false);
const [summaryProgress, setSummaryProgress] = useState(0);

const testEmails = [
  {
    subject: "Case 1 – Thompson v. United States: Initial Discovery Review and Liability Assessment",
    content: `
Good afternoon CPT Smith,

I wanted to provide an update on Thompson v. United States.

Key observations:
- The plaintiff continues to assert negligence by the government driver.
- Vehicle inspection logs show no mechanical deficiencies.
- Accident reconstruction suggests possible contributory negligence.

Please review and advise on settlement posture.

Respectfully,
MAJ Allen
`
  },

  {
    subject: "Case 1 – Thompson v. United States: Witness Statements and Damages",
    content: `
Sir,

Recent witness statements indicate:
- Two civilian witnesses observed excessive speed by the plaintiff.
- No witnesses corroborate the claim that the GOV ran a stop sign.

Damages appear overstated due to documented pre-existing conditions.

v/r,
CPT Nguyen
`
  },

  {
    subject: "Case 2 – Alvarez v. United States: Command Investigation Findings",
    content: `
CPT Smith,

The Command Investigation found:
- Prior notice of erosion hazards at Range 14
- Maintenance delays due to funding constraints
- Contractor was authorized and within scope of duties

These findings may impact liability analysis.

LTC Harris
`
  },

  {
    subject: "Team Potluck – Friday at 1200",
    content: `
Hi CPT John Smith,

Just a reminder that the unit is hosting a team potluck this Friday at 1200.

Details:
- Location: Break room
- Theme: Comfort foods
- Please reply with what you plan to bring

Hope to see you there!

- SFC Ramirez
`
  },

  {
    subject: "Case 2 – Alvarez v. United States: Settlement Considerations",
    content: `
CPT Smith,

Based on preliminary exposure analysis:
- Liability risk assessed as moderate to high
- Damages appear limited
- Early settlement may be fiscally prudent

Recommend coordinating with USARCS.

MAJ Allen
`
  }
];

const startTypingEffect = async () => {
  // Start loading phase
  setSummaryLoading(true);
  setSummaryProgress(0);
  
  // Simulate loading progress
  const loadingDuration = 2000; // 2 seconds
  const progressInterval = setInterval(() => {
    setSummaryProgress(prev => {
      if (prev >= 100) {
        clearInterval(progressInterval);
        return 100;
      }
      return prev + 2;
    });
  }, loadingDuration / 50);
  
  // Wait for loading to complete
  await new Promise(resolve => setTimeout(resolve, loadingDuration));
  setSummaryLoading(false);
  
  // Start typing effect
//     Weekly Summary Email – For CPT John Smith

// From: Litigation Division – Case Management
// To: CPT John Smith, JAGC
// Subject: Weekly Case Update – Thompson & Alvarez Matters
  const fullSummary = `

Good afternoon CPT Smith,

Below is your weekly litigation update summarizing activity from the past week:\n\n

Case 1: Thompson v. United States (FTCA – GOV Accident)

Recent Updates:

Discovery review suggests defensible liability posture, including evidence of possible plaintiff contributory negligence.

GOV maintenance records and MP reports support SPC Reyes’ compliance with duty standards.

Civilian witness statements undermine plaintiff’s account of the collision.

Plaintiff informally signaling a high settlement demand, though damages appear inflated due to pre-existing conditions and employment gaps.

Next steps may include pushing back on settlement posture and considering a Rule 35 IME once medical records are complete.

Case 2: Alvarez v. United States (Premises Liability – Training Range Injury)

Recent Updates:

Command Investigation confirms prior notice of hazardous range conditions and delayed maintenance.

Liability risk assessed as moderate to high based on CI findings.

Damages likely limited due to recovery and return to work.

Early settlement discussions recommended in the low-to-mid five-figure range, pending DPW document review.

Coordination with DPW and USARCS advised to assess settlement authority.
`;
  

  let index = 0;
  setTypedSummary('');
  
  const typingInterval = setInterval(() => {
    if (index < fullSummary.length) {
      setTypedSummary(fullSummary.substring(0, index + 1));
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, 20);
};


const handleProcessEmail = async () => {
  setProcessing(true);
  setTimeout(() => {
    setResults({
      classification: {
        label: 'RELEVANT',
        confidence: 0.94
      },
      entities: [
        { text: 'CPT John Smith', type: 'PERSON', color: '#3b82f6' },
        { text: 'Fort Bragg', type: 'GPE', color: '#10b981' },
        { text: 'Article 15', type: 'LAW', color: '#f59e0b' },
        { text: '15 March 2024', type: 'DATE', color: '#8b5cf6' }
      ],
      relationships: [
        { from: 'CPT John Smith', relation: 'STATIONED_AT', to: 'Fort Bragg' },
        { from: 'CPT John Smith', relation: 'INVOLVED_IN', to: 'Article 15' }
      ],
      summary: 'Article 15 hearing shceduled for March 15, 2024.'
    });
    setProcessing(false);
  }, 2000);
};

const handleBatchProcess = async () => {
  setProcessing(true);
  setBatchResults([]);
  setCurrentBatchIndex(0);

  for (let i = 0; i < testEmails.length; i++) {
    setCurrentBatchIndex(i);
    
    if (useRealAPI) {
      await processEmailWithAPI(testEmails[i].content, i);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockResult = {
        emailIndex: i,
        subject: testEmails[i].subject,
        body: testEmails[i].content,        // ✅ include the body
        fullText: `Subject: ${testEmails[i].subject}\n\nBody:\n${testEmails[i].content}`,
        subject: testEmails[i].subject,
        classification: {
          label: i === 3 ? 'IRRELEVANT' : 'RELEVANT',
          confidence: 0.85 + Math.random() * 0.15
        },
        entities: i === 3 ? [] : [
          { text: 'Sample Entity', type: 'PERSON', color: '#3b82f6' },
          { text: 'Fort Location', type: 'GPE', color: '#10b981' }
        ],
        relationships: i === 3 ? [] : [
          { from: 'Person', relation: 'STATIONED_AT', to: 'Location' }
        ],
        summary: i === 3 ? 
          "This email contains routine administrative information with no legal matters requiring attention." :
          `Processed email regarding ${testEmails[i].subject}. Key entities and relationships have been extracted and stored in the graph database.`
      };
      setBatchResults(prev => [...prev, mockResult]);
    }
  }

  console.log("BATCH RESULTS:", batchResults)

  setProcessing(false);
setCurrentBatchIndex(-1);

// Start typing effect after batch completes
setShowBatchSummary(true);
startTypingEffect();
};

const processEmailWithAPI = async (content, index) => {
  // Simplified version - you can expand this with real API calls
  await new Promise(resolve => setTimeout(resolve, 1500));
  const mockResult = {
    emailIndex: index,
    subject: testEmails[index].subject,
    classification: {
      label: index === 3 ? 'IRRELEVANT' : 'RELEVANT',
      confidence: 0.85 + Math.random() * 0.15
    },
    entities: index === 3 ? [] : [
      { text: 'Sample Entity', type: 'PERSON', color: '#3b82f6' }
    ],
    relationships: index === 3 ? [] : [
      { from: 'Person', relation: 'LOCATED_AT', to: 'Place' }
    ],
    summary: index === 3 ? 
      "This email contains routine administrative information with no legal matters requiring attention." :
      `Processed email regarding ${testEmails[index].subject}.`
  };
  setBatchResults(prev => [...prev, mockResult]);
};

const handleProcessEmailOfficial = async () => {
  setProcessing(true);
  setPipelineStep('classification');
  setResults(null);

  try {
    // Step 1: Classification
    await new Promise(resolve => setTimeout(resolve, 800));
    const classifyResponse = await fetch("https://ner-hh1e.onrender.com/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subject: "JAG Legal Communication",
        body: emailContent,
        email_id: `email_${Date.now()}`
      })
    });

    const classifyData = await classifyResponse.json();
    console.log("CLASSIFICATION RESULT:", classifyData);
    
    // Map backend response to frontend format
    setResults({ 
      classification: {
        label: classifyData.is_relevant ? 'RELEVANT' : 'IRRELEVANT',
        confidence: classifyData.confidence
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Step 2: NER Extraction
    setPipelineStep('ner');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const nerResponse = await fetch("https://ner-hh1e.onrender.com/ner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: emailContent
      })
    });

    const nerData = await nerResponse.json();
    console.log("NER RESULT:", nerData);
    
    // Map entity colors based on label
    const entityColorMap = {
      'PERSON': '#3b82f6',
      'ORG': '#10b981',
      'GPE': '#10b981',
      'LOC': '#10b981',
      'DATE': '#8b5cf6',
      'TIME': '#8b5cf6',
      'LAW': '#f59e0b',
      'EVENT': '#f59e0b',
      'NORP': '#ec4899',
      'FAC': '#10b981',
      'PRODUCT': '#06b6d4',
      'WORK_OF_ART': '#a855f7'
    };

    const mappedEntities = nerData.entities.map(ent => ({
      text: ent.text,
      type: ent.label,
      color: entityColorMap[ent.label] || '#64748b',
      start: ent.start,
      end: ent.end
    }));

    // Generate basic relationships (you can enhance this logic)
    const relationships = [];
    const persons = mappedEntities.filter(e => e.type === 'PERSON');
    const locations = mappedEntities.filter(e => ['GPE', 'LOC', 'FAC'].includes(e.type));
    const orgs = mappedEntities.filter(e => e.type === 'ORG');
    const laws = mappedEntities.filter(e => e.type === 'LAW');

    // Create relationships between persons and locations
    persons.forEach(person => {
      if (locations.length > 0) {
        relationships.push({
          from: person.text,
          relation: 'LOCATED_AT',
          to: locations[0].text
        });
      }
      if (orgs.length > 0) {
        relationships.push({
          from: person.text,
          relation: 'WORKS_FOR',
          to: orgs[0].text
        });
      }
      if (laws.length > 0) {
        relationships.push({
          from: person.text,
          relation: 'INVOLVED_IN',
          to: laws[0].text
        });
      }
    });
    
    setResults(prev => ({
      ...prev,
      entities: mappedEntities,
      relationships: relationships
    }));
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Step 3: Graph DB Population
    setPipelineStep('graph');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: Summary Generation
    setPipelineStep('summary');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate summary based on extracted entities
    // const summary = generateSummary(mappedEntities, relationships);
    const summary = generateSummaryFromEmail(
      "JAG Legal Communication",
      emailContent
    );    
    setResults(prev => ({
      ...prev,
      summary: summary
    }));

    setPipelineStep('complete');

  } catch (err) {
    console.error("API request failed:", err);
    setResults({
      entities: [],
      relationships: [],
      summary: "API service error: " + err.message,
      classification: { label: "ERROR", confidence: 0 }
    });
    setPipelineStep('error');
  } finally {
    setProcessing(false);
  }
};

// Helper function to generate summary (place this before renderDemo)
const generateSummary = (entities, relationships) => {
  const entityCounts = {};
  entities.forEach(ent => {
    entityCounts[ent.type] = (entityCounts[ent.type] || 0) + 1;
  });

  const parts = [];
  
  if (entityCounts['PERSON']) {
    parts.push(`${entityCounts['PERSON']} person node${entityCounts['PERSON'] > 1 ? 's' : ''}`);
  }
  if (entityCounts['ORG']) {
    parts.push(`${entityCounts['ORG']} organization node${entityCounts['ORG'] > 1 ? 's' : ''}`);
  }
  if (entityCounts['GPE'] || entityCounts['LOC'] || entityCounts['FAC']) {
    const locCount = (entityCounts['GPE'] || 0) + (entityCounts['LOC'] || 0) + (entityCounts['FAC'] || 0);
    parts.push(`${locCount} location node${locCount > 1 ? 's' : ''}`);
  }
  if (entityCounts['LAW']) {
    parts.push(`${entityCounts['LAW']} legal code node${entityCounts['LAW'] > 1 ? 's' : ''}`);
  }
  if (entityCounts['DATE']) {
    parts.push(`${entityCounts['DATE']} date node${entityCounts['DATE'] > 1 ? 's' : ''}`);
  }

  const entitySummary = parts.length > 0 ? parts.join(', ') : 'no new nodes';
  const relSummary = `${relationships.length} relationship${relationships.length !== 1 ? 's' : ''}`;

  return `Case 2025-0947 involves SPC SGT Marjorie Adams. Recent updates include the completion of new witness interviews and a need to review the evidence to determine whether it is sufficient to support formal charges. Potential defense arguments or mitigating factors should be considered, and a decision is required on whether to proceed with an Article 32 hearing or pursue an administrative resolution. Additionally, guidance is needed on how to brief the command while ensuring compliance with regulations.`;
};


  return (
       <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="brand-icon">
              <Mail />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">JAG Email Intelligence</h1>
              <p className="brand-subtitle">Graph Database Email Processing System</p>
            </div>
          </div>
          
          <div className="radio-navigation">
            <Link href='/'>
            <label className={`radio-card ${activeView === 'demo' ? 'active' : ''}`}>
              <input
                type="radio"
                name="view"
                value="demo"
                checked={activeView === 'demo'}
                onChange={(e) => setActiveView(e.target.value)}
              />
              <Database className="radio-icon" />
              <div className="radio-content">
                <div className="radio-title">Demo</div>
                <div className="radio-description">Pipeline Overview</div>
              </div>
            </label>
            </Link>
            <Link href='/mvp'>
            <label className={`radio-card ${activeView === 'mvp' ? 'active' : ''}`}>
              <input
                type="radio"
                name="view"
                value="mvp"
                checked={activeView === 'mvp'}
                onChange={(e) => setActiveView(e.target.value)}
              />
              <Send className="radio-icon" />
              <div className="radio-content">
                <div className="radio-title">MVP</div>
                <div className="radio-description">Process Emails</div>
              </div>
            </label>
            </Link>
            <Link href='/admin'>
            <label className={`radio-card ${activeView === 'admin' ? 'active' : ''}`}>
              <input
                type="radio"
                name="view"
                value="admin"
                checked={activeView === 'admin'}
                onChange={(e) => setActiveView(e.target.value)}
              />
              <BarChart3 className="radio-icon" />
              <div className="radio-content">
                <div className="radio-title">Admin Dashboard</div>
                <div className="radio-description">Database Overview</div>
              </div>
            </label>
            </Link>
          </div>
        </div>
      </nav>
      <main className='main-content'>
    <div className="mvp-container">
      <div className="mvp-header">
        <Send className="mvp-icon" />
        <div>
          <h2 className="mvp-title">Email Processor MVP</h2>
          <p className="mvp-subtitle">Test single emails or process a batch</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle-container">
        <div className="mode-toggle-buttons">
          <button
            className={`mode-toggle-btn ${processingMode === 'single' ? 'active' : ''}`}
            onClick={() => {
              setProcessingMode('single');
              setResults(null);
              setBatchResults([]);
            }}
            disabled={processing}
          >
            <Mail size={18} />
            Single Email
          </button>
         <button
              className={`mode-toggle-btn ${processingMode === 'batch' ? 'active' : ''}`}
              onClick={() => {
                      setProcessingMode('batch');
                      setResults(null);
                      setBatchResults([]);
                      setShowBatchSummary(false);
                      setTypedSummary('');
                      setSummaryLoading(false);
                      setSummaryProgress(0);
              }}
              disabled={processing}
            >
            <Layers size={18} />
            Batch Processing
          </button>
        </div>
      </div>

      <div className="mvp-content">
        {processingMode === 'single' ? (
          <div className="email-input-section">
            <label className="input-label">Compose Email</label>
            <div className="email-draft-container">
              <div className="draft-header-fields">
                <div className="draft-field">
                  <span className="draft-label">From:</span>
                  <input
                    type="text"
                    className="draft-input"
                    value="MAJ Sarah Johnson <sarah.johnson@jag.mil>"
                    readOnly
                  />
                </div>
                <div className="draft-field">
                  <span className="draft-label">To:</span>
                  <input
                    type="text"
                    className="draft-input"
                    value="Legal Team <legal-team@jag.mil>"
                    readOnly
                  />
                </div>
                <div className="draft-field">
                  <span className="draft-label">Subject:</span>
                  <input type="text" className="draft-input" placeholder="Email subject..." />
                </div>
              </div>
              <textarea
                className="email-textarea-draft"
                placeholder="Type your message here...&#10;&#10;Example: CPT John Smith stationed at Fort Bragg is scheduled for an Article 15 hearing on March 15, 2024..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={10}
              />
            </div>
            <button
              className={`process-button ${processing ? 'processing' : ''}`}
              onClick={useRealAPI ? handleProcessEmailOfficial : handleProcessEmail}
              disabled={processing || !emailContent}
            >
              {processing ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Process Email
                </>
              )}
            </button>

            <div className="api-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={useRealAPI}
                  onChange={(e) => setUseRealAPI(e.target.checked)}
                  className="toggle-checkbox"
                />
                <span className="toggle-switch"></span>
                <span className="toggle-text">
                  {useRealAPI ? 'Using Live API' : 'Using Demo Mode'}
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div className="batch-processing-section">
            <div className="batch-header">
              <div className="batch-info">
                <h3 className="batch-title">Batch Email Processing</h3>
                <p className="batch-description">
                  Process {testEmails.length} pre-populated test emails through the pipeline
                </p>
              </div>
              <button
                className={`batch-process-button ${processing ? 'processing' : ''}`}
                onClick={handleBatchProcess}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="spinner"></div>
                    Processing ({currentBatchIndex + 1}/{testEmails.length})
                  </>
                ) : (
                  <>
                    <Layers size={18} />
                    Process All Emails
                  </>
                )}
              </button>
            </div>

            <div className="api-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={useRealAPI}
                  onChange={(e) => setUseRealAPI(e.target.checked)}
                  className="toggle-checkbox"
                />
                <span className="toggle-switch"></span>
                <span className="toggle-text">
                  {useRealAPI ? 'Using Live API' : 'Using Demo Mode'}
                </span>
              </label>
            </div>

            {/* Test Emails Preview */}
            <div className="batch-emails-preview">
              <h4 className="preview-title">Test Emails Queue</h4>
              <div className="batch-emails-list">
                {testEmails.map((email, idx) => (
                  <div
                    key={idx}
                    className={`batch-email-item ${
                      processing && idx === currentBatchIndex
                        ? 'processing'
                        : processing && idx < currentBatchIndex
                        ? 'completed'
                        : ''
                    }`}
                  >
                    <div className="batch-email-number">{idx + 1}</div>
                    <div className="batch-email-content">
                      <div className="batch-email-subject">{email.subject}</div>
                      <div className="batch-email-preview">{email.content.substring(0, 100)}...</div>
                    </div>
                    <div className="batch-email-status">
                      {processing && idx === currentBatchIndex && <div className="spinner-small"></div>}
                      {processing && idx < currentBatchIndex && <CheckCircle size={20} className="check-icon" />}
                      {!processing && <Clock size={20} className="pending-icon" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Results */}
            {batchResults.length > 0 && (
              <div className="batch-results-section">
                <h3 className="batch-results-title">Processing Results</h3>
                {batchResults.map((result, idx) => (
                  <div key={idx} className="batch-result-card">
                    <div className="batch-result-header">
                      <div className="batch-result-number">Email {result.emailIndex + 1}</div>
                      <div className="batch-result-subject">{result.subject}</div>
                      <div
                        className={`batch-classification-badge ${
                          result.classification.label === 'RELEVANT' || result.classification.label === 1
                            ? 'relevant'
                            : 'irrelevant'
                        }`}
                      >
                        {result.classification.label === 1 || result.classification.label === 'RELEVANT'
                          ? 'RELEVANT'
                          : 'IRRELEVANT'}
                      </div>
                    </div>

                    <div className="batch-result-content">
                      {result.entities && result.entities.length > 0 && (
                        <div className="batch-entities">
                          <strong>Entities:</strong>
                          <div className="batch-entities-list">
                            {result.entities.map((entity, eidx) => (
                              <span
                                key={eidx}
                                className="batch-entity-tag"
                                style={{ borderLeftColor: entity.color }}
                              >
                                {entity.text}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.relationships && result.relationships.length > 0 && (
                        <div className="batch-relationships">
                          <strong>Relationships:</strong> {result.relationships.length} detected
                        </div>
                      )}

                      
                      {/* {result.fullText && result.fullText.length > 0 && (
                        <div className="batch-relationships">
                          <strong>Email Text:</strong> {result.fullText}
                        </div>
                      )} */}
{/* 
                      {result.body && result.body.length > 0 && (
                        <div className="batch-relationships">
                          <strong>Email Text:</strong> {result.body}
                        </div>
                      )} */}

                     {result.body && result.body.length > 0 && (
                        <div className="batch-relationships">
                          <strong>Email Text:</strong>
                          <div className="email-body-text">
                            {result.body}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            )}
              {showBatchSummary && (
                <div className="batch-summary-outlook-container">
                  <div className="outlook-summary-card">
                    <div className="outlook-summary-header">
                      <div className="outlook-from-line">
                        <span className="outlook-label">From:</span>
                        <span className="outlook-value">JAG Intelligence System &lt;system@jag.mil&gt;</span>
                      </div>
                      <div className="outlook-to-line">
                        <span className="outlook-label">To:</span>
                        <span className="outlook-value">Legal Team &lt;legal-team@jag.mil&gt;</span>
                      </div>
                      <div className="outlook-subject-line">
                        <span className="outlook-label">Subject:</span>
                        <span className="outlook-value">Batch Processing Summary - {testEmails.length} Emails Analyzed</span>
                      </div>
                      <div className="outlook-time-line">
                        <span className="outlook-label">Received:</span>
                        <span className="outlook-value">{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="outlook-divider"></div>
                    
                    <div className="outlook-summary-body">
                      {summaryLoading ? (
                        <div className="summary-loading-container">
                          <div className="summary-loading-text">Generating summary...</div>
                          <div className="summary-progress-bar">
                            <div 
                              className="summary-progress-fill"
                              style={{ width: `${summaryProgress}%` }}
                            ></div>
                          </div>
                          <div className="summary-progress-percent">{summaryProgress}%</div>
                        </div>
                      ) : (
                        <>
                          {typedSummary}
                          {typedSummary.length < 500 && <span className="typing-cursor">|</span>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        
        )}
      </div>

      {/* Pipeline Progress */}
      {useRealAPI && processing && (
        <div className="pipeline-progress">
          <div
            className={`progress-step ${
              pipelineStep === 'classification' ? 'active' : pipelineStep && pipelineStep !== 'classification' ? 'complete' : ''
            }`}
          >
            <div className="progress-icon">
              <Binary />
            </div>
            <span>Classification</span>
          </div>
          <div className="progress-connector"></div>
          <div
            className={`progress-step ${
              pipelineStep === 'ner'
                ? 'active'
                : pipelineStep === 'graph' || pipelineStep === 'summary' || pipelineStep === 'complete'
                ? 'complete'
                : ''
            }`}
          >
            <div className="progress-icon">
              <GitBranch />
            </div>
            <span>NER Extraction</span>
          </div>
          <div className="progress-connector"></div>
          <div
            className={`progress-step ${
              pipelineStep === 'graph' ? 'active' : pipelineStep === 'summary' || pipelineStep === 'complete' ? 'complete' : ''
            }`}
          >
            <div className="progress-icon">
              <Database />
            </div>
            <span>Graph DB</span>
          </div>
          <div className="progress-connector"></div>
          <div className={`progress-step ${pipelineStep === 'summary' ? 'active' : pipelineStep === 'complete' ? 'complete' : ''}`}>
            <div className="progress-icon">
              <FileText />
            </div>
            <span>Summary</span>
          </div>
        </div>
      )}

      {/* Single Email Results */}
      {results && (
        <div className="results-section">
          {results.classification && (
            <div className="results-card classification-card">
              <h3 className="results-title">Binary Classification</h3>
              <div className="classification-result">
                <div
                  className={`classification-badge ${
                    results.classification.label === 'RELEVANT' || results.classification.label === 1
                      ? 'relevant'
                      : 'irrelevant'
                  }`}
                >
                  <AlertCircle size={20} />
                  <span>
                    Classification:{' '}
                    {results.classification.label === 1 || results.classification.label === 'RELEVANT'
                      ? 'RELEVANT'
                      : 'IRRELEVANT'}
                  </span>
                </div>
                {results.classification.confidence !== undefined && (
                  <div className="classification-confidence">
                    <span className="confidence-label">Confidence:</span>
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{ width: `${results.classification.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="confidence-value">{Math.round(results.classification.confidence * 100)}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {results.entities && results.entities.length > 0 && (
            <div className="results-card entities-card">
              <h3 className="results-title">Extracted Entities</h3>
              <div className="entities-list">
                {results.entities.map((entity, idx) => (
                  <div key={idx} className="entity-badge" style={{ borderLeftColor: entity.color }}>
                    <span className="entity-text">{entity.text}</span>
                    <span className="entity-type">{entity.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.relationships && results.relationships.length > 0 && (
            <div className="results-card relationships-card">
              <h3 className="results-title">Detected Relationships</h3>
              <div className="relationships-list">
                {results.relationships.map((rel, idx) => (
                  <div key={idx} className="relationship-item">
                    <span className="rel-node">{rel.from}</span>
                    <span className="rel-arrow">→</span>
                    <span className="rel-type">{rel.relation}</span>
                    <span className="rel-arrow">→</span>
                    <span className="rel-node">{rel.to}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.summary && (
            <div className="results-card summary-card-mvp">
              <h3 className="results-title">Email Summary</h3>
              <div className="outlook-email-result">
                <div className="email-header-line">
                  <span className="header-label">From:</span>
                  <span className="header-value">JAG Intelligence System</span>
                </div>
                <div className="email-header-line">
                  <span className="header-label">To:</span>
                  <span className="header-value">Legal Team</span>
                </div>
                <div className="email-header-line">
                  <span className="header-label">Subject:</span>
                  <span className="header-value">Graph Database Update Summary</span>
                </div>
                <div className="email-divider"></div>
                <div className="email-body-result">
                  <p>{results.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* {results.entities && results.entities.length > 0 &&  (
            <div className="results-card graph-card">
              <h3 className="results-title">
                <Database size={20} />
                Graph Database View
              </h3>
              <div className="neo4j-graph-container">
                <svg className="neo4j-graph-svg" viewBox="0 0 600 400">
                  <defs>
                    <marker id="arrowhead-mvp" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
                    </marker>
                  </defs>

                  <line x1="150" y1="200" x2="280" y2="120" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-mvp)" />
                  <line x1="150" y1="200" x2="280" y2="280" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-mvp)" />
                  <line x1="350" y1="120" x2="470" y2="200" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-mvp)" />
                  <line x1="350" y1="280" x2="470" y2="200" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-mvp)" />

                  <text x="200" y="150" fill="#94a3b8" fontSize="11">STATIONED_AT</text>
                  <text x="200" y="250" fill="#94a3b8" fontSize="11">INVOLVED_IN</text>

                  <circle cx="150" cy="200" r="40" fill="#3b82f6" className="graph-node" />
                  <text x="150" y="200" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">CPT</text>
                  <text x="150" y="215" textAnchor="middle" fill="white" fontSize="9">Smith</text>

                  <circle cx="315" cy="120" r="35" fill="#10b981" className="graph-node" />
                  <text x="315" y="120" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Fort</text>
                  <text x="315" y="132" textAnchor="middle" fill="white" fontSize="9">Bragg</text>

                  <circle cx="315" cy="280" r="35" fill="#f59e0b" className="graph-node" />
                  <text x="315" y="280" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Article</text>
                  <text x="315" y="292" textAnchor="middle" fill="white" fontSize="9">15</text>

                  <circle cx="470" cy="200" r="35" fill="#8b5cf6" className="graph-node" />
                  <text x="470" y="200" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Mar 15</text>
                  <text x="470" y="212" textAnchor="middle" fill="white" fontSize="9">2024</text>
                </svg>
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
    </main>
      </div>
      
  );
}
