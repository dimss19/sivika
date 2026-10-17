"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Tv,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";

interface WebNavbarProps {
  onOpenTvMode: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalSchedule: number;
}

export default function WebNavbar({
  onOpenTvMode,
  onRefresh,
  isRefreshing,
  totalSchedule,
}: WebNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="relative w-12 sm:w-14 h-11 sm:h-12 flex items-center justify-center p-1 bg-white rounded-xl border border-slate-200 shadow-xs group-hover:border-slate-400 transition-all shrink-0">
                <Image
                  src="/logo.png"
                  alt="Solo Techno Park"
                  width={56}
                  height={44}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-950 truncate">
                    SOLO<span className="text-slate-900">TECHNO</span><span className="text-rose-600">PARK</span>
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    SIVIKA
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide truncate hidden sm:block">
                  Sistem Informasi Kunjungan & Portal Agenda
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700">
            <a
              href="#jadwal"
              className="px-3.5 py-2 rounded-xl hover:text-slate-950 hover:bg-slate-100 transition-all text-slate-900 font-extrabold"
            >
              Jadwal Kunjungan
            </a>
            <a
              href="#fasilitas"
              className="px-3.5 py-2 rounded-xl hover:text-slate-950 hover:bg-slate-100 transition-all"
            >
              Fasilitas & Kawasan
            </a>
            <a
              href="#video"
              className="px-3.5 py-2 rounded-xl hover:text-slate-950 hover:bg-slate-100 transition-all"
            >
              Video Profil
            </a>
            <a
              href="#kontak"
              className="px-3.5 py-2 rounded-xl hover:text-slate-950 hover:bg-slate-100 transition-all"
            >
              Kontak
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Perbarui Data Jadwal"
              className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all disabled:opacity-50 border border-slate-200/80 shrink-0"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-slate-900" : ""}`}
              />
            </button>

            {/* Launch TV Display Button */}
            <button
              onClick={onOpenTvMode}
              title="Display TV Lobi"
              aria-label="Display TV Lobi"
              className="p-2 sm:p-2.5 bg-slate-950 hover:bg-black text-white rounded-xl transition-all shadow-xs hover:shadow-md border border-slate-800 shrink-0 flex items-center justify-center"
            >
              <Tv className="w-4 h-4 text-slate-200" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all shrink-0"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-1.5 text-xs font-bold text-slate-700 animate-in slide-in-from-top-2 duration-150">
          <a
            href="#jadwal"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-rose-600 font-extrabold"
          >
            Jadwal Kunjungan ({totalSchedule} Agenda)
          </a>
          <a
            href="#fasilitas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl hover:bg-slate-50"
          >
            Fasilitas & Kawasan
          </a>
          <a
            href="#video"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl hover:bg-slate-50"
          >
            Video Profil
          </a>
          <a
            href="#kontak"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl hover:bg-slate-50"
          >
            Kontak & Lokasi
          </a>
        </div>
      )}
    </header>
  );
}
