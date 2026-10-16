"use client";

import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  FileText,
  Building,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { JadwalKunjungan, SPREADSHEET_URL } from "@/lib/sheets";

interface JadwalDetailModalProps {
  jadwal: JadwalKunjungan | null;
  onClose: () => void;
}

export default function JadwalDetailModal({
  jadwal,
  onClose,
}: JadwalDetailModalProps) {
  if (!jadwal) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-200"
      >
        {/* Top Crimson Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-200">
                Solo Techno Park • Detail Agenda Kunjungan
              </span>
              <h3 className="text-lg font-black leading-tight text-white">
                {jadwal.kegiatan}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Institution Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Instansi / Lembaga Tamu
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{jadwal.status || "Terjadwal"}</span>
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {jadwal.instansi}
            </h2>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Waktu & Tanggal */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0 mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">
                  Tanggal Kunjungan
                </p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {jadwal.dateFormatted || jadwal.rawDateTime}
                </p>
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{jadwal.timeFormatted}</span>
                </p>
              </div>
            </div>

            {/* Lokasi / Ruangan */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">
                  Lokasi / Ruangan Pertemuan
                </p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {jadwal.tempat || "Solo Techno Park"}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Kawasan Terpadu STP Surakarta
                </p>
              </div>
            </div>

            {/* Jumlah Peserta */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl shrink-0 mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">
                  Kapasitas / Peserta
                </p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {jadwal.jumlahPeserta && jadwal.jumlahPeserta !== "-"
                    ? `${jadwal.jumlahPeserta} Orang`
                    : "Rombongan Tamu"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Tamu Kunjungan Resmi</p>
              </div>
            </div>

            {/* PIC STP & No Surat */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">
                  PIC Petugas STP
                </p>
                <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {jadwal.pic || "Humas & Protokol STP"}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>No. Surat: {jadwal.noSurat || "-"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Guide Box for Visitors */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-rose-800 block mb-1">
              Ketentuan Tamu & Kunjungan Solo Techno Park:
            </span>
            Harap hadir 15 menit sebelum jadwal kunjungan dimulai dan melapor ke
            resepsionis lobi utama. Kendaraan rombongan dan bus wajib parkir di area
            parkir timur.
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <a
            href={SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Lihat Baris di Spreadsheet</span>
          </a>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
}
