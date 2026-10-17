"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  Calendar,
  Tv,
  CalendarDays,
  Film,
  Maximize,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { JadwalKunjungan } from "@/lib/sheets";
import STPVideoPlayer from "./STPVideoPlayer";

interface TVDisplayViewProps {
  data: JadwalKunjungan[];
  onCloseTvMode: () => void;
  onSelectItem: (item: JadwalKunjungan) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}

export type TVModeType = "today" | "carousel" | "split";

function formatKegiatan(kegiatan: string, kategori?: string): string {
  if (!kegiatan || kegiatan.trim() === "-" || kegiatan.trim() === "") {
    if (kategori === "Pelatihan") return "Pelatihan & Workshop Vokasi";
    if (kategori === "Kunjungan Kerja") return "Kunjungan Kerja & Audiensi Resmi";
    return "Kunjungan Industri & Eksplorasi Sains";
  }
  return kegiatan
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCategoryBadge(kategori: string) {
  switch (kategori) {
    case "Kunjungan Industri":
      return {
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200/90",
        label: "Kunjungan Industri",
      };
    case "Pelatihan":
      return {
        badge: "bg-amber-50 text-amber-800 border-amber-200/90",
        label: "Pelatihan & Diklat",
      };
    case "Kunjungan Kerja":
      return {
        badge: "bg-blue-50 text-blue-800 border-blue-200/90",
        label: "Kunjungan Kerja",
      };
    default:
      return {
        badge: "bg-slate-100 text-slate-800 border-slate-200",
        label: "Agenda Umum",
      };
  }
}

export default function TVDisplayView({
  data,
  onCloseTvMode,
  onSelectItem,
  onRefresh,
  isRefreshing,
  lastUpdated,
}: TVDisplayViewProps) {
  const [tvMode, setTvMode] = useState<TVModeType>("carousel");
  const slideInterval = 10;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  // Clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " WIB"
      );
      setDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter items based on TV Mode
  const todayItems = useMemo(() => {
    return data.filter((item) => item.isToday);
  }, [data]);

  // Prioritize today + upcoming items for signage relevance
  const relevantItems = useMemo(() => {
    const today = data.filter((item) => item.isToday);
    const upcoming = data.filter((item) => !item.isToday && item.isUpcoming);
    const past = data.filter((item) => !item.isToday && !item.isUpcoming);
    return [...today, ...upcoming, ...past];
  }, [data]);

  const activeItems = useMemo(() => {
    if (tvMode === "today") {
      return todayItems.length > 0 ? todayItems : relevantItems.slice(0, 6);
    }
    if (tvMode === "split") {
      return relevantItems.slice(0, 16);
    }
    // "carousel" mode: rotate through the 36 most relevant items (6 slides of 6 cards = a 60-second cycle)
    return relevantItems.slice(0, 36);
  }, [tvMode, todayItems, relevantItems]);

  const itemsPerPage = tvMode === "split" ? 4 : 6;
  const totalPages = Math.max(1, Math.ceil(activeItems.length / itemsPerPage));

  const handleModeChange = (newMode: TVModeType) => {
    setTvMode(newMode);
    setCurrentPage(0);
    setProgress(0);
  };

  // Carousel Auto-rotation
  useEffect(() => {
    if (tvMode !== "carousel" || totalPages <= 1) {
      return;
    }

    const intervalMs = slideInterval * 1000;
    const stepMs = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += stepMs;
      setProgress(Math.min(100, (elapsed / intervalMs) * 100));

      if (elapsed >= intervalMs) {
        elapsed = 0;
        setProgress(0);
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }
    }, stepMs);

    return () => {
      clearInterval(timer);
      setProgress(0);
    };
  }, [tvMode, totalPages, slideInterval]);

  const activePage = currentPage >= totalPages ? 0 : currentPage;
  const displayedItems = activeItems.slice(
    activePage * itemsPerPage,
    (activePage + 1) * itemsPerPage
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col justify-between overflow-hidden select-none">
      {/* 1. SINGLE UNIFIED BROADCAST HEADER */}
      <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-2.5 shadow-xs flex items-center justify-between shrink-0 relative z-30 gap-3">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-11 h-10 flex items-center justify-center p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <Image
              src="/logo.png"
              alt="Solo Techno Park"
              width={44}
              height={34}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                SOLO<span className="text-slate-800">TECHNO</span>
                <span className="text-rose-600">PARK</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Lobby TV Display
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase whitespace-nowrap hidden sm:block">
              SIVIKA • Sistem Informasi Jadwal Kunjungan
            </p>
          </div>
        </div>

        {/* Center: Clean 3-Tab Capsule Mode Switcher */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shadow-2xs shrink-0">
          <button
            onClick={() => handleModeChange("carousel")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              tvMode === "carousel"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Carousel Slide</span>
          </button>

          <button
            onClick={() => handleModeChange("today")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              tvMode === "today"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Hari Ini ({todayItems.length})</span>
            {todayItems.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => handleModeChange("split")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              tvMode === "split"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Split Video</span>
          </button>
        </div>

        {/* Right: Date, Clock, and Quick Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Date */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{date || "Hari Ini"}</span>
          </div>

          {/* Obsidian Live Digital Clock */}
          <div className="bg-slate-950 text-white px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-2 border border-slate-800 shrink-0 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <Clock className="w-4 h-4 text-slate-300" />
            <span className="text-base sm:text-lg font-black font-mono tracking-wider">
              {time || "--:--:--"}
            </span>
          </div>

          {/* Actions: Refresh, Fullscreen, Exit */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Sync / Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title={
                lastUpdated
                  ? `Muat Ulang Jadwal (Terakhir: ${new Date(
                      lastUpdated
                    ).toLocaleTimeString("id-ID")})`
                  : "Muat Ulang Jadwal"
              }
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl transition-all disabled:opacity-50 shrink-0"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefreshing ? "animate-spin text-slate-900" : ""
                }`}
              />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title="Layar Penuh TV (F11)"
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl transition-all shrink-0"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>

            {/* Exit to Web Button */}
            <button
              onClick={onCloseTvMode}
              className="px-3.5 py-1.5 bg-slate-950 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. AUTO-SLIDE PROGRESS TICKER (Smooth Hairline Bar) */}
      {tvMode === "carousel" && totalPages > 1 && (
        <div className="w-full bg-slate-200/80 h-1 overflow-hidden shrink-0 relative z-20">
          <div
            className="h-full bg-rose-600 transition-all duration-100 ease-linear shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* 3. MAIN TV SCREEN DISPLAY BODY */}
      <main className="flex-1 p-4 sm:p-5 overflow-hidden flex flex-col justify-between min-h-0 bg-slate-50/80">
        {/* Broadcast Status Bar */}
        <div className="flex items-center justify-between mb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h2 className="text-sm sm:text-base font-black text-slate-950 tracking-tight">
              {tvMode === "today"
                ? "Jadwal Agenda Hari Ini"
                : tvMode === "split"
                ? "Agenda Kunjungan & Profil Kawasan Solo Techno Park"
                : "Display Digital Signage Agenda Solo Techno Park"}
            </h2>
            <span className="bg-white text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200/90 shadow-2xs">
              {displayedItems.length} dari {activeItems.length} Agenda
            </span>
          </div>

          {/* Carousel Slide Page Indicator */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span className="bg-white border border-slate-200/90 px-3 py-1 rounded-xl shadow-2xs text-slate-800 text-[11px]">
                Halaman{" "}
                <strong className="text-slate-950 font-black">
                  {activePage + 1}
                </strong>{" "}
                / {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setCurrentPage((p) => (p > 0 ? p - 1 : totalPages - 1));
                    setProgress(0);
                  }}
                  title="Halaman Sebelumnya"
                  className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs text-slate-700"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentPage((p) => (p + 1) % totalPages);
                    setProgress(0);
                  }}
                  title="Halaman Berikutnya"
                  className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-2xs text-slate-700"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notice for Today Mode if empty */}
        {tvMode === "today" && todayItems.length === 0 && (
          <div className="mb-2 bg-amber-50 border border-amber-200/90 text-amber-900 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Tidak ada agenda kunjungan khusus untuk hari ini (
              {date || "Hari Ini"}). Menampilkan jadwal resmi terdekat berikutnya
              Solo Techno Park:
            </span>
          </div>
        )}

        {/* Cards View Container (Crisp 100% Native Resolution) */}
        <div className="flex-1 flex flex-col min-h-0">
          {tvMode === "split" ? (
            /* Split Screen Layout (Left Cards, Right Video & Highlights) */
            <div className="grid grid-cols-12 gap-5 h-full min-h-0">
              <div className="col-span-7 flex flex-col h-full min-h-0">
                <div className="grid grid-cols-2 gap-3.5 flex-1 min-h-0 overflow-hidden pr-0.5">
                  {displayedItems.map((item) => {
                    const cat = getCategoryBadge(item.kategori);
                    const formattedKegiatan = formatKegiatan(
                      item.kegiatan,
                      item.kategori
                    );
                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl p-4 shadow-2xs hover:shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-200 relative overflow-hidden group border-t-4 border-t-slate-900 hover:border-t-rose-600"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="bg-slate-950 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                              <Clock className="w-3 h-3 text-rose-400" />
                              {item.timeFormatted}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${cat.badge}`}
                            >
                              {cat.label}
                            </span>
                          </div>

                          <h3 className="text-base font-black text-slate-950 group-hover:text-rose-600 transition-colors line-clamp-1 mt-2.5 mb-1 tracking-tight">
                            {item.instansi}
                          </h3>

                          <div className="bg-slate-50 border border-slate-150 rounded-xl p-2 text-xs font-semibold text-slate-700 leading-snug line-clamp-2">
                            {formattedKegiatan}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{item.dateFormatted || item.rawDateTime}</span>
                          </div>
                        </div>

                        <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate max-w-[65%]">
                            <div className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                              <MapPin className="w-3 h-3" />
                            </div>
                            <span className="truncate text-[11px]">
                              {item.tempat}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                            {item.jumlahPeserta && item.jumlahPeserta !== "-"
                              ? `${item.jumlahPeserta} Pax`
                              : "Rombongan"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-5 h-full min-h-0 overflow-y-auto">
                <STPVideoPlayer />
              </div>
            </div>
          ) : (
            /* Full 6-Card Grid Layout (3 cols x 2 rows, perfectly proportioned) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 flex-1 min-h-0 overflow-hidden pr-0.5">
              {displayedItems.map((item) => {
                const cat = getCategoryBadge(item.kategori);
                const formattedKegiatan = formatKegiatan(
                  item.kegiatan,
                  item.kategori
                );
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="bg-white border border-slate-200 hover:border-slate-400 rounded-3xl p-4 sm:p-5 shadow-2xs hover:shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-200 relative overflow-hidden group border-t-4 border-t-slate-900 hover:border-t-rose-600"
                  >
                    <div>
                      {/* Top Bar: Time Pill + Category & Status Badges */}
                      <div className="flex items-center justify-between gap-2">
                        {/* Time Pill */}
                        <div className="bg-slate-950 text-white font-mono text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xs">
                          <Clock className="w-3.5 h-3.5 text-rose-400" />
                          <span>{item.timeFormatted}</span>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-1.5">
                          {item.isToday && (
                            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              HARI INI
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${cat.badge}`}
                          >
                            {cat.label}
                          </span>
                        </div>
                      </div>

                      {/* Institution / Guest Name */}
                      <h3 className="text-lg sm:text-xl font-black text-slate-950 group-hover:text-rose-600 transition-colors line-clamp-1 mt-3 mb-1.5 tracking-tight">
                        {item.instansi}
                      </h3>

                      {/* Activity / Event Box */}
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-slate-700 leading-snug line-clamp-2">
                        {formattedKegiatan}
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.dateFormatted || item.rawDateTime}</span>
                      </div>
                    </div>

                    {/* Footer Row: Room/Location + Participants */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-900 truncate max-w-[65%]">
                        <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate text-xs">{item.tempat}</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs">
                          {item.jumlahPeserta && item.jumlahPeserta !== "-"
                            ? `${item.jumlahPeserta} Peserta`
                            : "Rombongan"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 4. TV BOTTOM MARQUEE TICKER (Pristine White with Obsidian Resepsionis Badge) */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between text-xs shrink-0 overflow-hidden shadow-xs relative z-20">
        <div className="flex items-center gap-2 bg-slate-950 text-white font-black px-3 py-1.5 rounded-xl mr-3 sm:mr-4 shrink-0 uppercase tracking-wider text-[10px] sm:text-[11px] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>INFO RESEPSIONIS</span>
        </div>
        <div className="flex-1 overflow-hidden whitespace-nowrap relative">
          <div className="animate-marquee inline-flex items-center gap-12 font-semibold text-slate-800 text-xs">
            <span>
              Selamat datang di Solo Techno Park (Pusat Vokasi & Inovasi
              Teknologi Surakarta).
            </span>
            <span>
              Bagi rombongan tamu kunjungan industri, kedinasan, dan peserta
              pelatihan, harap melapor ke Petugas Resepsionis Gedung Utama
              sebelum memasuki ruangan acara.
            </span>
            <span>
              Area parkir bus dan kendaraan tamu tersedia di Area Parkir Timur
              STP. Akses WiFi publik tersedia di seluruh kawasan Solo Techno
              Park.
            </span>
            <span>
              Data agenda diperbarui secara berkala dan terhubung langsung dengan
              Google Spreadsheet SIVIKA Solo Techno Park.
            </span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 text-[11px] font-bold text-slate-500 shrink-0">
          <span>Solo Techno Park © 2026</span>
        </div>
      </footer>
    </div>
  );
}
