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
    <footer className="w-full bg-slate-900 text-white shrink-0 border-t-2 border-rose-600 flex items-center justify-between text-xs overflow-hidden relative z-20">
      {/* Red STP Announcement Badge */}
      <div className="bg-rose-600 text-white font-extrabold px-5 py-3 flex items-center gap-2 shrink-0 shadow-lg tracking-wider text-xs uppercase">
        <Megaphone className="w-4 h-4 text-white animate-bounce" />
        <span>INFO LOBI STP</span>
      </div>

      {/* Marquee Ticker */}
      <div className="flex-1 overflow-hidden whitespace-nowrap py-3 relative">
        <div className="animate-marquee inline-flex items-center gap-12 font-medium text-slate-200">
          {tickerMessages.concat(tickerMessages).map((msg, idx) => (
            <div key={idx} className="inline-flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Buttons for Operator / TV Kiosk */}
      <div className="flex items-center gap-1.5 px-4 shrink-0 bg-slate-900 border-l border-slate-800">
        <button
          onClick={onToggleControls}
          title="Buka Pengaturan Mode Tampilan"
          className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
            showControls
              ? "bg-rose-600 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span className="hidden md:inline">Mode</span>
        </button>

        <button
          onClick={toggleFullscreen}
          title="Layar Penuh (F11)"
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
