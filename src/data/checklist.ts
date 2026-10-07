/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InspectionModule } from '../types';

export const CHECKLIST_TEMPLATE: InspectionModule[] = [
  {
    id: 'EGR',
    code: '2.2.1',
    title: 'Means of Egress Checks (Office Routes & Exit Doors)',
    plainDescription: 'Check all office exit doors, panic push-bars, and hallways to make sure employees have an unobstructed escape route.',
    statutoryRefs: 'OSHA 29 CFR 1910.36 & 1910.37 (Exit Routes) · NFPA 101 (Life Safety Code - Business Occupancies) · SBC 801 Chapter 10 · ISO 9001:2015 Cl. 7.1.3 · ISO 45001:2018 Cl. 8.1',
    items: [
      {
        id: 'EGR.1',
        ref: '2.2.1.1',
        item: 'Office Fire Door Self-Closing & Automatic Latching',
        plainQuestion: 'Do office fire doors swing shut and latch completely on their own?',
        howToCheck: 'Open the door to a 45-degree angle and release it without pushing. The hydraulic closer must pull it smoothly shut, and the latch bolt must click firmly into the door frame without getting stuck. Ensure nobody propped it open with a trash bin or wedge.',
        criteria: 'Closes and latches automatically from any position; closer arm intact with no hydraulic fluid leaks; latch engagement positive.',
        standardsRef: 'OSHA 1910.37(a)(2) · NFPA 101 Cl. 7.2.1.8 · SBC 801 Cl. 703.2 · ISO 9001:2015 Cl. 7.1.3',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Listen for the audible "click" of the latch entering the strike plate.',
          'Never permit wooden door wedges or flower pots to prop open rated fire doors.'
        ]
      },
      {
        id: 'EGR.2',
        ref: '2.2.1.2',
        item: 'Panic Push-Bars & Exit Release Hardware',
        plainQuestion: 'Does the panic push-bar press down smoothly and open easily?',
        howToCheck: 'Push the horizontal panic bar with normal hand pressure. The mechanism should operate smoothly with no sticking or binding. Verify the lock bolt extends at least 19 mm (3/4 inch) into the strike plate when released.',
        criteria: 'Panic hardware operates freely with operational push force under 67 N (15 lbf); positive latch bolt throw >= 19mm.',
        standardsRef: 'OSHA 1910.36(d) · NFPA 101 Cl. 7.2.1.7 · SBC 801 Cl. 1010.1.9 · ISO 45001:2018 Cl. 8.1',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Ensure the panic bar does not require two hands or twisting motions to release.',
          'Check that mounting screws are tight and un-corroded.'
        ]
      },
      {
        id: 'EGR.3',
        ref: '2.2.1.3',
        item: 'Fire Door Smoke Seals & Structural Frame Integrity',
        plainQuestion: 'Are the rubber & expanding heat seals around the door edges intact and clean?',
        howToCheck: 'Inspect the perimeter edges of the door leaf and frame. Check that the black heat-expanding (intumescent) strip is firmly attached along all sides, never painted over, and that the door frame is firmly bolted with no loose gaps.',
        criteria: 'Intumescent graphite seals continuous, unpainted, and unpeeled; door perimeter perimeter gaps <= 3mm; structural frame firmly anchored.',
        standardsRef: 'NFPA 80 Cl. 5.2.4 · SBC 801 Cl. 716 · ISO 9001:2015 Cl. 8.5.1',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Paint on smoke seals stops them from expanding during a fire—note as failure.',
          'Check the bottom smoke brush / drop seal touches the floor when closed.'
        ]
      },
      {
        id: 'EGR.4',
        ref: '2.2.1.4',
        item: 'Magnetic Door Hold-Open Release Mechanisms',
        plainQuestion: 'Do magnetic hallway door holders release instantly when the test button is pressed?',
        howToCheck: 'If office corridor double-doors are held open by wall electro-magnets, push the manual release button or switch on the wall. The magnets must instantly let go so both doors swing completely closed.',
        criteria: 'Electromagnetic hold-open device immediately de-energizes upon manual test or alarm signal; doors close completely under closer tension.',
        standardsRef: 'NFPA 101 Cl. 7.2.1.8.2 · SBC 801 Cl. 716.2.6 · ISO 45001:2018 Cl. 8.2',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Verify both left and right leaves close in proper sequence if astragal is installed.'
        ]
      },
      {
        id: 'EGR.5',
        ref: '2.2.1.5',
        item: 'Primary Office Exit Doors Unlocked & Unobstructed',
        plainQuestion: 'Are main exit doors unlocked from the inside and 100% free of obstacles?',
        howToCheck: 'Check that anyone can open the exit door from the inside without special keys, passcodes, or tools. Verify there are no delivery boxes, archive document bins, water cooler bottles, or temporary partitions within 1.5m of the door.',
        criteria: 'Zero locks requiring key/tool from egress side; clear path with zero storage, deliveries, or furniture obstructions.',
        standardsRef: 'OSHA 1910.36(d)(1) · OSHA 1910.37(a)(3) · SBC 801 Cl. 1003.6 · ISO 45001:2018 Cl. 8.1',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Common office violation: Cleaning carts or excess delivery boxes parked by exit doors.',
          'Immediate Level 3 defect if any door is found padlocked or chained.'
        ]
      },
      {
        id: 'EGR.6',
        ref: '2.2.1.6',
        item: 'Office Corridors, Hallways & Stairwells Clearance',
        plainQuestion: 'Are office hallways and stairwells wide and completely clear of storage?',
        howToCheck: 'Walk through all primary and secondary office hallways and stairwell landings. Verify the walking path maintains at least 1.1 meters (44 inches) clear width. Check that spare office chairs, paper shredder bins, or ladders are not left in corridors.',
        criteria: 'Minimum 1.1m (44 in) clear corridor width maintained continuously; stairwells free of storage or trip hazards.',
        standardsRef: 'OSHA 1910.36(g)(2) · NFPA 101 Cl. 7.3.4 · SBC 801 Cl. 1020.2 · ISO 9001:2015 Cl. 7.1.3',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Check stairwell door landings—nothing may be stored beneath or behind stairs.',
          'Verify non-slip stair nosing treads are intact and not peeling.'
        ]
      }
    ]
  },
  {
    id: 'LIT',
    code: '2.2.2',
    title: 'Life Safety Signage & Lighting Systems (Office Illumination)',
    plainDescription: 'Verify that office emergency lights, glowing floor path markers, and illuminated exit signs are bright and clearly visible.',
    statutoryRefs: 'OSHA 1910.37(b) · NFPA 101 Cl. 7.9 & 7.10 (90-Min Emergency Illumination) · SBC 801 Section 1008 & 1013 · ISO 9001:2015 Cl. 7.1.3 · ISO 45001:2018 Cl. 8.2',
    items: [
      {
        id: 'LIT.1',
        ref: '2.2.2.1',
        item: 'Emergency Battery Backup Lighting Function',
        plainQuestion: 'Do dual-head emergency lamps light up when pressing the "Push to Test" button?',
        howToCheck: 'Locate the wall-mounted dual-lamp emergency units in office corridors. Press and hold the small "Push to Test" button for 5-10 seconds. Both spotlight heads must instantly illuminate at full brightness. Check that the battery charging indicator LED glows green.',
        criteria: 'Unit transfers instantly to battery power upon manual test switch depression; lamp heads fully illuminated; pilot LED shows charging.',
        standardsRef: 'OSHA 1910.37(b)(1) · NFPA 101 Cl. 7.9.2 · SBC 801 Cl. 1008 · ISO 9001:2015 Cl. 7.1.3',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'If either lamp flickers, dims, or fails to ignite, battery or bulb replacement is needed.',
          'Emergency lighting must provide at least 90 minutes of light during an outage.'
        ]
      },
      {
        id: 'LIT.2',
        ref: '2.2.2.2',
        item: 'Glow-in-the-Dark (Photoluminescent) Path Markings',
        plainQuestion: 'Are glowing baseboard strips and floor direction markers continuous and clean?',
        howToCheck: 'Check the glowing photoluminescent guidance strips along office corridor baseboards and stair step edges. They must be clean, unscuffed, firmly glued with no missing sections or peeling corners, ready to guide people crawling beneath smoke.',
        criteria: 'Photoluminescent markings continuous without gaps or scuff damage; mounted along low level (10-40cm above floor) and stair treads.',
        standardsRef: 'NFPA 101 Cl. 7.2.2.5.5 · SBC 801 Cl. 1025 · ISO 45001:2018 Cl. 8.2',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Test by briefly shielding ambient light—strip should emit visible green glow.',
          'Ensure cleaning staff do not wax or apply abrasive chemicals over photoluminescent strips.'
        ]
      },
      {
        id: 'LIT.3',
        ref: '2.2.2.3',
        item: 'Illuminated EXIT Signs Operational Status',
        plainQuestion: 'Are all green/white EXIT signs above doorways brightly lit and intact?',
        howToCheck: 'Look up at each exit sign above office doors and hallway exits. The lettering "EXIT" or the running man icon must be uniformly bright. The plastic cover must be free of cracks, and the internal backup battery status light should show steady normal operation.',
        criteria: 'Internally illuminated EXIT signs continuously lit at >= 54 lux; backup battery indicator healthy; housing clean with no cracks.',
        standardsRef: 'OSHA 1910.37(b)(2) · NFPA 101 Cl. 7.10.1.2 · SBC 801 Cl. 1013 · ISO 9001:2015 Cl. 7.1.3',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Notice if any letters are burned out or dim.',
          'Check that signs are visible in dual English and Arabic where specified.'
        ]
      },
      {
        id: 'LIT.4',
        ref: '2.2.2.4',
        item: 'EXIT Sign Direct Line of Sight (No Visual Blockages)',
        plainQuestion: 'Can you see an EXIT sign clearly from everywhere in the hallway?',
        howToCheck: 'Walk down the office corridors and stand outside conference rooms. Look towards the exits. Ensure there are no hanging TV displays, seasonal decorations, informational signs, or ceiling cable trays blocking the view of the EXIT sign.',
        criteria: 'Unobstructed direct line of sight from all corridor vantage points up to 30 meters; zero obstruction by signs or fixtures.',
        standardsRef: 'OSHA 1910.37(b)(4) · NFPA 101 Cl. 7.10.1.5 · SBC 801 Cl. 1013.1 · ISO 45001:2018 Cl. 8.1',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Common office problem: Hanging promotional banners or temporary divider walls.',
          'If viewing angle is blocked, an additional directional sign is legally required.'
        ]
      },
      {
        id: 'LIT.5',
        ref: '2.2.2.5',
        item: 'Directional Exit Arrow Signage Alignment',
        plainQuestion: 'Do directional exit arrows point straight toward real exit doors?',
        howToCheck: 'Inspect directional signs containing arrows (← EXIT or EXIT →). Follow each arrow physically to ensure it directs staff toward an accessible stairwell or outdoor exit door, and NEVER toward a storage closet, private office, or dead-end pantry.',
        criteria: 'Directional arrows precisely aligned with actual egress route path; no misleading cues toward dead-ends or hazardous zones.',
        standardsRef: 'OSHA 1910.37(b)(3) · NFPA 101 Cl. 7.10.2 · SBC 801 Cl. 1013.2 · ISO 9001:2015 Cl. 8.5.1',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Double check recently remodeled office corridors where layouts may have changed.'
        ]
      }
    ]
  },
  {
    id: 'WRE',
    code: '2.2.3',
    title: 'Warden Equipment Readiness & PPE (Floor Warden Kit)',
    plainDescription: 'Inspect the Floor Fire Warden grab-bag, high-visibility vest, tactical flashlight, radio, acoustic amplifier, and protective gear.',
    statutoryRefs: 'ISO 45001:2018 Cl. 8.2 (Emergency Preparedness) & Cl. 8.1.2 (PPE) · OSHA 29 CFR 1910.38 & 1910.132 · SBC 801 Chapter 4 · KSIA Administrative Emergency Preparedness Manual',
    items: [
      {
        id: 'WRE.1',
        ref: '2.2.3.1',
        item: 'Floor Warden High-Visibility Vest Inspection',
        plainQuestion: 'Is the Floor Warden vest clean, high-visibility, and clearly labeled?',
        howToCheck: 'Inspect the high-vis safety vest in the office warden station. The fluorescent yellow/orange fabric must be clean, velcro fasteners functional, silver reflective stripes undamaged (EN ISO 20471 Class 2/3), and bold dual-language text "FLOOR WARDEN / مسؤول الحريق" clearly readable.',
        criteria: 'EN ISO 20471 Class 2/3 compliant; retroreflective silver strips intact; bold dual-language identification text unfaded.',
        standardsRef: 'EN ISO 20471 · OSHA 1910.132 · ISO 45001:2018 Cl. 8.2',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Vests must be stored in an accessible warden station or mounted wall hook on each office floor.',
          'Check that the vest fits comfortably over regular corporate attire or abayas/thobes.'
        ]
      },
      {
        id: 'WRE.2',
        ref: '2.2.3.2',
        item: 'Warden Tactical LED Flashlight Operational Check',
        plainQuestion: 'Is the warden emergency flashlight fully charged and working brightly?',
        howToCheck: 'Take out the heavy-duty LED flashlight from the warden grab-bag. Press the switch: the beam should be intense and steady. Check that the battery charge indicator shows full power (green) or fresh spare batteries are stored in the pouch.',
        criteria: 'Minimum 300+ lumens output; internal rechargeable cell fully charged or fresh alkaline spares present; rugged drop-resistant casing intact.',
        standardsRef: 'NFPA 101 Cl. 7.9.3 · OSHA 1910.38 · ISO 45001:2018 Cl. 8.2',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Crucial for searching dark office cubicles, archives, and unlit restrooms during power cuts.'
        ]
      },
      {
        id: 'WRE.3',
        ref: '2.2.3.3',
        item: 'Portable Megaphone / Acoustic Amplifier & Siren Check',
        plainQuestion: 'Does the portable megaphone produce clear voice amplification and siren?',
        howToCheck: 'Pick up the office warden megaphone. Squeeze the talk trigger and give a calm voice instruction. Verify voice amplification is loud and intelligible without screeching feedback. Briefly toggle the siren mode to confirm it sounds, and verify battery gauge.',
        criteria: 'Voice output intelligible across 50m office corridor; siren alarm functional; battery level >= 80%.',
        standardsRef: 'NFPA 72 Emergency Communications · OSHA 1910.38(c)(3) · ISO 9001:2015 Cl. 7.1.3',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Required for cutting through loud HVAC noise, fire chimes, and chatter in open-plan office wings.'
        ]
      },
      {
        id: 'WRE.4',
        ref: '2.2.3.4',
        item: 'Two-Way Radio Channel Setup & Battery Readiness',
        plainQuestion: 'Is the office warden radio tuned to the HQ Safety Channel and charged?',
        howToCheck: 'Turn on the two-way emergency radio. Verify the channel selector is locked onto the assigned KSIA Admin Office Safety Channel (e.g., Channel 3 - Office Incident Response). Conduct a 5-second test call with Security / Safety Desk to confirm clear audio and dock battery status.',
        criteria: 'Pre-set to correct KSIA emergency channel; push-to-talk transmission clear; antenna un-bent; battery fully charged on dock.',
        standardsRef: 'Saudi Civil Defense Executive Regulations · NFPA 1221 · ISO 45001:2018 Cl. 8.2',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Confirm spare battery or charging cradle is plugged into an active wall socket.'
        ]
      },
      {
        id: 'WRE.5',
        ref: '2.2.3.5',
        item: 'Rubber Door Wedges, Search Ribbons & Door Chalk',
        plainQuestion: 'Are door wedges and search markers inside the warden pouch?',
        howToCheck: 'Open the warden tool pouch. Count at least 2 heavy-duty rubber door wedges (to hold stairwell doors open during crowd movement) and check for yellow reflective search ribbons or door chalk markers used to mark cleared office rooms.',
        criteria: 'Heavy-duty non-slip rubber wedges (min 2 units) present; high-visibility reflective door tags or markers stocked.',
        standardsRef: 'Saudi Civil Defense Evacuation Sweep Guidelines · ISO 9001:2015 Cl. 8.5.1',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Once a room or floor zone is checked and empty, wardens use tags/chalk to prevent duplicate searches.'
        ]
      },
      {
        id: 'WRE.6',
        ref: '2.2.3.6',
        item: 'Warden PPE & Basic Office First Aid Pouch Readiness',
        plainQuestion: 'Are thermal protective work gloves and emergency first aid gear ready?',
        howToCheck: 'Inspect the warden PPE kit: confirm a pair of heavy-duty heat-resistant work gloves (to safely test door handles before opening), a compact smoke escape hood or particle mask, and a clean, sealed office first aid pouch (burn dressings, bandages, antiseptic).',
        criteria: 'Thermal work gloves intact and clean; smoke escape barrier present; first aid supplies within expiry date.',
        standardsRef: 'OSHA 1910.138 (Hand Protection) · ISO 45001:2018 Cl. 8.1.2 (Hierarchy of Controls) · SBC 801',
        status: null,
        severity: null,
        likelihood: null,
        consequence: null,
        location: '',
        finding: '',
        photos: [],
        quickTips: [
          'Remember the 3-Point Thermal Audit: Use the back of an ungloved hand or gloved back to check door temperature before opening.'
        ]
      }
    ]
  }
];
