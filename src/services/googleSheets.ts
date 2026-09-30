/**
 * Google Sheets Service for University Parking & Diet AI Generator
 * Supports Google Workspace Sheets API v4
 */

export interface ParkingBooking {
  rowIndex?: number;
  bookingId: string;
  userName: string;
  licensePlate: string;
  zoneBuilding: string;
  slotNumber: string;
  startTime: string;
  duration: string;
  status: string;
}

export interface DietRecord {
  rowIndex?: number;
  userIngredients: string;
  recommendedMenu: string;
  calories: string;
  instructions: string;
  createdAt: string;
}

export interface SpreadsheetInfo {
  id: string;
  name: string;
  url: string;
  sheetTitle: string;
}

const DEFAULT_PARKING_SHEET_NAME = 'UniParking_Database';
const DEFAULT_DIET_SHEET_NAME = 'Diet_AI_Database';

/**
 * Searches user's Google Drive for existing spreadsheet
 */
export async function findExistingSpreadsheet(
  accessToken: string,
  sheetName = DEFAULT_PARKING_SHEET_NAME
): Promise<SpreadsheetInfo | null> {
  const query = encodeURIComponent(
    `name = '${sheetName}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
  );
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)&pageSize=5`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error searching drive:', errorText);
    return null;
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    const file = data.files[0];
    const sheetTitle = await getFirstSheetTitle(accessToken, file.id);
    return {
      id: file.id,
      name: file.name,
      url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
      sheetTitle,
    };
  }

  return null;
}

export async function getFirstSheetTitle(
  accessToken: string,
  spreadsheetId: string
): Promise<string> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return 'Sheet1';
  }

  const data = await response.json();
  const sheets = data.sheets || [];
  if (sheets.length > 0 && sheets[0].properties?.title) {
    return sheets[0].properties.title;
  }
  return 'Sheet1';
}

/**
 * Creates UniParking_Database in Google Sheets
 */
export async function createParkingSpreadsheet(
  accessToken: string,
  title = DEFAULT_PARKING_SHEET_NAME
): Promise<SpreadsheetInfo> {
  const payload = {
    properties: { title },
    sheets: [
      {
        properties: {
          title: 'Bookings',
          gridProperties: { frozenRowCount: 1 },
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: [
                  { userEnteredValue: { stringValue: 'Booking_ID' }, userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.15, green: 0.38, blue: 0.92 } } },
                  { userEnteredValue: { stringValue: 'User_Name' }, userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.15, green: 0.38, blue: 0.92 } } },
                  { userEnteredValue: { stringValue: 'License_Plate' }, userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.15, green: 0.38, blue: 0.92 } } },
                  { userEnteredValue: { stringValue: 'Zone_Building' }, userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.15, green: 0.38, blue: 0.92 } } },
                  { userEnteredValue: { stringValue: 'Slot_Number' }, userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.15, green: 0.38, blue: 0.92 } } },
                  { userEnteredValue: { stringValue: 'Start_Time' }, userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.15, green: 0.38, blue: 0.92 } } },
                  { userEnteredValue: { stringValue: 'Duration' }, userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.15, green: 0.38, blue: 0.92 } } },
                  { userEnteredValue: { stringValue: 'Status' }, userEnteredFormat: { textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }, backgroundColor: { red: 0.15, green: 0.38, blue: 0.92 } } },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to create parking sheet:', errorText);
    throw new Error('ไม่สามารถสร้าง Google Sheet: ' + response.statusText);
  }

  const result = await response.json();
  return {
    id: result.spreadsheetId,
    name: title,
    url: result.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${result.spreadsheetId}/edit`,
    sheetTitle: 'Bookings',
  };
}

export async function getOrInitParkingSpreadsheet(accessToken: string): Promise<SpreadsheetInfo> {
  const existing = await findExistingSpreadsheet(accessToken, DEFAULT_PARKING_SHEET_NAME);
  if (existing) return existing;
  return await createParkingSpreadsheet(accessToken, DEFAULT_PARKING_SHEET_NAME);
}

export async function appendParkingBooking(
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
  booking: ParkingBooking
): Promise<boolean> {
  const range = `${sheetTitle}!A:H`;
  const values = [
    [
      booking.bookingId,
      booking.userName,
      booking.licensePlate,
      booking.zoneBuilding,
      booking.slotNumber,
      booking.startTime,
      booking.duration,
      booking.status,
    ],
  ];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Append parking booking failed:', errorData);
    throw new Error(errorData.error?.message || 'ไม่สามารถบันทึกข้อมูลการจองลง Google Sheet ได้');
  }

  return true;
}

export async function fetchParkingBookings(
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string
): Promise<ParkingBooking[]> {
  const range = `${sheetTitle}!A2:H100`;
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const rows: any[][] = data.values || [];

  return rows
    .map((row, index) => ({
      rowIndex: index + 2,
      bookingId: row[0] || `BK-${index + 1}`,
      userName: row[1] || 'Somchai',
      licensePlate: row[2] || '-',
      zoneBuilding: row[3] || '-',
      slotNumber: row[4] || '-',
      startTime: row[5] || '-',
      duration: row[6] || '-',
      status: row[7] || 'Completed',
    }))
    .reverse();
}

export async function deleteParkingRecord(
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
  rowIndex: number
): Promise<boolean> {
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(sheetId,title))`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!metaRes.ok) throw new Error('ไม่สามารถตรวจสอบ Sheet ID ได้');

  const metaData = await metaRes.json();
  const targetSheet =
    metaData.sheets?.find((s: any) => s.properties?.title === sheetTitle) ||
    metaData.sheets?.[0];
  const sheetIdNum = targetSheet?.properties?.sheetId ?? 0;

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetIdNum,
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'ไม่สามารถลบแถวได้');
  }

  return true;
}

