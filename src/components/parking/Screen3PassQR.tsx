import React, { useState } from 'react';
import {
  Navigation,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Car,
  Clock,
  MapPin,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';

interface Screen3PassQRProps {
  slotId: string;
  onBack: () => void;
  onNavigate: () => void;
  savedInGoogleSheet: boolean;
}

export const Screen3PassQR: React.FC<Screen3PassQRProps> = ({
  slotId = 'A12',
  onBack,
  onNavigate,
  savedInGoogleSheet,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStartNav = () => {
    setIsNavigating(true);
    setTimeout(() => {
      onNavigate();
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col min-h-[640px] animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-base font-extrabold text-slate-900">บัตรผ่านจอดรถ (Pass)</h2>
          <p className="text-xs text-slate-500">สแกนเปิดไม้กั้นอัตโนมัติ</p>
        </div>
        <button
          onClick={() => alert('คัดลอกลิงก์บัตรผ่านแล้ว')}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col items-center justify-center">
        {/* QR Code Container with Scanner Corners [  ] matching sketch Page 3 */}
        <div className="relative p-6 bg-white rounded-3xl border-2 border-slate-100 shadow-xl shadow-blue-500/5 flex flex-col items-center">
          {/* Scanner Corner Markers matching hand drawn corners */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-3 border-l-3 border-blue-600 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-3 border-r-3 border-blue-600 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-3 border-l-3 border-blue-600 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-3 border-r-3 border-blue-600 rounded-br-lg" />

          {/* High-Contrast Crisp SVG QR Code */}
          <div className="w-48 h-48 bg-white p-2 flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              shapeRendering="crispEdges"
            >
              {/* QR Finder patterns Top Left */}
              <rect x="5" y="5" width="25" height="25" fill="#1e293b" />
              <rect x="8" y="8" width="19" height="19" fill="#ffffff" />
              <rect x="11" y="11" width="13" height="13" fill="#1e293b" />

              {/* QR Finder patterns Top Right */}
              <rect x="70" y="5" width="25" height="25" fill="#1e293b" />
              <rect x="73" y="8" width="19" height="19" fill="#ffffff" />
              <rect x="76" y="11" width="13" height="13" fill="#1e293b" />

              {/* QR Finder patterns Bottom Left */}
              <rect x="5" y="70" width="25" height="25" fill="#1e293b" />
              <rect x="8" y="73" width="19" height="19" fill="#ffffff" />
              <rect x="11" y="76" width="13" height="13" fill="#1e293b" />

              {/* QR Data Matrix Bits (Unique Pattern) */}
              <rect x="35" y="8" width="6" height="6" fill="#2563eb" />
              <rect x="45" y="8" width="6" height="6" fill="#1e293b" />
              <rect x="55" y="12" width="6" height="6" fill="#2563eb" />
              <rect x="35" y="24" width="6" height="6" fill="#1e293b" />
              <rect x="47" y="26" width="6" height="6" fill="#2563eb" />
              <rect x="10" y="38" width="6" height="6" fill="#1e293b" />
              <rect x="22" y="38" width="6" height="6" fill="#2563eb" />
              <rect x="38" y="38" width="10" height="10" fill="#2563eb" />
              <rect x="55" y="38" width="6" height="6" fill="#1e293b" />
              <rect x="72" y="38" width="6" height="6" fill="#2563eb" />
              <rect x="84" y="38" width="6" height="6" fill="#1e293b" />
              <rect x="38" y="55" width="8" height="8" fill="#1e293b" />
              <rect x="52" y="55" width="8" height="8" fill="#2563eb" />
              <rect x="66" y="55" width="6" height="6" fill="#1e293b" />
              <rect x="38" y="72" width="6" height="6" fill="#2563eb" />
              <rect x="48" y="72" width="6" height="6" fill="#1e293b" />
              <rect x="60" y="72" width="6" height="6" fill="#2563eb" />
              <rect x="75" y="72" width="8" height="8" fill="#1e293b" />
              <rect x="85" y="82" width="6" height="6" fill="#2563eb" />
            </svg>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] font-mono text-slate-400 tracking-wider">
              PASS-ID: UNI-2026-A12
            </span>
          </div>
        </div>

        {/* Big Slot Badge "A 12" matching sketch */}
        <div className="text-center space-y-1">
          <div className="text-xs uppercase font-extrabold text-blue-600 tracking-widest">
            ช่องจอดที่ได้รับการจัดสรร
          </div>
          <div className="text-5xl font-black text-slate-900 tracking-tight font-mono">
            {slotId}
          </div>
          <p className="text-xs text-slate-500">
            อาคารเรียนรวม 3 &bull; ชั้น 2 ลานจอดในร่ม
          </p>
        </div>

        {/* Details Card */}
        <div className="w-full bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-600" /> ทะเบียนรถ:
            </span>
            <span className="font-bold text-slate-800">1กก 8899 กทม (Somchai)</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> เวลาที่เริ่มจอด:
            </span>
            <span className="font-bold text-slate-800">1 ชม. 45 นาที (ฟรี)</span>
          </div>
          {savedInGoogleSheet && (
            <div className="flex items-center justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> สถานะ Google Sheets:
              </span>
              <span>บันทึกแถวแล้ว &check;</span>
            </div>
          )}
        </div>

        {/* Navigate Button matching sketch "[ Navigate ]" */}
        <div className="w-full pt-2 mt-auto">
          <button
            onClick={handleStartNav}
            disabled={isNavigating}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Navigation className={`w-4 h-4 ${isNavigating ? 'animate-bounce' : ''}`} />
            <span>{isNavigating ? 'กำลังเริ่มระบบนำทาง...' : 'Navigate (นำทางไปยังช่อง A12)'}</span>
          </button>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            ระบบจะคำนวณเส้นทางและเปิดหน้าต่าง Parking Ring ติดตามเวลา
          </p>
        </div>
      </div>
    </div>
  );
};
