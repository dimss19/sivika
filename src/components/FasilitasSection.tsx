"use client";

import React from "react";
import {
  Building2,
  Cpu,
  Layers,
  Sparkles,
  Flame,
  Gamepad2,
} from "lucide-react";

export default function FasilitasSection() {
  const facilities = [
    {
      id: "rnd",
      name: "Gedung Riset & Rekayasa (RnD)",
      category: "Manufaktur & Presisi",
      desc: "Laboratorium mesin CNC 5-Axis, rekayasa mekanik presisi, dan perakitan prototipe produk industri nasional.",
      icon: Cpu,
      stats: "Kapasitas 300+ Orang",
      badge: "Aula Utama & Lab",
    },
    {
      id: "sembrani",
      name: "Gedung Sembrani Incubator",
      category: "Inkubasi Bisnis & Startup",
      desc: "Ruang kolaborasi akselerasi startup teknologi, co-working space, dan kantor inkubasi talenta bisnis digital.",
      icon: Layers,
      stats: "20+ Tenant Startup",
      badge: "Pusat Inkubasi",
    },
    {
      id: "goto",
      name: "GoTo & Tech Partner Arena",
      category: "Teknologi Digital & E-Commerce",
      desc: "Pusat pengembangan teknologi komputasi awan, training e-commerce, dan creative gaming center.",
      icon: Gamepad2,
      stats: "Lab Komputer Canggih",
      badge: "Kolaborasi Industri",
    },
    {
      id: "auditorium",
      name: "Auditorium & Ruang Seminar STP",
      category: "Konvensi & Pertemuan Tamu",
      desc: "Ruang pertemuan modern berkapasitas ratusan peserta dengan fasilitas multimedia broadcast terpadu.",
      icon: Building2,
      stats: "Hingga 500 Peserta",
      badge: "Kunjungan Resmi",
    },
    {
      id: "migas",
      name: "Oil & Gas Training Center",
      category: "Vokasi Energi & Kelautan",
      desc: "Fasilitas simulasi operasi rig minyak dan gas serta sertifikasi kompetensi tenaga kerja energi terakreditasi.",
      icon: Flame,
      stats: "Sertifikasi Internasional",
      badge: "Pelatihan Khusus",
    },
    {
      id: "creative",
      name: "Creative Hub & Desain Produk",
      category: "Ekonomi Kreatif",
      desc: "Studio desain industri, animasi, multimedia, dan laboratorium cetak 3D untuk riset kreatif mahasiswa & umum.",
      icon: Sparkles,
      stats: "Studio Digital Terbuka",
      badge: "Kreatif & Inovasi",
    },
  ];

  return (
    <section id="fasilitas" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full mb-3 border border-rose-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>Kawasan Solo Techno Park</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Klaster Fasilitas & Lokasi Kunjungan
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2 font-medium">
              Solo Techno Park memiliki beragam fasilitas bertaraf internasional untuk
              kegiatan pelatihan vokasi, kunjungan industri sekolah & kampus, serta
              penelitian inovatif.
            </p>
          </div>
          <span className="mt-4 md:mt-0 text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 w-fit">
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
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-rose-300 shadow-xs hover:shadow-lg hover:shadow-rose-600/5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {f.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase block mb-1">
                    {f.category}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                    {f.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 font-medium">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>{f.stats}</span>
                  <span className="text-rose-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
