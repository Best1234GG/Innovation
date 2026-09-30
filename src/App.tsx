import React, { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  setCachedAccessToken,
} from './services/googleAuth';
import {
  getOrInitParkingSpreadsheet,
  fetchParkingBookings,
  appendParkingBooking,
  deleteParkingRecord,
  getOrInitSpreadsheet,
  fetchDietHistory,
  appendDietRecord,
  type SpreadsheetInfo,
  type ParkingBooking,
  type DietRecord,
} from './services/googleSheets';
import { Header } from './components/Header';
import { Screen1Home } from './components/parking/Screen1Home';
import { Screen2SlotGrid } from './components/parking/Screen2SlotGrid';
import { Screen3PassQR } from './components/parking/Screen3PassQR';
import { Screen4ParkingRing } from './components/parking/Screen4ParkingRing';
import { ParkingDatabaseTab } from './components/parking/ParkingDatabaseTab';
import { ParkingAiAssistant } from './components/parking/ParkingAiAssistant';
import { PaperWireframeModal } from './components/parking/PaperWireframeModal';
import { GoogleSheetsTab } from './components/GoogleSheetsTab';
import { CozeAgentTab } from './components/CozeAgentTab';
import { ConfirmationModal } from './components/ConfirmationModal';
import {
  Car,
  FileSpreadsheet,
  Bot,
  Layers,
  Utensils,
  BookOpen,
  AlertCircle,
  X,
  ChevronRight,
} from 'lucide-react';

