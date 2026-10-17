"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { SPREADSHEET_URL } from "@/lib/sheets";

export default function WebFooter() {
  return (
    <footer id="kontak" className="bg-white text-slate-800 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & About */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 bg-white rounded-xl p-1 flex items-center justify-center border border-slate-200 shadow-2xs">
                <Image
                  src="/logo.png"
                  alt="Solo Techno Park"
                  width={48}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black text-slate-950">
                SOLO<span className="text-slate-900">TECHNO</span><span className="text-rose-600">PARK</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium max-w-sm">
              Kawasan terpadu inovasi sains, inkubasi bisnis teknologi, dan vokasi
              digital kebanggaan Kota Surakarta. Melayani kunjungan industri, studi
              tiru, dan program kemitraan nasional.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                SIVIKA v2.0
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Sistem Informasi Digital Signage & Portal Kunjungan
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3 text-xs font-semibold">
            <h4 className="text-sm font-extrabold text-slate-950 tracking-wider uppercase mb-3">
              Tautan Navigasi
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a href="#profil" className="hover:text-slate-950 transition-colors">
                  Profil & Sejarah STP
                </a>
              </li>
              <li>
                <a href="#fasilitas" className="hover:text-slate-950 transition-colors">
                  Fasilitas & Gedung
                </a>
              </li>
              <li>
                <a href="#jadwal" className="hover:text-slate-950 transition-colors">
                  Jadwal Kunjungan Terbuka
                </a>
              </li>
              <li>
                <a href="#video" className="hover:text-slate-950 transition-colors">
                  Video Profil Resmi
                </a>
              </li>
              <li>
                <a
                  href={SPREADSHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-950 transition-colors flex items-center gap-1 text-slate-800 font-bold"
                >
                  <span>Google Spreadsheet Jadwal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="md:col-span-4 space-y-3 text-xs font-semibold">
            <h4 className="text-sm font-extrabold text-slate-950 tracking-wider uppercase mb-3">
              Kontak & Lokasi
            </h4>
            <div className="space-y-2.5 text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <span>
                  Gedung Solo Trade Center, Jl. Ki Hajar Dewantara No. 19, Jebres, Kec. Jebres, Kota Surakarta, Jawa Tengah 57126
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-700 shrink-0" />
                <span>(0271) 666628 / WA: 0857-4311-0623</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-700 shrink-0" />
                <span>info.solotechnopark@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-100 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <p>© 2026 Solo Techno Park. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="text-slate-400">
            Sistem Informasi Digital Signage & Agenda Resmi STP
          </p>
        </div>
      </div>
    </footer>
  );
}
