/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InspectionReport } from '../types';
import { format } from 'date-fns';

export const generatePDF = async (report: InspectionReport) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Calculate compliance statistics
  let totalEvaluated = 0;
  let passCount = 0;
  let failCount = 0;
  let naCount = 0;
  let criticalCount = 0;
  let highCount = 0;
  let medCount = 0;
  let lowCount = 0;

  report.modules.forEach(m => {
    m.items.forEach(i => {
      if (i.status) {
        totalEvaluated++;
        if (i.status === 'P') passCount++;
        if (i.status === 'F') {
          failCount++;
          const ri = (i.likelihood && i.consequence) ? i.likelihood * i.consequence : 0;
          if (ri >= 16 || i.severity === 'L3') criticalCount++;
          else if (ri >= 10 || i.severity === 'L2') highCount++;
          else if (ri >= 5) medCount++;
          else lowCount++;
        }
        if (i.status === 'N/A') naCount++;
      }
    });
  });

  const complianceRate = totalEvaluated > 0 ? Math.round((passCount / (totalEvaluated - naCount || 1)) * 100) : 100;

  // --- Executive Header Banner ---
  // Royal Navy & Deep Indigo KSIA Theme
  doc.setFillColor(10, 37, 64); // #0A2540 KSIA Deep Corporate Navy
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Gold / Amber Strip (Saudi Excellence)
  doc.setFillColor(217, 119, 6); // Amber Gold
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // KSIA Title & Hierarchy
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('KING SALMAN INTERNATIONAL AIRPORT (KSIA)', 14, 15);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(224, 231, 255);
  doc.text('CORPORATE ADMINISTRATIVE OFFICES · HSE & QUALITY ASSURANCE', 14, 22);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 205, 230);
  doc.text('Egress Control, Emergency Lighting & Warden Equipment Readiness Audit (Sec 2.2)', 14, 29);
  doc.text('Compliance Framework: ISO 9001:2015 · ISO 45001:2018 · OSHA 29 CFR 1910.36/37/38 · SBC 801', 14, 35);

  // Controlled Document Stamp Box in Header
  doc.setFillColor(15, 52, 90);
  doc.roundedRect(pageWidth - 62, 8, 48, 26, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('ISO 9001 CONTROLLED RECORD', pageWidth - 59, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(200, 215, 240);
  doc.text(`DOC ID: KSIA-ADM-${report.id.substring(0, 6).toUpperCase()}`, pageWidth - 59, 19);
  doc.text(`DATE: ${report.inspectionDate}`, pageWidth - 59, 23);
  doc.text(`STATUS: ${report.isDraft ? 'DRAFT' : 'FORMAL RECORD'}`, pageWidth - 59, 27);
  doc.text('REV: 2.2 (OFFICE AUDIT)', pageWidth - 59, 31);

  let y = 52;

  // --- Executive Scorecard Summary Card ---
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'S');

  // Overall Score
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('COMPLIANCE INDEX', 20, y + 6);
  doc.setFontSize(14);
  if (complianceRate >= 90) doc.setTextColor(22, 101, 52); // green
  else if (complianceRate >= 75) doc.setTextColor(194, 65, 12); // amber
  else doc.setTextColor(185, 28, 28); // red
  doc.text(`${complianceRate}%`, 20, y + 14);

  // Stats Breakdown
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('EVALUATED ITEMS', 65, y + 6);
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalEvaluated} Total (${passCount} Pass / ${failCount} Fail)`, 65, y + 14);

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('DEFECT SEVERITY', 135, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(criticalCount > 0 ? 185 : 71, criticalCount > 0 ? 28 : 85, criticalCount > 0 ? 28 : 105);
  doc.text(`Crit (L3): ${criticalCount}  |  High (L2): ${highCount}  |  Low (L1): ${lowCount}`, 135, y + 14);

  y += 26;

  // --- 1. Audit Header & Administrative Control ---
  doc.setTextColor(10, 37, 64);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. ADMINISTRATIVE OFFICE JURISDICTION & INSPECTOR CREDENTIALS', 14, y);
  y += 4;

  const adminBody = [
    ['Administrative Facility', report.facility || 'KSIA Administrative Headquarters (HQ Tower)', 'Lead Office Inspector', `${report.leadInspector || 'Not Assigned'}`],
    ['Office Floor / Level', report.floor || 'Level 3 - Corporate Wing', 'Employee ID / Staff No.', `${report.staffId || 'N/A'}`],
    ['Department / Directorate', report.department || 'Executive Office & Corporate Services', 'Access Badge / Pass ID', `${report.badgeId || 'N/A'}`],
    ['Office Wing / Zone ID', `${report.zoneId || 'HQ-ZN-01'} · ${report.officeWing || report.concourse || 'Main Corridor'}`, 'Floor Deputy Warden', `${report.deputyWarden || 'None Designated'}`],
    ['Office Suites / Rooms', report.roomNumbers || 'Executive Suites & Open Workspace', 'Audit Date & Shift', `${report.inspectionDate} (${report.shift} Shift)`],
    ['Audit Classification', report.auditType, 'HQ Safety Radio / Ext.', `${report.radioChannel || 'Ch 03 - HQ Safety'} / ${report.phoneExt || '8800'}`],
    ['Worker Consultation (ISO 45001 Cl 5.4)', report.workersConsulted ? `Completed: ${report.consultationDetails || 'Consulted floor occupants'}` : 'Not conducted during this sweep', 'Quality Standard Control', 'ISO 9001:2015 Cl. 7.1.3 & 8.5.1']
  ];

  autoTable(doc, {
    startY: y,
    body: adminBody,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 44 },
      1: { cellWidth: 50 },
      2: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 44 },
      3: { cellWidth: 44 }
    }
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // --- 2. Systematic Section 2.2 Inspection Modules ---
  doc.setTextColor(10, 37, 64);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. SECTION 2.2 SYSTEMATIC OFFICE INSPECTION RESULTS', 14, y);
  y += 4;

  for (const module of report.modules) {
    if (y > pageHeight - 45) {
      doc.addPage();
      y = 18;
    }

    doc.setFillColor(241, 245, 249);
    doc.rect(14, y - 3, pageWidth - 28, 8, 'F');
    doc.setTextColor(10, 37, 64);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`Module ${module.id} (${module.code}): ${module.title}`, 16, y + 2.5);
    
    y += 7;

    const moduleRows = module.items.map(item => {
      const statusText = item.status === 'P' ? 'PASS' : item.status === 'F' ? 'FAIL' : item.status === 'N/A' ? 'N/A' : 'UNCHECKED';
      const ri = (item.likelihood && item.consequence) ? item.likelihood * item.consequence : null;
      const riskLabel = !ri ? (item.severity || '-') : ri >= 16 ? `Crit (${ri})` : ri >= 10 ? `High (${ri})` : ri >= 5 ? `Med (${ri})` : `Low (${ri})`;

      return [
        item.ref,
        `${item.item}\nPlain Check: ${item.plainQuestion}`,
        item.standardsRef || 'OSHA / ISO / SBC',
        statusText,
        riskLabel,
        `${item.location ? `[${item.location}] ` : ''}${item.finding || 'Compliant with standards'}`
      ];
    });

    autoTable(doc, {
      startY: y,
      head: [['Ref', 'Office Verification Item', 'Standards Baseline', 'Status', 'Risk', 'Observed Findings & Location']],
      body: moduleRows,
      theme: 'grid',
      headStyles: {
        fillColor: [10, 37, 64],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
        cellPadding: 2
      },
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 14, fontStyle: 'bold', halign: 'center' },
        1: { cellWidth: 62 },
        2: { cellWidth: 32, fontSize: 6.5 },
        3: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 15, halign: 'center' },
        5: { cellWidth: 'auto' }
      },
      didParseCell: (data) => {
        if (data.column.index === 3) {
          if (data.cell.raw === 'PASS') {
            data.cell.styles.textColor = [22, 101, 52];
            data.cell.styles.fillColor = [220, 252, 231];
          } else if (data.cell.raw === 'FAIL') {
            data.cell.styles.textColor = [185, 28, 28];
            data.cell.styles.fillColor = [254, 226, 226];
          } else if (data.cell.raw === 'N/A') {
            data.cell.styles.textColor = [161, 98, 7];
            data.cell.styles.fillColor = [254, 240, 138];
          }
        }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 3. Corrective Action Plan (CAP) - ISO 9001:2015 & ISO 45001:2018 ---
  if (report.correctiveActions.length > 0) {
    if (y > pageHeight - 55) {
      doc.addPage();
      y = 18;
    }

    doc.setTextColor(185, 28, 28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('3. CORRECTIVE ACTION PLAN (CAP) · ISO 9001:2015 CL. 10.2 & ISO 45001 CL. 8.2', 14, y);
    y += 4;

    const capRows = report.correctiveActions.map(ca => [
      ca.id,
      ca.location || 'Office Suite',
      ca.defect || 'Identified Defect',
      ca.severity || 'L2',
      ca.containment || 'Immediate containment initiated',
      ca.owner || 'Facilities Dept',
      ca.targetSla || '24 Hours',
      ca.signOff || 'Pending'
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Item Ref', 'Office Location', 'Identified Defect', 'Sev', 'Immediate Action', 'Assigned Owner', 'Target SLA', 'Sign-Off']],
      body: capRows,
      theme: 'grid',
      headStyles: {
        fillColor: [185, 28, 28],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold'
      },
      styles: { fontSize: 7, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 15, fontStyle: 'bold' },
        1: { cellWidth: 25 },
        2: { cellWidth: 40 },
        3: { cellWidth: 10, halign: 'center' },
        4: { cellWidth: 38 },
        5: { cellWidth: 22 },
        6: { cellWidth: 16, halign: 'center' },
        7: { cellWidth: 16, halign: 'center' }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- 4. Standards Compliance Statement & Sign-off ---
  if (y > pageHeight - 55) {
    doc.addPage();
    y = 18;
  }

  doc.setTextColor(10, 37, 64);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('4. STATUTORY COMPLIANCE DECLARATION & FORMAL SIGN-OFF', 14, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'S');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const declaration = "I hereby confirm that this Life Safety, Egress & Warden Equipment inspection was systematically executed across the KSIA Administrative Headquarters in compliance with ISO 9001:2015 (Quality Infrastructure Control), ISO 45001:2018 (Occupational Health & Safety), OSHA 29 CFR 1910.36/37/38 (Exit Routes & Emergency Action Plans), and the Saudi Building Code (SBC 801 - Business Occupancies). Any Level 3 (Critical) or Level 2 (High) safety defects have been formally escalated to KSIA Corporate Facilities and the Corporate Safety Directorate.";
  const splitDeclaration = doc.splitTextToSize(declaration, pageWidth - 36);
  doc.text(splitDeclaration, 18, y + 5);

  y += 28;

  const signoffTable = [
    [
      'Lead Office Safety Inspector',
      `${report.leadInspector || 'Sarah Al-Ghamdi'}\nEmployee ID: ${report.staffId || 'KSIA-EMP-8492'}`,
      report.inspectionDate || format(new Date(), 'yyyy-MM-dd'),
      '[ Digitally Verified via KSIA Portal ]'
    ],
    [
      'Floor Administrative / Dept Manager',
      `${report.areaManagerSignatory || 'Designated Floor Director'}`,
      report.inspectionDate || format(new Date(), 'yyyy-MM-dd'),
      'Reviewed & Acknowledged'
    ],
    [
      'KSIA HSE & Quality Assurance Director',
      `${report.chiefSignatory || 'Corporate Safety & Quality Lead'}`,
      report.inspectionDate || format(new Date(), 'yyyy-MM-dd'),
      'Formal Audit Endorsement'
    ]
  ];

  autoTable(doc, {
    startY: y,
    head: [['Role', 'Printed Name & Credential', 'Date Verified', 'Formal Status']],
    body: signoffTable,
    theme: 'grid',
    headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255], fontSize: 7.5 },
    styles: { fontSize: 7.5, cellPadding: 2.5 }
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // --- 5. Photo Appendix ---
  const allPhotos: { ref: string; photo: string; location: string }[] = [];
  report.modules.forEach(m => {
    m.items.forEach(i => {
      i.photos.forEach(p => {
        allPhotos.push({ ref: i.ref, photo: p, location: i.location || i.item });
      });
    });
  });

  if (allPhotos.length > 0) {
    doc.addPage();
    doc.setFillColor(10, 37, 64);
    doc.rect(0, 0, pageWidth, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('APPENDIX: AUDIT PHOTOGRAPHIC EVIDENCE & FIELD VERIFICATION LOG', 14, 11);

    let photoY = 24;
    let photoX = 14;
    const photoWidth = 85;
    const photoHeight = 60;

    allPhotos.forEach((item, index) => {
      if (photoY > pageHeight - 75) {
        doc.addPage();
        photoY = 20;
      }

      try {
        doc.addImage(item.photo, 'JPEG', photoX, photoY, photoWidth, photoHeight);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`Item Ref ${item.ref}: ${item.location}`, photoX, photoY + photoHeight + 5);
      } catch (e) {
        console.error('Failed to render photo in PDF', e);
      }

      if (index % 2 === 0) {
        photoX = 110;
      } else {
        photoX = 14;
        photoY += 75;
      }
    });
  }

  // --- Running Footers with Page Numbers ---
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    
    // Bottom border line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

    doc.text(
      'KSIA CORPORATE ADMINISTRATIVE HEADQUARTERS · HSE & QUALITY ASSURANCE AUDIT REPORT',
      14,
      pageHeight - 8
    );
    doc.text(
      `DOC ID: KSIA-ADM-${report.id.substring(0, 6).toUpperCase()} | PAGE ${i} OF ${totalPages}`,
      pageWidth - 14,
      pageHeight - 8,
      { align: 'right' }
    );
  }

  const filename = `KSIA_Admin_Office_Audit_${report.zoneId ? report.zoneId.replace(/\s+/g, '_') : 'HQ'}_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`;
  doc.save(filename);
};
