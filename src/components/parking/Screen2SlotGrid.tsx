import React, { useState, useEffect } from 'react';
import {
  Lock,
  CheckCircle,
  Car,
  Clock,
  ArrowLeft,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface Screen2SlotGridProps {
  onBack: () => void;
  onLockSlot: (slotId: string) => void;
  onConfirmBooking: (slotId: string, durationMinutes: number) => void;
  isSavingToSheet: boolean;
}

interface ParkingSlot {
  id: string;
  isOccupied: boolean;
  isEV?: boolean;
}

const INITIAL_SLOTS: ParkingSlot[] = [
  { id: 'A10', isOccupied: false },
  { id: 'A11', isOccupied: true },
  { id: 'A12', isOccupied: false }, // Target slot from sketch!
  { id: 'B10', isOccupied: true },
  { id: 'B11', isOccupied: false },
  { id: 'B12', isOccupied: false },
  { id: 'C10', isOccupied: false },
  { id: 'C11', isOccupied: false },
  { id: 'C12', isOccupied: true },
];

export const Screen2SlotGrid: React.FC<Screen2SlotGridProps> = ({
  onBack,
  onLockSlot,
  onConfirmBooking,
  isSavingToSheet,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('A12');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockSecondsLeft, setLockSecondsLeft] = useState<number>(300); // 5 min lock
  const [duration, setDuration] = useState<number>(105); // 1 hr 45 min (105 mins) matching sketch!

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockSecondsLeft > 0) {
      timer = setInterval(() => {
        setLockSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockSecondsLeft]);

  const handleToggleLock = () => {
    if (!isLocked) {
      setIsLocked(true);
      setLockSecondsLeft(300);
      onLockSlot(selectedSlot);
    } else {
      setIsLocked(false);
    }
  };

  const formatLockTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
          <h2 className="text-base font-extrabold text-slate-900">
            เลือกช่องจอดรถ (Floor 2)
          </h2>
          <p className="text-xs text-slate-500">อาคารเรียนรวม 3 &bull; โซน A</p>
        </div>
        <div className="w-9" />
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col">
        {/* Status legend */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md border-2 border-slate-300 bg-white" />
            <span>ว่าง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-300 relative overflow-hidden">
              <span className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#94a3b8,#94a3b8_2px,transparent_2px,transparent_4px)]" />
            </span>
            <span>ไม่ว่าง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-blue-600" />
            <span>เลือกอยู่</span>
          </div>
        </div>

        {/* 3x3 Parking Grid from Sketch (Page 2) */}
        <div className="p-4 rounded-3xl bg-slate-100/90 border border-slate-200/80 shadow-inner flex-1 flex flex-col justify-center">
          <div className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span>&uarr; ทางเดินรถเข้า (Driveway In) &uarr;</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {INITIAL_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot.id;
              const isOccupied = slot.isOccupied;

              if (isOccupied) {
                return (
                  <div
                    key={slot.id}
                    title="ช่องจอดมีรถแล้ว"
                    className="h-24 rounded-2xl border-2 border-slate-300 bg-slate-200/80 relative flex flex-col items-center justify-center cursor-not-allowed overflow-hidden opacity-75"
                  >
                    {/* Diagonal hatch pattern matching sketch drawing */}
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(100,116,139,0.25),rgba(100,116,139,0.25)_4px,transparent_4px,transparent_8px)]" />
                    <Car className="w-6 h-6 text-slate-400 relative z-10" />
                    <span className="font-mono text-xs font-bold text-slate-500 relative z-10 mt-1">
                      {slot.id}
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-500/20 scale-102'
                      : 'border-white bg-white hover:border-blue-300 text-slate-700 shadow-2xs hover:shadow'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
                  )}
                  {isSelected && isLocked && (
                    <div className="absolute top-1.5 left-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                  )}
                  <Car
                    className={`w-6 h-6 ${
                      isSelected ? 'text-blue-600' : 'text-slate-300'
                    }`}
                  />
                  <span className="font-mono text-sm font-black mt-1">{slot.id}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">ว่าง</span>
                </button>
              );
            })}
          </div>

          <div className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3 flex items-center justify-center gap-2">
            <span>&darr; ทางเดินรถออก (Driveway Out) &darr;</span>
          </div>
        </div>

        {/* Selected Slot Information Bar */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
              {selectedSlot}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                ช่องจอด {selectedSlot} (ใกล้ลิฟต์ 15 เมตร)
              </div>
              <div className="text-[11px] text-slate-500">
                {isLocked ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ล็อคช่องนี้ไว้ {formatLockTimer(lockSecondsLeft)}
                  </span>
                ) : (
                  'กดปุ่ม Lock เพื่อจองล็อกช่องชั่วคราว'
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-blue-700">1 ชม. 45 นาที</span>
          </div>
        </div>

        {/* Action Buttons: [ Lock ] [ Confirm ] matching sketch Page 2 */}
        <div className="pt-2 grid grid-cols-2 gap-3 mt-auto">
          {/* Lock Button */}
          <button
            onClick={handleToggleLock}
            className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isLocked
                ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-inner'
                : 'border-slate-300 hover:border-slate-400 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isLocked ? `Locked (${formatLockTimer(lockSecondsLeft)})` : 'Lock (ล็อคช่อง)'}</span>
          </button>

          {/* Confirm Button */}
          <button
            onClick={() => onConfirmBooking(selectedSlot, duration)}
            disabled={isSavingToSheet}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSavingToSheet ? 'กำลังบันทึก...' : 'Confirm (ยืนยัน)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
