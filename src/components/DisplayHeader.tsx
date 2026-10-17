"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Calendar, CloudSun } from "lucide-react";

interface DisplayHeaderProps {
  lastUpdated?: string;
  isLive?: boolean;
  totalSchedule?: number;
}

export default function DisplayHeader({
  lastUpdated,
  isLive = true,
  totalSchedule = 0,
}: DisplayHeaderProps) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " WIB"
      );
      setDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full bg-white border-b border-slate-200 px-6 py-3.5 shadow-xs flex items-center justify-between shrink-0 relative z-20">
      {/* Brand & Logo STP */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-12 bg-white rounded-xl p-1 flex items-center justify-center border border-slate-200 shadow-2xs">
          <Image
            src="/logo.png"
            alt="Solo Techno Park Logo"
            width={60}
            height={44}
            className="object-contain"
            priority
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-950 flex items-center gap-1.5">
              <span>SOLO</span>
              <span className="text-slate-900">TECHNO</span>
              <span className="text-rose-600">PARK</span>
            </h1>
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              SIVIKA v2.0
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 tracking-wide">
            Sistem Informasi Jadwal Kunjungan & Display Lobi
          </p>
        </div>
      </div>

      {/* Middle Status / Weather Badge */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 px-3.5 py-1.5 rounded-xl text-xs">
          <CloudSun className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-slate-700">Surakarta</span>
          <span className="font-bold text-slate-900">31°C</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">
            {isLive ? "Live Spreadsheet" : "Offline Cache"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <span className="font-bold text-slate-900">{totalSchedule} Agenda</span>
        </div>
      </div>

      {/* Live Digital Clock & Date */}
      <div className="flex items-center gap-4 text-right">
        <div className="hidden sm:block">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-end gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{date || "Memuat Tanggal..."}</span>
          </div>
          {lastUpdated && (
            <p className="text-[10px] text-slate-400 font-medium">
              Update: {new Date(lastUpdated).toLocaleTimeString("id-ID")}
            </p>
          )}
        </div>

        <div className="bg-slate-950 text-white px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <Clock className="w-5 h-5 text-slate-300" />
          <span className="text-xl sm:text-2xl font-black font-mono tracking-wider">
            {time || "--:--:--"}
          </span>
        </div>
      </div>
    </header>
  );
}
