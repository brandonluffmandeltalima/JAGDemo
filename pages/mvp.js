import React, { useState, useEffect, useRef } from 'react';
import { Mail, Database, Zap, BarChart3, Send, AlertCircle, GitBranch, Users, FileText, Binary, Layers, Clock, CheckCircle, Network, TrendingUp, Plus, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import * as d3 from "d3-force";

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
  const [singleEmailTypedSummary, setSingleEmailTypedSummary] = useState('');
  const [singleEmailSummaryTyping, setSingleEmailSummaryTyping] = useState(false);

  // Refs for scrolling
  const classificationRef = useRef(null);
  const nerRef = useRef(null);
  const graphRef = useRef(null);
  const summaryRef = useRef(null);
  const progressBarRef = useRef(null);

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

// Enhanced entity extraction for placeholder email
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

  // MOTION entity
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

// Enhanced entity extraction with properties and coreference - IMPROVED FOR BATCH EMAILS
const extractEntitiesWithProperties = (text, emailIndex) => {
  const entities = [];
  
  // Email 0: Thompson v. United States - Initial Discovery
  if (emailIndex === 0) {
    entities.push(
      {
        text: 'Thompson v. United States',
        type: 'CASE',
        color: entityColorMap['CASE'],
        start: text.indexOf('Thompson v. United States'),
        end: text.indexOf('Thompson v. United States') + 25,
        properties: {
          case_number: '2024-CV-1847',
          case_type: 'Federal Tort Claims Act',
          status: 'Discovery Phase',
          jurisdiction: 'Federal District Court'
        },
        canonical_id: 'CASE_THOMPSON'
      },
      {
        text: 'plaintiff',
        type: 'PARTY_ENTITY',
        color: entityColorMap['PARTY_ENTITY'],
        start: text.toLowerCase().indexOf('plaintiff'),
        end: text.toLowerCase().indexOf('plaintiff') + 9,
        properties: {
          role: 'Plaintiff',
          name_resolved: 'Robert Thompson',
          party_type: 'Individual',
          claims: 'Negligence, Vehicle Collision'
        },
        canonical_id: 'PARTY_PLAINTIFF_THOMPSON',
        is_coreference: true,
        refers_to: 'Robert Thompson'
      },
      {
        text: 'government driver',
        type: 'PARTY_ENTITY',
        color: entityColorMap['PARTY_ENTITY'],
        start: text.indexOf('government driver'),
        end: text.indexOf('government driver') + 17,
        properties: {
          role: 'Defendant',
          employer: 'United States Government',
          party_type: 'Government Employee'
        },
        canonical_id: 'PARTY_GOV_DRIVER'
      },
      {
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
        canonical_id: 'ISSUE_NEGLIGENCE'
      },
      {
        text: 'Vehicle inspection logs',
        type: 'EVIDENCE',
        color: entityColorMap['EVIDENCE'],
        start: text.indexOf('Vehicle inspection logs'),
        end: text.indexOf('Vehicle inspection logs') + 23,
        properties: {
          evidence_type: 'Documentary',
          relevance: 'Maintenance History',
          custodian: 'Motor Pool',
          authentication_required: true,
          finding: 'No mechanical deficiencies'
        },
        canonical_id: 'EVID_VEHICLE_LOGS'
      },
      {
        text: 'Accident reconstruction',
        type: 'EVIDENCE',
        color: entityColorMap['EVIDENCE'],
        start: text.indexOf('Accident reconstruction'),
        end: text.indexOf('Accident reconstruction') + 23,
        properties: {
          evidence_type: 'Expert Analysis',
          relevance: 'Causation and Liability',
          finding: 'Possible contributory negligence'
        },
        canonical_id: 'EVID_RECONSTRUCTION'
      },
      {
        text: 'MAJ Allen',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf('MAJ Allen'),
        end: text.indexOf('MAJ Allen') + 9,
        properties: {
          rank: 'Major',
          first_name: 'James',
          last_name: 'Allen',
          role: 'Defense Counsel',
          unit: 'Trial Defense Service'
        },
        canonical_id: 'PERSON_MAJ_ALLEN'
      },
      {
        text: 'CPT Smith',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf('CPT Smith'),
        end: text.indexOf('CPT Smith') + 9,
        properties: {
          rank: 'Captain',
          first_name: 'John',
          last_name: 'Smith',
          role: 'Staff Judge Advocate',
          unit: 'Office of the Staff Judge Advocate'
        },
        canonical_id: 'PERSON_CPT_SMITH'
      }
    );
  }
  
  // Email 1: Thompson v. United States - Witness Statements
  else if (emailIndex === 1) {
    entities.push(
      {
        text: 'Thompson v. United States',
        type: 'CASE',
        color: entityColorMap['CASE'],
        start: text.indexOf('Thompson v. United States'),
        end: text.indexOf('Thompson v. United States') + 25,
        properties: {
          case_number: '2024-CV-1847',
          case_type: 'Federal Tort Claims Act',
          status: 'Discovery Phase'
        },
        canonical_id: 'CASE_THOMPSON'
      },
      {
        text: 'witness statements',
        type: 'EVIDENCE',
        color: entityColorMap['EVIDENCE'],
        start: text.indexOf('witness statements'),
        end: text.indexOf('witness statements') + 18,
        properties: {
          evidence_type: 'Testimonial',
          relevance: 'Eyewitness Account',
          count: '2 civilian witnesses'
        },
        canonical_id: 'EVID_WITNESS_STATEMENTS'
      },
      {
        text: 'civilian witnesses',
        type: 'PARTY_ENTITY',
        color: entityColorMap['PARTY_ENTITY'],
        start: text.indexOf('civilian witnesses'),
        end: text.indexOf('civilian witnesses') + 18,
        properties: {
          party_type: 'Witness',
          count: 2,
          observation: 'Excessive speed by plaintiff'
        },
        canonical_id: 'PARTY_WITNESSES'
      },
      {
        text: 'plaintiff',
        type: 'PARTY_ENTITY',
        color: entityColorMap['PARTY_ENTITY'],
        start: text.toLowerCase().indexOf('plaintiff'),
        end: text.toLowerCase().indexOf('plaintiff') + 9,
        properties: {
          name_resolved: 'Robert Thompson',
          allegation: 'GOV ran stop sign',
          witness_corroboration: 'None'
        },
        canonical_id: 'PARTY_PLAINTIFF_THOMPSON',
        is_coreference: true,
        refers_to: 'Robert Thompson'
      },
      {
        text: 'pre-existing conditions',
        type: 'EVIDENCE',
        color: entityColorMap['EVIDENCE'],
        start: text.indexOf('pre-existing conditions'),
        end: text.indexOf('pre-existing conditions') + 23,
        properties: {
          evidence_type: 'Medical Records',
          relevance: 'Damages Assessment',
          impact: 'Overstated damages claim'
        },
        canonical_id: 'EVID_MEDICAL'
      },
      {
        text: 'CPT Nguyen',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf('CPT Nguyen'),
        end: text.indexOf('CPT Nguyen') + 10,
        properties: {
          rank: 'Captain',
          first_name: 'Lisa',
          last_name: 'Nguyen',
          role: 'Assistant Defense Counsel'
        },
        canonical_id: 'PERSON_CPT_NGUYEN'
      }
    );
  }
  
  // Email 2: Alvarez v. United States - Command Investigation
  else if (emailIndex === 2) {
    entities.push(
      {
        text: 'Alvarez v. United States',
        type: 'CASE',
        color: entityColorMap['CASE'],
        start: text.indexOf('Alvarez v. United States'),
        end: text.indexOf('Alvarez v. United States') + 24,
        properties: {
          case_number: '2024-CV-2193',
          case_type: 'Premises Liability',
          status: 'Pre-Settlement Negotiation',
          jurisdiction: 'Federal District Court'
        },
        canonical_id: 'CASE_ALVAREZ'
      },
      {
        text: 'Command Investigation',
        type: 'EVIDENCE',
        color: entityColorMap['EVIDENCE'],
        start: text.indexOf('Command Investigation'),
        end: text.indexOf('Command Investigation') + 21,
        properties: {
          evidence_type: 'Official Investigation Report',
          relevance: 'Liability Determination',
          conducted_by: 'LTC Harris'
        },
        canonical_id: 'EVID_CMD_INVESTIGATION'
      },
      {
        text: 'Range 14',
        type: 'LOCATION',
        color: entityColorMap['LOCATION'],
        start: text.indexOf('Range 14'),
        end: text.indexOf('Range 14') + 8,
        properties: {
          location_type: 'Training Range',
          installation: 'Fort Liberty',
          safety_classification: 'Restricted',
          hazard_status: 'Known Erosion Risk',
          notice_given: 'Prior notice documented'
        },
        canonical_id: 'LOC_RANGE14'
      },
      {
        text: 'erosion hazards',
        type: 'LEGAL_ISSUE',
        color: entityColorMap['LEGAL_ISSUE'],
        start: text.indexOf('erosion hazards'),
        end: text.indexOf('erosion hazards') + 15,
        properties: {
          issue_type: 'Premises Liability',
          notice: 'Prior notice given',
          maintenance_status: 'Delayed due to funding'
        },
        canonical_id: 'ISSUE_EROSION'
      },
      {
        text: 'Contractor',
        type: 'PARTY_ENTITY',
        color: entityColorMap['PARTY_ENTITY'],
        start: text.indexOf('Contractor'),
        end: text.indexOf('Contractor') + 10,
        properties: {
          party_type: 'Third Party',
          authorization: 'Authorized',
          scope_compliance: 'Within scope of duties'
        },
        canonical_id: 'PARTY_CONTRACTOR'
      },
      {
        text: 'LTC Harris',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf('LTC Harris'),
        end: text.indexOf('LTC Harris') + 10,
        properties: {
          rank: 'Lieutenant Colonel',
          first_name: 'Michael',
          last_name: 'Harris',
          role: 'Command Investigation Officer',
          unit: 'Installation Command'
        },
        canonical_id: 'PERSON_LTC_HARRIS'
      },
      {
        text: 'CPT Smith',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf('CPT Smith'),
        end: text.indexOf('CPT Smith') + 9,
        properties: {
          rank: 'Captain',
          first_name: 'John',
          last_name: 'Smith',
          role: 'Staff Judge Advocate'
        },
        canonical_id: 'PERSON_CPT_SMITH'
      }
    );
  }
  
  // Email 3: Potluck - IRRELEVANT
  else if (emailIndex === 3) {
    entities.push(
      {
        text: 'CPT John Smith',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf('CPT John Smith'),
        end: text.indexOf('CPT John Smith') + 14,
        properties: {
          rank: 'Captain',
          first_name: 'John',
          last_name: 'Smith'
        },
        canonical_id: 'PERSON_CPT_SMITH'
      },
      {
        text: 'Friday at 1200',
        type: 'DATE',
        color: entityColorMap['DATE'],
        start: text.indexOf('Friday at 1200'),
        end: text.indexOf('Friday at 1200') + 14,
        properties: {
          date_type: 'event_date',
          event: 'Team Potluck'
        },
        canonical_id: 'DATE_POTLUCK'
      },
      {
        text: 'Break room',
        type: 'LOCATION',
        color: entityColorMap['LOCATION'],
        start: text.indexOf('Break room'),
        end: text.indexOf('Break room') + 10,
        properties: {
          location_type: 'Common Area',
          purpose: 'Social Event'
        },
        canonical_id: 'LOC_BREAKROOM'
      },
      {
        text: 'SFC Ramirez',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf('SFC Ramirez'),
        end: text.indexOf('SFC Ramirez') + 11,
        properties: {
          rank: 'Sergeant First Class',
          last_name: 'Ramirez',
          role: 'Unit Administrator'
        },
        canonical_id: 'PERSON_SFC_RAMIREZ'
      }
    );
  }
  
  // Email 4: Alvarez v. United States - Settlement
  else if (emailIndex === 4) {
    entities.push(
      {
        text: 'Alvarez v. United States',
        type: 'CASE',
        color: entityColorMap['CASE'],
        start: text.indexOf('Alvarez v. United States'),
        end: text.indexOf('Alvarez v. United States') + 24,
        properties: {
          case_number: '2024-CV-2193',
          case_type: 'Premises Liability',
          status: 'Settlement Consideration'
        },
        canonical_id: 'CASE_ALVAREZ'
      },
      {
        text: 'exposure analysis',
        type: 'EVIDENCE',
        color: entityColorMap['EVIDENCE'],
        start: text.indexOf('exposure analysis'),
        end: text.indexOf('exposure analysis') + 17,
        properties: {
          evidence_type: 'Risk Assessment',
          finding: 'Moderate to high liability risk'
        },
        canonical_id: 'EVID_EXPOSURE_ANALYSIS'
      },
      {
        text: 'Liability risk',
        type: 'LEGAL_ISSUE',
        color: entityColorMap['LEGAL_ISSUE'],
        start: text.indexOf('Liability risk'),
        end: text.indexOf('Liability risk') + 14,
        properties: {
          assessment: 'Moderate to high',
          damages_status: 'Limited'
        },
        canonical_id: 'ISSUE_LIABILITY'
      },
      {
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
        canonical_id: 'PARTY_USARCS'
      },
      {
        text: 'MAJ Allen',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf('MAJ Allen'),
        end: text.indexOf('MAJ Allen') + 9,
        properties: {
          rank: 'Major',
          first_name: 'James',
          last_name: 'Allen',
          role: 'Defense Counsel'
        },
        canonical_id: 'PERSON_MAJ_ALLEN'
      },
      {
        text: 'CPT Smith',
        type: 'PERSON',
        color: entityColorMap['PERSON'],
        start: text.indexOf('CPT Smith'),
        end: text.indexOf('CPT Smith') + 9,
        properties: {
          rank: 'Captain',
          first_name: 'John',
          last_name: 'Smith',
          role: 'Staff Judge Advocate'
        },
        canonical_id: 'PERSON_CPT_SMITH'
      }
    );
  }

  return entities.filter(e => e.start !== -1);
};

// Generate contextual relationships based on entities
const generateRelationships = (entities, emailIndex) => {
  const relationships = [];
  
  if (emailIndex === 0) {
    relationships.push(
      { from: 'Robert Thompson', relation: 'PLAINTIFF_IN', to: 'Thompson v. United States', properties: { role: 'Plaintiff', claim_type: 'Negligence' } },
      { from: 'Thompson v. United States', relation: 'INVOLVES', to: 'government driver', properties: { role: 'Defendant' } },
      { from: 'Vehicle inspection logs', relation: 'EVIDENCE_IN', to: 'Thompson v. United States', properties: { finding: 'No deficiencies' } },
      { from: 'Accident reconstruction', relation: 'SUPPORTS', to: 'contributory negligence', properties: { conclusion: 'Possible plaintiff negligence' } },
      { from: 'MAJ Allen', relation: 'COUNSEL_FOR', to: 'United States', properties: { case: 'Thompson v. United States' } }
    );
  } else if (emailIndex === 1) {
    relationships.push(
      { from: 'civilian witnesses', relation: 'TESTIFY_IN', to: 'Thompson v. United States', properties: { observation: 'Excessive speed by plaintiff' } },
      { from: 'witness statements', relation: 'CONTRADICT', to: 'plaintiff claim', properties: { claim: 'GOV ran stop sign' } },
      { from: 'pre-existing conditions', relation: 'AFFECT', to: 'damages claim', properties: { impact: 'Overstated' } },
      { from: 'CPT Nguyen', relation: 'ANALYZES', to: 'Thompson v. United States', properties: { focus: 'Witness credibility' } }
    );
  } else if (emailIndex === 2) {
    relationships.push(
      { from: 'Command Investigation', relation: 'DOCUMENTS', to: 'erosion hazards', properties: { location: 'Range 14' } },
      { from: 'Range 14', relation: 'SUBJECT_OF', to: 'Alvarez v. United States', properties: { incident_type: 'Premises liability' } },
      { from: 'Contractor', relation: 'AUTHORIZED_AT', to: 'Range 14', properties: { scope: 'Within duties' } },
      { from: 'LTC Harris', relation: 'CONDUCTED', to: 'Command Investigation', properties: { findings: 'Prior notice, delayed maintenance' } }
    );
  } else if (emailIndex === 4) {
    relationships.push(
      { from: 'exposure analysis', relation: 'ASSESSES', to: 'Alvarez v. United States', properties: { risk: 'Moderate to high' } },
      { from: 'Alvarez v. United States', relation: 'REQUIRES_COORDINATION_WITH', to: 'USARCS', properties: { purpose: 'Settlement authority' } },
      { from: 'MAJ Allen', relation: 'RECOMMENDS', to: 'early settlement', properties: { rationale: 'Fiscal prudence' } }
    );
  }
  
  return relationships;
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
          backgroundColor: `${entity.color}`,
          borderBottom: `2px solid ${entity.color}`,
          padding: '2px 4px',
          margin: '0 2px',
          display: 'inline',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          borderRadius: '5px'
        }}
        title={entity.properties ? JSON.stringify(entity.properties, null, 2) : ''}
      >
        <span style={{ whiteSpace: 'normal' }}>{text.substring(entity.start, entity.end)}</span>
        <span
          className="entity-label"
          style={{
            backgroundColor: entity.color,
            color: 'white',
            padding: '2px 5px',
            borderRadius: '3px',
            marginLeft: '4px',
            fontSize: '0.65rem',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            verticalAlign: 'baseline',
            display: 'inline-block'
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

Coordination with DPW and USARCS advised to assess settlement authority.

Have a great week!
JAGBot`;
  
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

// Single email typing effect
const startSingleEmailTypingEffect = async (summaryText) => {
  setSingleEmailSummaryTyping(true);
  setSingleEmailTypedSummary('');
  
  let index = 0;
  
  const typingInterval = setInterval(() => {
    if (index < summaryText.length) {
      setSingleEmailTypedSummary(summaryText.substring(0, index + 1));
      index++;
    } else {
      clearInterval(typingInterval);
      setSingleEmailSummaryTyping(false);
    }
  }, 8);
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

// Smooth scroll helper with delay
const smoothScrollToElement = (ref, delay = 0) => {
  setTimeout(() => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, delay);
};

const handleProcessEmail = async () => {
  setProcessing(true);
  setPipelineStep('classification');
  setResults(null);
  setSingleEmailTypedSummary('');
  setSingleEmailSummaryTyping(false);
  
  // Ensure minimum time between steps
  const MIN_STEP_DELAY = 1000;
  
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const textToProcess = useRealAPI ? emailContent : placeholderEmail;
  const mockEntities = extractPlaceholderEntities();
  
  setResults({
    classification: {
      label: 'RELEVANT',
      confidence: 0.98
    }
  });
  
  // Scroll to classification after a delay
  smoothScrollToElement(classificationRef, 300);
  
  await new Promise(resolve => setTimeout(resolve, Math.max(MIN_STEP_DELAY, 1500)));
  
  setPipelineStep('ner');
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  setResults(prev => ({
    ...prev,
    entities: mockEntities,
    originalText: textToProcess,
    relationships: []
  }));
  
  // Scroll to NER section
  smoothScrollToElement(nerRef, 300);
  
  await new Promise(resolve => setTimeout(resolve, Math.max(MIN_STEP_DELAY, 1500)));
  
  setPipelineStep('graph');
  
  await new Promise(resolve => setTimeout(resolve, 800));

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

  // Scroll to graph
  smoothScrollToElement(graphRef, 300);
  
  await new Promise(resolve => setTimeout(resolve, Math.max(MIN_STEP_DELAY, 1200)));

  setResults(prev => ({
    ...prev,
    relationships: relationships,
    summaryText: `Good afternoon CPT Smith,

Below is your weekly litigation update for matters within your portfolio:

United States v. Reynolds (UCMJ – Art. 92)

Defense counsel entered representation and issued a formal evidence preservation demand covering unit taskings, command communications, and CID materials.

Article 32 hearing remains scheduled for 10 January 2025 at Fort Liberty. No continuance requests noted.

Defense is signaling potential discovery and preservation challenges tied to Feb–Mar 2024 unit directives.

Action Items:

Ensure responsive unit records and command communications are preserved and coordinated with CID ahead of the Article 32.

Respectfully,
JAG Bot`
  }));
  
  setPipelineStep('summary');
  
  // Scroll to summary
  smoothScrollToElement(summaryRef, 300);
  
  // Start typing effect for summary
  const summaryText = `Good afternoon CPT Smith,

Below is your weekly litigation update for matters within your portfolio:

United States v. Reynolds (UCMJ – Art. 92)

Defense counsel entered representation and issued a formal evidence preservation demand covering unit taskings, command communications, and CID materials.

Article 32 hearing remains scheduled for 10 January 2025 at Fort Liberty. No continuance requests noted.

Defense is signaling potential discovery and preservation challenges tied to Feb–Mar 2024 unit directives.

Action Items:

Ensure responsive unit records and command communications are preserved and coordinated with CID ahead of the Article 32.

Respectfully,
JAG Bot`;

  await new Promise(resolve => setTimeout(resolve, 500));
  startSingleEmailTypingEffect(summaryText);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setPipelineStep('complete');
  setProcessing(false);
};

const handleProcessEmailWithAPI = async () => {
  setProcessing(true);
  setPipelineStep('classification');
  setResults(null);

  try {
    const emailId = `email_${Date.now()}`;
    const fullText = `Subject: ${subjectContent}\n\n${emailContent}`;

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

    smoothScrollToElement(classificationRef, 300);

    await new Promise(r => setTimeout(r, 1000));

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

    smoothScrollToElement(nerRef, 300);

    await new Promise(r => setTimeout(r, 1000));

    setPipelineStep('graph');
    await new Promise(r => setTimeout(r, 600));

    smoothScrollToElement(graphRef, 300);

    await new Promise(r => setTimeout(r, 1000));

    setPipelineStep('summary');
    await new Promise(r => setTimeout(r, 600));

    smoothScrollToElement(summaryRef, 300);

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
  setShowBatchSummary(false);
  setTypedSummary('');
  setSummaryLoading(false);

  const allGraphNodes = new Map();
  const allGraphRelationships = [];
  const MIN_STEP_DELAY = 1000;

  for (let i = 0; i < testEmails.length; i++) {
    setCurrentBatchIndex(i);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isRelevant = i !== 3;
    const fullText = `Subject: ${testEmails[i].subject}\n\n${testEmails[i].content}`;
    const entities = isRelevant ? extractEntitiesWithProperties(fullText, i) : [];
    const relationships = isRelevant ? generateRelationships(entities, i) : [];

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
    
    setBatchResults(prev => {
      const newResults = [...prev, mockResult];
      // Scroll to the latest result
      setTimeout(() => {
        const resultCards = document.querySelectorAll('.batch-result-card');
        if (resultCards[i]) {
          resultCards[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return newResults;
    });

    // Add delay between processing each email
    await new Promise(resolve => setTimeout(resolve, MIN_STEP_DELAY));
  }

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
  
  // Wait before showing graph changes
  await new Promise(resolve => setTimeout(resolve, MIN_STEP_DELAY));
  
  // Scroll to graph changes
  setTimeout(() => {
    const graphSection = document.querySelector('.graph-changes-section');
    if (graphSection) {
      graphSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 300);
  
  // Wait before showing summary
  await new Promise(resolve => setTimeout(resolve, MIN_STEP_DELAY + 500));
  
  setShowBatchSummary(true);
  
  // Scroll to summary
  setTimeout(() => {
    const summarySection = document.querySelector('.batch-summary-outlook-container');
    if (summarySection) {
      summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 300);
  
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
      
      {/* Fixed Progress Bar */}
      {processing && (
        <div ref={progressBarRef} className="fixed-progress-bar">
          <div className="pipeline-progress">
            <div className={`progress-step ${pipelineStep === 'classification' ? 'active' : pipelineStep && ['ner', 'graph', 'summary', 'complete'].includes(pipelineStep) ? 'complete' : ''}`}>
              <div className="progress-icon">
                <Binary size={20} />
              </div>
              <span>Classification</span>
            </div>
            <div className="progress-connector"></div>
            <div className={`progress-step ${pipelineStep === 'ner' ? 'active' : pipelineStep && ['graph', 'summary', 'complete'].includes(pipelineStep) ? 'complete' : ''}`}>
              <div className="progress-icon">
                <FileText size={20} />
              </div>
              <span>NER</span>
            </div>
            <div className="progress-connector"></div>
            <div className={`progress-step ${pipelineStep === 'graph' ? 'active' : pipelineStep && ['summary', 'complete'].includes(pipelineStep) ? 'complete' : ''}`}>
              <div className="progress-icon">
                <Network size={20} />
              </div>
              <span>Graph Update</span>
            </div>
            <div className="progress-connector"></div>
            <div className={`progress-step ${pipelineStep === 'summary' ? 'active' : pipelineStep === 'complete' ? 'complete' : ''}`}>
              <div className="progress-icon">
                <FileText size={20} />
              </div>
              <span>Summary</span>
            </div>
          </div>
        </div>
      )}
      
      <main className='main-content' style={{ paddingTop: processing ? '100px' : '0' }}>
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
                  setGraphChanges(null);
                  setGraphAnimation(null);
                  setPipelineStep(null);
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
                  setPipelineStep(null);
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

                {/* Test Emails Preview */}
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
                          {result.body && result.body.length > 0 && (
                            <div className="batch-email-body-section">
                              <strong>Email Preview:</strong>
                              <div className="email-body-annotated">
                                {createAnnotatedText(result.fullText, result.entities)}
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
                <div ref={classificationRef} className="results-card classification-card">
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
                <div ref={nerRef} className="results-card annotation-card">
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
                            {/* <span className="entity-type-badge" style={{ backgroundColor: entity.color }}>
                              {entity.type}
                            </span> */}
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Graph Database Updates */}
              {graphChanges && (
                <div ref={graphRef}>
                  <GraphVisualization graphData={graphChanges} />
                </div>
              )}

              {/* Email Summary with Typing Effect */}
              {/* Email Summary with Typing Effect */}
{results.summaryText && (
  <div ref={summaryRef} className="results-card summary-card-mvp">
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
        <span className="header-value">
          Case Update - SSG Michael A. Reynolds (Case 24-MJ-117)
        </span>
      </div>
      <div className="email-divider"></div>
      <div className="email-body-result" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
        {singleEmailTypedSummary.split('\n').map((line, index) => {
          if (line.includes('United States v. Reynolds')) {
            return (
              <div key={index} className="email-line-header">
                <strong>{line}</strong>
              </div>
            );
          } else if (line.includes('Action Items:')) {
            return (
              <div key={index} className="email-line-header">
                <strong>{line}</strong>
              </div>
            );
          } else {
            return <div key={index}>{line}</div>;
          }
        })}
        {singleEmailSummaryTyping && <span className="typing-cursor">|</span>}
      </div>
    </div>
  </div>
)}

            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .fixed-progress-bar {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          z-index: 1000;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          padding: 1.5rem 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .typing-cursor {
          animation: blink 1s step-end infinite;
          color: #3b82f6;
          font-weight: bold;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
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

  /* ---------- theme ---------- */
  const theme = {
    shellGradient: "linear-gradient(180deg, #0b1220 0%, #0f1b2d 100%)",
    border: "#1e293b",
    nodeFill: "#0b1220",
    nodeStroke: "#334155",
    nodeHalo: "rgba(56, 189, 248, 0.12)",
    edge: "#475569",
    edgeActive: "#38bdf8",
    text: "#e5e7eb",
    subtext: "#94a3b8",
    edgeLabel: "#cbd5f5"
  };

  const entityAccent = {
    PERSON: "#38bdf8",
    LOCATION: "#34d399",
    DATE: "#a78bfa",
    CASE: "#f87171",
    COURT: "#fb7185",
    JUDGE: "#60a5fa",
    MOTION: "#facc15",
    PARTY_ENTITY: "#2dd4bf",
    STATUTE: "#fb923c",
    LEGAL_ISSUE: "#c084fc",
    PRECEDENT: "#4ade80",
    CONTRACT: "#818cf8",
    CLAUSE: "#9ca3af",
    EVIDENCE: "#38bdf8"
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

    const nodeMap = new Map();

    graphData.nodes_added.forEach((n, i) => {
      // position nodes roughly in a circle with margin
      const angle = (i / graphData.nodes_added.length) * 2 * Math.PI;
      nodeMap.set(n.label, {
        id: n.label,
        label: n.label,
        type: n.type,
        x: MARGIN + Math.cos(angle) * (dimensions.width / 2 - MARGIN),
        y: MARGIN + Math.sin(angle) * (dimensions.height / 2 - MARGIN)
      });
    });

    const builtLinks = graphData.relationships
      .map(r => {
        const source = nodeMap.get(r.from);
        const target = nodeMap.get(r.to);
        if (!source || !target) return null;
        return {
          source,
          target,
          label: r.type || "RELATED_TO"
        };
      })
      .filter(Boolean);

    setNodes([...nodeMap.values()]);
    setLinks(builtLinks);
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
      // clamp nodes inside viewport
      setNodes(nodes.map(n => ({
        ...n,
        x: Math.max(MARGIN, Math.min(dimensions.width - MARGIN, n.x)),
        y: Math.max(MARGIN, Math.min(dimensions.height - MARGIN, n.y))
      })));
    });

    return () => simulationRef.current?.stop();
  }, [nodes.length, links.length, dimensions]);

  return (
    <div ref={containerRef} className="graph-shell">
      <header className="graph-header">
        <h2>Knowledge Graph Updates</h2>
        <span>{nodes.length} entities • {links.length} relationships</span>
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
            const accent = entityAccent[n.type] || theme.nodeStroke;
            const hovered = hoverNode === n.id;

            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                onMouseEnter={() => setHoverNode(n.id)}
                onMouseLeave={() => setHoverNode(null)}
                className={`node ${hovered ? "hovered" : ""}`}
              >
                <circle className="halo" r={NODE_RADIUS + 8} />
                <circle className="core" r={NODE_RADIUS} stroke={accent} />

                <text y={NODE_RADIUS + 12} textAnchor="middle">
                  {n.label.length > 16 ? n.label.slice(0, 14) + "…" : n.label}
                </text>
                <text y={NODE_RADIUS + 26} textAnchor="middle" className="sub">
                  {n.type}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <style jsx>{`
        .graph-shell {
          height: clamp(560px, 70vh, 720px);
          background: ${theme.shellGradient};
          border-radius: 24px;
          border: 2px solid #6366f133;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          // margin-top: 2rem;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.6);
                background: linear-gradient(135deg, #8b5cf60d 0%, #7c3aed0d 100%);
    border: 2px solid #8b5cf64d;
      box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.03),
            0 40px 90px rgba(0,0,0,0.65);
        }

        .graph-header {
          padding: 1.6rem 2rem;
          border-bottom: 1px solid ${theme.border};
        }

        .graph-header h2 {
          margin: 0;
          color: ${theme.text};
        }

        .graph-header span {
          color: ${theme.subtext};
          font-size: 0.85rem;
        }

        .graph-svg {
          flex: 1;
                    background: ${theme.shellGradient};

        }

        .edge {
          stroke: ${theme.edge};
          stroke-width: 1.2;
          opacity: 0.35;
        }

        .edge.active {
          stroke: ${theme.edgeActive};
          opacity: 0.9;
          stroke-width: 2.2;
        }

        .edge-label {
          fill: ${theme.edgeLabel};
          font-size: 9px;
          pointer-events: none;
          opacity: 0.6;
        }

        .node {
          cursor: pointer;
        }

        .node .halo {
          fill: ${theme.nodeHalo};
          opacity: 0;
          transition: opacity 200ms ease;
        }

        .node .core {
          fill: ${theme.nodeFill};
          stroke-width: 2;
          transition: all 200ms ease;
        }

        .node text {
          fill: ${theme.text};
          font-size: 11px;
          font-weight: 600;
          pointer-events: none;
        }

        .node text.sub {
          fill: ${theme.subtext};
          font-size: 9px;
        }

        .node.hovered .halo {
          opacity: 1;
        }

        .node.hovered .core {
          r: ${NODE_RADIUS + 4}px;
          stroke-width: 3;
        }
      `}</style>
    </div>
  );
}
