"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Tv,
  ArrowUpDown,
} from "lucide-react";
import { JadwalKunjungan } from "@/lib/sheets";

interface JadwalExplorerProps {
  items: JadwalKunjungan[];
  onSelectItem: (item: JadwalKunjungan) => void;
  onOpenTvMode: () => void;
}

export default function JadwalExplorer({
  items,
  onSelectItem,
  onOpenTvMode,
}: JadwalExplorerProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortOrder, setSortOrder] = useState<"newest" | "upcoming" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Tabs & Sort filtering for genuine agenda database navigation
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (activeTab === "today") {
      result = result.filter((item) => item.isToday);
    } else if (activeTab === "industri") {
      result = result.filter((item) => item.kategori === "Kunjungan Industri");
    } else if (activeTab === "pelatihan") {
      result = result.filter((item) => item.kategori === "Pelatihan");
    } else if (activeTab === "kerja") {
      result = result.filter((item) => item.kategori === "Kunjungan Kerja");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.instansi.toLowerCase().includes(q) ||
          item.tempat.toLowerCase().includes(q) ||
          item.kegiatan.toLowerCase().includes(q) ||
          item.pic.toLowerCase().includes(q) ||
          item.noSurat.toLowerCase().includes(q)
      );
    }

    const now = new Date();
    const todayIso = now.toISOString().split("T")[0];

    // Sort order:
    // newest: Data terbaru yang TIDAK melebihi hari ini (<= hari ini, descending timestamp)
    // upcoming: Agenda mendatang (> hari ini, ascending timestamp)
    // oldest: Agenda dari urutan awal (2024, ascending timestamp)
    if (sortOrder === "newest") {
      result = result.filter((item) => !item.dateIso || item.dateIso <= todayIso);
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortOrder === "upcoming") {
      result = result.filter((item) => item.dateIso && item.dateIso > todayIso);
      result.sort((a, b) => a.timestamp - b.timestamp);
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => a.timestamp - b.timestamp);
    }

    return result;
  }, [items, activeTab, searchQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <section id="jadwal" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full mb-3 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              <Calendar className="w-3.5 h-3.5 text-slate-700" />
              <span>Sistem Jadwal Kunjungan SIVIKA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Eksplorasi Agenda Kunjungan STP
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-1.5 font-medium">
              Data agenda kunjungan resmi Solo Techno Park yang tersinkronisasi secara otomatis dan terintegrasi secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenTvMode}
              className="px-5 py-3 bg-slate-900 hover:bg-black text-white font-extrabold rounded-2xl text-xs shadow-xs hover:shadow-md flex items-center gap-2 transition-all border border-slate-800"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <Tv className="w-4 h-4 text-slate-300" />
              <span>Buka Display TV Layar Penuh</span>
            </button>
          </div>
        </div>

        {/* Control Bar: Tabs, Search, View, Zoom */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => handleTabChange("all")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Semua Agenda ({items.length})
              </button>

              <button
                onClick={() => handleTabChange("industri")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === "industri"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Kunjungan Industri
              </button>

              <button
                onClick={() => handleTabChange("pelatihan")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === "pelatihan"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Pelatihan & Workshop
              </button>

              <button
                onClick={() => handleTabChange("kerja")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === "kerja"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Kunjungan Kerja
              </button>

              <button
                onClick={() => handleTabChange("today")}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === "today"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                <span>Hari Ini</span>
              </button>
            </div>

            {/* Sort Order & View Mode Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Sort Order Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase px-2 flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  <span className="hidden sm:inline">Urut:</span>
                </span>
                <button
                  onClick={() => {
                    setSortOrder("newest");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    sortOrder === "newest"
                      ? "bg-white text-slate-900 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                  title="Tampilkan agenda terbaru s/d hari ini"
                >
                  Terbaru
                </button>
                <button
                  onClick={() => {
                    setSortOrder("upcoming");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    sortOrder === "upcoming"
                      ? "bg-white text-slate-900 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                  title="Tampilkan agenda mendatang terlebih dahulu"
                >
                  Mendatang
                </button>
                <button
                  onClick={() => {
                    setSortOrder("oldest");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    sortOrder === "oldest"
                      ? "bg-white text-slate-900 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900 font-semibold"
                  }`}
                  title="Tampilkan urutan data awal (2024)"
                >
                  Terlama
                </button>
              </div>

              {/* View Mode Toggle: Table or Cards */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold border border-slate-200/80">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    viewMode === "table"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tabel
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    viewMode === "cards"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Kartu
                </button>
              </div>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari instansi tamu, ruang pertemuan, PIC, nomor surat... (Contoh: Universitas, SMK, Gedung RnD, GoTo)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* Content Container (Table / Cards) */}
        <div className="transition-all duration-150">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">
                Data Tidak Ditemukan
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Tidak ada agenda yang cocok dengan kata kunci & filter pencarian Anda.
              </p>
            </div>
          ) : viewMode === "table" ? (
            /* Table Layout */
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 min-w-[760px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-extrabold tracking-wider">
                    <tr>
                      <th
                        className="py-4 px-6 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                        onClick={() => {
                          setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
                          setCurrentPage(1);
                        }}
                        title="Klik untuk mengubah urutan tanggal (Terbaru / Terlama)"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Tanggal & Waktu</span>
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                          <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 uppercase tracking-wider">
                            {sortOrder === "newest"
                              ? "Terbaru"
                              : sortOrder === "upcoming"
                              ? "Mendatang"
                              : "Terlama"}
                          </span>
                        </div>
                      </th>
                      <th className="py-4 px-6">Instansi / Tamu</th>
                      <th className="py-4 px-6">Nama Kegiatan</th>
                      <th className="py-4 px-6">Lokasi / Ruangan</th>
                      <th className="py-4 px-6">Peserta</th>
                      <th className="py-4 px-6">PIC STP</th>
                      <th className="py-4 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/90 transition-colors duration-150 group cursor-pointer border-b border-slate-100"
                        onClick={() => onSelectItem(item)}
                      >
                        <td className="py-4 px-6 font-semibold whitespace-nowrap">
                          <div className="text-slate-900 font-bold">
                            {item.dateFormatted || item.rawDateTime}
                          </div>
                          <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{item.timeFormatted}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-extrabold text-slate-900 text-sm group-hover:text-rose-600 transition-colors duration-150">
                          <div className="flex items-center gap-2">
                            <span>{item.instansi}</span>
                            {item.isToday && (
                              <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                <span className="w-1 h-1 rounded-full bg-white" />
                                Hari Ini
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6 font-medium text-slate-600">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold text-[11px] group-hover:bg-slate-200 transition-colors">
                            {item.kegiatan}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-semibold text-slate-800">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 group-hover:text-rose-600 transition-colors" />
                            <span>{item.tempat}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap">
                          {item.jumlahPeserta && item.jumlahPeserta !== "-"
                            ? `${item.jumlahPeserta} Peserta`
                            : "-"}
                        </td>

                        <td className="py-4 px-6 font-medium text-slate-600 whitespace-nowrap">
                          {item.pic}
                        </td>

                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectItem(item);
                            }}
                            className="px-3.5 py-1.5 bg-slate-100 group-hover:bg-slate-950 text-slate-800 group-hover:text-white font-bold rounded-xl text-xs transition-all duration-200 flex items-center gap-1 mx-auto hover:scale-105 active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Tampilkan</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Cards Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-slate-400 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between group border-t-4 border-t-slate-900 hover:border-t-rose-600"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1 font-mono group-hover:bg-slate-200 transition-colors">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        <span>{item.timeFormatted}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {item.isToday && (
                          <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                            <span className="w-1 h-1 rounded-full bg-white" />
                            Hari Ini
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {item.kegiatan}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors duration-200 leading-snug mb-2">
                      {item.instansi}
                    </h3>

                    <p className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.dateFormatted || item.rawDateTime}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold truncate max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{item.tempat}</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="text-xs font-bold text-slate-800 hover:text-rose-600 flex items-center gap-1"
                    >
                      <span>Detail</span>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600">
            <span>
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredItems.length)} dari{" "}
              {filteredItems.length} agenda
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
