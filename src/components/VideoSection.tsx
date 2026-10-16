"use client";

import React from "react";
import { Play, Sparkles, Award } from "lucide-react";

export default function VideoSection() {
  return (
    <section id="video" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              <Play className="w-3.5 h-3.5 fill-rose-600" />
              <span>Video Profil Kawasan</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Mengenal Lebih Dekat Solo Techno Park
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Sebagai *Center of Excellence*, Solo Techno Park menggabungkan unsur
              akademisi, bisnis, pemerintah, dan komunitas dalam menciptakan ekosistem
              inovasi terapan dan vokasi digital di Jawa Tengah dan Indonesia.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Kawasan Sains & Teknologi Terpadu
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mendukung transformasi digital industri dan hilirisasi riset teknologi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Kemitraan Multinasional
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kolaborasi erat bersama industri teknologi nasional dan global.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Video Player */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 rounded-3xl p-3 shadow-2xl border-4 border-slate-800 overflow-hidden">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Profil Solo Techno Park"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
