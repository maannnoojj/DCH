import React from 'react';
import { ShieldAlert, FileCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Core Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          
          {/* Column 1 - Brand & Philosophy */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-sm font-bold text-white">
              DocConvert<span className="text-indigo-400">Hub</span>
            </span>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              Fast, free, and secure online document management. Your privacy is protected because all files are processed 100% locally inside your web browser. Nothing is ever uploaded to external servers.
            </p>
          </div>

          {/* Column 2 - Legal & Security */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Privacy & Security
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <span className="text-slate-400 font-medium">100% Client-Side Engine</span>
              </li>
              <li>
                <span className="text-slate-400 font-medium">Zero Server Data Leakage</span>
              </li>
              <li>
                <span className="text-slate-400 font-medium">No Registrations Needed</span>
              </li>
              <li>
                <span className="text-slate-400 font-medium">Instant File Destruction</span>
              </li>
            </ul>
          </div>

          {/* Column 3 - Supported Formats */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Supported Formats
            </h3>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li>PDF (.pdf)</li>
              <li>Word (.docx, .doc)</li>
              <li>Excel (.xlsx, .xls)</li>
              <li>PowerPoint (.pptx, .ppt)</li>
              <li>Images (.png, .jpg, .webp)</li>
              <li>Plain Text (.txt, .html)</li>
            </ul>
          </div>

          {/* Column 4 - Navigation / Help */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Information
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Help Center</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Contact Support</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} DocConvert Hub Inc. Open-source, browser-based sandbox engine.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" /> Secure Sandbox Verified
            </span>
            <span className="flex items-center gap-1">
              <FileCheck className="h-3.5 w-3.5 text-indigo-400" /> PDF-Lib Certified
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
