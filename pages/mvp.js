
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
    </main>
      </div>
      
  );
}
