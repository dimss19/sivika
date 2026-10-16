"use client";

import React from "react";
import {
  CalendarDays,
  SlidersHorizontal,
  Tv,
  Film,
  RefreshCw,
  Search,
  X,
  Clock,
  Sparkles,
} from "lucide-react";

export type DisplayMode = "today" | "carousel" | "range" | "split";

interface ModeControlsProps {
  mode: DisplayMode;
  onModeChange: (newMode: DisplayMode) => void;
  slideInterval: number; // in seconds
  onIntervalChange: (sec: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isOpen: boolean;
  onClose: () => void;
  todayCount: number;
  totalCount: number;
}

export default function ModeControls({
  mode,
  onModeChange,
  slideInterval,
  onIntervalChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing,
  isOpen,
  onClose,
  todayCount,
  totalCount,
}: ModeControlsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border-2 border-rose-100 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-600 text-white rounded-xl shadow-md shadow-rose-600/20">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Pengaturan Tampilan Layar TV
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pilih mode penayangan agenda digital signage STP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Pilih Mode Display TV
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Mode Hari Ini */}
            <button
              onClick={() => {
                onModeChange("today");
                onClose();
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                mode === "today"
                  ? "bg-rose-50/80 border-rose-600 shadow-sm"
                  : "bg-slate-50/50 border-slate-200 hover:border-rose-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <CalendarDays
                  className={`w-5 h-5 ${
                    mode === "today" ? "text-rose-600" : "text-slate-500"
                  }`}
                />
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {todayCount} Agenda
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Khusus Hari Ini</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Fokus menampilkan agenda kunjungan untuk hari ini saja.
              </p>
            </button>

            {/* Mode Carousel TV */}
            <button
              onClick={() => {
                onModeChange("carousel");
                onClose();
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                mode === "carousel"
                  ? "bg-rose-50/80 border-rose-600 shadow-sm"
                  : "bg-slate-50/50 border-slate-200 hover:border-rose-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Tv
                  className={`w-5 h-5 ${
                    mode === "carousel" ? "text-rose-600" : "text-slate-500"
                  }`}
                />
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  Auto-Slide
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Carousel TV Signage</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Rotasi halaman otomatis setiap {slideInterval} detik.
              </p>
            </button>

            {/* Mode Split TV & Video */}
            <button
              onClick={() => {
                onModeChange("split");
                onClose();
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                mode === "split"
                  ? "bg-rose-50/80 border-rose-600 shadow-sm"
                  : "bg-slate-50/50 border-slate-200 hover:border-rose-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Film
                  className={`w-5 h-5 ${
                    mode === "split" ? "text-rose-600" : "text-slate-500"
                  }`}
                />
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Dual Screen
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Split Jadwal & Video</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Berdampingan dengan pemutar video profil Solo Techno Park.
              </p>
            </button>

            {/* Mode Rentang / Semua */}
            <button
              onClick={() => {
                onModeChange("range");
                onClose();
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                mode === "range"
                  ? "bg-rose-50/80 border-rose-600 shadow-sm"
                  : "bg-slate-50/50 border-slate-200 hover:border-rose-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sparkles
                  className={`w-5 h-5 ${
                    mode === "range" ? "text-rose-600" : "text-slate-500"
                  }`}
                />
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {totalCount} Total
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Semua / Mendatang</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Daftar lengkap agenda kunjungan mendatang di STP.
              </p>
            </button>
          </div>
        </div>

        {/* Carousel Interval Slider (If Carousel is active) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-600" />
              Durasi Ganti Slide Otomatis:
            </span>
            <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
              {slideInterval} Detik
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="30"
            step="2"
            value={slideInterval}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
            className="w-full accent-rose-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
            <span>6 detik (Cepat)</span>
            <span>15 detik (Normal)</span>
            <span>30 detik (Santai)</span>
          </div>
        </div>

        {/* Search Input Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Cari Instansi / Lokasi Ruangan
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Contoh: Universitas, SMK, Gedung RnD, GoTo..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>

        {/* Refresh & Close Action */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-rose-600" : ""}`} />
            <span>{isRefreshing ? "Menyinkronkan..." : "Sinkronkan Spreadsheet"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
          >
            Terapkan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
