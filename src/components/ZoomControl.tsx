"use client";

import React from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ZoomControlProps {
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  className?: string;
}

export default function ZoomControl({
  zoomLevel,
  onZoomChange,
  className = "",
}: ZoomControlProps) {
  const handleZoomIn = () => {
    if (zoomLevel < 160) {
      onZoomChange(Math.min(160, zoomLevel + 10));
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 75) {
      onZoomChange(Math.max(75, zoomLevel - 10));
    }
  };

  const handleReset = () => {
    onZoomChange(100);
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-white border border-slate-200/90 shadow-sm p-1 rounded-2xl text-xs ${className}`}
    >
      <button
        onClick={handleZoomOut}
        disabled={zoomLevel <= 75}
        title="Perkecil Ukuran Tampilan (Zoom Out)"
        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-40"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      <button
        onClick={handleReset}
        title="Kembalikan ke Ukuran Normal 100%"
        className="px-2.5 py-1 font-bold text-slate-800 hover:bg-slate-100 rounded-lg transition-all min-w-[50px] text-center"
      >
        {zoomLevel}%
      </button>

      <button
        onClick={handleZoomIn}
        disabled={zoomLevel >= 160}
        title="Perbesar Ukuran Tampilan untuk TV (Zoom In)"
        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-40"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      {zoomLevel !== 100 && (
        <button
          onClick={handleReset}
          title="Reset Zoom ke 100%"
          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all ml-0.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
