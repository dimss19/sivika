"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import { JadwalKunjungan } from "@/lib/sheets";
import { DisplayMode } from "./ModeControls";

interface JadwalGridProps {
  items: JadwalKunjungan[];
  mode: DisplayMode;
  slideInterval?: number; // in seconds
  isSplitView?: boolean;
}

export default function JadwalGrid({
  items,
  mode,
  slideInterval = 10,
  isSplitView = false,
}: JadwalGridProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  // Items per page based on layout
  const itemsPerPage = isSplitView ? 4 : 6;
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Reset page when items or mode changes
  useEffect(() => {
    setCurrentPage(0);
    setProgress(0);
  }, [items.length, mode]);

  // Auto carousel rotation
  useEffect(() => {
    if (mode !== "carousel" || totalPages <= 1) {
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
  }, [mode, totalPages, slideInterval]);

  const displayedItems =
    mode === "carousel"
      ? items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
      : items;

  const getActivityBadgeColor = (kegiatan: string) => {
    const k = kegiatan.toLowerCase();
    if (k.includes("industri")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    }
    if (k.includes("training") || k.includes("pelatihan")) {
      return "bg-amber-50 text-amber-700 border-amber-200/80";
    }
    if (k.includes("kerja") || k.includes("rapat") || k.includes("koordinasi")) {
      return "bg-blue-50 text-blue-700 border-blue-200/80";
    }
    return "bg-rose-50 text-rose-700 border-rose-200/80";
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-rose-200/80 text-center shadow-sm">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-4 shadow-sm border border-rose-100">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-800">
          Belum Ada Agenda Kunjungan
        </h3>
        <p className="text-sm text-slate-500 max-w-md mt-1.5 font-medium">
          Tidak ditemukan jadwal kunjungan aktif untuk kriteria filter ini. Data
          disinkronkan otomatis dari Google Spreadsheet SIVIKA Solo Techno Park.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0">
      {/* Cards Grid */}
      <div
        className={`grid gap-4 flex-1 overflow-y-auto pr-1 ${
          isSplitView
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {displayedItems.map((item, idx) => {
          return (
            <div
              key={item.id || idx}
              className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                item.isToday
                  ? "bg-white border-2 border-rose-500 shadow-lg shadow-rose-600/10"
                  : "bg-white border border-slate-200/90 hover:border-rose-300 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Fresh Top Accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  item.isToday
                    ? "bg-gradient-to-r from-red-600 via-rose-500 to-red-600"
                    : "bg-gradient-to-r from-slate-200 to-slate-100 group-hover:from-rose-400 group-hover:to-red-500 transition-all"
                }`}
              />

              <div>
                {/* Header Row: Time & Activity */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-xl font-bold text-xs border border-rose-200/70 shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>{item.timeFormatted}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.isToday && (
                      <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm animate-pulse">
                        <Flame className="w-3 h-3 fill-white" />
                        Hari Ini
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${getActivityBadgeColor(
                        item.kegiatan
                      )}`}
                    >
                      {item.kegiatan}
                    </span>
                  </div>
                </div>

                {/* Institution Name */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug tracking-tight mb-2 group-hover:text-rose-700 transition-colors">
                  {item.instansi}
                </h3>

                {/* Date Badge */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{item.dateFormatted || item.rawDateTime}</span>
                </div>
              </div>

              {/* Bottom Meta Information Grid */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate" title={item.tempat}>
                    {item.tempat}
                  </span>
                </div>

                {/* Participants */}
                <div className="flex items-center gap-1.5 text-slate-600 font-medium justify-end">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {item.jumlahPeserta && item.jumlahPeserta !== "-"
                      ? `${item.jumlahPeserta} Peserta`
                      : "Rombongan"}
                  </span>
                </div>

                {/* PIC STP */}
                <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">PIC: {item.pic}</span>
                </div>

                {/* Surat */}
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] justify-end">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{item.noSurat}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel Navigation & Progress Bar (when mode is carousel) */}
      {mode === "carousel" && totalPages > 1 && (
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between shrink-0 bg-white/70 backdrop-blur-xs px-4 py-2.5 rounded-2xl border">
          {/* Page Indicators */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Halaman {currentPage + 1} dari {totalPages}
            </span>
            <div className="flex gap-1.5 ml-2">
              {Array.from({ length: totalPages }).map((_, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => {
                    setCurrentPage(pIdx);
                    setProgress(0);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentPage === pIdx
                      ? "w-7 bg-rose-600"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar of next slide */}
          <div className="flex items-center gap-3">
            <div className="w-36 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
                  setProgress(0);
                }}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentPage((prev) => (prev + 1) % totalPages);
                  setProgress(0);
                }}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
