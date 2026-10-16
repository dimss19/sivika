"use client";

import React, { useState } from "react";
import { Play, Building2, Users, Award, ExternalLink } from "lucide-react";

interface STPVideoPlayerProps {
  initialVideoUrl?: string;
}

export default function STPVideoPlayer({
  initialVideoUrl = "https://www.youtube.com/embed/Psa9J6wWn3Y",
}: STPVideoPlayerProps) {
  const [videoUrl] = useState<string>(initialVideoUrl);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Video Container */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
              <Play className="w-4 h-4 fill-rose-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Profil Solo Techno Park
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pusat Inovasi & Vokasi Terkemuka
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full">
            Official Video
          </span>
        </div>

        {/* Video Player */}
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner relative border border-slate-100">
          <iframe
            className="w-full h-full"
            src={`${videoUrl}?autoplay=1&mute=1&loop=1&playlist=${videoUrl.split("/").pop()}`}
            title="Profil Solo Techno Park"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* STP Quick Highlights Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        <div className="bg-gradient-to-br from-white to-rose-50/50 p-4 rounded-2xl border border-rose-100/80 shadow-sm flex flex-col justify-between">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-xl w-fit">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900">9+</h4>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              Klaster Gedung & Fasilitas
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Gedung RnD, Sembrani, GoTo, Auditorium, dsb.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-rose-50/50 p-4 rounded-2xl border border-rose-100/80 shadow-sm flex flex-col justify-between">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-xl w-fit">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-900">50K+</h4>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              Alumni Pelatihan & Vokasi
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Sinergi akademisi, industri & pemerintah.
            </p>
          </div>
        </div>

        <div className="col-span-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Pusat Pengembangan Talenta Digital
              </p>
              <p className="text-[11px] text-slate-500">
                Kolaborasi Shopee, Garena, Mandiri, Bukalapak & Tech Leaders
              </p>
            </div>
          </div>
          <a
            href="https://solotechnopark.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 shrink-0 px-2 py-1 bg-rose-50 rounded-lg"
          >
            <span>Kunjungi STP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
