import React, { useState } from 'react';
import { Mail, Database, BarChart3, Send, AlertCircle, GitBranch, Users, FileText, Binary, Layers, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function JAGEmailProcessor() {
  const [activeView, setActiveView] = useState('demo');
  const [emailContent, setEmailContent] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [useRealAPI, setUseRealAPI] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(null);
  const [processingMode, setProcessingMode] = useState('single');
  const [batchResults, setBatchResults] = useState([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);

const testEmails = [
  {
    subject: "Case Update – CPT John Smith (Case #JS-2417)",
    content: "New information has been added to Case #JS-2417 involving CPT John Smith’s March 2024 training incident. The safety officer submitted a revised statement that may affect the initial findings. Please review before drafting the attorney’s response."
  },
  {
    subject: "Document Requirements – CPT John Smith Hearing (Case #JS-2521)",
    content: "For Case #JS-2521, all updated counseling statements and the final witness list for CPT John Smith’s administrative hearing must be added to the packet. Submission deadline remains 1700 tomorrow."
  },
  {
    subject: "Evidence Review Needed – CPT John Smith (Case #JS-2417)",
    content: "During review of Case #JS-2417, legal identified inconsistencies in the radio traffic logs from the incident day. Please examine these discrepancies and provide attorney notes for follow-up."
  },
  {
  subject: "Team Potluck – Friday at 1200",
  content: "Hi CPT John Smith,\n\nJust a reminder that the unit is hosting a team potluck this Friday at 1200 in the break room. Everyone is encouraged to bring a dish to share. Let us know what you plan to bring so we can coordinate. Hope to see you there!\n\n- SFC Ramirez"
  },
  {
    subject: "Commander Inquiry – CPT John Smith (Case #JS-2521)",
    content: "The battalion commander submitted additional questions regarding CPT John Smith’s decision-making during the readiness evaluation under Case #JS-2521. Attorney response is required by Monday."
  }
];


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

  setProcessing(false);
  setCurrentBatchIndex(-1);
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
    const summary = generateSummary(mappedEntities, relationships);
    
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



  const renderDemo = () => (
    <div className="demo-container">
      <div className="demo-header">
        <Database className="demo-icon" />
        <div>
          <h2 className="demo-title">Pipeline Demo</h2>
          <p className="demo-subtitle">See how emails flow through the NER → Graph DB pipeline</p>
        </div>
      </div>

      <div className="pipeline-flow">
        <div className="pipeline-step">
          <div className="step-icon email-step">
            <Mail />
          </div>
          <h3 className="step-title">Email Ingestion</h3>
          <p className="step-description">JAG attorney emails are collected and queued for processing</p>
        </div>

        <div className="pipeline-arrow">→</div>

        <div className="pipeline-step">
          <div className="step-icon binary-step">
            <Binary />
          </div>
          <h3 className="step-title">Binary Classification</h3>
          <p className="step-description">Determines whether each incoming JAG attorney email is relevant or irrelevant</p>
        </div>

        <div className="pipeline-arrow">→</div>

        <div className="pipeline-step">
          <div className="step-icon spacy-step">
            <GitBranch />
          </div>
          <h3 className="step-title">Spacy NER</h3>
          <p className="step-description">Extract entities, relationships, and legal references</p>
        </div>

        <div className="pipeline-arrow">→</div>

        <div className="pipeline-step">
          <div className="step-icon neo4j-step">
            <Database />
          </div>
          <h3 className="step-title">GraphDB</h3>
          <p className="step-description">Store nodes and relationships in knowledge graph</p>
        </div>

        <div className="pipeline-arrow">→</div>

        <div className="pipeline-step">
          <div className="step-icon summary-step">
            <FileText />
          </div>
          <h3 className="step-title">Summary Generation</h3>
          <p className="step-description">Create intelligent summaries of graph changes</p>
        </div>
      </div>

      <div className="pipeline-details">
        <div className="detail-step">
          <div className="detail-header">
            <div className="step-icon email-step">
              <Mail />
            </div>
            <div>
              <h3 className="step-title">Email Ingestion</h3>
              <p className="step-description">JAG attorney emails are collected and queued for processing</p>
            </div>
          </div>
          <div className="detail-animation">
            <div className="outlook-inbox">
              <div className="outlook-email animate-outlook-slide delay-1">
                <div className="email-sender">MAJ Sarah Johnson</div>
                <div className="email-subject">RE: Article 15 Proceeding Update</div>
                <div className="email-preview">The hearing has been rescheduled to next week...</div>
              </div>
              <div className="outlook-email animate-outlook-slide delay-2">
                <div className="email-sender">CPT Robert Lee</div>
                <div className="email-subject">Court Martial Assignment</div>
                <div className="email-preview">I've been assigned as defense counsel for...</div>
              </div>
              <div className="outlook-email animate-outlook-slide delay-3">
                <div className="email-sender">LTC Maria Garcia</div>
                <div className="email-subject">Case File Review Required</div>
                <div className="email-preview">Please review the attached documents...</div>
              </div>
            </div>
            <div className="animation-label">Incoming Emails</div>
          </div>
        </div>

        <div className="detail-step">
          <div className="detail-header">
            <div className="step-icon binary-step">
              <GitBranch />
            </div>
            <div>
              <h3 className="step-title">Binary Classification</h3>
              <p className="step-description">Determines whether each incoming JAG attorney email is relevant or irrelevant</p>
            </div>
          </div>
          <div className="detail-animation">
            <div className="classification-flow">
              <div className="classifier-input-wrapper">
                <div className="classifier-input"></div>
                <div className="input-label-text">Email</div>
              </div>
              <div className="arrow-right">→</div>
              <div className="classifier-box">
                <span>Classifier</span>
              </div>
              <div className="arrow-split">
                <div className="arrow-line arrow-up">↗</div>
                <div className="arrow-line arrow-down">↘</div>
              </div>
              <div className="classifier-outputs">
                <div className="output-relevant">Relevant</div>
                <div className="output-irrelevant">Irrelevant</div>
              </div>
            </div>
            <div className="animation-label">Email Classification</div>
          </div>
        </div>

        <div className="detail-step">
          <div className="detail-header">
            <div className="step-icon spacy-step">
              <GitBranch />
            </div>
            <div>
              <h3 className="step-title">Spacy NER</h3>
              <p className="step-description">Extract entities, relationships, and legal references</p>
            </div>
          </div>
          <div className="detail-animation">
            <div className="ner-extraction">
              <div className="ner-text">
                <span className="ner-entity person">CPT Smith</span>
                <span> stationed at </span>
                <span className="ner-entity location">Fort Bragg</span>
              </div>
              <div className="ner-tags">
                <div className="tag person-tag">PERSON</div>
                <div className="tag location-tag">LOCATION</div>
              </div>
            </div>
            <div className="animation-label">Entity Extraction</div>
          </div>
        </div>

        <div className="detail-step">
          <div className="detail-header">
            <div className="step-icon neo4j-step">
              <Database />
            </div>
            <div>
              <h3 className="step-title">GraphDB</h3>
              <p className="step-description">Store nodes and relationships in knowledge graph</p>
            </div>
          </div>
          <div className="detail-animation">
            <div className="graph-update-animation">
              <svg className="graph-update-svg" viewBox="0 0 500 300">
                <defs>
                  <marker id="arrowhead-demo" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
                  </marker>
                </defs>
                
                <line className="existing-edge" x1="100" y1="150" x2="200" y2="150" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-demo)" />
                <line className="new-edge animate-edge-appear" x1="250" y1="150" x2="350" y2="100" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowhead-demo)" />
                <line className="new-edge animate-edge-appear delay-edge" x1="250" y1="150" x2="350" y2="200" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowhead-demo)" />
                
                <text className="edge-label" x="150" y="140" fill="#94a3b8" fontSize="11">WORKS_AT</text>
                <text className="edge-label new-label animate-label-appear" x="290" y="110" fill="#10b981" fontSize="11">LOCATED_IN</text>
                <text className="edge-label new-label animate-label-appear delay-label" x="290" y="190" fill="#f59e0b" fontSize="11">ASSIGNED_TO</text>
                
                <circle className="existing-node" cx="100" cy="150" r="30" fill="#3b82f6" />
                <text x="100" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">PERSON</text>
                
                <circle className="existing-node" cx="200" cy="150" r="30" fill="#10b981" />
                <text x="200" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">ORG</text>
                
                <circle className="new-node animate-node-appear" cx="250" cy="150" r="30" fill="#3b82f6" />
                <text className="animate-node-appear" x="250" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">PERSON</text>
                
                <circle className="new-node animate-node-appear delay-node-1" cx="350" cy="100" r="30" fill="#10b981" />
                <text className="animate-node-appear delay-node-1" x="350" y="105" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">LOCATION</text>
                
                <circle className="new-node animate-node-appear delay-node-2" cx="350" cy="200" r="30" fill="#f59e0b" />
                <text className="animate-node-appear delay-node-2" x="350" y="205" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">CASE</text>
              </svg>
            </div>
            <div className="animation-label">Knowledge Graph Update</div>
          </div>
        </div>

        <div className="detail-step">
          <div className="detail-header">
            <div className="step-icon summary-step">
              <FileText />
            </div>
            <div>
              <h3 className="step-title">Summary Generation</h3>
              <p className="step-description">Create intelligent summaries of graph changes</p>
            </div>
          </div>
          <div className="detail-animation">
            <div className="outlook-email-summary">
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
                <span className="header-value">Case Updates for CPT John Smith</span>
              </div>
              <div className="email-divider"></div>
                <div className="email-body-summary">
                  <p className="summary-paragraph animate-paragraph">Hello CPT John Smith,</p>
                  
                  <p className="summary-paragraph animate-paragraph delay-p1">
                    Here’s your weekly summary of the cases you are currently working on and their latest updates.
                  </p>

                  <p className="summary-paragraph animate-paragraph delay-p1"><strong>Case Updates:</strong></p>
                  <ul className="summary-list animate-paragraph delay-p1">
                    <li><strong>Article 15 Proceeding – Fort Bragg:</strong> Case initiated; documents submitted for review.</li>
                    <li><strong>Training Compliance Review:</strong> Pending review of submitted training logs; follow-up scheduled next week.</li>
                    <li><strong>Equipment Audit – Fort Bragg:</strong> Audit completed; discrepancies reported and logged.</li>
                    <li><strong>Special Project X:</strong> Coordination with external agencies completed; awaiting feedback.</li>
                  </ul>
                </div>

            </div>
            <div className="animation-label">Email Summary</div>
          </div>
        </div>
      </div>

      {/* <div className="demo-stats">
        <div className="stat-card">
          <div className="stat-value">1,247</div>
          <div className="stat-label">Emails Processed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">3,891</div>
          <div className="stat-label">Entities Extracted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">7,203</div>
          <div className="stat-label">Relationships Mapped</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">98.3%</div>
          <div className="stat-label">Accuracy Rate</div>
        </div>
      </div> */}
    </div>
  );

