import React, { useState, useEffect } from 'react';
import { Mail, Database, BarChart3, Send, AlertCircle, GitBranch, Users, FileText, Binary, Layers, Clock, CheckCircle, Network, TrendingUp, Plus, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [subjectContent, setSubjectContent] = useState("");
  const [graphChanges, setGraphChanges] = useState(null);
  const [batchGraphChanges, setBatchGraphChanges] = useState(null);
  const [expandedEntities, setExpandedEntities] = useState({});
  const [graphAnimation, setGraphAnimation] = useState(null);

  // Comprehensive entity types with updated colors
  const ENTITY_TYPES = [
    'PERSON', 'LOCATION', 'DATE', 'CASE', 'COURT', 'JUDGE', 
    'MOTION', 'HEARING', 'PARTY_ENTITY', 'STATUTE', 'LEGAL_ISSUE', 
    'PRECEDENT', 'CONTRACT', 'CLAUSE', 'EVIDENCE'
  ];

  const entityColorMap = {
    'PERSON': '#2563eb',      // Rich blue
    'LOCATION': '#059669',    // Emerald green
    'DATE': '#7c3aed',        // Vibrant purple
    'CASE': '#dc2626',        // Strong red
    'COURT': '#be185d',       // Deep pink
    'JUDGE': '#0891b2',       // Cyan
    'MOTION': '#d97706',      // Amber
    'HEARING': '#db2777',     // Pink
    'PARTY_ENTITY': '#0d9488',// Teal
    'STATUTE': '#ea580c',     // Orange
    'LEGAL_ISSUE': '#9333ea', // Purple
    'PRECEDENT': '#65a30d',   // Lime
    'CONTRACT': '#4f46e5',    // Indigo
    'CLAUSE': '#57534e',      // Stone
    'EVIDENCE': '#0284c7'     // Sky blue
  };

const testEmails = [
  {
    subject: "Case 1 – Thompson v. United States: Initial Discovery Review and Liability Assessment",
    content: `Good afternoon CPT Smith,

I wanted to provide an update on Thompson v. United States.

Key observations:
- The plaintiff continues to assert negligence by the government driver.
- Vehicle inspection logs show no mechanical deficiencies.
- Accident reconstruction suggests possible contributory negligence.

Please review and advise on settlement posture.

Respectfully,
MAJ Allen`
  },
  {
    subject: "Case 1 – Thompson v. United States: Witness Statements and Damages",
    content: `Sir,

Recent witness statements indicate:
- Two civilian witnesses observed excessive speed by the plaintiff.
- No witnesses corroborate the claim that the GOV ran a stop sign.

Damages appear overstated due to documented pre-existing conditions.

v/r,
CPT Nguyen`
  },
  {
    subject: "Case 2 – Alvarez v. United States: Command Investigation Findings",
    content: `CPT Smith,

The Command Investigation found:
- Prior notice of erosion hazards at Range 14
- Maintenance delays due to funding constraints
- Contractor was authorized and within scope of duties

These findings may impact liability analysis.

LTC Harris`
  },
  {
    subject: "Team Potluck – Friday at 1200",
    content: `Hi CPT John Smith,

Just a reminder that the unit is hosting a team potluck this Friday at 1200.

Details:
- Location: Break room
- Theme: Comfort foods
- Please reply with what you plan to bring

Hope to see you there!

- SFC Ramirez`
  },
  {
    subject: "Case 2 – Alvarez v. United States: Settlement Considerations",
    content: `CPT Smith,

Based on preliminary exposure analysis:
- Liability risk assessed as moderate to high
- Damages appear limited
- Early settlement may be fiscally prudent

Recommend coordinating with USARCS.

MAJ Allen`
  }
];

const placeholderSubject = `Notice of Representation, Case Coordination, and Preservation of Evidence – Case No. 24-MJ-117`;

const placeholderEmail = `Dear Counsel,

This firm represents Staff Sergeant Michael A. Reynolds, United States Army, currently assigned to the 82nd Airborne Division, 1st Brigade Combat Team, stationed at Fort Liberty, North Carolina. This correspondence serves as formal notice of representation in connection with Case No. 24-MJ-117, presently filed in the Fort Liberty Military Justice Court and arising under the Uniform Code of Military Justice (UCMJ).

The above-referenced case concerns allegations stemming from events alleged to have occurred on 14 March 2024 at or near Smoke Bomb Hill Training Area, Fort Liberty, North Carolina. As reflected in the charge sheet dated 22 March 2024, Staff Sergeant Reynolds has been charged with Article 92, UCMJ (Failure to Obey a Lawful Order). My client denies these allegations.

This matter is part of an ongoing military justice proceeding, with an Article 32 preliminary hearing currently scheduled for 10 January 2025, to be held at the Fort Liberty Legal Services Facility, Building 4-2843. The case file includes investigative materials compiled by CID Special Agent Laura M. Bennett, multiple sworn witness statements, unit policies, and command directives referenced by the Government in support of the charge.

Please be advised that the evidence presently contained in the case file both supports and materially contradicts the allegations asserted. Several documents originate from internal unit taskings issued between 1 February 2024 and 12 March 2024, including duty rosters, operational emails, and training directives discussed during a command meeting held on 5 March 2024 at 1-82 IN Headquarters, Fort Liberty.

Accordingly, this letter constitutes a formal demand for preservation of evidence. You and your client are hereby instructed to preserve all documents, reports, communications, electronic records, messages, photographs, videos, and other materials that reference, document, support, or contradict the allegations in this case. This obligation extends to materials in the possession of command staff, investigators, witnesses, and any collaborating units or legal advisors.

Please also confirm whether the Government intends to introduce additional motions or supplemental evidence prior to the scheduled hearing. Any failure to disclose or preserve relevant materials may result in appropriate motions for relief, including evidentiary sanctions or dismissal.

Nothing contained herein shall be construed as a waiver of any rights, defenses, or appellate remedies available to my client. All such rights are expressly reserved.

Kindly direct all future communications regarding this matter to my office.

Respectfully,
John Smith
Attorney at Law
Counsel for Staff Sergeant Michael A. Reynolds
Fort Liberty, North Carolina`;

// Enhanced entity extraction for placeholder email - FIXED to catch all entities
const extractPlaceholderEntities = () => {
  const text = placeholderEmail;
  const entities = [];

  // PERSON entities
  const personPatterns = [
    { pattern: /Staff Sergeant Michael A\. Reynolds/g, props: { rank: 'Staff Sergeant', first_name: 'Michael', middle_initial: 'A', last_name: 'Reynolds', branch: 'United States Army', unit: '82nd Airborne Division, 1st Brigade Combat Team', status: 'Active Duty' }, id: 'PERSON_REYNOLDS' },
    { pattern: /My client/g, props: { refers_to: 'Staff Sergeant Michael A. Reynolds' }, id: 'PERSON_REYNOLDS', is_coreference: true },
    { pattern: /CID Special Agent Laura M\. Bennett/g, props: { title: 'Special Agent', first_name: 'Laura', middle_initial: 'M', last_name: 'Bennett', agency: 'Criminal Investigation Division', role: 'Investigating Officer' }, id: 'PERSON_BENNETT' },
    { pattern: /John Smith(?=\n)/g, props: { first_name: 'John', last_name: 'Smith', title: 'Attorney at Law', role: 'Defense Counsel', bar_status: 'Active' }, id: 'PERSON_SMITH' }
  ];

  personPatterns.forEach(({ pattern, props, id, is_coreference }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: match.index,
        end: match.index + match[0].length,
        properties: props,
        canonical_id: id,
        is_coreference: is_coreference || false,
        refers_to: is_coreference ? props.refers_to : undefined
      });
    }
  });

  // LOCATION entities
  const locationPatterns = [
    { pattern: /Fort Liberty, North Carolina/g, props: { installation_type: 'Military Base', state: 'North Carolina', command: 'XVIII Airborne Corps', formerly_known_as: 'Fort Bragg' }, id: 'LOC_FORT_LIBERTY' },
    { pattern: /Smoke Bomb Hill Training Area/g, props: { location_type: 'Training Area', parent_installation: 'Fort Liberty', activity_type: 'Military Training' }, id: 'LOC_SMOKE_BOMB' },
    { pattern: /Fort Liberty Legal Services Facility/g, props: { facility_type: 'Legal Services', parent_installation: 'Fort Liberty' }, id: 'LOC_LEGAL_FAC' },
    { pattern: /Building 4-2843/g, props: { building_type: 'Government Building', location: 'Fort Liberty' }, id: 'LOC_BUILDING' },
    { pattern: /1-82 IN Headquarters/g, props: { unit_type: 'Infantry Battalion Headquarters', parent_unit: '82nd Airborne Division' }, id: 'LOC_HQ' }
  ];

  locationPatterns.forEach(({ pattern, props, id }) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'LOCATION',
        color: entityColorMap['LOCATION'],
        start: match.index,
        end: match.index + match[0].length,
        properties: props,
        canonical_id: id
      });
    }
  });

  // CASE entities
  const casePattern = /Case No\. 24-MJ-117/g;
  let match;
  while ((match = casePattern.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'CASE',
      color: entityColorMap['CASE'],
      start: match.index,
      end: match.index + match[0].length,
      properties: {
        case_number: '24-MJ-117',
        case_type: 'Court-Martial',
        forum: 'Military Justice',
        status: 'Pre-Article 32 Hearing',
        filing_date: '2024-03-22'
      },
      canonical_id: 'CASE_24MJ117'
    });
  }

  // COURT entity
  const courtPattern = /Fort Liberty Military Justice Court/g;
  while ((match = courtPattern.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'COURT',
      color: entityColorMap['COURT'],
      start: match.index,
      end: match.index + match[0].length,
      properties: {
        court_type: 'Court-Martial Convening Authority',
        jurisdiction: 'Military',
        location: 'Fort Liberty, North Carolina'
      },
      canonical_id: 'COURT_FL_MJ'
    });
  }

  // STATUTE entities
  const statutePatterns = [
    { pattern: /Uniform Code of Military Justice/g, props: { statute_type: 'Military Law', abbreviation: 'UCMJ', codification: '10 U.S.C. §§ 801-946', governing_body: 'Congress' }, id: 'STATUTE_UCMJ' },
    { pattern: /UCMJ(?!\s*\()/g, props: { full_name: 'Uniform Code of Military Justice' }, id: 'STATUTE_UCMJ', is_coreference: true },
    { pattern: /Article 92, UCMJ/g, props: { article_number: '92', offense: 'Failure to Obey Order or Regulation', parent_code: 'UCMJ', maximum_punishment: 'Dishonorable Discharge, Forfeiture of Pay, 2 Years Confinement' }, id: 'STATUTE_ART92' }
  ];

  statutePatterns.forEach(({ pattern, props, id, is_coreference }) => {
    while ((match = pattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'STATUTE',
        color: entityColorMap['STATUTE'],
        start: match.index,
        end: match.index + match[0].length,
        properties: props,
        canonical_id: id,
        is_coreference: is_coreference || false,
        refers_to: is_coreference ? props.full_name : undefined
      });
    }
  });

  // DATE entities
  const datePatterns = [
    { text: '14 March 2024', type: 'incident_date' },
    { text: '22 March 2024', type: 'charge_date' },
    { text: '10 January 2025', type: 'hearing_date' },
    { text: '1 February 2024', type: 'document_period_start' },
    { text: '12 March 2024', type: 'document_period_end' },
    { text: '5 March 2024', type: 'meeting_date' }
  ];

  datePatterns.forEach((date, idx) => {
    const index = text.indexOf(date.text);
    if (index !== -1) {
      entities.push({
        text: date.text,
        type: 'DATE',
        color: entityColorMap['DATE'],
        start: index,
        end: index + date.text.length,
        properties: {
          date_type: date.type,
          formatted: date.text,
          significance: date.type.replace(/_/g, ' ')
        },
        canonical_id: `DATE_${idx}`
      });
    }
  });

  // HEARING entity
  const hearingPattern = /Article 32 preliminary hearing/g;
  while ((match = hearingPattern.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'HEARING',
      color: entityColorMap['HEARING'],
      start: match.index,
      end: match.index + match[0].length,
      properties: {
        hearing_type: 'Article 32 Preliminary Hearing',
        purpose: 'Determine Probable Cause',
        scheduled_date: '2025-01-10',
        location: 'Fort Liberty Legal Services Facility'
      },
      canonical_id: 'HEARING_ART32'
    });
  }

  // EVIDENCE entities
  const evidencePatterns = [
    { pattern: /charge sheet/g, props: { document_type: 'Charge Sheet', date: '2024-03-22', relevance: 'Formal Charges', custodian: 'Trial Counsel' }, id: 'EVID_CHARGE_SHEET' },
    { pattern: /witness statements/g, props: { document_type: 'Sworn Statements', relevance: 'Testimonial Evidence', authentication_required: true }, id: 'EVID_WITNESS' },
    { pattern: /unit policies/g, props: { document_type: 'Policy Documents', relevance: 'Regulatory Compliance', source: 'Unit Command' }, id: 'EVID_POLICIES' },
    { pattern: /command directives/g, props: { document_type: 'Command Directives', relevance: 'Authority and Orders', source: 'Command' }, id: 'EVID_DIRECTIVES' },
    { pattern: /duty rosters/g, props: { document_type: 'Administrative Records', relevance: 'Assignment Documentation', custodian: 'Unit Administration' }, id: 'EVID_ROSTERS' },
    { pattern: /operational emails/g, props: { document_type: 'Electronic Communications', relevance: 'Correspondence', preservation_required: true }, id: 'EVID_EMAILS' },
    { pattern: /training directives/g, props: { document_type: 'Training Orders', relevance: 'Duty Requirements', source: 'Training Command' }, id: 'EVID_TRAINING' }
  ];

  evidencePatterns.forEach(({ pattern, props, id }) => {
    while ((match = pattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'EVIDENCE',
        color: entityColorMap['EVIDENCE'],
        start: match.index,
        end: match.index + match[0].length,
        properties: props,
        canonical_id: id
      });
    }
  });

  // MOTION entity (implicit)
  const motionPattern = /motions for relief/g;
  while ((match = motionPattern.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'MOTION',
      color: entityColorMap['MOTION'],
      start: match.index,
      end: match.index + match[0].length,
      properties: {
        motion_type: 'Motion for Relief',
        potential_grounds: 'Evidentiary Sanctions or Dismissal',
        filing_status: 'Potential'
      },
      canonical_id: 'MOTION_RELIEF'
    });
  }

  // LEGAL_ISSUE entity
  const legalIssuePattern = /Failure to Obey a Lawful Order/g;
  while ((match = legalIssuePattern.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'LEGAL_ISSUE',
      color: entityColorMap['LEGAL_ISSUE'],
      start: match.index,
      end: match.index + match[0].length,
      properties: {
        issue_type: 'Criminal Offense',
        governing_law: 'Article 92, UCMJ',
        elements: 'Order was lawful, accused had knowledge, accused violated order'
      },
      canonical_id: 'ISSUE_ART92'
    });
  }

  return entities.filter(e => e.start !== -1).sort((a, b) => a.start - b.start);
};

