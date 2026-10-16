"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  Calendar,
  CloudSun,
  Radio,
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
  Flame,
  CheckCircle2,
  RefreshCw,
  X,
} from "lucide-react";
import { JadwalKunjungan } from "@/lib/sheets";
import ZoomControl from "./ZoomControl";
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
  const [slideInterval, setSlideInterval] = useState<number>(10);
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

  // Reset page when mode changes
  useEffect(() => {
    setCurrentPage(0);
    setProgress(0);
  }, [tvMode, activeItems.length]);

  // Carousel Auto-rotation
  useEffect(() => {
    if (tvMode !== "carousel" || totalPages <= 1) {
      setProgress(0);
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

    return () => clearInterval(timer);
  }, [tvMode, totalPages, slideInterval]);

  const displayedItems =
    tvMode === "carousel"
      ? activeItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 1. TV Display Header */}
      <header className="bg-white text-slate-900 border-b-2 border-rose-500 px-6 py-3.5 shadow-md flex items-center justify-between shrink-0">
        {/* Brand */}
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
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              SOLO<span className="text-rose-600">TECHNOPARK</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SIVIKA • Digital Signage Lobi
            </p>
          </div>
        </div>

        {/* Center Live Badge & Mode Indicator */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-700">Surakarta 31°C</span>
          </div>

          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-xs text-rose-700">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-600" />
            <span className="font-bold">
              {isLive ? "Live Spreadsheet" : "Cache Standby"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span className="font-extrabold">{data.length} Agenda</span>
          </div>
        </div>

        {/* Live Clock & Exit Button */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-600 flex items-center justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              <span>{date || "Hari Ini"}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Sinkron: {new Date(lastUpdated).toLocaleTimeString("id-ID")}
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-2xl shadow-md shadow-rose-600/25 flex items-center gap-2 border border-rose-500">
            <Clock className="w-5 h-5 text-rose-100 animate-pulse" />
            <span className="text-xl font-black font-mono tracking-wider">
              {time || "--:--:--"}
            </span>
          </div>
        </div>
      </header>

      {/* 2. TV Subheader: Mode Switcher, Zoom Controller, Actions */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setTvMode("carousel")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              tvMode === "carousel"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Carousel Auto-Slide</span>
          </button>

          <button
            onClick={() => setTvMode("today")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              tvMode === "today"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Hari Ini ({todayItems.length})</span>
          </button>

          <button
            onClick={() => setTvMode("split")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              tvMode === "split"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Split Jadwal & Video</span>
          </button>

          <button
            onClick={() => setTvMode("all")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              tvMode === "all"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semua Agenda</span>
          </button>
        </div>

        {/* Right Tools: Zoom Control, Refresh, Fullscreen, Close */}
        <div className="flex items-center gap-2.5">
          {/* Zoom Control */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-2xl border border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">
              Zoom:
            </span>
            <button
              onClick={() => setTvZoom((z) => Math.max(75, z - 10))}
              disabled={tvZoom <= 75}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40"
            >
              -
            </button>
            <span className="text-xs font-bold text-white px-2 min-w-[45px] text-center">
              {tvZoom}%
            </span>
            <button
              onClick={() => setTvZoom((z) => Math.min(160, z + 10))}
              disabled={tvZoom >= 160}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-40"
            >
              +
            </button>
            {tvZoom !== 100 && (
              <button
                onClick={() => setTvZoom(100)}
                className="text-[10px] font-bold text-rose-400 hover:underline px-1"
              >
                Reset
              </button>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Sinkronkan Spreadsheet"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-rose-500" : ""}`}
            />
          </button>

          <button
            onClick={toggleFullscreen}
            title="Layar Penuh (F11)"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button
            onClick={onCloseTvMode}
            className="px-3.5 py-2 bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Web</span>
          </button>
        </div>
      </div>

      {/* 3. Main TV Screen Content Body (Scaled by Zoom Level) */}
      <main className="flex-1 p-6 overflow-hidden flex flex-col justify-between min-h-0 bg-slate-950">
        <div
          style={{ zoom: `${tvZoom}%` }}
          className="flex-1 flex flex-col min-h-0 transition-all duration-150 origin-top"
        >
          {tvMode === "split" ? (
            /* Split View: Left Cards, Right Video */
            <div className="grid grid-cols-12 gap-6 h-full min-h-0">
              <div className="col-span-7 flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Agenda Kunjungan Solo Techno Park</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    Menampilkan {displayedItems.length} Agenda
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
                  {displayedItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="bg-slate-900 border border-slate-800 hover:border-rose-500/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between cursor-pointer transition-all hover:bg-slate-850 group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-rose-600/20 text-rose-400 border border-rose-500/30 text-[11px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {item.timeFormatted}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                            {item.kegiatan}
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-white group-hover:text-rose-400 transition-colors line-clamp-2">
                          {item.instansi}
                        </h4>

                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          <span>{item.dateFormatted || item.rawDateTime}</span>
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300 font-semibold truncate max-w-[150px]">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          {item.tempat}
                        </span>
                        <span className="text-rose-400 font-bold flex items-center gap-1">
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
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <h3 className="text-lg font-black text-white">
                    {tvMode === "today"
                      ? "Agenda Kunjungan Hari Ini"
                      : "Display Digital Signage Agenda Kunjungan"}
                  </h3>
                  <span className="bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full ml-1">
                    {activeItems.length} Agenda
                  </span>
                </div>

                {tvMode === "carousel" && (
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Auto-Slide ({slideInterval}s)
                  </span>
                )}
              </div>

              {/* Grid of 6 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-1 min-h-0 overflow-y-auto pr-1">
                {displayedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="bg-slate-900 border border-slate-800 hover:border-rose-500 rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer transition-all hover:bg-slate-850 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 to-rose-500" />

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono text-xs font-black px-3 py-1 rounded-xl flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {item.timeFormatted}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {item.isToday && (
                            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md animate-pulse">
                              Hari Ini
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-slate-300 uppercase bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                            {item.kegiatan}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xl font-black text-white group-hover:text-rose-400 transition-colors leading-snug mb-2">
                        {item.instansi}
                      </h4>

                      <p className="text-xs font-semibold text-slate-400 mb-4 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{item.dateFormatted || item.rawDateTime}</span>
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{item.tempat}</span>
                      </div>

                      <div className="flex items-center gap-1.5 justify-end font-semibold text-slate-400">
                        <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>
                          {item.jumlahPeserta && item.jumlahPeserta !== "-"
                            ? `${item.jumlahPeserta} Peserta`
                            : "Rombongan"}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 col-span-2 pt-1 flex items-center justify-between">
                        <span>PIC: {item.pic}</span>
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Lihat Detail
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Carousel Progress Bar */}
        {tvMode === "carousel" && totalPages > 1 && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span>
                Halaman {currentPage + 1} dari {totalPages}
              </span>
              <div className="flex gap-1.5 ml-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i);
                      setProgress(0);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      currentPage === i ? "w-6 bg-rose-500" : "w-2 bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-40 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setCurrentPage((p) => (p > 0 ? p - 1 : totalPages - 1));
                    setProgress(0);
                  }}
                  className="p-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCurrentPage((p) => (p + 1) % totalPages);
                    setProgress(0);
                  }}
                  className="p-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 border-t-2 border-rose-600 px-6 py-2.5 flex items-center justify-between text-xs shrink-0 overflow-hidden">
        <span className="bg-rose-600 text-white font-black px-3 py-1 rounded mr-4 shrink-0 uppercase tracking-wider text-[11px] z-10 shadow-sm">
          INFO RESEPSIONIS
        </span>
        <div className="flex-1 overflow-hidden whitespace-nowrap relative">
          <div className="animate-marquee inline-flex items-center gap-12 font-semibold text-slate-200">
            <span>
              Selamat datang di Solo Techno Park (STP). Bagi rombongan tamu kunjungan
              industri dan kedinasan, harap melapor ke Petugas Resepsionis Gedung
              Utama sebelum memasuki ruangan acara. Area parkir bus dan kendaraan
              tamu tersedia di Area Parkir Timur STP.
            </span>
            <span>
              Data agenda kunjungan diperbarui secara langsung (real-time) melalui integrasi Google Spreadsheet SIVIKA.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
