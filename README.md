# SIVIKA - Solo Techno Park Digital Signage

Sistem Informasi Jadwal Kunjungan dan Display Agenda Terpadu untuk Layar TV Lobi di Kawasan Solo Techno Park (STP).

Dibangun menggunakan Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, serta terintegrasi langsung dengan sistem data terpusat secara otomatis dan real-time.

---

## Fitur Utama

- Tampilan TV Display Lobi Bersih dan Modern:
  Desain profesional berstandar Passenger Information Display System (PIDS) yang dioptimalkan untuk layar TV lobi 16:9 widescreen. Menggunakan kontras tinggi, tata letak kartu yang rapi, dan mudah dibaca dari jarak jauh.

- 3 Mode Display TV Fleksibel:
  1. Papan Jadwal (Auto-Carousel):
     Menampilkan daftar agenda kunjungan secara bergiliran dengan rotasi otomatis antar halaman setiap 10 detik, lengkap dengan tombol kontrol halaman manual.
  2. Hari Ini:
     Fokus menayangkan agenda kunjungan khusus untuk hari ini, dengan pemberitahuan otomatis jika belum ada agenda khusus pada hari berjalan.
  3. Split Video:
     Menyandingkan daftar agenda kunjungan di sisi kiri dengan pemutar video resmi profil kawasan Solo Techno Park di sisi kanan.

- Jam Digital Presisi dan Cuaca Live Surakarta:
  Dilengkapi jam digital berakurasi tinggi dengan zona waktu WIB, tanggal bahasa Indonesia, serta integrasi pemantau prakiraan cuaca langsung untuk wilayah Surakarta.

- Portal Web Interaktif dan Responsif:
  Halaman web publik responsif yang dapat diakses melalui perangkat desktop, tablet, maupun ponsel pintar:
  - Pencarian pintar instansi, PIC, dan nomor agenda.
  - Filter kategori kunjungan (Kunjungan Industri, Pelatihan & Diklat, Kunjungan Kerja).
  - Filter rentang waktu (Terbaru s/d Hari Ini, Mendatang, dan Urutan Awal).
  - Modal rincian agenda lengkap dengan informasi instansi, waktu, ruangan, jumlah peserta, PIC, dan kontak narahubung.
  - Bagian Fasilitas Kawasan dan Video Profil resmi STP.

- Banner Informasi Resepsionis:
  Pengumuman terpadu di bagian bawah layar untuk memandu rombongan tamu agar melapor ke Petugas Resepsionis Gedung Utama sebelum memasuki ruangan acara.

---

## Tech Stack

- Framework: Next.js 16 (App Router, Turbopack)
- Library UI: React 19
- Styling: Tailwind CSS v4
- Ikon: Lucide React
- Integrasi Data: API Sinkronisasi Data Internal STP (Auto-Caching & Revalidation)
- Tipografi: Plus Jakarta Sans (Google Fonts)
- Bahasa: TypeScript

---

## Struktur Direktori Proyek

```text
src/
├── app/
│   ├── api/jadwal/        # API endpoint sinkronisasi data jadwal
│   ├── globals.css        # Konfigurasi Tailwind CSS v4 dan tema
│   ├── layout.tsx         # Root layout dan metadata aplikasi
│   └── page.tsx           # Halaman utama portal publik dan switcher TV mode
├── components/
│   ├── FasilitasSection.tsx   # Komponen informasi klaster gedung & fasilitas
│   ├── JadwalDetailModal.tsx  # Modal rincian data agenda kunjungan
│   ├── JadwalExplorer.tsx     # Tabel penjelajah jadwal kunjungan dan filter
│   ├── ProfileHero.tsx        # Hero banner dan statistik kunjungan real-time
│   ├── STPVideoPlayer.tsx     # Pemutar video profil kawasan STP
│   ├── TVDisplayView.tsx      # Tampilan khusus layar TV display lobi
│   ├── VideoSection.tsx       # Seksi video profil pada portal web
│   ├── WebFooter.tsx          # Footer navigasi dan kontak resmi
│   └── WebNavbar.tsx          # Navigasi sticky web portal
└── lib/
    └── sheets.ts          # Layanan parser, normalisasi tanggal, dan pengurutan
```

---

## Panduan Menjalankan Secara Lokal

### Prasyarat
- Node.js versi 18.18 atau lebih baru
- npm, yarn, atau pnpm

### Langkah Instalasi

1. Kloning repositori:
   ```bash
   git clone https://github.com/dimss19/sivika.git
   cd sivika/Sivika1
   ```

2. Pasang seluruh dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembang lokal:
   ```bash
   npm run dev
   ```

4. Buka peramban di alamat:
   ```text
   http://localhost:3000
   ```

---

## Pengujian Kualitas Kode dan Build Produksi

- Memeriksa linter:
  ```bash
  npm run lint
  ```

- Membuat build produksi:
  ```bash
  npm run build
  ```

- Menjalankan build produksi:
  ```bash
  npm start
  ```

---

## Panduan Deploy ke Vercel

1. Unggah kode ke repositori GitHub:
   ```bash
   git push origin main
   ```

2. Buka dashboard Vercel (https://vercel.com) dan pilih Add New Project.
3. Pilih repositori dimss19/sivika (dengan root directory diatur ke Sivika1 jika diperlukan).
4. Klik Deploy. Aplikasi akan otomatis ter-build dan siap digunakan di domain .vercel.app.

---

Hak Cipta 2026 Solo Techno Park. Seluruh hak cipta dilindungi undang-undang.
Dikembangkan untuk Sistem Informasi Digital Signage SIVIKA Solo Techno Park.
