"use client";

import React from "react";
import { Megaphone, Maximize, Settings2 } from "lucide-react";

interface DisplayFooterProps {
  onToggleControls?: () => void;
  showControls?: boolean;
}

export default function DisplayFooter({
  onToggleControls,
  showControls = false,
}: DisplayFooterProps) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const tickerMessages = [
    "Selamat datang di Solo Techno Park (STP) — Pusat Inovasi, Teknologi, dan Kewirausahaan Terpadu Kota Surakarta.",
    "Bagi rombongan Kunjungan Industri & Tamu Resmi, mohon melapor ke Pos Resepsionis Gedung Utama sebelum memasuki ruangan acara.",
    "Area Parkir Kendaraan Tamu & Bus Rombongan tersedia di Area Parkir Timur STP.",
    "Jadwal kunjungan diperbarui secara langsung (real-time) melalui integrasi Google Spreadsheet SIVIKA.",
    "Tetap jaga kebersihan dan ketertiban selama berada di kawasan Solo Techno Park.",
  ];

  return (
    <footer className="w-full bg-white text-slate-800 shrink-0 border-t border-slate-200 flex items-center justify-between text-xs overflow-hidden relative z-20 shadow-xs">
      {/* Sleek Obsidian STP Announcement Badge */}
      <div className="bg-slate-950 text-white font-extrabold px-4 py-2.5 flex items-center gap-2 shrink-0 shadow-xs tracking-wider text-xs uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        <Megaphone className="w-4 h-4 text-slate-300" />
        <span>INFO LOBI STP</span>
      </div>

      {/* Marquee Ticker */}
      <div className="flex-1 overflow-hidden whitespace-nowrap py-2.5 relative">
        <div className="animate-marquee inline-flex items-center gap-12 font-semibold text-slate-800">
          {tickerMessages.concat(tickerMessages).map((msg, idx) => (
            <div key={idx} className="inline-flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Buttons for Operator / TV Kiosk */}
      <div className="flex items-center gap-1.5 px-4 shrink-0 bg-white border-l border-slate-200">
        <button
          onClick={onToggleControls}
          title="Buka Pengaturan Mode Tampilan"
          className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold border ${
            showControls
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80"
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span className="hidden md:inline">Mode</span>
        </button>

        <button
          onClick={toggleFullscreen}
          title="Layar Penuh (F11)"
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 rounded-xl transition-all"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
