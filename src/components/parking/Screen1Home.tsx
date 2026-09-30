import React, { useState } from 'react';
import {
  Search,
  Bell,
  MapPin,
  Car,
  Zap,
  Navigation,
  CheckCircle,
  Building,
  Info,
} from 'lucide-react';

interface Screen1HomeProps {
  onQuickBook: (zoneId: string) => void;
  onSelectZone: (zoneId: string) => void;
}

export interface ParkingZone {
  id: string;
  name: string;
  buildingName: string;
  totalSlots: number;
  availableSlots: number;
  walkMinutes: number;
  isFree: boolean;
  coords: { x: number; y: number };
}

const ZONES_DATA: ParkingZone[] = [
  {
    id: 'zone-a',
    name: 'ลานจอดโซน A (อาคารเรียนรวม 3)',
    buildingName: 'อาคารเรียนรวม 3 (SC3)',
    totalSlots: 24,
    availableSlots: 8,
    walkMinutes: 2,
    isFree: true,
    coords: { x: 35, y: 40 },
  },
  {
    id: 'zone-b',
    name: 'ลานจอดโซน B (คณะวิศวกรรมศาสตร์)',
    buildingName: 'ตึกวิศวกรรมศาสตร์ 100 ปี',
    totalSlots: 30,
    availableSlots: 0,
    walkMinutes: 5,
    isFree: false,
    coords: { x: 70, y: 55 },
  },
  {
    id: 'zone-c',
    name: 'ลานจอดโซน C (หอสมุดกลาง & SCB)',
    buildingName: 'หอสมุดกลาง & ตึกวิทยาศาสตร์',
    totalSlots: 40,
    availableSlots: 15,
    walkMinutes: 4,
    isFree: true,
    coords: { x: 50, y: 25 },
  },
];

export const Screen1Home: React.FC<Screen1HomeProps> = ({
  onQuickBook,
  onSelectZone,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'free' | 'full'>('all');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-a');

  const filteredZones = ZONES_DATA.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.buildingName.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterMode === 'free') return matchesSearch && zone.isFree;
    if (filterMode === 'full') return matchesSearch && !zone.isFree;
    return matchesSearch;
  });

  const currentZone =
    ZONES_DATA.find((z) => z.id === selectedZoneId) || ZONES_DATA[0];

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col min-h-[640px] animate-in fade-in duration-300">
      {/* Top Bar: somchai profile + bell (matching sketch "O somchai ^") */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
              S
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">ยินดีต้อนรับ,</span>
              <span className="text-xs font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                นักศึกษา
              </span>
            </div>
            <div className="text-sm font-black text-slate-800 tracking-tight">
              somchai (สมชาย)
            </div>
          </div>
        </div>

        <button
          className="relative p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
          title="การแจ้งเตือน"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col">
        {/* Search Bar (matching sketch "[ 🔍 search ]") */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาตึกเรียน, อาคาร หรือคณะ..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs"
          />
        </div>

        {/* Interactive Campus Map View (matching sketch box with map roads and pins) */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-44 shadow-inner flex flex-col justify-between p-3">
          {/* Stylized SVG Map roads & contours */}
          <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
            <line x1="10%" y1="10%" x2="90%" y2="85%" stroke="#94a3b8" strokeWidth="6" strokeDasharray="4 4" />
            <line x1="80%" y1="15%" x2="20%" y2="85%" stroke="#cbd5e1" strokeWidth="8" />
            <path d="M 30,30 Q 150,120 300,50" fill="none" stroke="#60a5fa" strokeWidth="3" />
            <circle cx="35%" cy="40%" r="20" fill="#3b82f6" fillOpacity="0.15" />
            <circle cx="70%" cy="55%" r="20" fill="#ef4444" fillOpacity="0.15" />
            <circle cx="50%" cy="25%" r="20" fill="#10b981" fillOpacity="0.15" />
          </svg>

          {/* Map interactive pins */}
          <div className="relative z-10 w-full h-full pointer-events-auto">
            {ZONES_DATA.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    onSelectZone(zone.id);
                  }}
                  style={{ left: `${zone.coords.x}%`, top: `${zone.coords.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md transition-transform cursor-pointer ${
                    isSelected ? 'scale-110 ring-2 ring-blue-600' : 'hover:scale-105'
                  } ${
                    zone.isFree
                      ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                      : 'bg-red-600 text-white shadow-red-500/30'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{zone.id.replace('zone-', 'Zone ').toUpperCase()}</span>
                  <span className="text-[10px] opacity-90">({zone.availableSlots})</span>
                </button>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-600 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs">
            <span className="font-semibold flex items-center gap-1">
              <Navigation className="w-3 h-3 text-blue-600" /> มหาวิทยาลัย (Main Campus)
            </span>
            <span className="text-slate-500">แตะหมุดเพื่อดูข้อมูล</span>
          </div>
        </div>

        {/* Status Filter Chips (matching sketch "O Free  O Full") */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterMode('free')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterMode === 'free'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Free (ว่าง)
            </button>
            <button
              onClick={() => setFilterMode('full')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterMode === 'full'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Full (เต็ม)
            </button>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredZones.length} โซน
          </span>
        </div>

        {/* Selected Zone Highlight Info */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              {currentZone.buildingName}
            </div>
            <div className="text-[11px] text-blue-700 mt-0.5">
              เดินไปตึกเรียนเพียง {currentZone.walkMinutes} นาที &bull; โซน A ชั้น 2
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                currentZone.isFree
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {currentZone.isFree ? `ว่าง ${currentZone.availableSlots} ช่อง` : 'เต็มแล้ว'}
            </span>
          </div>
        </div>

        {/* Quick Book Button (matching sketch "[ Quick Book ]") */}
        <div className="pt-2 mt-auto">
          <button
            onClick={() => onQuickBook(selectedZoneId)}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Quick Book (จองช่องจอดด่วน)</span>
          </button>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            * ระบบจะค้นหาและจองช่องจอดที่ใกล้ตึกเรียนของคุณที่สุดให้ทันที
          </p>
        </div>
      </div>
    </div>
  );
};
