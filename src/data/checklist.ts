import { InspectionModule } from '../types';

export const CHECKLIST_TEMPLATE: InspectionModule[] = [
  {
    id: 'EGR',
    title: 'Means of Egress Checks',
    statutoryRefs: 'NFPA 101, SBC 801 Chapter 4',
    items: [
      {
        id: 'EGR.1',
        ref: '2.2.1.1',
        item: 'Fire Door Self-Closing Devices',
        criteria: 'Doors close and latch automatically from any position; hydraulic fluid not leaking; no binding.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'EGR.2',
        ref: '2.2.1.2',
        item: 'Fire Door Latching Hardware',
        criteria: 'Panic bars and mortise latches engage fully (min 19mm throw); no excessive force required.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'EGR.3',
        ref: '2.2.1.3',
        item: 'Intumescent Seals & Frame Integrity',
        criteria: 'Seals unpainted and continuous; frames firmly anchored without gaps or distortion.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'EGR.4',
        ref: '2.2.1.4',
        item: 'Magnetic Hold-Open Release',
        criteria: 'Magnets de-energize immediately on alarm/test, allowing doors to swing shut.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'EGR.5',
        ref: '2.2.1.5',
        item: 'Primary Exit Accessibility',
        criteria: 'Unlocked from inside; free of padlocks/chains; zero physical obstructions (carts, retail).',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'EGR.6',
        ref: '2.2.1.6',
        item: 'Secondary Escape Corridors',
        criteria: 'Sub-terminal corridors and service hallways clear of storage/waste; min egress width maintained.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      }
    ]
  },
  {
    id: 'LIT',
    title: 'Life Safety Signage & Lighting',
    statutoryRefs: 'NFPA 101, SBC 801',
    items: [
      {
        id: 'LIT.1',
        ref: '2.2.2.1',
        item: 'Emergency Lighting Battery Backup',
        criteria: 'Monthly function test (push-to-test) successful; batteries energize heads instantly.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'LIT.2',
        ref: '2.2.2.2',
        item: 'Photoluminescent Path Markings',
        criteria: 'Clean, continuous strips and floor arrows; no gaps or peeling; visible in total blackout.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'LIT.3',
        ref: '2.2.2.3',
        item: 'Exit Sign Illumination',
        criteria: 'LED lamps fully illuminated; green/white configuration clear; housing free of cracks.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'LIT.4',
        ref: '2.2.2.4',
        item: 'Exit Sign Visibility',
        criteria: 'Unobstructed direct line of sight from any point; no tenant signs or banners blocking view.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'LIT.5',
        ref: '2.2.2.5',
        item: 'Directional Signage Alignment',
        criteria: 'Arrows point accurately toward active escape routes; no direction toward dead-ends.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      }
    ]
  },
  {
    id: 'WRE',
    title: 'Warden Equipment & PPE Readiness',
    statutoryRefs: 'Fire Safety Leadership Course Section 2.2.3',
    items: [
      {
        id: 'WRE.1',
        ref: '2.2.3.1',
        item: 'High-Visibility Warden Vest',
        criteria: 'EN ISO 20471 Class 3; reflective strips intact; dual-language text clear and legible.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'WRE.2',
        ref: '2.2.3.2',
        item: 'Tactical Flashlight Check',
        criteria: 'Li-ion batteries charged; casing drop-resistant/intact; beam focus smooth.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'WRE.3',
        ref: '2.2.3.3',
        item: 'Megaphone & Sound Amplifier',
        criteria: 'Volume clear without distortion; siren function active; auxiliary batteries fully charged.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'WRE.4',
        ref: '2.2.3.4',
        item: 'Two-Way Radio Alignment',
        criteria: 'Channel alignment (e.g. Ch 3); antenna integrity verified; battery status on dock normal.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      },
      {
        id: 'WRE.5',
        ref: '2.2.3.5',
        item: 'Door Wedges & Search Markers',
        criteria: 'Heavy-duty rubber wedges present; reflective ribbons and tactical chalk markers stocked.',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: []
      }
    ]
  }
];
