"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  Calendar,
  CloudSun,
  Tv,
  CalendarDays,
  Film,
  Sparkles,
  Maximize,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Eye,
  RefreshCw,
} from "lucide-react";
import { JadwalKunjungan } from "@/lib/sheets";
import STPVideoPlayer from "./STPVideoPlayer";

interface TVDisplayViewProps {
  data: JadwalKunjungan[];
  onCloseTvMode: () => void;
  onSelectItem: (item: JadwalKunjungan) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLive: boolean;
  lastUpdated: string;
}

export type TVModeType = "today" | "carousel" | "split" | "all";

export default function TVDisplayView({
  data,
  onCloseTvMode,
  onSelectItem,
  onRefresh,
  isRefreshing,
  isLive,
  lastUpdated,
}: TVDisplayViewProps) {
  const [tvMode, setTvMode] = useState<TVModeType>("carousel");
  const [tvZoom, setTvZoom] = useState<number>(100);
  const slideInterval = 10;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  // Clock
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

  const activeItems = useMemo(() => {
    if (tvMode === "today") {
      return todayItems.length > 0 ? todayItems : data.slice(0, 8);
    }
    return data;
  }, [data, tvMode, todayItems]);

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
  const displayedItems =
    tvMode === "carousel"
      ? activeItems.slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage)
      : activeItems.slice(0, itemsPerPage);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const getCategoryBadgeClass = (kategori: string) => {
    if (kategori === "Kunjungan Industri") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/90";
    }
    if (kategori === "Pelatihan") {
      return "bg-amber-50 text-amber-700 border-amber-200/90";
    }
    if (kategori === "Kunjungan Kerja") {
      return "bg-blue-50 text-blue-700 border-blue-200/90";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col justify-between overflow-hidden select-none">
      {/* 1. TV Display Header (Pristine White & Sleek Obsidian Clock) */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 shadow-xs flex items-center justify-between shrink-0 relative z-20">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-12 flex items-center justify-center p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
            <Image
              src="/logo.png"
              alt="Solo Techno Park"
              width={56}
              height={44}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">
              SOLO<span className="text-slate-900">TECHNO</span><span className="text-rose-600">PARK</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SIVIKA • Digital Signage Lobi
            </p>
          </div>
        </div>

        {/* Center Status Indicators */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-xl text-xs">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-700">Surakarta 31°C</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">
              {isLive ? "Live Spreadsheet" : "Cache Standby"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="font-extrabold">{data.length} Agenda</span>
          </div>
        </div>

        {/* Live Clock & Date */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{date || "Hari Ini"}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Sinkron: {new Date(lastUpdated).toLocaleTimeString("id-ID")}
            </p>
          </div>

          <div className="bg-slate-950 text-white px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <Clock className="w-5 h-5 text-slate-300" />
            <span className="text-xl font-black font-mono tracking-wider">
              {time || "--:--:--"}
            </span>
          </div>
        </div>
      </header>

      {/* 2. TV Subheader: Mode Switcher, Zoom Controller, Actions (Pristine White) */}
      <div className="bg-white border-b border-slate-200/90 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 relative z-10 shadow-xs">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => handleModeChange("carousel")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              tvMode === "carousel"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Carousel Auto-Slide</span>
          </button>

          <button
            onClick={() => handleModeChange("today")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              tvMode === "today"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Hari Ini ({todayItems.length})</span>
          </button>

          <button
            onClick={() => handleModeChange("split")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              tvMode === "split"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Split Jadwal & Video</span>
          </button>

          <button
            onClick={() => handleModeChange("all")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              tvMode === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semua Agenda</span>
          </button>
        </div>

        {/* Right Tools: Zoom Control, Refresh, Fullscreen, Close */}
        <div className="flex items-center gap-2.5">
          {/* Zoom Control */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 px-2 uppercase tracking-wider">
              Zoom:
            </span>
            <button
              onClick={() => setTvZoom((z) => Math.max(75, z - 10))}
              disabled={tvZoom <= 75}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/90 transition-all disabled:opacity-40"
            >
              -
            </button>
            <span className="text-xs font-bold text-slate-900 px-2 min-w-[45px] text-center">
              {tvZoom}%
            </span>
            <button
              onClick={() => setTvZoom((z) => Math.min(160, z + 10))}
              disabled={tvZoom >= 160}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/90 transition-all disabled:opacity-40"
            >
              +
            </button>
            {tvZoom !== 100 && (
              <button
                onClick={() => setTvZoom(100)}
                className="text-[10px] font-bold text-slate-900 hover:underline px-1.5"
              >
                Reset
              </button>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Sinkronkan Spreadsheet Sekarang"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-slate-900" : ""}`}
            />
          </button>

          <button
            onClick={toggleFullscreen}
            title="Layar Penuh (F11)"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl transition-all"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button
            onClick={onCloseTvMode}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Web</span>
          </button>
        </div>
      </div>

      {/* 3. Main TV Screen Content Body (Clean White & Slate-50) */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col justify-between min-h-0 bg-slate-50/70">
        <div
          style={{ zoom: `${tvZoom}%` }}
          className="flex-1 flex flex-col min-h-0 transition-all duration-150 origin-top"
        >
          {tvMode === "split" ? (
            /* Split View: Left Cards, Right Video */
            <div className="grid grid-cols-12 gap-6 h-full min-h-0">
              <div className="col-span-7 flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    <span>Agenda Kunjungan Solo Techno Park</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    Menampilkan {displayedItems.length} Agenda
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
                  {displayedItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="bg-white border border-slate-200/90 hover:border-slate-400 rounded-2xl p-5 shadow-2xs hover:shadow-md flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 via-rose-600 to-slate-900" />

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-600" />
                            {item.timeFormatted}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryBadgeClass(
                              item.kategori
                            )}`}
                          >
                            {item.kegiatan}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-950 group-hover:text-slate-900 transition-colors line-clamp-1 mt-1">
                          {item.instansi}
                        </h4>

                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.dateFormatted || item.rawDateTime}</span>
                        </p>
                      </div>

                      <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center gap-1 text-slate-800 font-bold truncate max-w-[150px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          {item.tempat}
                        </span>
                        <span className="text-slate-800 font-extrabold flex items-center gap-1 group-hover:text-rose-600">
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-5 h-full min-h-0 overflow-y-auto">
                <STPVideoPlayer />
              </div>
            </div>
          ) : (
            /* Full Cards View (Carousel, Today, All) */
            <div className="flex-1 flex flex-col min-h-0 justify-between">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <h3 className="text-lg font-black text-slate-950">
                    {tvMode === "today"
                      ? "Agenda Kunjungan Hari Ini"
                      : "Display Digital Signage Agenda Kunjungan"}
                  </h3>
                  <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full ml-1 border border-slate-200">
                    {activeItems.length} Agenda
                  </span>
                </div>

                {tvMode === "carousel" && (
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Auto-Slide ({slideInterval}s)
                  </span>
                )}
              </div>

              {/* Grid of 6 Cards - Crisp White & Spacious */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-1 min-h-0 overflow-y-auto pr-1">
                {displayedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="bg-white border border-slate-200/90 hover:border-slate-400 rounded-3xl p-6 shadow-2xs hover:shadow-md flex flex-col justify-between cursor-pointer transition-all duration-200 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 via-rose-600 to-slate-900" />

                    <div>
                      {/* Top Row: Time & Activity */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="bg-slate-100 text-slate-800 border border-slate-200 font-mono text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-slate-600" />
                          {item.timeFormatted}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {item.isToday && (
                            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-rose-500" />
                              Hari Ini
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${getCategoryBadgeClass(
                              item.kategori
                            )}`}
                          >
                            {item.kegiatan}
                          </span>
                        </div>
                      </div>

                      {/* Institution Name */}
                      <h4 className="text-lg sm:text-xl font-black text-slate-950 group-hover:text-slate-900 transition-colors leading-tight line-clamp-1 mt-2">
                        {item.instansi}
                      </h4>

                      {/* Date */}
                      <p className="text-xs font-semibold text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.dateFormatted || item.rawDateTime}</span>
                      </p>
                    </div>

                    {/* Bottom Metadata & Detail Action */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 truncate max-w-[200px]">
                        <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="truncate">{item.tempat}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-semibold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {item.jumlahPeserta && item.jumlahPeserta !== "-"
                              ? `${item.jumlahPeserta}`
                              : "Rombongan"}
                          </span>
                        </span>

                        <span className="px-3 py-1 bg-slate-100 group-hover:bg-slate-900 text-slate-800 group-hover:text-white font-extrabold rounded-lg text-xs transition-all flex items-center gap-1 shadow-2xs">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Elegant Pagination Bar (Clean, no 213 dots!) */}
        {tvMode === "carousel" && totalPages > 1 && (
          <div className="mt-4 pt-3.5 border-t border-slate-200/90 flex items-center justify-between text-xs font-bold text-slate-600 shrink-0 bg-white/90 px-5 py-2.5 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Left Page Info */}
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-extrabold">
                Halaman {activePage + 1}
              </span>
              <span className="text-slate-400">dari {totalPages}</span>
            </div>

            {/* Center Slide Timer Progress */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 uppercase font-semibold hidden sm:inline">
                Slide Berikutnya:
              </span>
              <div className="w-48 sm:w-64 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-slate-900 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Right Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setCurrentPage((p) => (p > 0 ? p - 1 : totalPages - 1));
                  setProgress(0);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>
              <button
                onClick={() => {
                  setCurrentPage((p) => (p + 1) % totalPages);
                  setProgress(0);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 flex items-center gap-1 transition-all"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 5. TV Bottom Marquee Footer (Pristine White with Sleek Obsidian Tag) */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs shrink-0 overflow-hidden shadow-xs relative z-20">
        <span className="bg-slate-950 text-white font-extrabold px-3.5 py-1.5 rounded-lg mr-4 shrink-0 uppercase tracking-wider text-[11px] shadow-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          INFO RESEPSIONIS
        </span>
        <div className="flex-1 overflow-hidden whitespace-nowrap relative">
          <div className="animate-marquee inline-flex items-center gap-12 font-semibold text-slate-800">
            <span>
              Selamat datang di Solo Techno Park. Bagi rombongan tamu kunjungan
              industri dan kedinasan, harap melapor ke Petugas Resepsionis Gedung
              Utama sebelum memasuki ruangan acara. Area parkir bus dan kendaraan
              tamu tersedia di Area Parkir Timur STP.
            </span>
            <span>
              Data agenda kunjungan diperbarui secara langsung (real-time) melalui integrasi Google Spreadsheet SIVIKA Solo Techno Park.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
