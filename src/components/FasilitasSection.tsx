"use client";

import React from "react";
import {
  Building2,
  Cpu,
  Layers,
  Sparkles,
  Flame,
  Gamepad2,
  ChevronRight,
} from "lucide-react";

export default function FasilitasSection() {
  const facilities = [
    {
      id: "rnd",
      name: "Gedung Riset & Rekayasa (RnD)",
      category: "Vokasi & Manufaktur Presisi",
      desc: "Laboratorium mesin CNC 5-Axis, rekayasa mekanik presisi, perakitan prototipe industri nasional, dan pelatihan kejuruan vokasi teknik.",
      icon: Cpu,
      stats: "Lab CNC & Vokasi Presisi",
      badge: "Aula RnD & Lab",
    },
    {
      id: "sembrani",
      name: "Gedung Sembrani (Tech Hub)",
      category: "Inovasi Digital & Startup",
      desc: "Kawasan ekosistem inovasi kemitraan Sea Group, co-working space kolaboratif, dan pusat akselerasi inkubasi bisnis startup teknologi.",
      icon: Layers,
      stats: "Pusat Inkubasi Bisnis",
      badge: "Tech Hub & Coworking",
    },
    {
      id: "goto",
      name: "GoTo UMKM Center",
      category: "Akselerasi Bisnis & E-Commerce",
      desc: "Pusat pendampingan, pelatihan komputasi awan, dan digitalisasi pelaku UMKM Surakarta bersama ekosistem GoTo agar berdaya saing nasional.",
      icon: Gamepad2,
      stats: "Pelatihan Digital UMKM",
      badge: "Kemitraan Industri",
    },
    {
      id: "auditorium",
      name: "Gedung Utama & Auditorium STP",
      category: "Konvensi & Pertemuan Resmi",
      desc: "Fasilitas pertemuan representatif mencakup Seminar Besar, Ruang Syailendra, dan Bale Tawang Arum berkapasitas ratusan peserta.",
      icon: Building2,
      stats: "Seminar Besar & Syailendra",
      badge: "Kunjungan Resmi",
    },
    {
      id: "migas",
      name: "Migas Corner (OGSCI)",
      category: "Vokasi Hulu Energi & Migas",
      desc: "Oil and Gas Skill Centre of Indonesia bersama SKK Migas dan KKKS untuk sarana edukasi visual, simulasi rig, serta sertifikasi keahlian energi.",
      icon: Flame,
      stats: "Sertifikasi SKK Migas",
      badge: "Pusat Diklat Energi",
    },
    {
      id: "creative",
      name: "Garena Gaming & Community Hub",
      category: "Ekonomi Kreatif & Esports",
      desc: "Arena kreativitas digital, turnamen esports resmi, studio animasi multimedia, dan laboratorium cetak 3D untuk komunitas muda dan mahasiswa.",
      icon: Sparkles,
      stats: "Creative Gaming Arena",
      badge: "Kreativitas Digital",
    },
  ];

  return (
    <section id="fasilitas" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full mb-3 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              <Building2 className="w-3.5 h-3.5 text-slate-700" />
              <span>Kawasan Solo Techno Park</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Klaster Fasilitas & Lokasi Kunjungan
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2 font-medium">
              Solo Techno Park memiliki beragam fasilitas bertaraf internasional untuk
              kegiatan pelatihan vokasi, kunjungan industri sekolah & kampus, serta
              penelitian inovatif.
            </p>
          </div>
          <span className="mt-4 md:mt-0 text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 w-fit">
            Area Luas 8 Hektar • Surakarta
          </span>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-slate-400 shadow-2xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top hairline accent bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-rose-600 transition-colors duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-100 text-slate-900 rounded-2xl group-hover:bg-slate-950 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-rose-50 group-hover:text-rose-700 transition-colors">
                      {f.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase block mb-1">
                    {f.category}
                  </span>
                  <h3 className="text-lg font-black text-slate-950 group-hover:text-rose-600 transition-colors duration-200">
                    {f.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>{f.stats}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1.5 transition-all duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