// Enhanced entity extraction with properties and coreference
const extractEntitiesWithProperties = (text, isEmail1 = false) => {
  const entities = [];
  
  if (isEmail1 || text.includes("Thompson v. United States")) {
    // Case entity
    const caseMatch = text.match(/Thompson v\. United States/);
    if (caseMatch) {
      entities.push({
        text: 'Thompson v. United States',
        type: 'CASE',
        color: entityColorMap['CASE'],
        start: text.indexOf(caseMatch[0]),
        end: text.indexOf(caseMatch[0]) + caseMatch[0].length,
        properties: {
          case_number: '2024-CV-1847',
          case_type: 'Federal Tort Claims Act',
          status: 'Discovery Phase',
          jurisdiction: 'Federal District Court'
        },
        canonical_id: 'CASE_001'
      });
    }

    // Parties
    const plaintiffIdx = text.toLowerCase().indexOf('plaintiff');
    if (plaintiffIdx !== -1) {
      entities.push({
        text: 'plaintiff',
        type: 'PARTY_ENTITY',
        color: entityColorMap['PARTY_ENTITY'],
        start: plaintiffIdx,
        end: plaintiffIdx + 9,
        properties: {
          role: 'Plaintiff',
          name_resolved: 'Robert Thompson',
          party_type: 'Individual'
        },
        canonical_id: 'PARTY_001',
        refers_to: 'Robert Thompson'
      });
    }

    // Legal issues
    if (text.includes('negligence')) {
      entities.push({
        text: 'negligence',
        type: 'LEGAL_ISSUE',
        color: entityColorMap['LEGAL_ISSUE'],
        start: text.toLowerCase().indexOf('negligence'),
        end: text.toLowerCase().indexOf('negligence') + 10,
        properties: {
          issue_type: 'Tort',
          standard: 'Reasonable Person Standard',
          burden_of_proof: 'Preponderance of Evidence'
        },
        canonical_id: 'ISSUE_001'
      });
    }

    // Evidence
    if (text.includes('Vehicle inspection logs')) {
      entities.push({
        text: 'Vehicle inspection logs',
        type: 'EVIDENCE',
        color: entityColorMap['EVIDENCE'],
        start: text.indexOf('Vehicle inspection logs'),
        end: text.indexOf('Vehicle inspection logs') + 23,
        properties: {
          evidence_type: 'Documentary',
          relevance: 'Maintenance History',
          custodian: 'Motor Pool',
          authentication_required: true
        },
        canonical_id: 'EVID_001'
      });
    }

    // Persons
    const maj = text.match(/MAJ Allen/);
    if (maj) {
      entities.push({
        text: 'MAJ Allen',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf(maj[0]),
        end: text.indexOf(maj[0]) + maj[0].length,
        properties: {
          rank: 'Major',
          first_name: 'James',
          last_name: 'Allen',
          role: 'Defense Counsel',
          unit: 'Trial Defense Service'
        },
        canonical_id: 'PERSON_001'
      });
    }

    const cpt = text.match(/CPT (Smith|Nguyen)/);
    if (cpt) {
      const name = cpt[1];
      entities.push({
        text: `CPT ${name}`,
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf(cpt[0]),
        end: text.indexOf(cpt[0]) + cpt[0].length,
        properties: {
          rank: 'Captain',
          first_name: name === 'Smith' ? 'John' : 'Lisa',
          last_name: name,
          role: 'Staff Judge Advocate',
          unit: 'Office of the Staff Judge Advocate'
        },
        canonical_id: name === 'Smith' ? 'PERSON_002' : 'PERSON_003'
      });
    }
  }

  if (text.includes("Alvarez v. United States")) {
    const caseMatch = text.match(/Alvarez v\. United States/);
    if (caseMatch) {
      entities.push({
        text: 'Alvarez v. United States',
        type: 'CASE',
        color: entityColorMap['CASE'],
        start: text.indexOf(caseMatch[0]),
        end: text.indexOf(caseMatch[0]) + caseMatch[0].length,
        properties: {
          case_number: '2024-CV-2193',
          case_type: 'Premises Liability',
          status: 'Pre-Settlement Negotiation',
          jurisdiction: 'Federal District Court'
        },
        canonical_id: 'CASE_002'
      });
    }

    if (text.includes('Range 14')) {
      entities.push({
        text: 'Range 14',
        type: 'LOCATION',
        color: entityColorMap['LOCATION'],
        start: text.indexOf('Range 14'),
        end: text.indexOf('Range 14') + 8,
        properties: {
          location_type: 'Training Range',
          installation: 'Fort Liberty',
          safety_classification: 'Restricted',
          hazard_status: 'Known Erosion Risk'
        },
        canonical_id: 'LOC_001'
      });
    }

    const ltc = text.match(/LTC Harris/);
    if (ltc) {
      entities.push({
        text: 'LTC Harris',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf(ltc[0]),
        end: text.indexOf(ltc[0]) + ltc[0].length,
        properties: {
          rank: 'Lieutenant Colonel',
          first_name: 'Michael',
          last_name: 'Harris',
          role: 'Command Investigation Officer',
          unit: 'Installation Command'
        },
        canonical_id: 'PERSON_004'
      });
    }

    if (text.includes('USARCS')) {
      entities.push({
        text: 'USARCS',
        type: 'PARTY_ENTITY',
        color: entityColorMap['PARTY_ENTITY'],
        start: text.indexOf('USARCS'),
        end: text.indexOf('USARCS') + 6,
        properties: {
          full_name: 'U.S. Army Claims Service',
          entity_type: 'Government Agency',
          role: 'Settlement Authority',
          jurisdiction: 'Federal'
        },
        canonical_id: 'ENTITY_001'
      });
    }
  }

  return entities.filter(e => e.start !== -1);
};

