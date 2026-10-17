"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  Calendar,
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
  CloudSun,
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

function formatKegiatan(kegiatan: string): string {
  if (!kegiatan || kegiatan.trim() === "-" || kegiatan.trim() === "") {
    return "Agenda Kunjungan";
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
  const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null);

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

  // Fetch real live weather for Surakarta (-7.5583, 110.8317)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-7.5583&longitude=110.8317&current=temperature_2m,weather_code&timezone=Asia%2FJakarta"
        );
        const d = await res.json();
        if (d && d.current) {
          const code = d.current.weather_code;
          let desc = "Cerah Berawan";
          if (code === 0) desc = "Cerah";
          else if (code <= 3) desc = "Cerah Berawan";
          else if (code <= 48) desc = "Berkabut";
          else if (code <= 67) desc = "Hujan";
          else desc = "Berawan";

          setWeather({
            temp: Math.round(d.current.temperature_2m),
            desc,
          });
        }
      } catch {
        // Fallback or offline: ignore gracefully
      }
    };

    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000); // 10 minutes
    return () => clearInterval(weatherTimer);
  }, []);

  // Filter items based on TV Mode with precise chronological order
  const todayItems = useMemo(() => {
    return data
      .filter((item) => item.isToday)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  const upcomingItems = useMemo(() => {
    return data
      .filter((item) => !item.isToday && item.isUpcoming)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  const pastItems = useMemo(() => {
    return data
      .filter((item) => !item.isToday && !item.isUpcoming)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [data]);

  // Prioritize today + upcoming items in chronological sequence
  const relevantItems = useMemo(() => {
    return [...todayItems, ...upcomingItems, ...pastItems];
  }, [todayItems, upcomingItems, pastItems]);

  const activeItems = useMemo(() => {
    if (tvMode === "today") {
      return todayItems.length > 0 ? todayItems : relevantItems.slice(0, 7);
    }
    if (tvMode === "split") {
      return relevantItems.slice(0, 16);
    }
    // "carousel" mode: rotate through the 35 most relevant items (5 slides of 7 station board rows = a 60-second cycle)
    return relevantItems.slice(0, 35);
  }, [tvMode, todayItems, relevantItems]);

  const itemsPerPage = tvMode === "split" ? 4 : 7;
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

        {/* Center: Clean 3-Tab Station Mode Switcher */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 shadow-2xs shrink-0">
          <button
            onClick={() => handleModeChange("carousel")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              tvMode === "carousel"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Papan Jadwal</span>
          </button>

          <button
            onClick={() => handleModeChange("today")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              tvMode === "today"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
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

        {/* Right: Date, Weather, Clock, and Quick Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Live Surakarta Weather */}
          {weather && (
            <div className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 shadow-2xs">
              <CloudSun className="w-3.5 h-3.5 text-rose-600" />
              <span>Surakarta {weather.temp}°C • {weather.desc}</span>
            </div>
          )}

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
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h2 className="text-sm sm:text-base font-black text-slate-950 tracking-tight">
              {tvMode === "today"
                ? "Papan Jadwal Kunjungan Hari Ini"
                : tvMode === "split"
                ? "Papan Jadwal Kunjungan & Video Kawasan STP"
                : "Papan Informasi Jadwal Kunjungan Solo Techno Park"}
            </h2>
            <span className="bg-white text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200/90 shadow-2xs">
              {displayedItems.length} dari {activeItems.length} Agenda
            </span>
          </div>

          {/* Station Board Page Indicator & Controls */}
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
                  className="p-1.5 bg-white hover:bg-slate-100 hover:scale-110 active:scale-90 border border-slate-200 rounded-xl transition-all duration-150 shadow-2xs text-slate-700"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentPage((p) => (p + 1) % totalPages);
                    setProgress(0);
                  }}
                  title="Halaman Berikutnya"
                  className="p-1.5 bg-white hover:bg-slate-100 hover:scale-110 active:scale-90 border border-slate-200 rounded-xl transition-all duration-150 shadow-2xs text-slate-700"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notice for Today Mode if empty */}
        {tvMode === "today" && todayItems.length === 0 && (
          <div className="mb-2 bg-amber-50 border border-amber-200/90 text-amber-900 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold shrink-0 animate-in fade-in duration-300">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Tidak ada agenda kunjungan khusus untuk hari ini (
              {date || "Hari Ini"}). Menampilkan jadwal resmi terdekat berikutnya:
            </span>
          </div>
        )}

        {/* Station Board Display Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {tvMode === "split" ? (
            /* Split Screen Layout (Left Station Rows, Right Video) */
            <div className="grid grid-cols-12 gap-5 h-full min-h-0">
              <div className="col-span-7 flex flex-col h-full min-h-0">
                {/* Station Board Column Headers */}
                <div className="bg-slate-950 text-white rounded-2xl px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider flex items-center font-bold border border-slate-800 shadow-xs mb-2 shrink-0">
                  <div className="w-40 shrink-0 flex items-center gap-1.5 pl-1">
                    <Clock className="w-3 h-3 text-rose-500" />
                    <span>WAKTU</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-3">
                    <span>INSTANSI & AGENDA</span>
                  </div>
                  <div className="w-36 shrink-0 flex items-center gap-1.5 pr-2">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>RUANGAN</span>
                  </div>
                  <div className="w-24 shrink-0 text-center">
                    <span>STATUS</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-2 min-h-0 overflow-hidden">
                  {displayedItems.map((item, index) => {
                    const cat = getCategoryBadge(item.kategori);
                    const formattedKegiatan = formatKegiatan(item.kegiatan);
                    return (
                      <div
                        key={`${activePage}-${item.id}`}
                        onClick={() => onSelectItem(item)}
                        className={`animate-card-enter stagger-${(index % 4) + 1} bg-white hover:bg-slate-100/90 border border-slate-200/90 hover:border-slate-400 rounded-2xl px-4 py-3 flex items-center shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden shrink-0 flex-1 min-h-[56px]`}
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            item.isToday
                              ? "bg-rose-600"
                              : "bg-slate-900 group-hover:bg-rose-600"
                          } transition-colors duration-200`}
                        />

                        {/* Waktu & Tanggal */}
                        <div className="w-40 shrink-0 pl-1.5">
                          <div className="bg-slate-950 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs w-fit group-hover:bg-slate-900 transition-colors">
                            <Clock className="w-3 h-3 text-rose-400" />
                            <span>{item.timeFormatted}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate font-medium">
                            {item.dateFormatted || item.rawDateTime}
                          </p>
                        </div>

                        {/* Instansi & Kegiatan */}
                        <div className="flex-1 min-w-0 pr-3">
                          <h3 className="text-sm font-black text-slate-950 group-hover:text-rose-600 transition-colors tracking-tight truncate">
                            {item.instansi}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider shrink-0 ${cat.badge}`}
                            >
                              {cat.label}
                            </span>
                            <span className="text-[11px] text-slate-600 truncate font-semibold">
                              {formattedKegiatan}
                            </span>
                          </div>
                        </div>

                        {/* Ruangan */}
                        <div className="w-36 shrink-0 flex items-center gap-1.5 pr-2">
                          <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:scale-110 group-hover:bg-rose-100 transition-all">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.tempat}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="w-24 shrink-0 text-center">
                          {item.isToday ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                              HARI INI
                            </span>
                          ) : item.isUpcoming ? (
                            <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider bg-slate-950 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                              TERJADWAL
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[9px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                              SELESAI
                            </span>
                          )}
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
            /* Full Railway Station Departure Board Layout (Clean, Tabular, High-Contrast PIDS) */
            <div className="flex-1 flex flex-col min-h-0 overflow-x-auto">
              <div className="min-w-[840px] flex-1 flex flex-col min-h-0">
                {/* Station Board Column Headers Bar */}
                <div className="bg-slate-950 text-white rounded-2xl px-5 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center font-bold border border-slate-800 shadow-xs mb-2 shrink-0">
                  <div className="w-48 lg:w-56 shrink-0 flex items-center gap-1.5 pl-2">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>WAKTU & TANGGAL</span>
                  </div>
                  <div className="w-64 lg:w-80 xl:w-96 shrink-0 pr-4">
                    <span>INSTANSI / TAMU</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-4 hidden md:block">
                    <span>AGENDA KEGIATAN</span>
                  </div>
                  <div className="w-44 lg:w-52 shrink-0 flex items-center gap-1.5 pr-3">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>LOKASI RUANGAN</span>
                  </div>
                  <div className="w-24 lg:w-28 shrink-0 text-center">
                    <span>PESERTA</span>
                  </div>
                  <div className="w-28 lg:w-32 shrink-0 text-center">
                    <span>STATUS</span>
                  </div>
                </div>

                {/* Station Board Departure Rows (7 Rows per Slide) */}
                <div className="flex-1 flex flex-col justify-between gap-1.5 min-h-0 overflow-hidden">
                  {displayedItems.map((item, index) => {
                    const cat = getCategoryBadge(item.kategori);
                    const formattedKegiatan = formatKegiatan(item.kegiatan);
                    return (
                      <div
                        key={`${activePage}-${item.id}`}
                        onClick={() => onSelectItem(item)}
                        className={`animate-card-enter stagger-${(index % 7) + 1} bg-white hover:bg-slate-100/90 border border-slate-200/90 hover:border-slate-400 rounded-2xl px-4 sm:px-5 py-2.5 flex items-center shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden shrink-0 flex-1 min-h-[48px]`}
                      >
                        {/* Left Status Accent Indicator Bar */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            item.isToday
                              ? "bg-rose-600"
                              : "bg-slate-900 group-hover:bg-rose-600"
                          } transition-colors duration-200`}
                        />

                        {/* 1. WAKTU & TANGGAL */}
                        <div className="w-48 lg:w-56 shrink-0 flex items-center gap-2.5 pl-2">
                          <div className="bg-slate-950 text-white font-mono text-xs sm:text-sm font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs shrink-0 group-hover:bg-slate-900 transition-colors">
                            <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{item.timeFormatted}</span>
                          </div>
                          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                            {item.dateFormatted || item.rawDateTime}
                          </div>
                        </div>

                        {/* 2. INSTANSI / ROMBONGAN TAMU */}
                        <div className="w-64 lg:w-80 xl:w-96 shrink-0 pr-4">
                          <h3 className="text-sm sm:text-base lg:text-lg font-black text-slate-950 group-hover:text-rose-600 transition-colors tracking-tight truncate">
                            {item.instansi}
                          </h3>
                          {item.pic && item.pic !== "-" && (
                            <p className="text-[10px] text-slate-400 truncate">
                              PIC: {item.pic}
                            </p>
                          )}
                        </div>

                        {/* 3. AGENDA KEGIATAN */}
                        <div className="flex-1 min-w-0 pr-4 hidden md:flex items-center gap-2">
                          <span
                            className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider shrink-0 ${cat.badge}`}
                          >
                            {cat.label}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                            {formattedKegiatan}
                          </span>
                        </div>

                        {/* 4. RUANGAN / LOKASI */}
                        <div className="w-44 lg:w-52 shrink-0 flex items-center gap-2 pr-3">
                          <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-200">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.tempat}
                          </span>
                        </div>

                        {/* 5. PESERTA */}
                        <div className="w-24 lg:w-28 shrink-0 text-center">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span>
                              {item.jumlahPeserta && item.jumlahPeserta !== "-"
                                ? `${item.jumlahPeserta} Pax`
                                : "Rombongan"}
                            </span>
                          </span>
                        </div>

                        {/* 6. STATUS */}
                        <div className="w-28 lg:w-32 shrink-0 text-center">
                          {item.isToday ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider bg-rose-600 text-white px-3 py-1 rounded-full shadow-xs animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                              HARI INI
                            </span>
                          ) : item.status.toLowerCase() === "reschedule" ? (
                            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full">
                              RESCHEDULE
                            </span>
                          ) : item.status.toLowerCase() === "cancel" ? (
                            <span className="inline-flex items-center text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-3 py-1 rounded-full">
                              BATAL
                            </span>
                          ) : item.isUpcoming ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-slate-950 text-white px-3 py-1 rounded-full shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              TERJADWAL
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full">
                              SELESAI
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
              Data agenda diperbarui secara berkala dan tersinkronisasi otomatis pada
              Sistem Informasi Digital Signage SIVIKA Solo Techno Park.
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
