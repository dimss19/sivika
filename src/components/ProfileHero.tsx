"use client";

import React from "react";
import {
  Tv,
  Calendar,
  Building,
  Users,
  ShieldCheck,
  ArrowRight,
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
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-14 sm:py-20 border-b border-slate-200/80">
      {/* Decorative ambient tint with smooth float animation */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200/90 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-2xs hover:scale-105 transition-transform duration-300">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>Pusat Inovasi, Sains, & Teknologi Kota Surakarta</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
              Sistem Informasi Kunjungan{" "}
              <span className="text-slate-900">Solo Techno Park</span>
              <span className="text-rose-600">.</span>
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
                className="px-6 py-3.5 bg-slate-950 hover:bg-black text-white font-extrabold rounded-2xl text-sm shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center gap-2.5 transition-all duration-200 border border-slate-800 group"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <Tv className="w-5 h-5 text-slate-300 group-hover:rotate-6 transition-transform duration-300" />
                <span>Buka Mode Display TV Lobi</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              <a
                href="#jadwal"
                className="px-6 py-3.5 bg-white hover:bg-slate-100 hover:scale-[1.02] active:scale-95 text-slate-900 font-bold rounded-2xl text-sm border-2 border-slate-200 transition-all duration-200 flex items-center gap-2 shadow-2xs"
              >
                <Calendar className="w-4 h-4 text-slate-600" />
                <span>Jelajahi Jadwal ({totalSchedule})</span>
              </a>

              <a
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 hover:scale-[1.02] active:scale-95 text-slate-700 font-semibold rounded-2xl text-xs transition-all duration-200 flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Spreadsheet</span>
              </a>
            </div>

            {/* Features check */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                <span>Otomatis Sinkron Spreadsheet</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                <span>Mendukung Layar Signage 16:9 & Fullscreen</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                <span>Broadcast Display Kiosk Lobi</span>
              </div>
            </div>
          </div>

          {/* Right Highlights Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {/* Card 1: Agenda Terdaftar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:border-slate-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between group">
              <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl w-fit mb-4 group-hover:bg-slate-950 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-950">
                  {totalSchedule || "1.270+"}
                </span>
                <p className="text-xs font-bold text-slate-700 mt-1">
                  Agenda Kunjungan
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tercatat di basis data spreadsheet
                </p>
              </div>
            </div>

            {/* Card 2: Hari Ini (Sleek Obsidian Black Card) */}
            <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col justify-between group hover:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-2xl w-fit backdrop-blur-md text-white group-hover:scale-110 group-hover:bg-rose-600 transition-all duration-300">
                  <Tv className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Hari Ini
                </span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {todayCount}
                </span>
                <p className="text-xs font-bold text-slate-200 mt-1">
                  Agenda Hari Ini
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Siap ditayangkan pada TV lobi
                </p>
              </div>
            </div>

            {/* Card 3: Gedung & Klaster */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:border-slate-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between group">
              <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl w-fit mb-4 group-hover:bg-slate-950 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-950">
                  9+
                </span>
                <p className="text-xs font-bold text-slate-700 mt-1">
                  Klaster & Fasilitas
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  RnD, Sembrani, GoTo, Auditorium
                </p>
              </div>
            </div>

            {/* Card 4: Talenta Terlatih */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:border-slate-400 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between group">
              <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl w-fit mb-4 group-hover:bg-slate-950 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-950">
                  50.000+
                </span>
                <p className="text-xs font-bold text-slate-700 mt-1">
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
