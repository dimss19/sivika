"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Mail, Phone, ExternalLink, Heart } from "lucide-react";
import { SPREADSHEET_URL } from "@/lib/sheets";

export default function WebFooter() {
  return (
    <footer id="kontak" className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Col 1: Brand & About */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 bg-white rounded-xl p-1 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Solo Techno Park"
                  width={48}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black text-white">
                SOLO<span className="text-rose-500">TECHNOPARK</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-sm">
              Kawasan terpadu inovasi sains, inkubasi bisnis teknologi, dan vokasi
              digital kebanggaan Kota Surakarta. Melayani kunjungan industri, studi
              tiru, dan program kemitraan nasional.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-extrabold text-rose-400 uppercase tracking-widest block mb-1">
                SIVIKA v2.0
              </span>
              <p className="text-xs text-slate-400">
                Sistem Informasi Digital Signage & Portal Kunjungan
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3 text-xs font-semibold">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase mb-3">
              Tautan Navigasi
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#profil" className="hover:text-rose-400 transition-colors">
                  Profil & Sejarah STP
                </a>
              </li>
              <li>
                <a href="#fasilitas" className="hover:text-rose-400 transition-colors">
                  Fasilitas & Gedung
                </a>
              </li>
              <li>
                <a href="#jadwal" className="hover:text-rose-400 transition-colors">
                  Jadwal Kunjungan Terbuka
                </a>
              </li>
              <li>
                <a href="#video" className="hover:text-rose-400 transition-colors">
                  Video Profil Resmi
                </a>
              </li>
              <li>
                <a
                  href={SPREADSHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors flex items-center gap-1 text-rose-400"
                >
                  <span>Google Spreadsheet Jadwal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="md:col-span-4 space-y-3 text-xs font-semibold">
            <h4 className="text-sm font-extrabold text-white tracking-wider uppercase mb-3">
              Kontak & Lokasi
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  Jl. Ki Hajar Dewantara No. 19, Jebres, Kec. Jebres, Kota Surakarta, Jawa Tengah 57126
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>(0271) 666628 / +62 811-2651-789</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>info@solotechnopark.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <p>© 2026 Solo Techno Park. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center gap-1">
            <span>Dikembangkan untuk Digital Signage STP</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