const renderMVP = () => {
  return (
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

                      {result.summary && (
                        <div className="batch-summary">
                          <strong>Summary:</strong>
                          <p>{result.summary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
  );
};


  const renderAdmin = () => (
    <div className="admin-container">
      <div className="admin-header">
        <BarChart3 className="admin-icon" />
        <div>
          <h2 className="admin-title">Admin Dashboard</h2>
          <p className="admin-subtitle">Graph Database Overview</p>
        </div>
      </div>

      <div className="admin-grid">
        <div className="metric-card">
          <div className="metric-header">
            <Users className="metric-icon person-icon" />
            <span className="metric-label">Person Nodes</span>
          </div>
          <div className="metric-value">342</div>
          <div className="metric-change positive">+12 this week</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Database className="metric-icon location-icon" />
            <span className="metric-label">Location Nodes</span>
          </div>
          <div className="metric-value">87</div>
          <div className="metric-change positive">+3 this week</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <FileText className="metric-icon legal-icon" />
            <span className="metric-label">Legal Code Nodes</span>
          </div>
          <div className="metric-value">156</div>
          <div className="metric-change neutral">No change</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <GitBranch className="metric-icon relationship-icon" />
            <span className="metric-label">Total Relationships</span>
          </div>
          <div className="metric-value">1,829</div>
          <div className="metric-change positive">+47 this week</div>
        </div>
      </div>

      <div className="graph-visualization">
        <h3 className="graph-title">
          <Database size={24} />
          Knowledge Graph - Sample Data
        </h3>
        <div className="graph-canvas">
          <svg className="graph-svg" viewBox="0 0 1000 600">
            <defs>
              <marker id="arrowhead-admin" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
              </marker>
            </defs>
            
            {/* Connections */}
            <line x1="200" y1="300" x2="350" y2="200" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-admin)" />
            <line x1="200" y1="300" x2="350" y2="400" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-admin)" />
            <line x1="420" y1="200" x2="550" y2="150" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-admin)" />
            <line x1="420" y1="400" x2="550" y2="350" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-admin)" />
            <line x1="620" y1="150" x2="750" y2="200" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-admin)" />
            <line x1="620" y1="350" x2="750" y2="300" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-admin)" />
            <line x1="200" y1="300" x2="350" y2="300" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-admin)" />
            <line x1="420" y1="300" x2="550" y2="250" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-admin)" />
            <line x1="820" y1="250" x2="750" y2="450" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead-admin)" />
            
            {/* Edge Labels */}
            <text x="260" y="240" fill="#94a3b8" fontSize="11">STATIONED_AT</text>
            <text x="260" y="360" fill="#94a3b8" fontSize="11">ASSIGNED_TO</text>
            <text x="270" y="290" fill="#94a3b8" fontSize="11">REPORTS_TO</text>
            <text x="470" y="170" fill="#94a3b8" fontSize="11">LOCATED_IN</text>
            <text x="470" y="315" fill="#94a3b8" fontSize="11">INVOLVES</text>
            <text x="670" y="170" fill="#94a3b8" fontSize="11">SUPERVISES</text>
            <text x="480" y="240" fill="#94a3b8" fontSize="11">HEARING_AT</text>
            
            {/* Person Nodes */}
            <circle cx="200" cy="300" r="45" fill="#3b82f6" className="graph-node" />
            <text x="200" y="295" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">MAJ Sarah</text>
            <text x="200" y="310" textAnchor="middle" fill="white" fontSize="10">Johnson</text>
            
            <circle cx="820" cy="250" r="45" fill="#3b82f6" className="graph-node" />
            <text x="820" y="245" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">CPT John</text>
            <text x="820" y="260" textAnchor="middle" fill="white" fontSize="10">Smith</text>
            
            <circle cx="385" cy="300" r="40" fill="#3b82f6" className="graph-node" />
            <text x="385" y="295" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">LTC Maria</text>
            <text x="385" y="308" textAnchor="middle" fill="white" fontSize="9">Garcia</text>
            
            {/* Location Nodes */}
            <circle cx="385" cy="200" r="40" fill="#10b981" className="graph-node" />
            <text x="385" y="200" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Fort Bragg</text>
            
            <circle cx="585" cy="150" r="35" fill="#10b981" className="graph-node" />
            <text x="585" y="150" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">NC</text>
            
            {/* Legal/Case Nodes */}
            <circle cx="385" cy="400" r="40" fill="#f59e0b" className="graph-node" />
            <text x="385" y="395" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Case</text>
            <text x="385" y="408" textAnchor="middle" fill="white" fontSize="9">#2024-187</text>
            
            <circle cx="585" cy="350" r="35" fill="#f59e0b" className="graph-node" />
            <text x="585" y="350" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Article 15</text>
            
            <circle cx="750" cy="450" r="35" fill="#f59e0b" className="graph-node" />
            <text x="750" y="445" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Court</text>
            <text x="750" y="458" textAnchor="middle" fill="white" fontSize="9">Martial</text>
            
            {/* Date Nodes */}
            <circle cx="585" cy="250" r="35" fill="#8b5cf6" className="graph-node" />
            <text x="585" y="250" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Mar 15</text>
            <text x="585" y="262" textAnchor="middle" fill="white" fontSize="9">2024</text>
            
            {/* Organization Node */}
            <circle cx="750" cy="250" r="40" fill="#ec4899" className="graph-node" />
            <text x="750" y="245" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Legal</text>
            <text x="750" y="258" textAnchor="middle" fill="white" fontSize="9">Division</text>
          </svg>
        </div>
      </div>

      <div className="ontology-section">
        <h3 className="ontology-title">
          <GitBranch size={24} />
          Database Ontology
        </h3>
        <div className="ontology-grid">
          <div className="ontology-card">
            <div className="ontology-node-type person-type">
              <Users size={20} />
              <span>PERSON</span>
            </div>
            <div className="ontology-properties">
              <div className="property-item">• name: String</div>
              <div className="property-item">• rank: String</div>
              <div className="property-item">• branch: String</div>
              <div className="property-item">• email: String</div>
            </div>
            <div className="ontology-relationships">
              <div className="rel-chip">STATIONED_AT</div>
              <div className="rel-chip">ASSIGNED_TO</div>
              <div className="rel-chip">REPORTS_TO</div>
            </div>
          </div>

          <div className="ontology-card">
            <div className="ontology-node-type location-type">
              <Database size={20} />
              <span>LOCATION</span>
            </div>
            <div className="ontology-properties">
              <div className="property-item">• name: String</div>
              <div className="property-item">• type: String</div>
              <div className="property-item">• state: String</div>
              <div className="property-item">• coordinates: Point</div>
            </div>
            <div className="ontology-relationships">
              <div className="rel-chip">LOCATED_IN</div>
              <div className="rel-chip">PART_OF</div>
            </div>
          </div>

          <div className="ontology-card">
            <div className="ontology-node-type legal-type">
              <FileText size={20} />
              <span>LEGAL_CODE</span>
            </div>
            <div className="ontology-properties">
              <div className="property-item">• code: String</div>
              <div className="property-item">• description: String</div>
              <div className="property-item">• category: String</div>
              <div className="property-item">• severity: String</div>
            </div>
            <div className="ontology-relationships">
              <div className="rel-chip">INVOLVES</div>
              <div className="rel-chip">APPLIES_TO</div>
            </div>
          </div>

          <div className="ontology-card">
            <div className="ontology-node-type case-type">
              <AlertCircle size={20} />
              <span>CASE</span>
            </div>
            <div className="ontology-properties">
              <div className="property-item">• case_id: String</div>
              <div className="property-item">• status: String</div>
              <div className="property-item">• filed_date: Date</div>
              <div className="property-item">• priority: String</div>
            </div>
            <div className="ontology-relationships">
              <div className="rel-chip">HAS_DEFENDANT</div>
              <div className="rel-chip">HAS_ATTORNEY</div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3 className="activity-title">Recent Graph Updates</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <div className="activity-text">Added relationship: MAJ Sarah Johnson → ASSIGNED_TO → Fort Hood</div>
              <div className="activity-time">2 minutes ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <div className="activity-text">New entity detected: Article 32 Hearing</div>
              <div className="activity-time">15 minutes ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <div className="activity-text">Updated node: CPT Robert Lee → PROMOTED_TO → MAJ Robert Lee</div>
              <div className="activity-time">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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

      <main className="main-content">
        {activeView === 'demo' && renderDemo()}
        {activeView === 'mvp' && renderMVP()}
        {activeView === 'admin' && renderAdmin()}
      </main>
    </div>
  );
}