"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Tv,
  Calendar,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";
import { SPREADSHEET_URL } from "@/lib/sheets";

interface WebNavbarProps {
  onOpenTvMode: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalSchedule: number;
  isLive: boolean;
}

export default function WebNavbar({
  onOpenTvMode,
  onRefresh,
  isRefreshing,
  totalSchedule,
  isLive,
}: WebNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3.5">
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative w-14 h-12 flex items-center justify-center p-1 bg-white rounded-xl border border-slate-100 shadow-xs group-hover:border-rose-300 transition-all">
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
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                    SOLO<span className="text-rose-600">TECHNOPARK</span>
                  </span>
                  <span className="hidden sm:inline-block bg-rose-50 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
                    SIVIKA
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Sistem Informasi Kunjungan & Portal Agenda
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700">
            <a
              href="#profil"
              className="px-3.5 py-2 rounded-xl hover:text-rose-600 hover:bg-slate-50 transition-all"
            >
              Profil STP
            </a>
            <a
              href="#fasilitas"
              className="px-3.5 py-2 rounded-xl hover:text-rose-600 hover:bg-slate-50 transition-all"
            >
              Fasilitas & Kawasan
            </a>
            <a
              href="#jadwal"
              className="px-3.5 py-2 rounded-xl hover:text-rose-600 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>Jadwal Kunjungan</span>
            </a>
            <a
              href="#video"
              className="px-3.5 py-2 rounded-xl hover:text-rose-600 hover:bg-slate-50 transition-all"
            >
              Video Profil
            </a>
            <a
              href="#kontak"
              className="px-3.5 py-2 rounded-xl hover:text-rose-600 hover:bg-slate-50 transition-all"
            >
              Kontak
            </a>
          </nav>

          {/* Live Sync Badge & TV Action Button */}
          <div className="flex items-center gap-2.5">
            {/* Live Sync Status */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-700">
                {isLive ? "Live Sync" : "Cached"}
              </span>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Sinkronkan Data Spreadsheet Sekarang"
                className="text-slate-400 hover:text-rose-600 transition-all disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-rose-600" : ""}`}
                />
              </button>
            </div>

            {/* Launch TV Display Button */}
            <button
              onClick={onOpenTvMode}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-600/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Tv className="w-4 h-4 animate-pulse" />
              <span>Display TV Lobi</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 text-xs font-bold text-slate-700 animate-in slide-in-from-top-2 duration-150">
          <a
            href="#profil"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl hover:bg-slate-50"
          >
            Profil STP
          </a>
          <a
            href="#fasilitas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl hover:bg-slate-50"
          >
            Fasilitas & Kawasan
          </a>
          <a
            href="#jadwal"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl hover:bg-slate-50 text-rose-600"
          >
            Jadwal Kunjungan ({totalSchedule} Agenda)
          </a>
          <a
            href="#video"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl hover:bg-slate-50"
          >
            Video Profil STP
          </a>
          <a
            href={SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-500"
          >
            Buka Google Spreadsheet
          </a>
        </div>
      )}
    </header>
  );
}