// Helper function to create annotated text with highlights
const createAnnotatedText = (text, entities) => {
  if (!entities || entities.length === 0) return text;

  const sortedEntities = [...entities].sort((a, b) => a.start - b.start);
  const nonOverlappingEntities = [];
  let lastEnd = -1;
  
  sortedEntities.forEach(entity => {
    if (entity.start >= lastEnd) {
      nonOverlappingEntities.push(entity);
      lastEnd = entity.end;
    }
  });

  let result = [];
  let lastIndex = 0;

  nonOverlappingEntities.forEach((entity, idx) => {
    if (entity.start > lastIndex) {
      result.push(text.substring(lastIndex, entity.start));
    }

    const labelText = entity.is_coreference 
      ? `${entity.type} → ${entity.refers_to}` 
      : entity.type;

    result.push(
      <span
        key={`entity-${idx}`}
        className="annotated-entity"
        style={{ 
          backgroundColor: `${entity.color}15`,
          borderBottom: `2px solid ${entity.color}`,
          position: 'relative',
          padding: '2px 4px',
          margin: '0 1px',
          display: 'inline-block',
          lineHeight: '1.8',
          cursor: 'pointer'
        }}
        title={entity.properties ? JSON.stringify(entity.properties, null, 2) : ''}
      >
        {text.substring(entity.start, entity.end)}
        <span
          className="entity-label"
          style={{
            backgroundColor: entity.color,
            color: 'white',
            padding: '2px 6px',
            borderRadius: '3px',
            marginLeft: '4px',
            fontSize: '0.7rem',
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}
        >
          {labelText}
        </span>
      </span>
    );

    lastIndex = entity.end;
  });

  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return <>{result}</>;
};

const startTypingEffect = async () => {
  setSummaryLoading(true);
  setSummaryProgress(0);
  
  const loadingDuration = 1500;
  const progressInterval = setInterval(() => {
    setSummaryProgress(prev => {
      if (prev >= 100) {
        clearInterval(progressInterval);
        return 100;
      }
      return prev + 3;
    });
  }, loadingDuration / 35);
  
  await new Promise(resolve => setTimeout(resolve, loadingDuration));
  setSummaryLoading(false);
  
  const fullSummary = `Good afternoon CPT Smith,

Below is your weekly litigation update summarizing activity from the past week:

Case 1: Thompson v. United States (FTCA – GOV Accident)

Discovery review suggests defensible liability posture, including evidence of possible plaintiff contributory negligence.

GOV maintenance records and MP reports support SPC Reyes' compliance with duty standards.

Civilian witness statements undermine plaintiff's account of the collision.

Plaintiff informally signaling a high settlement demand, though damages appear inflated due to pre-existing conditions and employment gaps.

Next steps may include pushing back on settlement posture and considering a Rule 35 IME once medical records are complete.

Case 2: Alvarez v. United States (Premises Liability – Training Range Injury)

Command Investigation confirms prior notice of hazardous range conditions and delayed maintenance.

Liability risk assessed as moderate to high based on CI findings.

Damages likely limited due to recovery and return to work.

Early settlement discussions recommended in the low-to-mid five-figure range, pending DPW document review.

Coordination with DPW and USARCS advised to assess settlement authority.`;
  
  let index = 0;
  setTypedSummary('');
  
  const typingInterval = setInterval(() => {
    if (index < fullSummary.length) {
      setTypedSummary(fullSummary.substring(0, index + 1));
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, 10);
};

const formatSummary = (text) => {
  const parts = text.split(/(Case \d+:.*|Recent Updates:|Next steps.*:)/g);
  return parts.map((part, index) => {
    if (part.match(/(Case \d+:.*|Recent Updates:|Next steps.*:)/g)) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
};

const handleProcessEmail = async () => {
  setProcessing(true);
  
  setTimeout(() => {
    const textToProcess = useRealAPI ? emailContent : placeholderEmail;
    const mockEntities = extractPlaceholderEntities();

    // Generate relationships with properties
    const relationships = [
      { 
        from: 'Staff Sergeant Michael A. Reynolds', 
        relation: 'ASSIGNED_TO', 
        to: '82nd Airborne Division, 1st Brigade Combat Team',
        properties: { assignment_type: 'Permanent', date_assigned: '2023-06-15' }
      },
      { 
        from: 'Staff Sergeant Michael A. Reynolds', 
        relation: 'REPRESENTED_BY', 
        to: 'John Smith',
        properties: { representation_type: 'Defense Counsel', date_retained: '2024-03-25' }
      },
      { 
        from: 'Staff Sergeant Michael A. Reynolds', 
        relation: 'CHARGED_WITH', 
        to: 'Article 92, UCMJ',
        properties: { charge_date: '2024-03-22', plea: 'Not Guilty' }
      },
      { 
        from: 'Case No. 24-MJ-117', 
        relation: 'INVOLVES', 
        to: 'Staff Sergeant Michael A. Reynolds',
        properties: { role: 'Accused' }
      },
      { 
        from: 'Case No. 24-MJ-117', 
        relation: 'FILED_IN', 
        to: 'Fort Liberty Military Justice Court',
        properties: { filing_date: '2024-03-22' }
      },
      { 
        from: 'Case No. 24-MJ-117', 
        relation: 'OCCURRED_AT', 
        to: 'Smoke Bomb Hill Training Area',
        properties: { incident_date: '2024-03-14' }
      },
      { 
        from: 'CID Special Agent Laura M. Bennett', 
        relation: 'INVESTIGATES', 
        to: 'Case No. 24-MJ-117',
        properties: { investigation_start: '2024-03-15', status: 'Ongoing' }
      },
      { 
        from: 'Article 32 preliminary hearing', 
        relation: 'PART_OF', 
        to: 'Case No. 24-MJ-117',
        properties: { hearing_date: '2025-01-10', purpose: 'Probable Cause Determination' }
      }
    ];

    // Generate graph changes
    const graphChanges = {
      nodes_added: [
        { id: 'PERSON_REYNOLDS', label: 'SSG Michael A. Reynolds', type: 'PERSON' },
        { id: 'CASE_24MJ117', label: 'Case No. 24-MJ-117', type: 'CASE' },
        { id: 'PERSON_SMITH', label: 'John Smith', type: 'PERSON' },
        { id: 'PERSON_BENNETT', label: 'SA Laura M. Bennett', type: 'PERSON' },
        { id: 'LOC_FORT_LIBERTY', label: 'Fort Liberty, NC', type: 'LOCATION' },
        { id: 'LOC_SMOKE_BOMB', label: 'Smoke Bomb Hill', type: 'LOCATION' },
        { id: 'STATUTE_ART92', label: 'Article 92, UCMJ', type: 'STATUTE' },
        { id: 'HEARING_ART32', label: 'Article 32 Hearing', type: 'HEARING' }
      ],
      relationships: relationships,
      relationships_added: relationships.length,
      properties_updated: 23,
      existing_nodes_updated: 0
    };

    setGraphChanges(graphChanges);
    setGraphAnimation({ nodes: graphChanges.nodes_added, relationships: relationships });

    setResults({
      classification: {
        label: 'RELEVANT',
        confidence: 0.98
      },
      entities: mockEntities,
      originalText: textToProcess,
      relationships: relationships,
      summary: `New case development: Staff Sergeant Michael A. Reynolds has been charged with Article 92, UCMJ (Failure to Obey a Lawful Order) in Case No. 24-MJ-117. Defense counsel John Smith has been retained and has filed a formal notice of representation. An Article 32 preliminary hearing is scheduled for 10 January 2025 at Fort Liberty. The incident allegedly occurred on 14 March 2024 at Smoke Bomb Hill Training Area. CID Special Agent Laura M. Bennett is conducting the investigation. The defense has filed a preservation of evidence demand covering all documents, communications, and materials from 1 February 2024 through present. Key evidence includes charge sheet, witness statements, unit policies, command directives, duty rosters, operational emails, and training directives. The defense maintains SSG Reynolds' innocence and has reserved all rights and appellate remedies.`
    });
    
    setProcessing(false);
  }, 2000);
};

const handleProcessEmailWithAPI = async () => {
  setProcessing(true);
  setPipelineStep('classification');
  setResults(null);

  try {
    const emailId = `email_${Date.now()}`;
    const fullText = `Subject: ${subjectContent}\n\n${emailContent}`;

    // ---------- CLASSIFICATION ----------
    const classifyRes = await fetch(
      "https://ner-hh1e.onrender.com/classify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectContent,
          body: emailContent,
          email_id: emailId
        })
      }
    );

    if (!classifyRes.ok) {
      throw new Error("Classification API failed");
    }

    const classifyData = await classifyRes.json();

    setResults({
      classification: {
        label: classifyData.is_relevant ? "RELEVANT" : "IRRELEVANT",
        confidence: classifyData.confidence
      }
    });

    // ---------- NER ----------
    setPipelineStep('ner');

    const nerRes = await fetch(
      "https://ner-hh1e.onrender.com/ner",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText })
      }
    );

    if (!nerRes.ok) {
      throw new Error("NER API failed");
    }

    const nerData = await nerRes.json();

    const entityColorMap = {
      PERSON: '#3b82f6',
      ORG: '#06b6d4',
      GPE: '#10b981',
      LOC: '#10b981',
      FAC: '#10b981',
      DATE: '#8b5cf6',
      LAW: '#f59e0b'
    };

    const mappedEntities = nerData.entities.map(e => ({
      text: e.text,
      type: e.label,
      start: e.start,
      end: e.end,
      color: entityColorMap[e.label] || '#64748b'
    }));

    setResults(prev => ({
      ...prev,
      entities: mappedEntities,
      originalText: fullText,
      relationships: []
    }));

    // ---------- GRAPH + SUMMARY (UI only for now) ----------
    setPipelineStep('graph');
    await new Promise(r => setTimeout(r, 600));

    setPipelineStep('summary');
    await new Promise(r => setTimeout(r, 600));

    setPipelineStep('complete');

  } catch (err) {
    console.error(err);
    setPipelineStep('error');
    setResults({
      classification: { label: "ERROR", confidence: 0 },
      summary: err.message
    });
  } finally {
    setProcessing(false);
  }
};


