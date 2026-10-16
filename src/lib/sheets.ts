// SIVIKA - Solo Techno Park Google Sheets Parser
export interface JadwalKunjungan {
  id: string;
  no: string;
  rawDateTime: string;
  dateIso: string; // YYYY-MM-DD
  dateFormatted: string; // e.g. "Kamis, 12 November 2026"
  timeFormatted: string; // e.g. "13:00 - Selesai"
  kegiatan: string;
  instansi: string;
  status: string;
  pic: string;
  jumlahPeserta: string;
  tempat: string;
  noSurat: string;
  isToday: boolean;
  isUpcoming: boolean;
}

export const SPREADSHEET_ID = "1aMlArIv2r6h7evDIJrpTsY2YMrE1NCtQUmf0Q4yZyoI";
export const CSV_EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=0`;

/**
 * Robust zero-dependency CSV parser that handles quotes, line breaks, and commas
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // Skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n in CRLF
      }
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Format date into Indonesian locale string
 */
export function formatIndonesianDate(year: number, month: number, day: number): string {
  try {
    const d = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return `${day}/${month}/${year}`;
  }
}

/**
 * Parses "Tanggal dan Waktu" column: e.g. "11/12/2026 13:00 - Selesai"
 */
export function parseDateTime(raw: string): {
  dateIso: string;
  dateFormatted: string;
  timeFormatted: string;
  isToday: boolean;
  isUpcoming: boolean;
} {
  const trimmed = raw.trim();
  const today = new Date();
  const todayIso = today.toISOString().split("T")[0];

  // Regex for M/D/YYYY or MM/DD/YYYY followed by time
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(.*)$/);
  if (match) {
    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const timeFormatted = match[4].trim() || "Sesuai Jadwal";

    const monthPadded = String(month).padStart(2, "0");
    const dayPadded = String(day).padStart(2, "0");
    const dateIso = `${year}-${monthPadded}-${dayPadded}`;
    const dateFormatted = formatIndonesianDate(year, month, day);

    const isToday = dateIso === todayIso;
    const isUpcoming = dateIso >= todayIso;

    return {
      dateIso,
      dateFormatted,
      timeFormatted,
      isToday,
      isUpcoming,
    };
  }

  return {
    dateIso: "",
    dateFormatted: trimmed,
    timeFormatted: "Sesuai Jadwal",
    isToday: false,
    isUpcoming: false,
  };
}

/**
 * Parses raw CSV rows into structured JadwalKunjungan records
 */
export function transformRowsToJadwal(rows: string[][]): JadwalKunjungan[] {
  if (rows.length < 2) return [];

  // Find header index: looks for "Tanggal dan Waktu" or "Nama Kegiatan"
  let headerRowIndex = -1;
  let colIdxTanggal = 1;
  let colIdxKegiatan = 2;
  let colIdxInstansi = 3;
  let colIdxStatus = 4;
  let colIdxPic = 5;
  let colIdxPeserta = 6;
  let colIdxTempat = 7;
  let colIdxNoSurat = 8;
  let colIdxNo = 0;

  for (let r = 0; r < Math.min(rows.length, 5); r++) {
    const row = rows[r];
    const joined = row.join(" ").toLowerCase();
    if (joined.includes("tanggal") || joined.includes("kegiatan") || joined.includes("instansi")) {
      headerRowIndex = r;
      row.forEach((col, idx) => {
        const c = col.toLowerCase().trim();
        if (c.includes("no") && !c.includes("surat")) colIdxNo = idx;
        if (c.includes("tanggal") || c.includes("waktu")) colIdxTanggal = idx;
        if (c.includes("kegiatan")) colIdxKegiatan = idx;
        if (c.includes("instansi")) colIdxInstansi = idx;
        if (c.includes("status")) colIdxStatus = idx;
        if (c.includes("pic")) colIdxPic = idx;
        if (c.includes("peserta")) colIdxPeserta = idx;
        if (c.includes("tempat") || c.includes("ruang") || c.includes("lokasi")) colIdxTempat = idx;
        if (c.includes("surat")) colIdxNoSurat = idx;
      });
      break;
    }
  }

  const startRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 1;
  const list: JadwalKunjungan[] = [];

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    const rawDateTime = row[colIdxTanggal] || "";
    const kegiatan = row[colIdxKegiatan] || "";
    const instansi = row[colIdxInstansi] || "";
    const tempat = row[colIdxTempat] || "";

    // Ignore completely blank rows
    if (!rawDateTime && !kegiatan && !instansi) continue;

    const { dateIso, dateFormatted, timeFormatted, isToday, isUpcoming } = parseDateTime(rawDateTime);

    list.push({
      id: `kunjungan-${i}`,
      no: row[colIdxNo] || String(list.length + 1),
      rawDateTime,
      dateIso,
      dateFormatted,
      timeFormatted,
      kegiatan: kegiatan || "Kunjungan & Kegiatan",
      instansi: instansi || "-",
      status: row[colIdxStatus] || "Tersedia",
      pic: row[colIdxPic] || "-",
      jumlahPeserta: row[colIdxPeserta] || "-",
      tempat: tempat || "Solo Techno Park",
      noSurat: row[colIdxNoSurat] || "-",
      isToday,
      isUpcoming,
    });
  }

  return list;
}
