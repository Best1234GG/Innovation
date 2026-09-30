import React from 'react';
import { X, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

interface PaperWireframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreenIndex: number;
  onSelectScreen: (index: number) => void;
}

const WIREFRAME_PAGES = [
  {
    page: 1,
    title: 'หน้า 1: หน้าแรกค้นหา & แผนที่ (Home, Map & Quick Book)',
    elements: [
      'Avatar ผู้ใช้: Somchai (สมชาย) + ไอคอนแจ้งเตือน',
      'ช่องค้นหา: [ 🔍 search ] ค้นหาตึกหรือคณะในมหาวิทยาลัย',
      'แผนที่ลานจอด (Campus Map) พร้อมหมุดตำแหน่ง',
      'ตัวกรองสถานะ: O Free (ว่าง) / O Full (เต็ม)',
      'ปุ่ม Quick Book (จองที่จอดด่วนทันที)',
    ],
  },
  {
    page: 2,
    title: 'หน้า 2: เลือกช่องจอด & ล็อค (Slot Grid, Lock & Confirm)',
    elements: [
      'ตารางช่องจอดรถ (Grid Slots): ช่องที่มีแถบลายคือช่องไม่ว่าง (Occupied)',
      'ช่องว่างสามารถแตะเพื่อเลือกได้ (Selected: A12)',
      'ปุ่ม Lock (ล็อคช่องจอดชั่วคราว 5 นาที)',
      'ปุ่ม Confirm (ยืนยันการจองเพื่อออกบัตรผ่าน)',
    ],
  },
  {
    page: 3,
    title: 'หน้า 3: QR Code บัตรผ่าน & นำทาง (QR Pass & Navigate)',
    elements: [
      'QR Code ประจำการจองสำหรับสแกนเปิดไม้กั้นลานจอด',
      'ระบุรหัสช่องจอดขนาดใหญ่: A12',
      'ข้อมูลป้ายทะเบียนและเวลาเข้าจอด',
      'ปุ่ม Navigate (เริ่มระบบนำทางเลี้ยวต่อเลี้ยวไปยังช่อง A12)',
    ],
  },
  {
    page: 4,
    title: 'หน้า 4: Parking Ring นับเวลา & SOS (Timer Ring & SOS)',
    elements: [
      'หัวข้อหลัก: Parking ring',
      'วงแหวนเวลานับถอยหลัง: 1H 45M Left (แสดงเวลาจอดที่เหลือ)',
      'ไอคอนรูปรถ 🚗 พร้อมรหัสช่อง A12',
      'ปุ่ม SOS (แจ้งเหตุฉุกเฉิน ส่งสัญญาณขอความช่วยเหลือ รปภ. มหาวิทยาลัย)',
    ],
  },
];

export const PaperWireframeModal: React.FC<PaperWireframeModalProps> = ({
  isOpen,
  onClose,
  activeScreenIndex,
  onSelectScreen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                ภาพร่างต้นฉบับ (Low-Fi Paper Prototype)
              </h3>
              <p className="text-xs text-slate-500">
                จากกิจกรรม Mini-Workshop ออกแบบแอปพลิเคชันจองที่จอดรถในมหาวิทยาลัยแบบเร่งด่วน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {WIREFRAME_PAGES.map((wf, idx) => {
            const isCurrent = activeScreenIndex === idx + 1;
            return (
              <div
                key={wf.page}
                onClick={() => {
                  onSelectScreen(idx + 1);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                    หน้าที่ {wf.page}
                  </span>
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-blue-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> หน้าจอที่เปิดอยู่
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">{wf.title}</h4>
                <ul className="space-y-1 text-xs text-slate-600">
                  {wf.elements.map((el, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">&bull;</span>
                      <span>{el}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>
            ระบบได้แปลงภาพร่างดินสอ/ปากกานี้ให้กลายเป็น UI ดิจิทัลแบบ High-Fidelity
            ที่สามารถกดโต้ตอบได้จริง เชื่อมต่อฐานข้อมูล <strong>Google Sheets</strong> เรียบร้อยแล้ว!
          </span>
        </div>
      </div>
    </div>
  );
};
