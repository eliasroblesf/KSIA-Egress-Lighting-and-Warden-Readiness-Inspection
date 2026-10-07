/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  BadgeCheck, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Sparkles
} from 'lucide-react';
import { InspectorProfile } from '../types';

interface SplashScreenProps {
  initialProfile?: InspectorProfile | null;
  onContinue: (profile: InspectorProfile) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const KSIA_DEPARTMENTS = [
  'Human Resources & Talent Directorate',
  'Finance, Procurement & Corporate Accounts',
  'Legal Affairs & Regulatory Governance',
  'Internal Audit & Quality Management',
  'Executive Management & Board Secretariat',
  'Corporate Strategy & PMO',
  'Information Technology & Digital Systems',
  'Corporate Facilities & Workplace Support',
  'Corporate HSE & Environmental Safety',
  'Commercial Leasing & Concessions Admin',
  'General Administration & Office Services'
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  initialProfile,
  onContinue,
  onCancel,
  isEditing = false
}) => {
  const [fullName, setFullName] = useState(initialProfile?.fullName || '');
  const [employeeId, setEmployeeId] = useState(initialProfile?.employeeId || '');
  const [department, setDepartment] = useState(
    initialProfile?.department || 'Human Resources & Talent Directorate'
  );
  const [jobTitle, setJobTitle] = useState(initialProfile?.jobTitle || 'Appointed Floor Fire Warden');
  const [contactNumber, setContactNumber] = useState(initialProfile?.contactNumber || 'Ext. 8420');

  // Keep state in sync if initialProfile loads from storage
  React.useEffect(() => {
    if (initialProfile) {
      if (initialProfile.fullName) setFullName(initialProfile.fullName);
      if (initialProfile.employeeId) setEmployeeId(initialProfile.employeeId);
      if (initialProfile.department) setDepartment(initialProfile.department);
      if (initialProfile.jobTitle) setJobTitle(initialProfile.jobTitle);
      if (initialProfile.contactNumber) setContactNumber(initialProfile.contactNumber);
    }
  }, [initialProfile]);

  const isValid = fullName.trim().length >= 2 && employeeId.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const profile: InspectorProfile = {
      fullName: fullName.trim(),
      employeeId: employeeId.trim().toUpperCase(),
      department,
      jobTitle,
      contactNumber
    };

    onContinue(profile);
  };

  const handleQuickFill = () => {
    setFullName('Sarah Al-Ghamdi');
    setEmployeeId('KSIA-EMP-8492');
    setDepartment('Human Resources & Talent Directorate');
    setJobTitle('Appointed Floor Fire Warden');
    setContactNumber('Ext. 4120');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0A2540] to-slate-900 text-white flex flex-col justify-between p-4 md:p-8">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
      </div>

      {/* Top Bar with Standards Badges */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-black tracking-widest uppercase text-amber-400">
              King Salman International Airport
            </span>
            <h2 className="text-sm font-bold text-slate-200">
              Administrative Headquarters · Life Safety Portal
            </h2>
          </div>
        </div>

        {/* Rigorous Standards Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold">
          <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Award className="w-3 h-3 text-emerald-400" />
            ISO 9001:2015 Quality
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            ISO 45001:2018 Safety
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-amber-400" />
            OSHA 29 CFR 1910
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
            SBC 801 Fire Code
          </span>
        </div>
      </header>

      {/* Center Card */}
      <main className="relative z-10 max-w-xl mx-auto w-full my-8">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/60">
          {/* Welcome Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Course Section 2.2 · Office Readiness & Egress Verification
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              {isEditing ? 'Update Inspector Profile' : 'Inspector Name & Employee ID'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              Please enter your Full Name and Employee Number before continuing to the inspection. This information is required for the final ISO 9001, ISO 45001, and OSHA compliance audit report.
            </p>
          </div>

          {/* Identification Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Al-Ghamdi"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                This name will appear on the final ISO 9001 certified audit report.
              </p>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Employee ID / Staff Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. KSIA-EMP-8492"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all uppercase"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Your official King Salman International Airport employee or warden credential.
              </p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Administrative Office Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {KSIA_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900 text-white">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Title & Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Assigned Inspection Role
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Appointed Floor Fire Warden"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Office Phone Ext. / Desk
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. Ext. 8420"
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={!isValid}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.99] transition-all"
              >
                <span>{isEditing ? 'Save Profile Changes' : 'Continue to Inspection Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4 transition-colors"
                >
                  Auto-fill demo warden credentials
                </button>

                {isEditing && onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full text-center py-4 border-t border-slate-800 text-[11px] text-slate-400">
        <p>
          King Salman International Airport (KSIA) · Corporate Administrative Headquarters · ISO 9001:2015 & ISO 45001:2018 Registered System
        </p>
      </footer>
    </div>
  );
};
