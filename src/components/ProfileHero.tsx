"use client";

import React from "react";
import {
  Tv,
  Calendar,
  Building,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { SPREADSHEET_URL } from "@/lib/sheets";

interface ProfileHeroProps {
  onOpenTvMode: () => void;
  totalSchedule: number;
  todayCount: number;
}

export default function ProfileHero({
  onOpenTvMode,
  totalSchedule,
  todayCount,
}: ProfileHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-rose-50/20 to-white py-14 sm:py-20 border-b border-slate-100">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-700 shadow-xs">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>Pusat Inovasi, Sains, & Teknologi Kota Surakarta</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Sistem Informasi Kunjungan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                Solo Techno Park
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
              Platform transparansi jadwal kunjungan industri, studi komparatif, dan
              agenda pelatihan vokasi terpadu di Solo Techno Park yang tersinkronisasi
              langsung dengan Google Spreadsheet secara *real-time*.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenTvMode}
                className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold rounded-2xl text-sm shadow-lg shadow-rose-600/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Tv className="w-5 h-5 animate-pulse" />
                <span>Buka Mode Display TV Lobi</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#jadwal"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl text-sm border-2 border-slate-200 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-rose-600" />
                <span>Jelajahi Jadwal ({totalSchedule})</span>
              </a>

              <a
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-2xl text-xs transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Spreadsheet</span>
              </a>
            </div>

            {/* Features check */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Otomatis Sinkron Spreadsheet</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mendukung Layar Signage 16:9 & Zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Broadcast Display Kiosk Lobi</span>
              </div>
            </div>
          </div>

          {/* Right Highlights Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Card 1: Agenda Terdaftar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-rose-300 transition-all flex flex-col justify-between">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {totalSchedule || "1.270+"}
                </span>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  Agenda Kunjungan
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tercatat di basis data spreadsheet
                </p>
              </div>
            </div>

            {/* Card 2: Hari Ini */}
            <div className="bg-gradient-to-br from-rose-600 to-red-700 text-white p-6 rounded-3xl shadow-lg shadow-rose-600/20 flex flex-col justify-between">
              <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4 backdrop-blur-md">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {todayCount}
                </span>
                <p className="text-xs font-bold text-rose-100 mt-1">
                  Agenda Hari Ini
                </p>
                <p className="text-[11px] text-rose-200 mt-0.5">
                  Siap ditayangkan pada TV lobi
                </p>
              </div>
            </div>

            {/* Card 3: Gedung & Klaster */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-rose-300 transition-all flex flex-col justify-between">
              <div className="p-3 bg-slate-100 text-slate-700 rounded-2xl w-fit mb-4">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  9+
                </span>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  Klaster & Fasilitas
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  RnD, Sembrani, GoTo, Auditorium
                </p>
              </div>
            </div>

            {/* Card 4: Talenta Terlatih */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-rose-300 transition-all flex flex-col justify-between">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  50.000+
                </span>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  Talenta Terlatih
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pelatihan vokasi & inkubasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
