"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import WebNavbar from "@/components/WebNavbar";
import ProfileHero from "@/components/ProfileHero";
import FasilitasSection from "@/components/FasilitasSection";
import JadwalExplorer from "@/components/JadwalExplorer";
import VideoSection from "@/components/VideoSection";
import WebFooter from "@/components/WebFooter";
import TVDisplayView from "@/components/TVDisplayView";
import JadwalDetailModal from "@/components/JadwalDetailModal";
import { JadwalKunjungan } from "@/lib/sheets";
import { CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const [data, setData] = useState<JadwalKunjungan[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isTvMode, setIsTvMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("mode") === "tv";
    }
    return false;
  });
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalKunjungan | null>(null);
  const [showSyncNotification, setShowSyncNotification] = useState<boolean>(false);

  // Fetch live spreadsheet data from API
  const fetchJadwal = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/jadwal?_t=${Date.now()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json && json.data) {
        setData((prevData) => {
          if (prevData.length > 0 && prevData.length !== json.data.length) {
            setShowSyncNotification(true);
            setTimeout(() => setShowSyncNotification(false), 4000);
          }
          return json.data;
        });
        setLastUpdated(json.lastUpdated || new Date().toISOString());
        setIsLive(json.source === "live_google_sheets");
      }
    } catch (err) {
      console.error("Gagal sinkronisasi spreadsheet:", err);
      setIsLive(false);
    } finally {
      if (isManual) setIsRefreshing(false);
    }
  }, []);

  // Automatic background live-sync every 10 seconds without synchronous setState in effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJadwal();
    }, 0);

    const syncInterval = setInterval(() => {
      fetchJadwal();
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(syncInterval);
    };
  }, [fetchJadwal]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "t" || e.key === "T") {
        setIsTvMode((prev) => !prev);
      } else if (e.key === "r" || e.key === "R") {
        fetchJadwal(true);
      } else if (e.key === "Escape") {
        setSelectedJadwal(null);
        setIsTvMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fetchJadwal]);

  const todayCount = useMemo(() => {
    return data.filter((item) => item.isToday).length;
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Toast Notification when new data syncs */}
      {showSyncNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Data Google Spreadsheet telah diperbarui secara otomatis!</span>
        </div>
      )}

      {/* Detail Modal Dialog */}
      <JadwalDetailModal
        jadwal={selectedJadwal}
        onClose={() => setSelectedJadwal(null)}
      />

      {isTvMode ? (
        /* Dedicated Full-Screen Digital Signage TV View */
        <TVDisplayView
          data={data}
          onCloseTvMode={() => setIsTvMode(false)}
          onSelectItem={(item) => setSelectedJadwal(item)}
          onRefresh={() => fetchJadwal(true)}
          isRefreshing={isRefreshing}
          isLive={isLive}
          lastUpdated={lastUpdated}
        />
      ) : (
        /* Complete Solo Techno Park Institutional Profile Website */
        <>
          <WebNavbar
            onOpenTvMode={() => setIsTvMode(true)}
            onRefresh={() => fetchJadwal(true)}
            isRefreshing={isRefreshing}
            totalSchedule={data.length}
            isLive={isLive}
          />

          <main className="flex-1">
            <ProfileHero
              onOpenTvMode={() => setIsTvMode(true)}
              totalSchedule={data.length}
              todayCount={todayCount}
            />

            <FasilitasSection />

            <JadwalExplorer
              items={data}
              onSelectItem={(item) => setSelectedJadwal(item)}
              onOpenTvMode={() => setIsTvMode(true)}
            />

            <VideoSection />
          </main>

          <WebFooter />
        </>
      )}
    </div>
  );
}
