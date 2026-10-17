"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Clock,
  CalendarDays,
  Film,
  MapPin,
  Users,
  FileText,
  CircleDot,
  ChevronLeft,
  ChevronRight,
  Maximize,
  ArrowLeft,
  RefreshCw,
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

export type TVModeType = "carousel" | "today" | "split";

function formatKegiatan(kegiatan: string): string {
  if (!kegiatan || kegiatan.trim() === "-" || kegiatan.trim() === "") {
    return "";
  }
  const clean = kegiatan
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const lower = clean.toLowerCase();
  if (lower.includes("satpam")) {
    return "Pendidikan dan Pelatihan Satpam";
  }
  if (
    lower === "kunjungan industri" ||
    lower === "pelatihan" ||
    lower.startsWith("pembukaan")
  ) {
    return "";
  }
  return clean;
}

function getCategoryBadge(kategori: string) {
  switch (kategori) {
    case "Kunjungan Industri":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
        label: "KUNJUNGAN INDUSTRI",
      };
    case "Pelatihan":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-100",
        label: "PELATIHAN & DIKLAT",
      };
    case "Kunjungan Kerja":
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-100",
        label: "KUNJUNGAN KERJA",
      };
    default:
      return {
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        label: "AGENDA UMUM",
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
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [weather, setWeather] = useState<{ temp: number; desc: string } | null>({
    temp: 29,
    desc: "Cerah Berawan",
  });

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
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

  // Live weather for Surakarta (-7.5583, 110.8317)
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
        // Fallback default Surakarta weather
      }
    };

    fetchWeather();
    const weatherTimer = setInterval(fetchWeather, 600000);
    return () => clearInterval(weatherTimer);
  }, []);

  // Filter items
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

  const relevantItems = useMemo(() => {
    return [...todayItems, ...upcomingItems, ...pastItems];
  }, [todayItems, upcomingItems, pastItems]);

  const activeItems = useMemo(() => {
    if (tvMode === "today") {
      return todayItems.length > 0 ? todayItems : relevantItems.slice(0, 5);
    }
    if (tvMode === "split") {
      return relevantItems.slice(0, 16);
    }
    // "carousel" mode: rotate through 25 most relevant items
    return relevantItems.slice(0, 25);
  }, [tvMode, todayItems, relevantItems]);

  const itemsPerPage = tvMode === "split" ? 4 : 5;
  const totalPages = Math.max(1, Math.ceil(activeItems.length / itemsPerPage));

  const handleModeChange = (newMode: TVModeType) => {
    setTvMode(newMode);
    setCurrentPage(0);
  };

  // Auto-slide carousel rotation
  useEffect(() => {
    if (tvMode !== "carousel" || totalPages <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, slideInterval * 1000);

    return () => clearInterval(timer);
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
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] text-slate-900 flex flex-col justify-between overflow-y-auto overflow-x-hidden select-none">
      {/* 1. TOP HEADER BAR */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 sm:py-3 shadow-xs flex items-center justify-between shrink-0 relative z-30 gap-2">
        {/* Left: Logo & Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="relative w-10 sm:w-12 h-9 sm:h-10 flex items-center justify-center p-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <Image
              src="/logo.png"
              alt="Solo Techno Park"
              width={40}
              height={30}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950 flex items-center">
              SOLO<span className="text-rose-600">TECHNOPARK</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider uppercase whitespace-nowrap hidden sm:block">
              SIVIKA • SISTEM INFORMASI JADWAL KUNJUNGAN
            </p>
          </div>
        </div>

        {/* Center: 3 Navigation Tabs (Desktop & Tablet) */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2 shrink-0">
          <button
            onClick={() => handleModeChange("carousel")}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tvMode === "carousel"
                ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-600" />
            <span>Papan Jadwal</span>
          </button>

          <button
            onClick={() => handleModeChange("today")}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tvMode === "today"
                ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-500" />
            <span>Hari Ini ({todayItems.length})</span>
          </button>

          <button
            onClick={() => handleModeChange("split")}
            className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              tvMode === "split"
                ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Film className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-500" />
            <span>Split Video</span>
          </button>
        </div>

        {/* Right: Weather & Digital Clock Widgets + Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Weather Widget */}
          <div className="hidden lg:flex bg-white border border-slate-200/90 shadow-2xs rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 items-center gap-2.5 sm:gap-3">
            <CloudSun className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" />
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5 sm:mb-1">
                Surakarta
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                  {weather?.temp ?? 29}°
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 leading-none">
                  {weather?.desc ?? "Cerah Berawan"}
                </span>
              </div>
            </div>
          </div>

          {/* Clock Widget */}
          <div className="bg-white border border-slate-200/90 shadow-2xs rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[120px] sm:min-w-[145px]">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-600">
                LIVE
              </span>
            </div>
            <div className="text-lg sm:text-2xl font-black font-mono text-slate-900 tracking-tight leading-none mt-0.5 sm:mt-1">
              {time || "07:54 WIB"}
            </div>
            <div className="text-[9px] sm:text-[10px] font-medium text-slate-500 mt-0.5 sm:mt-1 leading-none truncate max-w-[140px] sm:max-w-none">
              {date || "Sabtu, 17 Oktober 2026"}
            </div>
          </div>

          {/* Quick Exit / Fullscreen buttons */}
          <div className="flex items-center gap-1 pl-0.5">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title={
                lastUpdated
                  ? `Muat Ulang Data (Terakhir: ${new Date(
                      lastUpdated
                    ).toLocaleTimeString("id-ID")})`
                  : "Muat Ulang Data"
              }
              className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? "animate-spin text-slate-900" : ""}`}
              />
            </button>
            <button
              onClick={toggleFullscreen}
              title="Layar Penuh TV (F11)"
              className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
            >
              <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={onCloseTvMode}
              title="Kembali ke Tampilan Web"
              className="p-2 sm:p-2.5 bg-slate-950 hover:bg-black text-white rounded-xl transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Subheader Navigation Tabs */}
      <div className="flex md:hidden items-center justify-around bg-white border-b border-slate-200 px-3 py-1.5 shrink-0 gap-1 text-[11px] font-bold">
        <button
          onClick={() => handleModeChange("carousel")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
            tvMode === "carousel"
              ? "bg-blue-50 text-blue-600 font-black"
              : "text-slate-600"
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Papan Jadwal</span>
        </button>

        <button
          onClick={() => handleModeChange("today")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
            tvMode === "today"
              ? "bg-blue-50 text-blue-600 font-black"
              : "text-slate-600"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Hari Ini ({todayItems.length})</span>
        </button>

        <button
          onClick={() => handleModeChange("split")}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
            tvMode === "split"
              ? "bg-blue-50 text-blue-600 font-black"
              : "text-slate-600"
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Split Video</span>
        </button>
      </div>

      {/* 2. MAIN TV BODY */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col justify-between min-h-0">
        {/* Title & Subtitle + Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-3 shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Jadwal Kunjungan
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5">
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Agenda kunjungan industri, pelatihan, dan kegiatan hari ini
              </p>
              <span className="bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                {displayedItems.length} dari {activeItems.length} agenda
              </span>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
              <button
                onClick={() => {
                  setCurrentPage((p) => (p > 0 ? p - 1 : totalPages - 1));
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-2xs transition-all"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-2xs">
                {String(activePage + 1).padStart(2, "0")} /{" "}
                {String(totalPages).padStart(2, "0")}
              </span>

              <button
                onClick={() => {
                  setCurrentPage((p) => (p + 1) % totalPages);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-2xs transition-all"
                title="Halaman Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Display Container: Split Mode vs Clean Board Mode */}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          {tvMode === "split" ? (
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 h-full min-h-0 overflow-y-auto">
              <div className="lg:col-span-7 flex flex-col h-full min-h-0 overflow-x-auto">
                <div className="min-w-[650px] flex flex-col h-full">
                  {/* Table Header Bar */}
                  <div className="bg-[#0F172A] text-white rounded-xl py-2.5 px-4 flex items-center text-[11px] font-bold tracking-wider uppercase mb-2 shadow-xs shrink-0">
                    <div className="w-36 shrink-0 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      <span>WAKTU</span>
                    </div>
                    <div className="flex-1 min-w-0 pr-3 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-300" />
                      <span>INSTANSI & AGENDA</span>
                    </div>
                    <div className="w-36 shrink-0 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-300" />
                      <span>LOKASI</span>
                    </div>
                    <div className="w-24 shrink-0 text-center">
                      <span>STATUS</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-2 min-h-0">
                    {displayedItems.map((item) => {
                      const cat = getCategoryBadge(item.kategori);
                      const formattedKegiatan = formatKegiatan(item.kegiatan);
                      return (
                        <div
                          key={item.id}
                          onClick={() => onSelectItem(item)}
                          className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all px-4 py-2.5 flex items-center shrink-0 flex-1 min-h-[50px] cursor-pointer"
                        >
                          <div className="w-36 shrink-0">
                            <div className="bg-blue-50 text-blue-600 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 w-fit">
                              <Clock className="w-3 h-3 text-blue-500" />
                              <span>{item.timeFormatted}</span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 pr-3">
                            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight uppercase truncate">
                              {item.instansi}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${cat.badge}`}
                              >
                                {cat.label}
                              </span>
                              {formattedKegiatan && (
                                <span className="text-[11px] text-slate-500 truncate font-medium">
                                  {formattedKegiatan}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="w-36 shrink-0 flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                              <MapPin className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 truncate">
                              {item.tempat}
                            </span>
                          </div>

                          <div className="w-24 shrink-0 text-center">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>TERJADWAL</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 h-full min-h-[300px] overflow-y-auto">
                <STPVideoPlayer />
              </div>
            </div>
          ) : (
            /* Clean TV Table Board with Horizontal Scroll Wrapper for Perfect Responsiveness */
            <div className="flex-1 flex flex-col justify-between min-h-0 overflow-x-auto overflow-y-visible">
              <div className="min-w-[920px] flex-1 flex flex-col justify-between min-h-0">
                {/* Table Header Bar */}
                <div className="bg-[#0F172A] text-white rounded-xl py-2.5 sm:py-3 px-5 sm:px-6 flex items-center text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-2.5 shadow-xs shrink-0">
                  <div className="w-40 sm:w-44 shrink-0 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span>WAKTU</span>
                  </div>
                  <div className="flex-1 min-w-[200px] pr-3 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-300" />
                    <span>INSTANSI / TAMU</span>
                  </div>
                  <div className="w-48 sm:w-56 shrink-0 pr-3 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-300" />
                    <span>AGENDA</span>
                  </div>
                  <div className="w-40 sm:w-48 shrink-0 pr-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-300" />
                    <span>LOKASI</span>
                  </div>
                  <div className="w-32 sm:w-36 shrink-0 pr-3 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-300" />
                    <span>PESERTA</span>
                  </div>
                  <div className="w-28 sm:w-32 shrink-0 flex items-center justify-center gap-1.5 text-center">
                    <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
                    <span>STATUS</span>
                  </div>
                </div>

                {/* Table Rows (Spaced cards) */}
                <div className="flex-1 flex flex-col justify-between gap-2 sm:gap-2.5 min-h-0 mb-2">
                  {displayedItems.map((item) => {
                    const cat = getCategoryBadge(item.kategori);
                    const formattedKegiatan = formatKegiatan(item.kegiatan);
                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all px-5 sm:px-6 py-2.5 sm:py-3.5 flex items-center shrink-0 flex-1 min-h-[50px] cursor-pointer"
                      >
                        {/* 1. Waktu */}
                        <div className="w-40 sm:w-44 shrink-0">
                          <div className="bg-blue-50 text-blue-600 font-bold text-xs sm:text-sm px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 w-fit">
                            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{item.timeFormatted}</span>
                          </div>
                        </div>

                        {/* 2. Instansi / Tamu */}
                        <div className="flex-1 min-w-[200px] pr-3">
                          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm lg:text-base tracking-tight uppercase truncate">
                            {item.instansi}
                          </h3>
                        </div>

                        {/* 3. Agenda */}
                        <div className="w-48 sm:w-56 shrink-0 pr-3">
                          <span
                            className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg uppercase tracking-wider inline-block ${cat.badge}`}
                          >
                            {cat.label}
                          </span>
                          {formattedKegiatan && (
                            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
                              {formattedKegiatan}
                            </p>
                          )}
                        </div>

                        {/* 4. Lokasi */}
                        <div className="w-40 sm:w-48 shrink-0 pr-3 flex items-center gap-2">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
                            {item.tempat}
                          </span>
                        </div>

                        {/* 5. Peserta */}
                        <div className="w-32 sm:w-36 shrink-0 pr-3 flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                          <span>
                            {item.jumlahPeserta && item.jumlahPeserta !== "-"
                              ? `${item.jumlahPeserta} peserta`
                              : "Rombongan"}
                          </span>
                        </div>

                        {/* 6. Status */}
                        <div className="w-28 sm:w-32 shrink-0 flex justify-center text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                            <span>TERJADWAL</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. BOTTOM INFO RESEPSIONIS BANNER */}
        <div className="bg-[#EBF3FF] border border-blue-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2.5 sm:gap-3 shadow-xs shrink-0 mt-1 sm:mt-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-black">
              i
            </div>
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-blue-900 uppercase">
              INFO RESEPSIONIS
            </span>
          </div>
          <span className="text-blue-300 font-light">|</span>
          <p className="text-[11px] sm:text-xs lg:text-sm font-medium text-slate-700 truncate">
            Seluruh rombongan tamu diharapkan melapor ke Petugas Resepsionis Gedung
            Utama sebelum memasuki ruangan acara.
          </p>
        </div>
      </main>
    </div>
  );
}
