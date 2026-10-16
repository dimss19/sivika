import { NextResponse } from "next/server";
import { CSV_EXPORT_URL, parseCSV, transformRowsToJadwal, JadwalKunjungan } from "@/lib/sheets";

// Fallback sample data in case internet connection is unreachable during tests/offline
const FALLBACK_DATA: JadwalKunjungan[] = [
  {
    id: "sample-1",
    no: "1",
    rawDateTime: "11/12/2026 13:00 - Selesai",
    dateIso: "2026-11-12",
    dateFormatted: "Kamis, 12 November 2026",
    timeFormatted: "13:00 - Selesai WIB",
    kegiatan: "Kunjungan Industri",
    instansi: "SMK NEGERI UNGGUL TERPADU ANAK TUHA LAMPUNG",
    status: "Completed",
    pic: "Mb Lusi",
    jumlahPeserta: "66",
    tempat: "Gedung GoTo STP",
    noSurat: "060/SEPT",
    isToday: true,
    isUpcoming: true,
  },
  {
    id: "sample-2",
    no: "2",
    rawDateTime: "11/16/2026 08:00 - Selesai",
    dateIso: "2026-11-16",
    dateFormatted: "Senin, 16 November 2026",
    timeFormatted: "08:00 - Selesai WIB",
    kegiatan: "Kunjungan Industri",
    instansi: "SMK TELADAN KERTASEMAYA INDRAMAYU",
    status: "Completed",
    pic: "Mb Lusi",
    jumlahPeserta: "216",
    tempat: "Aula Gedung RnD",
    noSurat: "023/OKT",
    isToday: false,
    isUpcoming: true,
  },
  {
    id: "sample-3",
    no: "3",
    rawDateTime: "11/24/2026 09:00 - Selesai",
    dateIso: "2026-11-24",
    dateFormatted: "Selasa, 24 November 2026",
    timeFormatted: "09:00 - Selesai WIB",
    kegiatan: "Kunjungan Industri",
    instansi: "SMK KOSGORO NGANJUK",
    status: "Completed",
    pic: "Mb Lusi",
    jumlahPeserta: "50",
    tempat: "Auditorium Utama STP",
    noSurat: "080/SEPT",
    isToday: false,
    isUpcoming: true,
  },
  {
    id: "sample-4",
    no: "4",
    rawDateTime: "11/25/2026 09:00 - 11:00",
    dateIso: "2026-11-25",
    dateFormatted: "Rabu, 25 November 2026",
    timeFormatted: "09:00 - 11:00 WIB",
    kegiatan: "Kunjungan Industri & Workshop",
    instansi: "SMK MANAHIJUL HUDA PATI",
    status: "Completed",
    pic: "Mb Lusi",
    jumlahPeserta: "100",
    tempat: "Aula Gedung RnD",
    noSurat: "082/AGUST",
    isToday: false,
    isUpcoming: true,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customGid = searchParams.get("gid") || "0";
  const sheetId = searchParams.get("sheetId") || "1aMlArIv2r6h7evDIJrpTsY2YMrE1NCtQUmf0Q4yZyoI";

  const fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${customGid}`;

  try {
    const res = await fetch(fetchUrl, {
      next: { revalidate: 30 }, // Cache in Next.js for 30s
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SivikaDigitalSignage/1.0",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch spreadsheet: ${res.statusText}`);
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);
    const jadwal = transformRowsToJadwal(rows);

    return NextResponse.json({
      success: true,
      source: "live_google_sheets",
      count: jadwal.length,
      data: jadwal,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Spreadsheet fetch failed, using fallback:", error);
    return NextResponse.json({
      success: true,
      source: "fallback_cache",
      count: FALLBACK_DATA.length,
      data: FALLBACK_DATA,
      lastUpdated: new Date().toISOString(),
    });
  }
}
