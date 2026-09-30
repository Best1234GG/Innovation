import React, { useState, useEffect } from 'react';
import {
  Car,
  AlertOctagon,
  Clock,
  Plus,
  CheckCircle,
  PhoneCall,
  ShieldAlert,
  ArrowLeft,
  X,
  Volume2,
} from 'lucide-react';

interface Screen4ParkingRingProps {
  slotId?: string;
  initialMinutes?: number;
  onFinishParking: () => void;
  onBack: () => void;
}

export const Screen4ParkingRing: React.FC<Screen4ParkingRingProps> = ({
  slotId = 'A12',
  initialMinutes = 105, // 1h 45m = 105 minutes matching the sketch!
  onFinishParking,
  onBack,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialMinutes * 60);
  const [totalSeconds, setTotalSeconds] = useState<number>(initialMinutes * 60);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isSosTriggered, setIsSosTriggered] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTime = (minutes: number) => {
    const addSec = minutes * 60;
    setSecondsRemaining((prev) => prev + addSec);
    setTotalSeconds((prev) => prev + addSec);
  };

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  // Percentage for the SVG Parking Ring
  const progressPercent = totalSeconds > 0 ? (secondsRemaining / totalSeconds) * 100 : 0;
  const strokeDashoffset = 100 - progressPercent;

  const handleTriggerSos = () => {
    setIsSosTriggered(true);
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
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Parking ring
          </h2>
          <p className="text-xs text-slate-500">นับเวลาจอดรถแบบเรียลไทม์</p>
        </div>
        <div className="w-9" />
      </div>

      <div className="p-5 sm:p-6 space-y-6 flex-1 flex flex-col items-center justify-center">
        {/* The Animated "Parking Ring" (matching Page 4 sketch circle "1H 45M Left") */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Background Outer Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-slate-100"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Active Glowing Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="42"
              className="text-blue-600 transition-all duration-1000 ease-linear drop-shadow-sm"
              strokeWidth="6"
              strokeDasharray="264"
              strokeDashoffset={`${(strokeDashoffset / 100) * 264}`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Text (Exact phrase from drawing: "1H 45M Left") */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              {hours > 0 ? `${hours}H ${minutes}M` : `${minutes}M ${seconds}S`}
            </div>
            <div className="text-sm font-extrabold text-blue-600 tracking-wider uppercase mt-1">
              Left (เวลาคงเหลือ)
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {secondsRemaining > 0 ? `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}` : 'หมดเวลาจอดแล้ว'}
            </div>
          </div>
        </div>

        {/* Car Icon + Slot Badge: [🚗 A12] matching sketch Page 4 */}
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-50 border border-blue-200 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">
              ช่องจอดของคุณ
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">
              {slotId}
            </div>
          </div>
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            จอดอยู่
          </span>
        </div>

        {/* Quick Extend Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">เพิ่มเวลา:</span>
          <button
            onClick={() => handleAddTime(30)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            +30 นาที
          </button>
          <button
            onClick={() => handleAddTime(60)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            +1 ชั่วโมง
          </button>
        </div>

        {/* SOS Emergency Button (matching sketch Page 4 "[ SOS ]") */}
        <div className="w-full pt-2 mt-auto space-y-2">
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-lg tracking-widest shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-red-500"
          >
            <AlertOctagon className="w-6 h-6 animate-pulse" />
            <span>SOS (ขอความช่วยเหลือฉุกเฉิน)</span>
          </button>

          <button
            onClick={onFinishParking}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            เสร็จสิ้นการจอด / เช็คเอาท์ (Check-out)
          </button>
        </div>
      </div>

      {/* SOS Emergency Modal */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                แจ้งเหตุฉุกเฉินในลานจอด (SOS)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                พิกัด: อาคารเรียนรวม 3 ชั้น 2 ช่องจอด <strong>{slotId}</strong>
              </p>
            </div>

            {isSosTriggered ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-1">
                <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                <p className="font-bold">ส่งสัญญาณแจ้งศูนย์ รปภ. แล้ว!</p>
                <p>เจ้าหน้าที่กำลังเดินทางมายังช่อง {slotId} ภายใน 2-3 นาที</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-600 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-red-600" />
                  <span>สายด่วน รปภ. มหาวิทยาลัย: <strong>02-555-9999</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>ระบบส่งสัญญาณไฟและกล้องวงจรปิดจับภาพช่อง {slotId}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setIsSosModalOpen(false);
                  setIsSosTriggered(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>

              {!isSosTriggered && (
                <button
                  onClick={handleTriggerSos}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all cursor-pointer"
                >
                  กดยืนยันส่งสัญญาณ
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
