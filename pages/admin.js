import React, { useState } from 'react';
import { Mail, Database, BarChart3, Send, AlertCircle, GitBranch, Users, FileText, Binary, Layers, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
      const [activeView, setActiveView] = useState('demo');
    
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
    </main>
    </div>
  );
}
