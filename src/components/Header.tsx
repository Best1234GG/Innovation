import React from 'react';
import type { User } from 'firebase/auth';
import type { SpreadsheetInfo } from '../services/googleSheets';
import {
  Car,
  FileSpreadsheet,
  ExternalLink,
  LogOut,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  user: User | null;
  spreadsheet: SpreadsheetInfo | null;
  isConnectingGoogle: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenSpreadsheet: () => void;
  onOpenWireframeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  spreadsheet,
  isConnectingGoogle,
  onSignIn,
  onSignOut,
  onOpenSpreadsheet,
  onOpenWireframeModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                UniParking Express
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                A12 &bull; Google Sheets
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              ระบบจองที่จอดรถในมหาวิทยาลัยแบบเร่งด่วน &bull; แปลงจาก Low-Fi Wireframe
            </p>
          </div>
        </div>

        {/* Right Actions: Wireframe toggle & Google Sign-In */}
        <div className="flex items-center gap-2.5">
          {/* Paper Wireframe button */}
          <button
            onClick={onOpenWireframeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200/80 transition-all cursor-pointer shadow-2xs"
            title="ดูภาพร่างแบบสเก็ตช์ 4 หน้าที่ผู้ใช้วาด"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">ดูภาพร่างต้นฉบับ</span> (Paper Prototype)
          </button>

          {spreadsheet && user && (   
            <button
              onClick={onOpenSpreadsheet}
              title="เปิด Google Sheets บนแท็บใหม่"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-800 text-xs font-medium transition-all border border-blue-200/70 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span className="max-w-[120px] truncate">{spreadsheet.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pr-2.5">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="hidden sm:block text-left text-xs max-w-[120px]">
                <div className="font-semibold text-slate-800 truncate">
                  {user.displayName || 'Somchai'}
                </div>
                <div className="text-slate-500 truncate text-[11px]">{user.email}</div>
              </div>
              <button
                onClick={onSignOut}
                title="ออกจากระบบ"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              disabled={isConnectingGoogle}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-slate-700 text-sm font-medium shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isConnectingGoogle ? 'กำลังเชื่อมต่อ...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
