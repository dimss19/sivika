"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import DisplayHeader from "@/components/DisplayHeader";
import DisplayFooter from "@/components/DisplayFooter";
import JadwalGrid from "@/components/JadwalGrid";
import STPVideoPlayer from "@/components/STPVideoPlayer";
import ModeControls, { DisplayMode } from "@/components/ModeControls";
import { JadwalKunjungan } from "@/lib/sheets";
import {
  CalendarDays,
  Tv,
  Film,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const [data, setData] = useState<JadwalKunjungan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLive, setIsLive] = useState<boolean>(true);

  // Display Settings
  const [mode, setMode] = useState<DisplayMode>("carousel");
  const [slideInterval, setSlideInterval] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showControls, setShowControls] = useState<boolean>(false);
  const [rangeFilter, setRangeFilter] = useState<"all" | "7days" | "month">("all");

  // Fetch data from Next.js API
  const fetchJadwal = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const res = await fetch("/api/jadwal", { cache: "no-store" });
      const json = await res.json();
      if (json && json.data) {
        setData(json.data);
        setLastUpdated(json.lastUpdated || new Date().toISOString());
        setIsLive(json.source === "live_google_sheets");
      }
    } catch (err) {
      console.error("Gagal mengambil data jadwal:", err);
      setIsLive(false);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch & background polling every 60 seconds
  useEffect(() => {
    fetchJadwal();
    const interval = setInterval(() => {
      fetchJadwal();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchJadwal]);

  // Keyboard shortcut listener (F for fullscreen, M for mode, R for refresh)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "m" || e.key === "M") {
        setShowControls((prev) => !prev);
      } else if (e.key === "r" || e.key === "R") {
        fetchJadwal(true);
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fetchJadwal]);

  // Calculate items for today
  const todayItems = useMemo(() => {
    return data.filter((item) => item.isToday);
  }, [data]);

  // Filtered items based on Mode and Search
  const filteredItems = useMemo(() => {
    let result = [...data];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.instansi.toLowerCase().includes(q) ||
          item.tempat.toLowerCase().includes(q) ||
          item.kegiatan.toLowerCase().includes(q) ||
          item.pic.toLowerCase().includes(q)
      );
    }

    // Filter by mode
    if (mode === "today") {
      // If there are today's items, show them
      if (todayItems.length > 0) {
        return todayItems;
      }
      // If no visits today, show upcoming so TV isn't empty
      return result.filter((item) => item.isUpcoming);
    }

    // Range mode filters
    if (mode === "range") {
      const now = new Date();
      if (rangeFilter === "7days") {
        const next7Days = new Date();
        next7Days.setDate(now.getDate() + 7);
        const next7Iso = next7Days.toISOString().split("T")[0];
        result = result.filter(
          (item) => item.dateIso && item.dateIso >= now.toISOString().split("T")[0] && item.dateIso <= next7Iso
        );
      }
    }

    return result;
  }, [data, mode, searchQuery, todayItems, rangeFilter]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden tv-bg-pattern select-none">
      {/* Top Header */}
      <DisplayHeader
        lastUpdated={lastUpdated}
        isLive={isLive}
        totalSchedule={data.length}
      />

      {/* Mode Bar & Quick Navigation */}
      <nav aria-label="Mode Display" className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-2.5 flex items-center justify-between shrink-0 z-10">
        {/* Mode Buttons */}
        <div className="flex items-center gap-2">
          {/* Hari Ini */}
          <button
            onClick={() => setMode("today")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === "today"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Hari Ini</span>
            {todayItems.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            )}
          </button>

          {/* Carousel TV */}
          <button
            onClick={() => setMode("carousel")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === "carousel"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Carousel TV Signage</span>
          </button>

          {/* Split Video */}
          <button
            onClick={() => setMode("split")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === "split"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Split Jadwal & Video</span>
          </button>

          {/* Semua / Range */}
          <button
            onClick={() => setMode("range")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === "range"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semua Agenda</span>
          </button>
        </div>

        {/* Right Info & Filter Indicators */}
        <div className="flex items-center gap-3">
          {mode === "range" && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setRangeFilter("all")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  rangeFilter === "all" ? "bg-white text-rose-600 shadow-xs" : "text-slate-600"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setRangeFilter("7days")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  rangeFilter === "7days" ? "bg-white text-rose-600 shadow-xs" : "text-slate-600"
                }`}
              >
                7 Hari Kedepan
              </button>
            </div>
          )}

          <button
            onClick={() => fetchJadwal(true)}
            disabled={isRefreshing}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
            title="Sinkronkan dengan Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-rose-600" : ""}`} />
          </button>

          <button
            onClick={() => setShowControls(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">Pengaturan</span>
          </button>
        </div>
      </nav>

      {/* Today Notice Banner if in today mode but 0 items today */}
      {mode === "today" && todayItems.length === 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs font-semibold text-amber-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              Agenda untuk hari ini belum terjadwal. Menampilkan agenda kunjungan mendatang terdekat Solo Techno Park.
            </span>
          </div>
          <button
            onClick={() => setMode("carousel")}
            className="text-amber-900 font-bold hover:underline flex items-center gap-1"
          >
            <span>Beralih ke Carousel TV</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Display Body */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col min-h-0">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-600 animate-pulse">
              Menghubungkan ke Google Spreadsheet STP...
            </p>
          </div>
        ) : mode === "split" ? (
          /* Split View: Left Schedule, Right Video */
          <div className="grid grid-cols-12 gap-6 h-full min-h-0">
            <div className="col-span-7 flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  Agenda Kunjungan & Kegiatan
                </h2>
                <span className="text-xs font-bold text-slate-500">
                  {filteredItems.length} Jadwal Terdaftar
                </span>
              </div>
              <JadwalGrid
                items={filteredItems}
                mode={mode}
                slideInterval={slideInterval}
                isSplitView={true}
              />
            </div>
            <div className="col-span-5 h-full min-h-0 overflow-y-auto">
              <STPVideoPlayer />
            </div>
          </div>
        ) : (
          /* Full Screen Grid View (Today / Carousel / Range) */
          <div className="flex-1 flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {mode === "today"
                    ? todayItems.length > 0
                      ? "Agenda Kunjungan Hari Ini"
                      : "Agenda Kunjungan Terdekat"
                    : mode === "carousel"
                    ? "Display Agenda Digital Signage"
                    : "Daftar Jadwal Kunjungan Lengkap"}
                </h2>
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full ml-1">
                  {filteredItems.length} Agenda
                </span>
              </div>

              {mode === "carousel" && (
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Auto-Slide Aktif ({slideInterval}s)</span>
                </div>
              )}
            </div>

            <JadwalGrid
              items={filteredItems}
              mode={mode}
              slideInterval={slideInterval}
              isSplitView={false}
            />
          </div>
        )}
      </main>

      {/* Bottom Footer Ticker */}
      <DisplayFooter
        onToggleControls={() => setShowControls((prev) => !prev)}
        showControls={showControls}
      />

      {/* Mode Controls Modal */}
      <ModeControls
        mode={mode}
        onModeChange={(m) => setMode(m)}
        slideInterval={slideInterval}
        onIntervalChange={(sec) => setSlideInterval(sec)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onRefresh={() => fetchJadwal(true)}
        isRefreshing={isRefreshing}
        isOpen={showControls}
        onClose={() => setShowControls(false)}
        todayCount={todayItems.length}
        totalCount={data.length}
      />
    </div>
  );
}