type MainAppTab = 'parking' | 'parking_db' | 'parking_ai' | 'diet_generator' | 'guide';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainAppTab>('parking');
  const [parkingScreenIndex, setParkingScreenIndex] = useState<number>(1);
  const [selectedSlot, setSelectedSlot] = useState<string>('A12');
  const [isSavedInSheet, setIsSavedInSheet] = useState<boolean>(false);
  const [isSavingBooking, setIsSavingBooking] = useState<boolean>(false);
  const [isWireframeModalOpen, setIsWireframeModalOpen] = useState<boolean>(false);

  // Auth & Workspace Google Sheets State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState<boolean>(false);
  const [parkingSpreadsheet, setParkingSpreadsheet] = useState<SpreadsheetInfo | null>(null);
  const [parkingBookings, setParkingBookings] = useState<ParkingBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);
  const [appError, setAppError] = useState<string | null>(null);

  // Diet Module State (preserved)
  const [dietSpreadsheet, setDietSpreadsheet] = useState<SpreadsheetInfo | null>(null);
  const [dietRecords, setDietRecords] = useState<DietRecord[]>([]);

  // Destructive Delete Modal
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    rowIndex: number | null;
  }>({
    isOpen: false,
    rowIndex: null,
  });

  // Load parking bookings from Google Sheets
  const loadParkingBookings = useCallback(
    async (accessToken: string, targetSheet: SpreadsheetInfo) => {
      setIsLoadingBookings(true);
      try {
        const list = await fetchParkingBookings(
          accessToken,
          targetSheet.id,
          targetSheet.sheetTitle || 'Bookings'
        );
        setParkingBookings(list);
      } catch (err: any) {
        console.error('Error fetching parking bookings:', err);
      } finally {
        setIsLoadingBookings(false);
      }
    },
    []
  );

  // Init Google Sheets on auth
  const initializeSpreadsheets = useCallback(
    async (accessToken: string) => {
      try {
        const sheet = await getOrInitParkingSpreadsheet(accessToken);
        setParkingSpreadsheet(sheet);
        await loadParkingBookings(accessToken, sheet);
      } catch (err: any) {
        console.error('Failed to init parking spreadsheet:', err);
      }

      // Also background load diet spreadsheet
      try {
        const dSheet = await getOrInitSpreadsheet(accessToken);
        setDietSpreadsheet(dSheet);
        const rows = await fetchDietHistory(accessToken, dSheet.id, dSheet.sheetTitle || 'Sheet1');
        setDietRecords(rows);
      } catch (e) {
        // optional background
      }
    },
    [loadParkingBookings]
  );

  useEffect(() => {
    const unsubscribe = initAuth(
      async (authUser, authToken) => {
        setUser(authUser);
        setToken(authToken);
        setCachedAccessToken(authToken);
        await initializeSpreadsheets(authToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setParkingSpreadsheet(null);
        setParkingBookings([]);
      }
    );
    return () => unsubscribe();
  }, [initializeSpreadsheets]);

  const handleSignIn = async () => {
    setIsConnectingGoogle(true);
    setAppError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        await initializeSpreadsheets(result.accessToken);
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAppError('เข้าสู่ระบบ Google ไม่สำเร็จ: ' + (err.message || ''));
      }
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setParkingSpreadsheet(null);
      setParkingBookings([]);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Parking Workflow transitions
  const handleQuickBook = (zoneId: string) => {
    setSelectedSlot('A12');
    setParkingScreenIndex(2); // Jump to Screen 2
  };

  const handleLockSlot = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleConfirmBooking = async (slot: string, durationMinutes: number) => {
    setSelectedSlot(slot);
    setIsSavingBooking(true);

    const booking: ParkingBooking = {
      bookingId: `UNI-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: user?.displayName || 'somchai',
      licensePlate: '1กก 8899 กทม',
      zoneBuilding: 'อาคารเรียนรวม 3 (SC3) ชั้น 2',
      slotNumber: slot,
      startTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      duration: '1 ชม. 45 นาที',
      status: 'กำลังจอด (Active)',
    };

    let currentToken = token || (await getAccessToken());
    if (currentToken && parkingSpreadsheet) {
      try {
        await appendParkingBooking(
          currentToken,
          parkingSpreadsheet.id,
          parkingSpreadsheet.sheetTitle || 'Bookings',
          booking
        );
        setIsSavedInSheet(true);
        loadParkingBookings(currentToken, parkingSpreadsheet);
      } catch (err: any) {
        console.error('Save to sheet error:', err);
      }
    }

    setIsSavingBooking(false);
    setParkingScreenIndex(3); // Jump to Screen 3 (Pass QR)
  };

  const handleNavigate = () => {
    setParkingScreenIndex(4); // Jump to Screen 4 (Parking Ring)
  };

  const handleFinishParking = () => {
    setParkingScreenIndex(1); // Back to Home
  };

  // Delete parking booking row with user confirmation
  const promptDeleteBooking = async (rowIndex: number) => {
    setDeleteModalState({ isOpen: true, rowIndex });
  };

  const handleConfirmDelete = async () => {
    const rIndex = deleteModalState.rowIndex;
    setDeleteModalState({ isOpen: false, rowIndex: null });
    if (!rIndex || !parkingSpreadsheet) return;

    const currentToken = token || (await getAccessToken());
    if (!currentToken) return;

    try {
      await deleteParkingRecord(
        currentToken,
        parkingSpreadsheet.id,
        parkingSpreadsheet.sheetTitle || 'Bookings',
        rIndex
      );
      await loadParkingBookings(currentToken, parkingSpreadsheet);
    } catch (err: any) {
      setAppError('ไม่สามารถลบแถวใน Google Sheet ได้: ' + (err.message || ''));
    }
  };

  const openSpreadsheetUrl = () => {
    if (parkingSpreadsheet?.url) {
      window.open(parkingSpreadsheet.url, '_blank', 'noopener,noreferrer');
    }
  };


  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header
        user={user}
        spreadsheet={parkingSpreadsheet}
        isConnectingGoogle={isConnectingGoogle}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenSpreadsheet={openSpreadsheetUrl}
        onOpenWireframeModal={() => setIsWireframeModalOpen(true)}
      />

      {/* Global Error Alert Banner */}
      {appError && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 text-xs px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span className="flex-1">{appError}</span>
            <button onClick={() => setAppError(null)} className="text-red-400 hover:text-red-700 p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2.5 gap-2 no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('parking')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'parking'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>แอปจองที่จอดรถ (4 Screens)</span>
              </button>

              <button
                onClick={() => setActiveTab('parking_db')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'parking_db'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Sheets Database</span>
                {parkingBookings.length > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      activeTab === 'parking_db'
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {parkingBookings.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('parking_ai')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'parking_ai'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>AI ผู้ช่วยที่จอดรถ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* PARKING TAB (4 SCREENS INTERACTIVE PROTOTYPE) */}
        {activeTab === 'parking' && (
          <div className="space-y-6">
            {/* Screen Stepper Header matching the 4 pages of user's sketch */}
            <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2 max-w-md mx-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">
                สเต็ปหน้าจอ:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { idx: 1, label: '1. ค้นหา/แผนที่' },
                  { idx: 2, label: '2. เลือกช่อง' },
                  { idx: 3, label: '3. QR บัตรผ่าน' },
                  { idx: 4, label: '4. Parking ring' },
                ].map((s) => (
                  <button
                    key={s.idx}
                    onClick={() => setParkingScreenIndex(s.idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      parkingScreenIndex === s.idx
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen 1: Home & Search & Map */}
            {parkingScreenIndex === 1 && (
              <Screen1Home
                onQuickBook={handleQuickBook}
                onSelectZone={() => {}}
              />
            )}

            {/* Screen 2: Slot Grid & Lock & Confirm */}
            {parkingScreenIndex === 2 && (
              <Screen2SlotGrid
                onBack={() => setParkingScreenIndex(1)}
                onLockSlot={handleLockSlot}
                onConfirmBooking={handleConfirmBooking}
                isSavingToSheet={isSavingBooking}
              />
            )}

            {/* Screen 3: QR Code Pass & A12 & Navigate */}
            {parkingScreenIndex === 3 && (
              <Screen3PassQR
                slotId={selectedSlot}
                onBack={() => setParkingScreenIndex(2)}
                onNavigate={handleNavigate}
                savedInGoogleSheet={isSavedInSheet}
              />
            )}

            {/* Screen 4: Parking Ring & 1H 45M Left & SOS */}
            {parkingScreenIndex === 4 && (
              <Screen4ParkingRing
                slotId={selectedSlot}
                initialMinutes={105}
                onFinishParking={handleFinishParking}
                onBack={() => setParkingScreenIndex(3)}
              />
            )}
          </div>
        )}

        {/* PARKING DATABASE TAB */}
        {activeTab === 'parking_db' && (
          <ParkingDatabaseTab
            user={user}
            spreadsheet={parkingSpreadsheet}
            bookings={parkingBookings}
            isLoading={isLoadingBookings}
            onRefresh={async () => {
              if (token && parkingSpreadsheet) {
                await loadParkingBookings(token, parkingSpreadsheet);
              }
            }}
            onOpenSpreadsheet={openSpreadsheetUrl}
            onDeleteBooking={promptDeleteBooking}
            onSignIn={handleSignIn}
          />
        )}

        {/* PARKING AI ASSISTANT TAB */}
        {activeTab === 'parking_ai' && <ParkingAiAssistant />}

      </main>

      {/* Hand-Drawn Paper Wireframe Modal */}
      <PaperWireframeModal
        isOpen={isWireframeModalOpen}
        onClose={() => setIsWireframeModalOpen(false)}
        activeScreenIndex={parkingScreenIndex}
        onSelectScreen={(idx) => setParkingScreenIndex(idx)}
      />

      {/* Destructive Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        title="ยืนยันการลบรายการจองใน Google Sheet"
        message={`คุณต้องการลบแถวที่ ${deleteModalState.rowIndex} ออกจาก Google Sheet 'UniParking_Database' ใช่หรือไม่? ข้อมูลนี้จะถูกนำออกจากสเปรดชีตอย่างถาวร`}
        confirmLabel="ลบข้อมูล"
        cancelLabel="ยกเลิก"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ isOpen: false, rowIndex: null })}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            UniParking Express &bull; มหาวิทยาลัย (Mini-Workshop Prototype to High-Fi)
          </span>
          <span>Google Workspace Sheets API v4 &bull; 100% Free Database</span>
        </div>
      </footer>
    </div>
  );
}
