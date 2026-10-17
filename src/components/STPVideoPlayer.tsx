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
      <div className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-200/90 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-900">
              <Play className="w-4 h-4 fill-slate-900" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950 leading-tight">
                Profil Solo Techno Park
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Pusat Inovasi & Vokasi Terkemuka
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Official Video
          </span>
        </div>

        {/* Video Player */}
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 shadow-inner relative border border-slate-200">
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
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="p-2 bg-slate-100 text-slate-900 rounded-xl w-fit">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-950">9+</h4>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Klaster Gedung & Fasilitas
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Gedung RnD, Sembrani, GoTo, Auditorium, dsb.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="p-2 bg-slate-100 text-slate-900 rounded-xl w-fit">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-slate-950">50K+</h4>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Alumni Pelatihan & Vokasi
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Sinergi akademisi, industri & pemerintah.
            </p>
          </div>
        </div>

        <div className="col-span-2 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 text-slate-900 rounded-xl">
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
            className="text-xs font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1 shrink-0 px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200"
          >
            <span>Kunjungi STP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
