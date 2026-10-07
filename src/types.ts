/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type InspectionStatus = 'P' | 'F' | 'N/A' | null;
export type SeverityLevel = 'L1' | 'L2' | 'L3' | null;

export interface InspectorProfile {
  fullName: string;
  employeeId: string;
  badgeId?: string;
  department: string;
  jobTitle?: string;
  email?: string;
  contactNumber?: string;
}

export interface ChecklistItem {
  id: string;
  ref: string; // e.g. "2.2.1.1"
  item: string; // Everyday plain language title
  plainQuestion: string; // Clear question for everyday staff
  howToCheck: string; // Practical, step-by-step guidance
  criteria: string; // Standard compliance baseline
  standardsRef: string; // Technical standards for executive report (OSHA, ISO 9001, ISO 45001, SBC 801, NFPA 101)
  status: InspectionStatus;
  severity: SeverityLevel;
  likelihood: number | null; // 1-5 scale (ISO 45001 risk matrix)
  consequence: number | null; // 1-5 scale
  location: string; // Specific office room or corridor
  finding: string; // Plain notes on what was observed
  photos: string[]; // Base64 strings for offline storage
  quickTips?: string[]; // Helpful tips for everyday users
}

export interface InspectionModule {
  id: string;
  code: string;
  title: string;
  plainDescription: string;
  statutoryRefs: string;
  items: ChecklistItem[];
}

export interface CorrectiveAction {
  id: string;
  location: string;
  defect: string;
  severity: SeverityLevel;
  containment: string; // Immediate action taken on site
  rootCause?: string; // ISO 9001:2015 Cl 10.2 Root cause analysis
  preventiveAction?: string; // Long-term preventive measure
  owner: string; // Assigned department/person
  targetSla: string; // Expected completion time
  signOff: string; // Re-inspection sign-off
}

export interface InspectionReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
  
  // Administrative Office Location Details
  facility: string; // e.g. "KSIA Administrative Headquarters (HQ Tower)"
  zoneId: string; // e.g. "HQ-Zone A (West Wing)"
  floor: string; // e.g. "Level 3 - HR & Corporate Services"
  concourse: string; // Kept for schema compatibility - represents Office Wing/Corridor
  officeWing: string; // "North Administrative Wing", "Executive Suite Corridor", etc.
  department: string; // "Human Resources", "Finance", "Legal", "Facilities", etc.
  roomNumbers: string; // "Suites 301-324, Boardroom B, Main Hallway"
  
  // Inspector Credentials (Captured from Splash Screen)
  leadInspector: string;
  staffId: string;
  badgeId: string;
  deputyWarden: string;
  
  // Audit Context
  inspectionDate: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  auditType: 'Egress, Lighting & Warden Readiness' | 'ISO 9001 / ISO 45001 Office Safety Audit' | 'Daily Admin Walkthrough' | 'Quarterly Warden Inspection';
  safetyOfficer: string;
  radioChannel: string;
  phoneExt: string;

  // ISO 9001:2015 & ISO 45001:2018 Governance
  workersConsulted: boolean;
  consultationDetails: string;
  hazardAssessmentRef: string;
  qualityStandardRef: string; // ISO 9001:2015 Cl. 7.1.3 Infrastructure & 8.5.1
  documentControlId: string; // Controlled Copy ID e.g. KSIA-ADM-HSE-RPT-2026

  // Modules
  modules: InspectionModule[];

  // Corrective Actions (CAP)
  correctiveActions: CorrectiveAction[];

  // Sign-off
  leadSignatory: string;
  areaManagerSignatory: string;
  chiefSignatory: string;
}
