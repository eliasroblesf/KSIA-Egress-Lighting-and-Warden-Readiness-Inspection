/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ClipboardCheck, 
  History, 
  Plus, 
  Save, 
  FileText, 
  Camera, 
  Trash2, 
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Share2,
  WifiOff,
  Building2,
  User,
  Award,
  HelpCircle,
  Lightbulb,
  Search,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { 
  InspectionReport, 
  ChecklistItem, 
  InspectionStatus, 
  SeverityLevel, 
  CorrectiveAction,
  InspectorProfile 
} from './types';
import { CHECKLIST_TEMPLATE } from './data/checklist';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { generatePDF } from './utils/pdf';
import { PWAInstallButton } from './components/PWAInstallButton';
import { SplashScreen } from './components/SplashScreen';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Hooks ---

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// --- Components ---

const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-black text-white shadow-2xl border-2 border-white animate-bounce">
      <WifiOff className="w-4 h-4" />
      OFFLINE MODE · WORKING LOCALLY
    </div>
  );
};

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'emerald', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-700 text-white hover:bg-blue-800 shadow-sm',
      secondary: 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-sm',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100',
      emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);

const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <label className={cn('text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block', className)}>
    {children}
  </label>
);

// --- Presets for KSIA Administrative Offices ---
const ADMIN_FACILITIES = [
  'KSIA HQ Tower A (Executive & Legal)',
  'KSIA HQ Tower B (HR & Talent Wing)',
  'KSIA HQ Tower C (Finance & Procurement)',
  'KSIA Corporate Training Annex',
  'Shared Corporate Services Building',
  'Facilities Management & Support Complex'
];

