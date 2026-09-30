import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import type { SpreadsheetInfo, ParkingBooking } from '../../services/googleSheets';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Search,
  Trash2,
  Database,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ParkingDatabaseTabProps {
  user: User | null;
  spreadsheet: SpreadsheetInfo | null;
  bookings: ParkingBooking[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onOpenSpreadsheet: () => void;
  onDeleteBooking: (rowIndex: number) => Promise<void>;
  onSignIn: () => void;
}

export const ParkingDatabaseTab: React.FC<ParkingDatabaseTabProps> = ({
  user,
  spreadsheet,
  bookings,
  isLoading,
  onRefresh,
  onOpenSpreadsheet,
  onDeleteBooking,
  onSignIn,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.slotNumber.toLowerCase().includes(term) ||
      b.userName.toLowerCase().includes(term) ||
      b.licensePlate.toLowerCase().includes(term) ||
      b.zoneBuilding.toLowerCase().includes(term)
    );
  });

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          เชื่อมต่อ Google Sheets เพื่อดูฐานข้อมูลที่จอดรถ
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          ระบบจะบันทึกประวัติการจองและรหัสช่องจอด A12 ลงในไฟล์ Google Spreadsheet{' '}
          <strong>UniParking_Database</strong> ของคุณโดยอัตโนมัติ
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onSignIn}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-5 h-5" />
            เข้าสู่ระบบด้วย Google เพื่อเชื่อมต่อฐานข้อมูล
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                {spreadsheet ? spreadsheet.name : 'UniParking_Database'}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Google Sheets API v4
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ฐานข้อมูลบันทึกการจองช่องจอดรถในมหาวิทยาลัยแบบเรียลไทม์
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
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
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              เปิดใน Google Sheets
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>รายการจองทั้งหมด</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{bookings.length} รายการ</div>
          <p className="text-[11px] text-slate-400 mt-1">บันทึกบน Google Drive</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>ช่องจอดล่าสุด</span>
            <Car className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {bookings.length > 0 ? bookings[0].slotNumber : 'A12'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">อาคารเรียนรวม 3</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>สถานะล่าสุด</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-slate-800 truncate mt-1">
            {bookings.length > 0 ? bookings[0].status : 'พร้อมใช้งาน'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {bookings.length > 0 ? bookings[0].startTime : 'ไม่มีการจองค้างอยู่'}
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
              placeholder="ค้นหารหัสจอง, ช่องจอด, ป้ายทะเบียน..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500 self-center">
            แสดง {filteredBookings.length} จากทั้งหมด {bookings.length} รายการ
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">รหัสการจอง</th>
                <th className="py-3 px-4">ผู้ใช้งาน</th>
                <th className="py-3 px-4">ป้ายทะเบียน</th>
                <th className="py-3 px-4">สถานที่ &bull; ตึก</th>
                <th className="py-3 px-4 w-28 text-center">ช่องจอด</th>
                <th className="py-3 px-4">เวลาที่จอง</th>
                <th className="py-3 px-4 w-24 text-center">สถานะ</th>
                <th className="py-3 px-4 w-14 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {item.bookingId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {item.userName}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {item.licensePlate}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.zoneBuilding}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                        {item.slotNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {item.startTime}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status.includes('Active') || item.status.includes('กำลังจอด')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.rowIndex && (
                        <button
                          onClick={() => onDeleteBooking(item.rowIndex!)}
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
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-sm font-medium text-slate-600">
                        {searchTerm ? 'ไม่พบข้อมูลที่ตรงกับการค้นหา' : 'ยังไม่มีประวัติการจองใน Google Sheets'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        ลองกด "Quick Book" ในหน้าแรกเพื่อจองช่องจอดรถ A12 และบันทึกข้อมูล
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
