import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import type { SpreadsheetInfo, DietRecord } from '../services/googleSheets';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Search,
  Trash2,
  PlusCircle,
  Database,
  Flame,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface GoogleSheetsTabProps {
  user: User | null;
  spreadsheet: SpreadsheetInfo | null;
  records: DietRecord[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onOpenSpreadsheet: () => void;
  onDeleteRecord: (rowIndex: number) => Promise<void>;
  onCreateNewSheet: () => Promise<void>;
  onSignIn: () => void;
}

export const GoogleSheetsTab: React.FC<GoogleSheetsTabProps> = ({
  user,
  spreadsheet,
  records,
  isLoading,
  onRefresh,
  onOpenSpreadsheet,
  onDeleteRecord,
  onCreateNewSheet,
  onSignIn,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);

  const filteredRecords = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.recommendedMenu.toLowerCase().includes(term) ||
      r.userIngredients.toLowerCase().includes(term) ||
      r.calories.toLowerCase().includes(term)
    );
  });

  const totalCaloriesSum = records.reduce((acc, r) => {
    const num = parseInt(r.calories.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? acc : acc + num;
  }, 0);

  const avgCalories = records.length > 0 ? Math.round(totalCaloriesSum / records.length) : 0;

  const handleCreateNew = async () => {
    setIsCreatingSheet(true);
    try {
      await onCreateNewSheet();
    } finally {
      setIsCreatingSheet(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          เชื่อมต่อ Google Sheets เพื่อใช้งานฐานข้อมูล
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          ระบบจะทำการสร้างหรือเชื่อมต่อไปยังไฟล์ Google Spreadsheet ที่ชื่อ{' '}
          <strong>Diet_AI_Database</strong> บน Google Drive ของคุณโดยอัตโนมัติ
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onSignIn}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-5 h-5" />
            เข้าสู่ระบบด้วย Google เพื่อเปิดฐานข้อมูล
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Spreadsheet Metadata */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-100/80 text-emerald-700">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {spreadsheet ? spreadsheet.name : 'กำลังค้นหาไฟล์ Diet_AI_Database...'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Google Sheets API v4
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ฐานข้อมูลบันทึกเมนูและแคลอรีตามเวิร์กโฟลว์ (คอลัมน์ User_Ingredients, AI_Menu, Calories)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            รีเฟรชข้อมูล
          </button>

          {spreadsheet && (
            <button
              onClick={onOpenSpreadsheet}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              เปิดใน Google Sheets
            </button>
          )}

          <button
            onClick={handleCreateNew}
            disabled={isCreatingSheet}
            title="สร้างสเปรดชีตใหม่อีกไฟล์"
            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>เมนูที่บันทึกทั้งหมด</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{records.length} เมนู</div>
          <p className="text-[11px] text-slate-400 mt-1">จาก Google Sheet ประจำตัวคุณ</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>แคลอรีเฉลี่ยต่อมื้อ</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {avgCalories} <span className="text-xs font-semibold text-slate-500">kcal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">คำนวณจากบันทึกในตาราง</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>บันทึกล่าสุด</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm font-bold text-slate-800 truncate mt-1">
            {records.length > 0 ? records[0].createdAt : '-'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {records.length > 0 ? records[0].recommendedMenu : 'ยังไม่มีข้อมูล'}
          </p>
        </div>
      </div>

      {/* Search and Table Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อเมนู, วัตถุดิบ, หรือแคลอรี..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="text-xs text-slate-500 self-center">
            แสดง {filteredRecords.length} จากทั้งหมด {records.length} แถว
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">เมนูอาหารที่แนะนำ (AI_Menu)</th>
                <th className="py-3 px-4">วัตถุดิบที่ป้อน (User_Ingredients)</th>
                <th className="py-3 px-4 w-28 text-center">แคลอรี (Calories)</th>
                <th className="py-3 px-4 hidden md:table-cell">วิธีทำอย่างย่อ</th>
                <th className="py-3 px-4 w-36">วันเวลาที่บันทึก</th>
                <th className="py-3 px-4 w-14 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {item.recommendedMenu}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="inline-block max-w-[200px] truncate" title={item.userIngredients}>
                        {item.userIngredients}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {item.calories}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">
                      <span className="inline-block max-w-[260px] truncate" title={item.instructions}>
                        {item.instructions}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {item.createdAt}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.rowIndex && (
                        <button
                          onClick={() => onDeleteRecord(item.rowIndex!)}
                          title="ลบแถวนี้ออกจาก Google Sheets"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-sm font-medium text-slate-600">
                        {searchTerm ? 'ไม่พบข้อมูลที่ตรงกับคำค้นหา' : 'ยังไม่มีข้อมูลบันทึกใน Google Sheets'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        ลองไปที่แท็บ "AI Diet Generator" เพื่อให้ AI คิดเมนูอาหารและบันทึกข้อมูล
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