const handleBatchProcess = async () => {
  setProcessing(true);
  setBatchResults([]);
  setCurrentBatchIndex(0);
  setBatchGraphChanges(null);

  const allGraphNodes = new Map();
  const allGraphRelationships = [];

  for (let i = 0; i < testEmails.length; i++) {
    setCurrentBatchIndex(i);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isRelevant = i !== 3;
    const fullText = `Subject: ${testEmails[i].subject}\n\n${testEmails[i].content}`;
    const entities = isRelevant ? extractEntitiesWithProperties(fullText, i === 0) : [];
    
    const relationships = [];
    if (isRelevant) {
      const persons = entities.filter(e => e.type === 'PERSON');
      const cases = entities.filter(e => e.type === 'CASE');
      const locations = entities.filter(e => e.type === 'LOCATION');
      const parties = entities.filter(e => e.type === 'PARTY_ENTITY');

      persons.forEach(person => {
        if (cases.length > 0) {
          relationships.push({
            from: person.text,
            relation: 'INVOLVED_IN',
            to: cases[0].text,
            properties: { role: person.properties?.role || 'Participant' }
          });
        }
      });

      if (cases.length > 0 && locations.length > 0) {
        relationships.push({
          from: cases[0].text,
          relation: 'LOCATION',
          to: locations[0].text,
          properties: { relevance: 'Incident Location' }
        });
      }

      parties.forEach(party => {
        if (cases.length > 0) {
          relationships.push({
            from: cases[0].text,
            relation: 'INVOLVES_PARTY',
            to: party.text,
            properties: { party_role: party.properties?.role || 'Party' }
          });
        }
      });
    }

    // Track graph changes
    entities.forEach(entity => {
      if (!allGraphNodes.has(entity.canonical_id)) {
        allGraphNodes.set(entity.canonical_id, {
          id: entity.canonical_id,
          label: entity.text,
          type: entity.type,
          properties: entity.properties
        });
      }
    });
    allGraphRelationships.push(...relationships);

    const mockResult = {
      emailIndex: i,
      subject: testEmails[i].subject,
      body: testEmails[i].content,
      fullText: fullText,
      classification: {
        label: isRelevant ? 'RELEVANT' : 'IRRELEVANT',
        confidence: 0.85 + Math.random() * 0.15
      },
      entities: entities,
      relationships: relationships,
      summary: isRelevant ? 
        `Processed email regarding ${testEmails[i].subject}. Extracted ${entities.length} entities and ${relationships.length} relationships.` :
        "This email contains routine administrative information with no legal matters requiring attention."
    };
    
    setBatchResults(prev => [...prev, mockResult]);
  }

  // Set comprehensive batch graph changes
  setBatchGraphChanges({
    nodes_added: Array.from(allGraphNodes.values()),
    relationships_added: allGraphRelationships.length,
    properties_set: Array.from(allGraphNodes.values()).reduce((sum, node) => 
      sum + Object.keys(node.properties || {}).length, 0
    ),
    coreferences_resolved: 4,
    summary: {
      total_nodes: allGraphNodes.size,
      total_relationships: allGraphRelationships.length,
      cases_tracked: 2,
      persons_identified: 6,
      locations_mapped: 2
    }
  });

  setProcessing(false);
  setCurrentBatchIndex(-1);
  setShowBatchSummary(true);
  startTypingEffect();
};

  const toggleEntityExpansion = (idx) => {
    setExpandedEntities(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
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
              <h1 className="brand-title">Attorney Email Intelligence</h1>
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

          {/* Entity Types Display */}
          <div className="entity-types-display">
            <h4 className="entity-types-title">
              <Network size={16} style={{ marginRight: '8px' }} />
              Extracting Entity Types:
            </h4>
            <div className="entity-types-grid">
              {ENTITY_TYPES.map((type, idx) => (
                <span 
                  key={idx} 
                  className="entity-type-badge"
                  style={{ borderColor: entityColorMap[type] }}
                >
                  <span 
                    className="entity-type-dot" 
                    style={{ backgroundColor: entityColorMap[type] }}
                  ></span>
                  {type}
                </span>
              ))}
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
                  setGraphChanges(null);
                  setGraphAnimation(null);
                }}
                disabled={processing}
              >
                <Mail size={20} />
                <span>Single Email</span>
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
                  setUseRealAPI(false);
                  setGraphChanges(null);
                  setBatchGraphChanges(null);
                  setGraphAnimation(null);
                }}
                disabled={processing}
              >
                <Layers size={20} />
                <span>Batch Processing</span>
              </button>
            </div>
          </div>

          <div className="mvp-content">
            {processingMode === 'single' ? (
              <div className="email-input-section">
                <div className='email-input-header'>
                  <label className="input-label">Compose Email</label>
                  <div className="api-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={useRealAPI}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setUseRealAPI(isChecked);
                          setEmailContent(isChecked ? '' : '');
                          setSubjectContent(isChecked ? '' : '');
                        }}
                        className="toggle-checkbox"
                      />
                      <span className="toggle-switch"></span>
                      <span className="toggle-text">
                        {useRealAPI ? 'Live API' : 'Demo Mode'}
                      </span>
                    </label>
                  </div>
                </div>
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
                      <input 
                        type="text" 
                        className="draft-input" 
                        onChange={(e) => setSubjectContent(e.target.value)} 
                        placeholder="Email subject..." 
                        value={useRealAPI ? subjectContent : placeholderSubject} 
                      />
                    </div>
                  </div>
                  <textarea
                    className="email-textarea-draft"
                    placeholder="Type your message here...&#10;&#10;Example: CPT John Smith stationed at Fort Bragg is scheduled for an Article 15 hearing on March 15, 2024..."
                    value={useRealAPI ? emailContent : placeholderEmail}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows={10}
                  />
                </div>
                <button
                  className={`process-button ${processing ? 'processing' : ''}`}
                  onClick={useRealAPI ? handleProcessEmailWithAPI : handleProcessEmail}
                  disabled={processing}
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

                {/* Test Emails Preview - NO annotations */}
                <div className="batch-emails-preview">
                  <h4 className="preview-title">Test Emails Queue</h4>
                  <div className="batch-emails-list">
                    {testEmails.map((email, idx) => {
                      return (
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
                            <div className="batch-email-preview">
                              {email.content.substring(0, 150)}...
                            </div>
                          </div>
                          <div className="batch-email-status">
                            {processing && idx === currentBatchIndex && <div className="spinner-small"></div>}
                            {processing && idx < currentBatchIndex && <CheckCircle size={20} className="check-icon" />}
                            {!processing && <Clock size={20} className="pending-icon" />}
                          </div>
                        </div>
                      );
                    })}
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
                          {/* Email Preview FIRST */}
                          {result.body && result.body.length > 0 && (
                            <div className="batch-email-body-section">
                              <strong>Email Preview:</strong>
                              <div className="email-body-annotated">
                                {createAnnotatedText(result.body, result.entities)}
                              </div>
                            </div>
                          )}

                          {result.entities && result.entities.length > 0 && (
                            <>
                              <div className="batch-entities">
                                <strong>Entities ({result.entities.length}):</strong>
                                <div className="batch-entities-list">
                                  {result.entities.map((entity, eidx) => (
                                    <span
                                      key={eidx}
                                      className="batch-entity-tag"
                                      style={{ borderLeftColor: entity.color }}
                                      title={JSON.stringify(entity.properties, null, 2)}
                                    >
                                      {entity.text}
                                      <span className="entity-type-mini">{entity.type}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {result.relationships && result.relationships.length > 0 && (
                                <div className="batch-relationships">
                                  <strong>Relationships ({result.relationships.length}):</strong>
                                  <div className="relationships-mini-list">
                                    {result.relationships.slice(0, 3).map((rel, ridx) => (
                                      <div key={ridx} className="relationship-mini-item">
                                        <span className="rel-node-mini">{rel.from}</span>
                                        <span className="rel-arrow-mini">→</span>
                                        <span className="rel-type-mini">{rel.relation}</span>
                                        <span className="rel-arrow-mini">→</span>
                                        <span className="rel-node-mini">{rel.to}</span>
                                      </div>
                                    ))}
                                    {result.relationships.length > 3 && (
                                      <div className="relationships-more">
                                        +{result.relationships.length - 3} more relationships
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Batch Graph Changes */}
                {batchGraphChanges && !showBatchSummary && (
                  <div className="graph-changes-section">
                    <div className="graph-changes-header">
                      <Network size={24} />
                      <h3>Knowledge Graph Updates</h3>
                    </div>
                    <div className="graph-changes-content">
                      <div className="graph-stats-grid">
                        <div className="graph-stat-card">
                          <div className="stat-icon">
                            <Plus size={20} />
                          </div>
                          <div className="stat-content">
                            <div className="stat-value">{batchGraphChanges.nodes_added.length}</div>
                            <div className="stat-label">Nodes Added</div>
                          </div>
                        </div>
                        <div className="graph-stat-card">
                          <div className="stat-icon">
                            <GitBranch size={20} />
                          </div>
                          <div className="stat-content">
                            <div className="stat-value">{batchGraphChanges.relationships_added}</div>
                            <div className="stat-label">Relationships Added</div>
                          </div>
                        </div>
                        <div className="graph-stat-card">
                          <div className="stat-icon">
                            <Edit3 size={20} />
                          </div>
                          <div className="stat-content">
                            <div className="stat-value">{batchGraphChanges.properties_set}</div>
                            <div className="stat-label">Properties Set</div>
                          </div>
                        </div>
                        <div className="graph-stat-card">
                          <div className="stat-icon">
                            <Users size={20} />
                          </div>
                          <div className="stat-content">
                            <div className="stat-value">{batchGraphChanges.coreferences_resolved}</div>
                            <div className="stat-label">Coreferences Resolved</div>
                          </div>
                        </div>
                      </div>

                      <div className="graph-nodes-list">
                        <h4>New Nodes Added:</h4>
                        <div className="nodes-grid">
                          {batchGraphChanges.nodes_added.map((node, idx) => (
                            <div key={idx} className="node-card" style={{ borderLeftColor: entityColorMap[node.type] }}>
                              <div className="node-type">{node.type}</div>
                              <div className="node-label">{node.label}</div>
                              {node.properties && Object.keys(node.properties).length > 0 && (
                                <div className="node-properties">
                                  {Object.keys(node.properties).length} properties
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="graph-summary-stats">
                        <h4>Summary:</h4>
                        <ul>
                          <li>Total nodes in graph: <strong>{batchGraphChanges.summary.total_nodes}</strong></li>
                          <li>Total relationships: <strong>{batchGraphChanges.summary.total_relationships}</strong></li>
                          <li>Cases being tracked: <strong>{batchGraphChanges.summary.cases_tracked}</strong></li>
                          <li>Persons identified: <strong>{batchGraphChanges.summary.persons_identified}</strong></li>
                          <li>Locations mapped: <strong>{batchGraphChanges.summary.locations_mapped}</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Batch Summary Email */}
                {showBatchSummary && (
                  <div className="batch-summary-outlook-container">
                    <div className="outlook-summary-card">
                      <div className="outlook-summary-header">
                        <div className="outlook-from-line">
                          <span className="outlook-label">From:</span>
                          <span className="outlook-value">Attorney Intelligence System &lt;system@jag.mil&gt;</span>
                        </div>
                        <div className="outlook-to-line">
                          <span className="outlook-label">To:</span>
                          <span className="outlook-value">Legal Team &lt;legal-team@jag.mil&gt;</span>
                        </div>
                        <div className="outlook-subject-line">
                          <span className="outlook-label">Subject:</span>
                          <span className="outlook-value">Weekly Litigation Summary - {testEmails.length} Emails Processed</span>
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
                          <div className='summary-content'>
                            {formatSummary(typedSummary)}
                            {typedSummary.length < 500 && <span className="typing-cursor">|</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

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

              {/* Entity Annotations */}
              {results.entities && results.entities.length > 0 && results.originalText && (
                <div className="results-card annotation-card">
                  <h3 className="results-title">Entity Annotations</h3>
                  <div className="annotated-email-container">
                    <div className="annotated-email-content">
                      {createAnnotatedText(results.originalText, results.entities)}
                    </div>
                  </div>
                </div>
              )}

              {/* Extracted Entities with Collapsible Properties */}
              {results.entities && results.entities.length > 0 && (
                <div className="results-card entities-card">
                  <h3 className="results-title">Extracted Entities with Properties</h3>
                  <div className="entities-list-enhanced">
                    {results.entities.map((entity, idx) => (
                      <div key={idx} className="entity-card-enhanced" style={{ borderLeftColor: entity.color }}>
                        <div className="entity-header-enhanced">
                          <div className="entity-main-info">
                            <span className="entity-text-enhanced">{entity.text}</span>
                            <span className="entity-type-badge" style={{ backgroundColor: entity.color }}>
                              {entity.type}
                            </span>
                          </div>
                          {entity.properties && Object.keys(entity.properties).length > 0 && (
                            <button 
                              className="entity-expand-btn"
                              onClick={() => toggleEntityExpansion(idx)}
                            >
                              {expandedEntities[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          )}
                        </div>
                        {entity.is_coreference && (
                          <div className="entity-coreference">
                            <Users size={14} />
                            Refers to: <strong>{entity.refers_to}</strong>
                          </div>
                        )}
                        {expandedEntities[idx] && entity.properties && Object.keys(entity.properties).length > 0 && (
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
                    ))}
                  </div>
                </div>
              )}

              {/* Detected Relationships with Properties */}
              {results.relationships && results.relationships.length > 0 && (
                <div className="results-card relationships-card">
                  <h3 className="results-title">Detected Relationships</h3>
                  <div className="relationships-list-enhanced">
                    {results.relationships.map((rel, idx) => (
                      <div key={idx} className="relationship-card-enhanced">
                        <div className="relationship-main">
                          <span className="rel-node">{rel.from}</span>
                          <span className="rel-arrow">→</span>
                          <span className="rel-type">{rel.relation}</span>
                          <span className="rel-arrow">→</span>
                          <span className="rel-node">{rel.to}</span>
                        </div>
                        {rel.properties && Object.keys(rel.properties).length > 0 && (
                          <div className="relationship-properties">
                            {Object.entries(rel.properties).map(([key, value], pidx) => (
                              <span key={pidx} className="rel-prop">
                                {key}: <strong>{value}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Graph Database Updates with Animation */}
              {graphChanges && (
                <GraphVisualization graphData={graphChanges} />
              )}

              {/* Email Summary */}
              {results.summary && (
                <div className="results-card summary-card-mvp">
                  <h3 className="results-title">Case Update Summary</h3>
                  <div className="outlook-email-result">
                    <div className="email-header-line">
                      <span className="header-label">From:</span>
                      <span className="header-value">Attorney Intelligence System</span>
                    </div>
                    <div className="email-header-line">
                      <span className="header-label">To:</span>
                      <span className="header-value">Legal Team</span>
                    </div>
                    <div className="email-header-line">
                      <span className="header-label">Subject:</span>
                      <span className="header-value">Case Update - SSG Michael A. Reynolds (Case 24-MJ-117)</span>
                    </div>
                    <div className="email-divider"></div>
                    <div className="email-body-result">
                      <p>{results.summary}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Graph Visualization Component
function GraphVisualization({ graphData }) {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const entityColorMap = {
    'PERSON': '#2563eb',
    'LOCATION': '#059669',
    'DATE': '#7c3aed',
    'CASE': '#dc2626',
    'COURT': '#be185d',
    'JUDGE': '#0891b2',
    'MOTION': '#d97706',
    'HEARING': '#db2777',
    'PARTY_ENTITY': '#0d9488',
    'STATUTE': '#ea580c',
    'LEGAL_ISSUE': '#9333ea',
    'PRECEDENT': '#65a30d',
    'CONTRACT': '#4f46e5',
    'CLAUSE': '#57534e',
    'EVIDENCE': '#0284c7'
  };

  return (
    <div className="results-card graph-updates-card">
      <h3 className="results-title">
        <Network size={20} style={{ marginRight: '8px' }} />
        Knowledge Graph Updates
      </h3>
      <div className="graph-updates-content">
        <div className="graph-update-stats">
          <div className="update-stat">
            <TrendingUp size={18} />
            <span className="stat-number">{graphData.nodes_added.length}</span>
            <span className="stat-text">Nodes Added</span>
          </div>
          <div className="update-stat">
            <GitBranch size={18} />
            <span className="stat-number">{graphData.relationships_added}</span>
            <span className="stat-text">Relationships</span>
          </div>
          <div className="update-stat">
            <Edit3 size={18} />
            <span className="stat-number">{graphData.properties_updated}</span>
            <span className="stat-text">Properties</span>
          </div>
          <div className="update-stat">
            <Database size={18} />
            <span className="stat-number">{graphData.existing_nodes_updated}</span>
            <span className="stat-text">Nodes Updated</span>
          </div>
        </div>
        
        {/* Graph Visualization */}
        <div className="graph-visualization-container">
          <svg className="graph-svg" viewBox="0 0 800 500">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Relationships (edges) */}
            {graphData.relationships.map((rel, idx) => {
              const fromNode = graphData.nodes_added.find(n => n.label.includes(rel.from.split(' ')[0]) || rel.from.includes(n.label.split(' ')[0]));
              const toNode = graphData.nodes_added.find(n => n.label.includes(rel.to.split(' ')[0]) || rel.to.includes(n.label.split(' ')[0]));
              
              if (!fromNode || !toNode) return null;
              
              const fromIdx = graphData.nodes_added.indexOf(fromNode);
              const toIdx = graphData.nodes_added.indexOf(toNode);
              
              const fromX = 150 + (fromIdx % 4) * 160;
              const fromY = 100 + Math.floor(fromIdx / 4) * 120;
              const toX = 150 + (toIdx % 4) * 160;
              const toY = 100 + Math.floor(toIdx / 4) * 120;
              
              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    opacity={animationComplete ? "0.5" : "0"}
                    className="graph-edge"
                    style={{
                      animation: `fadeIn 0.5s ease-in-out ${idx * 0.15}s forwards`
                    }}
                  />
                  <text
                    x={(fromX + toX) / 2}
                    y={(fromY + toY) / 2 - 5}
                    fontSize="10"
                    fill="#64748b"
                    textAnchor="middle"
                    opacity={animationComplete ? "0.7" : "0"}
                    style={{
                      animation: `fadeIn 0.5s ease-in-out ${idx * 0.15 + 0.3}s forwards`
                    }}
                  >
                    {rel.relation}
                  </text>
                </g>
              );
            })}
            
            {/* Nodes */}
            {graphData.nodes_added.map((node, idx) => {
              const x = 150 + (idx % 4) * 160;
              const y = 100 + Math.floor(idx / 4) * 120;
              const color = entityColorMap[node.type];
              
              return (
                <g key={node.id} className="graph-node">
                  <circle
                    cx={x}
                    cy={y}
                    r="0"
                    fill={color}
                    filter="url(#glow)"
                    className="node-circle-new"
                    style={{
                      animation: `nodeAppear 0.6s ease-out ${idx * 0.1}s forwards`
                    }}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="35"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity="0"
                    className="node-ring"
                    style={{
                      animation: `ringPulse 1.5s ease-out ${idx * 0.1}s forwards`
                    }}
                  />
                  <text
                    x={x}
                    y={y + 5}
                    fontSize="11"
                    fontWeight="600"
                    fill="white"
                    textAnchor="middle"
                    opacity="0"
                    style={{
                      animation: `fadeIn 0.4s ease-in ${idx * 0.1 + 0.3}s forwards`
                    }}
                  >
                    {node.label.length > 15 ? node.label.substring(0, 13) + '...' : node.label}
                  </text>
                  <text
                    x={x}
                    y={y + 50}
                    fontSize="9"
                    fill="#64748b"
                    textAnchor="middle"
                    opacity="0"
                    style={{
                      animation: `fadeIn 0.4s ease-in ${idx * 0.1 + 0.4}s forwards`
                    }}
                  >
                    {node.type}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="graph-legend">
          <h4>Graph Legend:</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-circle-new"></div>
              <span>New nodes added from this email</span>
            </div>
            <div className="legend-item">
              <div className="legend-line"></div>
              <span>Relationships between entities</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes nodeAppear {
          0% {
            r: 0;
            opacity: 0;
          }
          50% {
            r: 35;
            opacity: 0.8;
          }
          100% {
            r: 30;
            opacity: 1;
          }
        }

        @keyframes ringPulse {
          0% {
            r: 30;
            opacity: 0.8;
            stroke-width: 2;
          }
          100% {
            r: 50;
            opacity: 0;
            stroke-width: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .graph-visualization-container {
          margin: 2rem 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #334155;
        }

        .graph-svg {
          width: 100%;
          height: auto;
          min-height: 500px;
        }

        .graph-legend {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #334155;
        }

        .graph-legend h4 {
          color: #e2e8f0;
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
        }

        .legend-items {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .legend-circle-new {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563eb;
          box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
        }

        .legend-line {
          width: 30px;
          height: 2px;
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}