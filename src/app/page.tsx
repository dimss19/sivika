"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import WebNavbar from "@/components/WebNavbar";
import ProfileHero from "@/components/ProfileHero";
import FasilitasSection from "@/components/FasilitasSection";
import JadwalExplorer from "@/components/JadwalExplorer";
import VideoSection from "@/components/VideoSection";
import WebFooter from "@/components/WebFooter";
import TVDisplayView from "@/components/TVDisplayView";
import JadwalDetailModal from "@/components/JadwalDetailModal";
import { JadwalKunjungan } from "@/lib/sheets";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<JadwalKunjungan[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalKunjungan | null>(null);
  const [tvModeOverride, setTvModeOverride] = useState<boolean | null>(null);

  const isTvMode =
    tvModeOverride !== null
      ? tvModeOverride
      : searchParams.get("mode") === "tv";

  const handleOpenTvMode = useCallback(() => {
    setTvModeOverride(true);
    router.push("/?mode=tv", { scroll: false });
  }, [router]);

  const handleCloseTvMode = useCallback(() => {
    setTvModeOverride(false);
    router.push("/", { scroll: false });
  }, [router]);

  // Fetch spreadsheet data from API for manual refresh
  const fetchJadwal = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/jadwal?_t=${Date.now()}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json && json.data) {
        setData(json.data);
        setLastUpdated(json.lastUpdated || new Date().toISOString());
      }
    } catch (err) {
      console.error("Gagal memuat spreadsheet:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Fetch once on mount asynchronously
  useEffect(() => {
    let isSubscribed = true;

    async function loadData() {
      try {
        const res = await fetch(`/api/jadwal?_t=${Date.now()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (isSubscribed && json && json.data) {
          setData(json.data);
          setLastUpdated(json.lastUpdated || new Date().toISOString());
        }
      } catch (err) {
        console.error("Gagal memuat spreadsheet:", err);
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Keyboard shortcut listener (T for TV Mode, R for Refresh, Escape to Exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "t" || e.key === "T") {
        if (isTvMode) {
          handleCloseTvMode();
        } else {
          handleOpenTvMode();
        }
      } else if (e.key === "r" || e.key === "R") {
        fetchJadwal();
      } else if (e.key === "Escape") {
        setSelectedJadwal(null);
        handleCloseTvMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fetchJadwal, handleCloseTvMode, handleOpenTvMode, isTvMode]);

  const realStats = useMemo(() => {
    const totalSchedule = data.length;
    const uniqueInstansi = new Set(
      data
        .map((x) => x.instansi)
        .filter((x) => x && x !== "-" && x !== "Tamu Solo Techno Park")
    ).size;
    let totalPeserta = 0;
    data.forEach((x) => {
      const p = parseInt((x.jumlahPeserta || "").replace(/[^0-9]/g, ""), 10);
      if (!isNaN(p)) totalPeserta += p;
    });
    const upcomingCount = data.filter((x) => x.isUpcoming).length;
    const todayCount = data.filter((x) => x.isToday).length;

    return {
      totalSchedule,
      uniqueInstansi,
      totalPeserta,
      upcomingCount,
      todayCount,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Detail Modal Dialog */}
      <JadwalDetailModal
        jadwal={selectedJadwal}
        onClose={() => setSelectedJadwal(null)}
      />

      {isTvMode ? (
        /* Dedicated Full-Screen Digital Signage TV View */
        <TVDisplayView
          data={data}
          onCloseTvMode={handleCloseTvMode}
          onSelectItem={(item) => setSelectedJadwal(item)}
          onRefresh={fetchJadwal}
          isRefreshing={isRefreshing}
          lastUpdated={lastUpdated}
        />
      ) : (
        /* Complete Solo Techno Park Institutional Profile Website */
        <>
          <WebNavbar
            onOpenTvMode={handleOpenTvMode}
            onRefresh={fetchJadwal}
            isRefreshing={isRefreshing}
            totalSchedule={data.length}
          />

          <main className="flex-1">
            <ProfileHero
              onOpenTvMode={handleOpenTvMode}
              totalSchedule={realStats.totalSchedule}
              todayCount={realStats.todayCount}
              upcomingCount={realStats.upcomingCount}
              uniqueInstansi={realStats.uniqueInstansi}
              totalPeserta={realStats.totalPeserta}
            />

            <FasilitasSection />

            <JadwalExplorer
              items={data}
              onSelectItem={(item) => setSelectedJadwal(item)}
              onOpenTvMode={handleOpenTvMode}
            />

            <VideoSection />
          </main>

          <WebFooter />
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-sm">
          Memuat SIVIKA Solo Techno Park...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
