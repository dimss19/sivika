"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";

interface STPVideoPlayerProps {
  initialVideoUrl?: string;
}

export default function STPVideoPlayer({
  initialVideoUrl = "https://www.youtube.com/embed/Psa9J6wWn3Y",
}: STPVideoPlayerProps) {
  const [videoUrl] = useState<string>(initialVideoUrl);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200/90 flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-3 shrink-0">
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
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 shadow-inner relative border border-slate-200 flex-1 min-h-0">
        <iframe
          className="w-full h-full"
          src={`${videoUrl}?autoplay=1&mute=1&loop=1&playlist=${videoUrl.split("/").pop()}`}
          title="Profil Solo Techno Park"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
