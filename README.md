# SIVIKA - Solo Techno Park Digital Signage

Sistem Informasi Jadwal Kunjungan & Display Agenda Terpadu untuk Layar TV Lobi di Kawasan **Solo Techno Park (STP)**.

Dibangun dengan **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, dan terintegrasi langsung secara *real-time* dengan **Google Spreadsheet**.

---

## 🚀 Fitur Utama

- **Integrasi Google Spreadsheet Real-Time:**
  Data jadwal kunjungan diambil langsung dari Google Sheets resmi STP ([Buka Spreadsheet](https://docs.google.com/spreadsheets/d/1aMlArIv2r6h7evDIJrpTsY2YMrE1NCtQUmf0Q4yZyoI/edit?gid=0#gid=0)) dengan sistem *auto-caching* (ISR) hemat kuota API.
- **Desain Fresh Merah-Putih Khas STP:**
  Antarmuka modern 16:9 widescreen berkualitas broadcast signage TV, tipografi jernih (Plus Jakarta Sans), dan kontras tinggi untuk kenyamanan baca dari jarak jauh.
- **4 Mode Display TV Fleksibel:**
  1. **Mode Khusus Hari Ini (`today`):** Fokus menayangkan agenda kunjungan hari ini. Dilengkapi *smart fallback* ke jadwal terdekat jika hari ini belum ada agenda.
  2. **Mode Carousel TV Signage (`carousel`):** Merotasi halaman slide jadwal secara otomatis setiap 10 detik (dapat diatur) dilengkapi indikator progress bar.
  3. **Mode Split Jadwal & Video Profil (`split`):** Tampilan ganda menyandingkan daftar agenda kunjungan dengan pemutar video profil Solo Techno Park serta statistik kawasan.
  4. **Mode Semua / Rentang Tanggal (`range`):** Menampilkan seluruh jadwal kunjungan dan filter 7 hari kedepan.
- **Live Clock & Weather Header:**
  Jam digital presisi dengan detik WIB, kalender hari/tanggal bahasa Indonesia, dan indikator status sinkronisasi.
- **Running Text (Marquee Lobi):**
  Pemberitahuan bergerak di bagian bawah layar untuk pengumuman lobi, tata tertib, dan informasi tamu.
- **Keyboard Shortcuts (Untuk Pengelola Layar):**
  - Tekan `F` : Layar Penuh (*Fullscreen TV*)
  - Tekan `M` : Buka Modal Pengaturan Mode
  - Tekan `R` : Sinkronisasi Ulang Data Spreadsheet

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **UI & Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Source:** Google Sheets CSV Export API
- **Typography:** Plus Jakarta Sans (Google Fonts)

---

## 💻 Menjalankan Secara Lokal

1. Pasang dependensi:
   ```bash
   npm install
   ```
2. Jalankan server pengembang:
   ```bash
   npm run dev
   ```
3. Buka di peramban: `http://localhost:3000`

---

## ☁️ Panduan Deploy ke Vercel

1. Push repository ini ke GitHub akun Anda: `https://github.com/dimss19/sivika.git`.
2. Buka dashboard [Vercel](https://vercel.com/) lalu pilih **Add New Project**.
3. Hubungkan ke repositori GitHub `dimss19/sivika`.
4. Klik **Deploy** tanpa perlu konfigurasi tambahan. Web langsung aktif di domain `.vercel.app`.

---

© 2026 Solo Techno Park. Dikembangkan untuk SIVIKA Digital Signage System.
