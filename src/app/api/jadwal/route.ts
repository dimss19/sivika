import { NextResponse } from "next/server";
import { parseCSV, transformRowsToJadwal, JadwalKunjungan } from "@/lib/sheets";

// Always fetch live Google Spreadsheet with cache-buster timestamp

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customGid = searchParams.get("gid") || "0";
  const sheetId = searchParams.get("sheetId") || "1aMlArIv2r6h7evDIJrpTsY2YMrE1NCtQUmf0Q4yZyoI";

  // Cache buster timestamp prevents Google Sheets CDN from returning stale CSV
  const cacheBuster = Date.now();
  const fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${customGid}&_t=${cacheBuster}`;

  try {
    const res = await fetch(fetchUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SivikaLive/2.0",
      },
    });

    if (!res.ok) {
      throw new Error(`Google Sheets responded with status: ${res.status} ${res.statusText}`);
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);
    const jadwal = transformRowsToJadwal(rows);

    return NextResponse.json(
      {
        success: true,
        source: "live_google_sheets",
        count: jadwal.length,
        timestamp: cacheBuster,
        data: jadwal,
        lastUpdated: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Gagal mengambil Google Spreadsheet secara langsung:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Gagal memuat spreadsheet",
        source: "error",
        count: 0,
        data: [],
        lastUpdated: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