// ---------------- Diet AI Spreadsheet Support ---------------- //

export async function createDietSpreadsheet(
  accessToken: string,
  customName = DEFAULT_DIET_SHEET_NAME
): Promise<SpreadsheetInfo> {
  const payload = {
    properties: { title: customName },
    sheets: [
      {
        properties: { title: 'Sheet1', gridProperties: { frozenRowCount: 1 } },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: [
                  { userEnteredValue: { stringValue: 'User_Ingredients' } },
                  { userEnteredValue: { stringValue: 'Recommended_Menu' } },
                  { userEnteredValue: { stringValue: 'Calories' } },
                  { userEnteredValue: { stringValue: 'Instructions' } },
                  { userEnteredValue: { stringValue: 'Date_Time' } },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('ไม่สามารถสร้าง Sheet อาหารได้');
  }

  const result = await response.json();
  return {
    id: result.spreadsheetId,
    name: customName,
    url: result.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${result.spreadsheetId}/edit`,
    sheetTitle: 'Sheet1',
  };
}

export async function getOrInitSpreadsheet(accessToken: string): Promise<SpreadsheetInfo> {
  const existing = await findExistingSpreadsheet(accessToken, DEFAULT_DIET_SHEET_NAME);
  if (existing) return existing;
  return await createDietSpreadsheet(accessToken);
}

export async function appendDietRecord(
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
  record: DietRecord
): Promise<boolean> {
  const range = `${sheetTitle}!A:E`;
  const values = [
    [
      record.userIngredients,
      record.recommendedMenu,
      record.calories,
      record.instructions,
      record.createdAt || new Date().toLocaleString('th-TH'),
    ],
  ];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
    }
  );

  return response.ok;
}

export async function fetchDietHistory(
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string
): Promise<DietRecord[]> {
  const range = `${sheetTitle}!A2:E100`;
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) return [];
  const data = await response.json();
  const rows: any[][] = data.values || [];

  return rows
    .map((row, index) => ({
      rowIndex: index + 2,
      userIngredients: row[0] || '-',
      recommendedMenu: row[1] || '-',
      calories: row[2] || '-',
      instructions: row[3] || '-',
      createdAt: row[4] || '-',
    }))
    .reverse();
}

export async function deleteDietRecord(
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
  rowIndex: number
): Promise<boolean> {
  return deleteParkingRecord(accessToken, spreadsheetId, sheetTitle, rowIndex);
}