const ADMIN_FLOORS = [
  'Ground Floor - Reception & Security',
  'Level 1 - Public Affairs & Visitor Suite',
  'Level 2 - HR & Shared Services',
  'Level 3 - Finance & Procurement',
  'Level 4 - Legal Affairs & Internal Audit',
  'Level 5 - Executive Suite & Boardrooms',
  'Lower Ground - Archives & Central IT'
];

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [reports, setReports] = useState<InspectionReport[]>([]);
  const [currentReport, setCurrentReport] = useState<InspectionReport | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(-1); // -1: Header, 0-2: Modules, 3: CAP, 4: Final
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // User Profile / Gatekeeper State
  const [inspectorProfile, setInspectorProfile] = useState<InspectorProfile | null>(null);
  const [splashPassed, setSplashPassed] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Load profile and reports from storage on start
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('ksia_active_inspector');
      if (savedProfile) {
        setInspectorProfile(JSON.parse(savedProfile));
      }

      const savedReports = localStorage.getItem('ksia_reports');
      if (savedReports) {
        setReports(JSON.parse(savedReports));
      }
    } catch (e) {
      console.error('Failed to load initial local data', e);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const saveReports = useCallback((updatedReports: InspectionReport[]) => {
    setReports(updatedReports);
    localStorage.setItem('ksia_reports', JSON.stringify(updatedReports));
  }, []);

  const handleProfileSubmit = (profile: InspectorProfile) => {
    setInspectorProfile(profile);
    localStorage.setItem('ksia_active_inspector', JSON.stringify(profile));
    setSplashPassed(true);
    setShowProfileModal(false);

    // If currently editing a report, update its inspector details
    if (currentReport) {
      setCurrentReport({
        ...currentReport,
        leadInspector: profile.fullName,
        staffId: profile.employeeId,
        department: profile.department,
        phoneExt: profile.contactNumber || currentReport.phoneExt
      });
    }
  };

  const createNewReport = () => {
    if (!inspectorProfile) {
      setShowProfileModal(true);
      return;
    }

    const newReport: InspectionReport = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDraft: true,
      
      // Administrative Office Location Defaults
      facility: 'KSIA HQ Tower A (Executive & Legal)',
      zoneId: 'HQ-ZN-03 (Admin West)',
      floor: 'Level 3 - Finance & Procurement',
      concourse: 'West Administrative Corridor',
      officeWing: 'West Administrative Corridor',
      department: inspectorProfile.department || 'Human Resources & Talent Directorate',
      roomNumbers: 'Suites 301-325 & Main Hallway',
      
      // Inspector Credentials
      leadInspector: inspectorProfile.fullName,
      staffId: inspectorProfile.employeeId,
      badgeId: `BDG-${inspectorProfile.employeeId.slice(-4) || '8492'}`,
      deputyWarden: 'Appointed Floor Deputy',
      
      // Audit Context
      inspectionDate: format(new Date(), 'yyyy-MM-dd'),
      shift: 'Morning',
      auditType: 'Egress, Lighting & Warden Readiness',
      safetyOfficer: 'Capt. Mansour Al-Harbi (HQ HSE)',
      radioChannel: 'Ch 03 - Admin Safety Net',
      phoneExt: inspectorProfile.contactNumber || 'Ext. 8420',

      // ISO 9001 & ISO 45001 Compliance
      workersConsulted: true,
      consultationDetails: 'Consulted with floor supervisor & 4 office occupants during walkthrough',
      hazardAssessmentRef: `RA-KSIA-HQ-${format(new Date(), 'yyyy')}-01`,
      qualityStandardRef: 'ISO 9001:2015 Cl. 7.1.3 & 8.5.1 Control of Infrastructure',
      documentControlId: `KSIA-HQ-EGR-${format(new Date(), 'yyyyMMdd')}`,

      // Section 2.2 Modules
      modules: JSON.parse(JSON.stringify(CHECKLIST_TEMPLATE)),
      correctiveActions: [],

      // Sign-off
      leadSignatory: inspectorProfile.fullName,
      areaManagerSignatory: 'Eng. Fahad Al-Otaibi (Corporate Facilities Director)',
      chiefSignatory: 'Dr. Elias Robles Fernandez (HSE & Quality Audit Lead)'
    };

    setCurrentReport(newReport);
    setActiveModuleIndex(-1);
    setView('form');
  };

  const handleSave = () => {
    if (!currentReport) return;
    const updatedReport = { ...currentReport, updatedAt: new Date().toISOString() };
    const existingIndex = reports.findIndex(r => r.id === updatedReport.id);
    let newReports: InspectionReport[];
    if (existingIndex > -1) {
      newReports = [...reports];
      newReports[existingIndex] = updatedReport;
    } else {
      newReports = [updatedReport, ...reports];
    }
    saveReports(newReports);
    setCurrentReport(updatedReport);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this office inspection report? This cannot be undone.')) {
      const updatedReports = reports.filter(r => r.id !== id);
      saveReports(updatedReports);
    }
  };

  const openReport = (report: InspectionReport) => {
    setCurrentReport(JSON.parse(JSON.stringify(report)));
    setActiveModuleIndex(-1);
    setView('form');
  };

  const updateReportField = (field: keyof InspectionReport, value: any) => {
    if (!currentReport) return;
    setCurrentReport({ ...currentReport, [field]: value });
  };

  const updateModuleItem = (moduleIndex: number, itemIndex: number, updates: Partial<ChecklistItem>) => {
    if (!currentReport) return;
    const newModules = [...currentReport.modules];
    newModules[moduleIndex].items[itemIndex] = {
      ...newModules[moduleIndex].items[itemIndex],
      ...updates
    };
    
    // Manage Corrective Action Plan (CAP) dynamically when an item fails
    let newCAP = [...currentReport.correctiveActions];
    const item = newModules[moduleIndex].items[itemIndex];
    
    if (item.status === 'F' && updates.status === 'F') {
      const exists = newCAP.find(ca => ca.id === item.id);
      if (!exists) {
        newCAP.push({
          id: item.id,
          location: item.location || currentReport.roomNumbers || 'Office Corridor',
          defect: item.finding || `${item.item}: Non-conformance detected`,
          severity: item.severity || 'L2',
          containment: 'Immediate containment: notified floor manager and placed hazard flag',
          rootCause: 'Wear & tear or unauthorized obstruction',
          preventiveAction: 'Include in monthly warden physical audit schedule',
          owner: 'Corporate Facilities & Workplace Support',
          targetSla: item.severity === 'L3' ? 'Immediate (< 4 Hrs)' : '24 Hours',
          signOff: ''
        });
      }
    } else if (updates.status && updates.status !== 'F') {
      newCAP = newCAP.filter(ca => ca.id !== item.id);
    }

    setCurrentReport({ ...currentReport, modules: newModules, correctiveActions: newCAP });
  };

  const updateCAP = (index: number, updates: Partial<CorrectiveAction>) => {
    if (!currentReport) return;
    const newCAP = [...currentReport.correctiveActions];
    newCAP[index] = { ...newCAP[index], ...updates };
    setCurrentReport({ ...currentReport, correctiveActions: newCAP });
  };

  const handlePhotoCapture = (moduleIndex: number, itemIndex: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const currentPhotos = currentReport?.modules[moduleIndex].items[itemIndex].photos || [];
      updateModuleItem(moduleIndex, itemIndex, { photos: [...currentPhotos, base64] });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (moduleIndex: number, itemIndex: number, photoIndex: number) => {
    const currentPhotos = currentReport?.modules[moduleIndex].items[itemIndex].photos || [];
    const newPhotos = [...currentPhotos];
    newPhotos.splice(photoIndex, 1);
    updateModuleItem(moduleIndex, itemIndex, { photos: newPhotos });
  };

  const handleExportPDF = async () => {
    if (!currentReport) return;
    await generatePDF(currentReport);
  };

  // Always show splash screen gatekeeper on initial visit or when profile editing is requested
  if (!isInitializing && (!splashPassed || showProfileModal)) {
    return (
      <SplashScreen
        initialProfile={inspectorProfile}
        onContinue={handleProfileSubmit}
        onCancel={splashPassed ? () => setShowProfileModal(false) : undefined}
        isEditing={showProfileModal && !!inspectorProfile}
      />
    );
  }

  // Filtered reports for search
  const filteredReports = reports.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.facility?.toLowerCase().includes(q) ||
      r.zoneId?.toLowerCase().includes(q) ||
      r.floor?.toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q) ||
      r.leadInspector?.toLowerCase().includes(q)
    );
  });

  // Calculate high level dashboard metrics
  const totalAudits = reports.length;
  const recentAuditsCount = reports.filter(r => !r.isDraft).length;
  const totalOpenActions = reports.reduce((acc, r) => acc + (r.correctiveActions?.length || 0), 0);

  // --- Rendering Dashboard ---
  const renderDashboard = () => (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* Top Corporate Header */}
      <header className="bg-white rounded-3xl p-6 md:p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              KSIA Administrative Headquarters
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              ISO 9001 · ISO 45001 · OSHA
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Office Egress & Warden Readiness
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">
            Section 2.2 Inspection System · Specially designed for KSIA Corporate Office Wings & Administrative Towers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <PWAInstallButton />
          <Button onClick={createNewReport} className="h-12 px-6 text-sm font-bold shadow-md shadow-blue-700/20">
            <Plus className="w-5 h-5" />
            Start Office Inspection
          </Button>
        </div>
      </header>

      {/* Logged-in Inspector Profile Bar */}
      {inspectorProfile && (
        <div className="bg-gradient-to-r from-slate-900 via-[#0A2540] to-slate-900 rounded-2xl p-4 md:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-black text-lg shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{inspectorProfile.fullName}</h3>
                <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                  {inspectorProfile.employeeId}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {inspectorProfile.jobTitle || 'Appointed Floor Fire Warden'} · {inspectorProfile.department}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProfileModal(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Switch Inspector Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900">{totalAudits}</div>
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Office Audits Conducted</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{recentAuditsCount}</div>
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Formal Reports Logged</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">{totalOpenActions}</div>
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Identified Action Items</div>
          </div>
        </div>
      </div>

      {/* Audit History List */}
      <section className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-zinc-900">Office Inspection Records</h2>
            <span className="text-xs font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
              {filteredReports.length}
            </span>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by floor, zone or wing..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-16 text-center">
            <ClipboardCheck className="w-14 h-14 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-base font-bold text-zinc-800 mb-1">No Office Inspections Found</h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
              Start your walkthrough of the administrative suites, hallways, illuminated exit signs, and floor warden emergency kit.
            </p>
            <Button onClick={createNewReport} className="inline-flex">
              <Plus className="w-4 h-4" />
              Start First Inspection
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => openReport(report)}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-bold text-zinc-900 text-base">
                      {report.facility || 'KSIA HQ Tower'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-zinc-100 text-zinc-700">
                      {report.floor || 'Level 3'}
                    </span>
                    {report.isDraft ? (
                      <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wider">
                        Draft
                      </span>
                    ) : (
                      <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">
                        Certified Record
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1 text-zinc-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      {report.department || 'Corporate Directorate'}
                    </span>
                    <span aria-hidden="true" className="text-zinc-300">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {report.inspectionDate} ({report.shift} Shift)
                    </span>
                    <span aria-hidden="true" className="text-zinc-300">·</span>
                    <span>Inspector: <strong className="text-zinc-700">{report.leadInspector}</strong> (ID: {report.staffId})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      generatePDF(report);
                    }}
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>PDF</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleDelete(report.id); 
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-5 h-5 text-zinc-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ISO 9001 / ISO 45001 Corporate Standards Footnote */}
      <footer className="pt-6 border-t border-zinc-200/80 text-center space-y-2">
        <div className="flex flex-wrap justify-center items-center gap-3 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          <span>ISO 9001:2015 Quality Infrastructure</span>
          <span>•</span>
          <span>ISO 45001:2018 Life Safety</span>
          <span>•</span>
          <span>OSHA 29 CFR 1910.36/37/38</span>
          <span>•</span>
          <span>SBC 801 Saudi Fire Code</span>
        </div>
        <p className="text-xs text-zinc-400">
          King Salman International Airport · Corporate Administrative Headquarters · Official Egress & Warden Audit System
        </p>
      </footer>
    </div>
  );

  // --- Rendering Admin Header Form ---
  const renderFormHeader = () => (
    <div className="space-y-6">
      {/* Office Facility Card */}
      <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-700" />
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
            Administrative Headquarters Facility Selection
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Administrative Office Building / Wing</Label>
            <div className="flex flex-col gap-1.5">
              {ADMIN_FACILITIES.map(fac => (
                <button
                  type="button"
                  key={fac}
                  onClick={() => updateReportField('facility', fac)}
                  className={cn(
                    'px-3 py-2 text-xs font-semibold rounded-xl border text-left transition-all',
                    currentReport?.facility === fac
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                  )}
                >
                  {fac}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Office Floor / Level</Label>
              <select
                value={currentReport?.floor}
                onChange={e => updateReportField('floor', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
              >
                {ADMIN_FLOORS.map(fl => (
                  <option key={fl} value={fl}>{fl}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Administrative Department / Directorate</Label>
              <Input
                value={currentReport?.department}
                onChange={e => updateReportField('department', e.target.value)}
                placeholder="e.g. Human Resources & Talent Management"
              />
            </div>

            <div>
              <Label>Office Wing / Zone ID</Label>
              <Input
                value={currentReport?.zoneId}
                onChange={e => updateReportField('zoneId', e.target.value)}
                placeholder="e.g. HQ-ZN-03 (Admin West Corridor)"
              />
            </div>

            <div>
              <Label>Office Suites & Room Numbers Verified</Label>
              <Input
                value={currentReport?.roomNumbers}
                onChange={e => updateReportField('roomNumbers', e.target.value)}
                placeholder="e.g. Suites 301-325, Boardroom B, Main Corridor"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inspector Details (Filled from Splash Screen Profile) */}
      <div className="bg-white border border-zinc-200 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Inspector Credentials & Duty Assignment
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">
            Sourced from Inspector Profile
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Lead Office Inspector</Label>
            <Input
              value={currentReport?.leadInspector}
              onChange={e => updateReportField('leadInspector', e.target.value)}
            />
          </div>
          <div>
            <Label>Employee ID / Staff No.</Label>
            <Input
              value={currentReport?.staffId}
              onChange={e => updateReportField('staffId', e.target.value)}
            />
          </div>
          <div>
            <Label>Office Badge / Access Pass ID</Label>
            <Input
              value={currentReport?.badgeId}
              onChange={e => updateReportField('badgeId', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <Label>Inspection Date</Label>
            <Input
              type="date"
              value={currentReport?.inspectionDate}
              onChange={e => updateReportField('inspectionDate', e.target.value)}
            />
          </div>
          <div>
            <Label>Shift Time</Label>
            <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg">
              {['Morning', 'Afternoon', 'Night'].map((s: any) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateReportField('shift', s)}
                  className={cn(
                    'flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors',
                    currentReport?.shift === s ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Floor Deputy Warden</Label>
            <Input
              value={currentReport?.deputyWarden}
              onChange={e => updateReportField('deputyWarden', e.target.value)}
              placeholder="e.g. Tariq Al-Shehri"
            />
          </div>
        </div>
      </div>

      {/* ISO 9001 & ISO 45001 Quality & Safety Governance Box */}
      <div className="bg-blue-50/70 border border-blue-200/80 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-700" />
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-900">
            ISO 9001:2015 & ISO 45001:2018 Statutory Verification Controls
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="mb-0 text-blue-900">Worker Consultation & Feedback (Cl. 5.4)</Label>
              <button
                type="button"
                onClick={() => updateReportField('workersConsulted', !currentReport?.workersConsulted)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                  currentReport?.workersConsulted ? 'bg-blue-600' : 'bg-zinc-300'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    currentReport?.workersConsulted ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
            <Input
              value={currentReport?.consultationDetails}
              onChange={e => updateReportField('consultationDetails', e.target.value)}
              placeholder="e.g. Consulted with Floor Receptionist & 3 Department Managers"
              disabled={!currentReport?.workersConsulted}
            />
          </div>

          <div>
            <Label className="text-blue-900">Risk Assessment Registry Ref (ISO 45001 Cl. 6.1.2)</Label>
            <Input
              value={currentReport?.hazardAssessmentRef}
              onChange={e => updateReportField('hazardAssessmentRef', e.target.value)}
              placeholder="e.g. RA-KSIA-HQ-2026-01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // --- Rendering Checklist Module in Everyday Language with Standards ---
  const renderModule = (index: number) => {
    if (!currentReport) return null;
    const module = currentReport.modules[index];
    if (!module) return null;

    return (
      <div className="space-y-8">
        {/* Module Header & Plain Description */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-700 text-white px-2 py-0.5 rounded">
              SECTION {module.code}
            </span>
            <span className="text-xs font-bold text-blue-900">
              {module.title}
            </span>
          </div>
          <p className="text-sm text-blue-950 font-medium leading-relaxed mb-3">
            {module.plainDescription}
          </p>
          <div className="text-[11px] text-blue-800 font-mono bg-white/70 p-2.5 rounded-lg border border-blue-200">
            <strong>Standards Compliance:</strong> {module.statutoryRefs}
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-10">
          {module.items.map((item, itemIdx) => (
            <div 
              key={item.id} 
              className={cn(
                'rounded-2xl border p-6 transition-all',
                item.status === 'P' ? 'bg-white border-emerald-200' :
                item.status === 'F' ? 'bg-red-50/20 border-red-300' :
                item.status === 'N/A' ? 'bg-white border-amber-200' :
                'bg-white border-zinc-200'
              )}
            >
              {/* Plain Everyday Question as Hero Header */}
              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-black rounded bg-zinc-100 text-blue-700 border border-zinc-200">
                      {item.ref}
                    </span>
                    <h3 className="font-bold text-zinc-900 text-base md:text-lg">
                      {item.item}
                    </h3>
                  </div>

                  {/* Standards Tag */}
                  <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
                    {item.standardsRef}
                  </span>
                </div>

                {/* Everyday Conversation Question */}
                <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-xl flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
                      Everyday Question to Verify:
                    </span>
                    <p className="text-sm font-bold text-zinc-900 leading-snug">
                      "{item.plainQuestion}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Test Guide for Everyday Users */}
              <div className="mb-6 bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>How to Check (Step-by-Step Practical Test):</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.howToCheck}
                </p>

                {/* Quick Tips */}
                {item.quickTips && item.quickTips.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {item.quickTips.map((tip, tIdx) => (
                      <span key={tIdx} className="text-[11px] bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-600">
                        {tip}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons & Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* Status Column */}
                <div className="lg:col-span-4 space-y-4">
                  <Label>Verification Outcome</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateModuleItem(index, itemIdx, { status: 'P' })}
                      className={cn(
                        'flex-1 py-3 text-xs md:text-sm font-black rounded-xl border-2 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5',
                        item.status === 'P'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                          : 'bg-white border-zinc-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'
                      )}
                    >
                      <span>PASS</span>
                      <span className="text-[9px] font-normal opacity-90">Fully Compliant</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateModuleItem(index, itemIdx, { status: 'F' })}
                      className={cn(
                        'flex-1 py-3 text-xs md:text-sm font-black rounded-xl border-2 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5',
                        item.status === 'F'
                          ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20'
                          : 'bg-white border-zinc-200 text-red-700 hover:bg-red-50 hover:border-red-300'
                      )}
                    >
                      <span>FAIL</span>
                      <span className="text-[9px] font-normal opacity-90">Defect Found</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateModuleItem(index, itemIdx, { status: 'N/A' })}
                      className={cn(
                        'flex-1 py-3 text-xs md:text-sm font-black rounded-xl border-2 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-0.5',
                        item.status === 'N/A'
                          ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                          : 'bg-white border-zinc-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300'
                      )}
                    >
                      <span>N/A</span>
                      <span className="text-[9px] font-normal opacity-90">Not In Suite</span>
                    </button>
                  </div>

                  {/* If FAIL: 5x5 ISO 45001 Risk Evaluation */}
                  {item.status === 'F' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-black text-red-900 uppercase">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span>Defect Risk Scoring (ISO 45001)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-[10px] text-red-800">Likelihood (1-5)</Label>
                          <select
                            value={item.likelihood || ''}
                            onChange={e => updateModuleItem(index, itemIdx, { likelihood: Number(e.target.value) })}
                            className="w-full h-8 text-xs rounded border border-red-200 bg-white"
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Rare</option>
                            <option value="2">2 - Unlikely</option>
                            <option value="3">3 - Possible</option>
                            <option value="4">4 - Likely</option>
                            <option value="5">5 - Frequent</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-[10px] text-red-800">Consequence (1-5)</Label>
                          <select
                            value={item.consequence || ''}
                            onChange={e => updateModuleItem(index, itemIdx, { consequence: Number(e.target.value) })}
                            className="w-full h-8 text-xs rounded border border-red-200 bg-white"
                          >
                            <option value="">Select...</option>
                            <option value="1">1 - Minor</option>
                            <option value="2">2 - Low</option>
                            <option value="3">3 - Moderate</option>
                            <option value="4">4 - Major</option>
                            <option value="5">5 - Catastrophic</option>
                          </select>
                        </div>
                      </div>

                      {item.likelihood && item.consequence && (
                        <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-red-200 text-xs">
                          <span className="font-bold text-zinc-600">
                            Risk Index: <strong>{item.likelihood * item.consequence}</strong>
                          </span>
                          <span className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-black uppercase',
                            item.likelihood * item.consequence <= 4 ? 'bg-emerald-100 text-emerald-800' :
                            item.likelihood * item.consequence <= 9 ? 'bg-amber-100 text-amber-800' :
                            item.likelihood * item.consequence <= 15 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-600 text-white'
                          )}>
                            {item.likelihood * item.consequence <= 4 ? 'Low (L1)' :
                             item.likelihood * item.consequence <= 9 ? 'Medium (L2)' :
                             item.likelihood * item.consequence <= 15 ? 'High (L2)' : 'Critical (L3)'}
                          </span>
                        </div>
                      )}

                      {/* Legacy Severity Selection */}
                      <div>
                        <Label className="text-[10px] text-red-800">Severity Tier</Label>
                        <div className="flex gap-1.5">
                          {['L1', 'L2', 'L3'].map((sev: any) => (
                            <button
                              type="button"
                              key={sev}
                              onClick={() => updateModuleItem(index, itemIdx, { severity: sev })}
                              className={cn(
                                'flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer',
                                item.severity === sev 
                                  ? sev === 'L1' ? 'bg-amber-500 border-amber-600 text-white' :
                                    sev === 'L2' ? 'bg-orange-500 border-orange-600 text-white' :
                                    'bg-red-700 border-red-800 text-white'
                                  : 'bg-white border-red-200 text-red-800 hover:bg-red-100/50'
                              )}
                            >
                              {sev === 'L1' ? 'L1 Routine' : sev === 'L2' ? 'L2 High' : 'L3 Critical'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location & Finding Notes Column */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Specific Office Room / Corridor Location</Label>
                      <Input
                        value={item.location}
                        onChange={e => updateModuleItem(index, itemIdx, { location: e.target.value })}
                        placeholder="e.g. 3rd Floor East Stairwell Door #3B"
                      />
                    </div>
                    <div>
                      <Label>What Did You Observe? (Plain Notes)</Label>
                      <Input
                        value={item.finding}
                        onChange={e => updateModuleItem(index, itemIdx, { finding: e.target.value })}
                        placeholder="e.g. Closer arm loose; door sticks at 10cm before closing"
                      />
                    </div>
                  </div>

                  {/* Photo Evidence Section */}
                  <div>
                    <Label>Photographic Evidence (Offline Supported)</Label>
                    <div className="flex flex-wrap gap-3">
                      {item.photos.map((photo, pIdx) => (
                        <div key={pIdx} className="relative group w-20 h-20">
                          <img 
                            src={photo} 
                            alt="Evidence" 
                            className="w-full h-full object-cover rounded-xl border border-zinc-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index, itemIdx, pIdx)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Camera Button */}
                      <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50/40 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all active:scale-95">
                        <Camera className="w-6 h-6 text-blue-600" />
                        <span className="text-[9px] text-blue-700 mt-1 font-black uppercase">Camera</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={e => e.target.files?.[0] && handlePhotoCapture(index, itemIdx, e.target.files[0])}
                        />
                      </label>

                      {/* Gallery Button */}
                      <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 transition-all active:scale-95">
                        <Plus className="w-6 h-6 text-zinc-400" />
                        <span className="text-[9px] text-zinc-500 mt-1 font-black uppercase">Attach</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => e.target.files?.[0] && handlePhotoCapture(index, itemIdx, e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // --- Rendering Corrective Action Plan (CAP) ---
  const renderCAP = () => {
    if (!currentReport) return null;

    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="block text-sm mb-0.5">ISO 9001:2015 Clause 10.2 & ISO 45001 Clause 8.2 Protocol</strong>
            Every non-conformance identified during the office walkthrough is recorded below. Define the immediate containment step, assigned responsible owner, and expected resolution SLA.
          </div>
        </div>

        {currentReport.correctiveActions.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-emerald-200 rounded-3xl bg-emerald-50/20">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Zero Deficiencies Found!</h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              All office egress routes, emergency lights, and floor warden equipment are in full compliance with ISO 9001, ISO 45001, and OSHA standards.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentReport.correctiveActions.map((ca, idx) => (
              <div key={ca.id} className="p-6 rounded-2xl border border-zinc-200 space-y-4 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    ITEM REF: {ca.id}
                  </span>
                  <span className={cn(
                    'text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider',
                    ca.severity === 'L1' ? 'bg-amber-100 text-amber-800' :
                    ca.severity === 'L2' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  )}>
                    LEVEL {ca.severity?.substring(1) || '2'} NON-CONFORMANCE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Observed Defect</Label>
                    <p className="text-sm font-bold text-zinc-900">{ca.defect}</p>
                  </div>
                  <div>
                    <Label>Office Suite / Corridor Location</Label>
                    <p className="text-sm font-bold text-zinc-900">{ca.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <Label>Immediate Containment Action (Field Correction)</Label>
                    <Input
                      value={ca.containment}
                      onChange={e => updateCAP(idx, { containment: e.target.value })}
                      placeholder="e.g. Moved delivery boxes into storage room immediately"
                    />
                  </div>
                  <div>
                    <Label>Assigned Action Owner / Dept</Label>
                    <Input
                      value={ca.owner}
                      onChange={e => updateCAP(idx, { owner: e.target.value })}
                      placeholder="e.g. Corporate Facilities Directorate"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <Label>Target SLA Resolution Time</Label>
                    <Input
                      value={ca.targetSla}
                      onChange={e => updateCAP(idx, { targetSla: e.target.value })}
                      placeholder="e.g. 4 Hours / 24 Hours"
                    />
                  </div>
                  <div>
                    <Label>Re-Inspection Sign-Off</Label>
                    <Input
                      value={ca.signOff}
                      onChange={e => updateCAP(idx, { signOff: e.target.value })}
                      placeholder="e.g. Sarah Al-Ghamdi (Verified Closed)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- Rendering Summary & Final Sign-Off ---
  const renderSummary = () => {
    if (!currentReport) return null;

    let totalItems = 0;
    let compliant = 0;
    let failCount = 0;
    let critRisk = 0;
    let highRisk = 0;
    let medRisk = 0;
    let lowRisk = 0;

    currentReport.modules.forEach(m => {
      m.items.forEach(i => {
        if (i.status) {
          totalItems++;
          if (i.status === 'P') compliant++;
          if (i.status === 'F') {
            failCount++;
            const ri = (i.likelihood && i.consequence) ? i.likelihood * i.consequence : 0;
            if (ri >= 16 || i.severity === 'L3') critRisk++;
            else if (ri >= 10 || i.severity === 'L2') highRisk++;
            else if (ri >= 5) medRisk++;
            else lowRisk++;
          }
        }
      });
    });

    const complianceRate = totalItems > 0 ? Math.round((compliant / totalItems) * 100) : 100;

    return (
      <div className="space-y-10">
        {/* Executive Scorecard */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A2540] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6 mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                Executive Audit Scorecard
              </span>
              <h3 className="text-2xl font-black text-white">
                KSIA Administrative Offices Safety Rating
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold">Overall Index</div>
                <div className={cn(
                  'text-3xl font-black',
                  complianceRate >= 90 ? 'text-emerald-400' :
                  complianceRate >= 75 ? 'text-amber-400' : 'text-red-400'
                )}>
                  {complianceRate}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-400">Total Checks</div>
              <div className="text-xl font-black text-white mt-0.5">{totalItems}</div>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="text-xs text-emerald-400 font-bold">Compliant</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{compliant}</div>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="text-xs text-amber-400 font-bold">Medium (L1)</div>
              <div className="text-xl font-black text-amber-400 mt-0.5">{lowRisk + medRisk}</div>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="text-xs text-orange-400 font-bold">High (L2)</div>
              <div className="text-xl font-black text-orange-400 mt-0.5">{highRisk}</div>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="text-xs text-red-400 font-bold">Critical (L3)</div>
              <div className="text-xl font-black text-red-400 mt-0.5">{critRisk}</div>
            </div>
          </div>
        </div>

        {/* Formal Statutory Declaration */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-900">
            <Award className="w-4 h-4 text-blue-700" />
            <span>Formal Statutory & Quality Declaration</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            "I hereby certify that this systematic physical inspection was executed across the King Salman International Airport corporate administrative facilities in full conformance with ISO 9001:2015 (Clause 7.1.3 & 8.5.1), ISO 45001:2018 (Clause 8.1 & 8.2), OSHA 29 CFR 1910.36/37/38, and the Saudi Building Code (SBC 801). All non-conformances have been logged into the formal Corrective Action Plan for immediate facilities close-out."
          </p>
        </div>

        {/* Digital Signatories */}
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">
            Multi-Party Digital Signatories
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Lead Office Safety Inspector</Label>
              <Input
                value={currentReport.leadSignatory}
                onChange={e => updateReportField('leadSignatory', e.target.value)}
                placeholder="Printed Full Name"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                ID: {currentReport.staffId} (Digital Sign-off)
              </span>
            </div>

            <div>
              <Label>Floor Administrative Manager</Label>
              <Input
                value={currentReport.areaManagerSignatory}
                onChange={e => updateReportField('areaManagerSignatory', e.target.value)}
                placeholder="Manager Name"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Corporate Floor Authority
              </span>
            </div>

            <div>
              <Label>KSIA HSE & Quality Assurance Lead</Label>
              <Input
                value={currentReport.chiefSignatory}
                onChange={e => updateReportField('chiefSignatory', e.target.value)}
                placeholder="Quality Lead Name"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Formal Audit Endorsement
              </span>
            </div>
          </div>
        </div>

        {/* Big PDF Export Button */}
        <div className="pt-2">
          <Button
            onClick={handleExportPDF}
            className="w-full h-14 text-base font-bold bg-blue-700 hover:bg-blue-800 shadow-xl shadow-blue-700/20"
          >
            <Download className="w-5 h-5" />
            <span>Generate & Download Executive ISO 9001 / OSHA Report (PDF)</span>
          </Button>
        </div>
      </div>
    );
  };

  // --- Rendering Form Shell with Dynamic Nav ---
  const renderForm = () => {
    if (!currentReport) return null;

    const capIndex = currentReport.modules.length;
    const finalIndex = currentReport.modules.length + 1;

    const sections = [
      { id: -1, title: 'Office Info' },
      ...currentReport.modules.map((m, i) => ({ id: i, title: `Sec ${m.code}` })),
      { id: capIndex, title: 'CAP Plan' },
      { id: finalIndex, title: 'Sign-Off' }
    ];

    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setView('dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                  KSIA Admin Offices
                </span>
                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded">
                  {currentReport.floor}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-zinc-900 leading-tight truncate max-w-[200px] sm:max-w-md">
                {currentReport.facility}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">Save Draft</span>
            </Button>
            <Button size="sm" onClick={handleExportPDF}>
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export PDF</span>
            </Button>
          </div>
        </header>

        {/* Section Navigation Tabs */}
        <nav className="bg-white border-b border-zinc-200 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-4">
          <div className="flex items-center">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveModuleIndex(s.id)}
                className={cn(
                  'px-4 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 relative -mb-[2px] cursor-pointer',
                  activeModuleIndex === s.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-600'
                )}
              >
                {s.title}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content Form */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-zinc-200">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-zinc-900 mb-1">
                {activeModuleIndex === -1 ? 'Administrative Office Location & Inspector Setup' : 
                 activeModuleIndex === capIndex ? 'Corrective Action Plan (CAP) · ISO 9001:2015' :
                 activeModuleIndex === finalIndex ? 'Executive Audit Summary & Formal Close-Out' :
                 currentReport.modules[activeModuleIndex]?.title}
              </h2>
              {activeModuleIndex >= 0 && activeModuleIndex < currentReport.modules.length && (
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  Course Section 2.2 · Verified according to OSHA 1910, ISO 9001 & ISO 45001 Standards
                </p>
              )}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {activeModuleIndex === -1 && renderFormHeader()}
              {activeModuleIndex >= 0 && activeModuleIndex < currentReport.modules.length && renderModule(activeModuleIndex)}
              {activeModuleIndex === capIndex && renderCAP()}
              {activeModuleIndex === finalIndex && renderSummary()}
            </div>

            {/* Stepper Navigation */}
            <div className="mt-14 flex items-center justify-between pt-6 border-t border-zinc-100">
              <Button 
                variant="secondary" 
                onClick={() => setActiveModuleIndex(prev => prev - 1)}
                disabled={activeModuleIndex === -1}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Section</span>
              </Button>

              {activeModuleIndex < finalIndex ? (
                <Button 
                  onClick={() => setActiveModuleIndex(prev => prev + 1)}
                >
                  <span>Next Section</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  variant="emerald"
                  onClick={() => {
                    handleSave();
                    handleExportPDF();
                  }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Download PDF</span>
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-blue-100">
      {view === 'dashboard' ? renderDashboard() : renderForm()}
      <OfflineIndicator />
    </div>
  );
}
