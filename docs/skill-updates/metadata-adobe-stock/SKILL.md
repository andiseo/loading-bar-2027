---
name: "metadata-adobe-stock"
description: "Buat metadata Adobe Stock (judul, keyword, kategori) dan file CSV siap upload untuk animasi Remotion yang baru selesai di project ini. Pakai setelah pengguna puas dengan preview."
---

# Metadata Adobe Stock dari project Remotion

Dipakai di Claude Code, di dalam project Remotion, setelah pengguna puas dengan hasil preview. Tujuannya membuat judul, keyword, dan kategori yang akurat, lalu menulis CSV yang bisa langsung di-upload ke Adobe Stock Contributor Portal. Bicara dengan pengguna dalam bahasa Indonesia; isi metadata dalam bahasa Inggris.

Pengguna membuat aset HUD/tech (loading bar, scanning bar, overlay kamera REC, countdown, callout, UI generik), umumnya putih minimal di background hitam atau transparan. Pengguna upload metadata lewat CSV, dan tidak mencentang label generative AI.

## 1. Tentukan aset yang diproses

Default: hanya aset yang belum punya metadata. Jangan membuat ulang metadata untuk aset yang sudah tercatat.

1. Kumpulkan semua file video hasil render di folder output (biasanya `out/`; cek juga konfigurasi render kalau foldernya lain).
2. Baca hanya CSV dengan awalan `adobe_stock_` di folder `metadata/`, dan kumpulkan nilai kolom Filename yang sudah ada. Jangan menghitung CSV platform lain (misalnya `shutterstock_*.csv`) sebagai sudah selesai.
3. Aset yang diproses = file render yang nama file-nya belum ada di CSV Adobe mana pun. Cocokkan nama persis, termasuk ekstensi.
4. Sebelum mulai, tampilkan ringkasan singkat: berapa aset sudah punya metadata (dilewati) dan daftar aset yang akan dibuatkan. Kalau tidak ada yang baru, katakan begitu dan berhenti.

Pengecualian:
- Kalau pengguna menyebut nama komposisi atau file tertentu, proses itu saja, walaupun sudah punya metadata (anggap permintaan perbaikan). Untuk aset yang sudah punya metadata, tulis versi barunya di CSV batch hari ini dan beri tahu pengguna bahwa baris lama di CSV sebelumnya sebaiknya tidak ikut di-upload lagi.
- Kalau pengguna minta "buat ulang semua", proses semua aset.
- Komposisi di `src/Root.tsx` yang belum punya file render: sebutkan di ringkasan sebagai "belum dirender", jangan dibuatkan metadata, karena nama file belum ada.

Nama file diambil dari file hasil render yang sebenarnya. Pengguna punya pola penamaan sendiri per project: ikuti polanya, jangan mengganti nama file tanpa izin.

## 2. Pahami isi aset dari kode

Untuk setiap aset, baca kode komposisinya dan catat fakta, bukan perkiraan:
- Elemen yang terlihat, teks di layar, dan gerakannya.
- Warna dan background (hitam, transparan, atau lainnya).
- Resolusi dan orientasi dari `width` dan `height` (3840x2160 = 4K horizontal; 2160x3840 = 4K vertikal 9:16).
- Durasi (`durationInFrames / fps`) dan apakah frame akhir menyambung ke frame awal (loop).
- Alpha channel: benar hanya kalau background transparan dan render memakai codec dengan alpha (misalnya ProRes 4444). Cek konfigurasi render atau perintah render yang dipakai.

Kalau ada fakta yang tidak bisa dipastikan dari kode (misalnya apakah sudah dirender dengan alpha), tanyakan, jangan menebak.

Kegunaan untuk buyer: baca bagian "Kegunaan untuk buyer" di brief project (biasanya `docs/brief.md`), yang sudah diurutkan dari yang paling laku. Pakai hanya kegunaan yang benar-benar didukung aset (misalnya "overlay" hanya kalau latarnya polos gelap atau ada alpha). Kalau bagian itu tidak ada, usulkan 2 sampai 4 kegunaan dari isi aset dan minta pengguna memastikan sebelum lanjut.

## 3. Judul

- Maksimal 70 karakter. Tanpa koma (aturan CSV Adobe).
- Frasa deskriptif, bukan kalimat formal dan bukan daftar keyword. Title Case.
- Pola: [elemen utama] + [gaya] + for [kegunaan] + [format bila perlu].
- Wajib memuat frasa kegunaan "for ..." berisi 1 atau 2 kegunaan teratas dari brief, digabung dengan "and" (bukan koma). Contoh: `2027 Loading Bar HUD Animation for New Year Countdown and Intro` (63 karakter).
- Subjek utama tetap di awal judul. Kalau lebih dari 70 karakter, buang dulu kata gaya, lalu kata format, lalu kegunaan kedua. Frasa "for" dengan kegunaan pertama tidak boleh dibuang.
- Boleh menambahkan "4K", "Loop", "Alpha Channel", "Vertical" hanya kalau memang benar untuk aset itu (dari langkah 2).
- Setiap varian (vertikal, alpha, warna lain) mendapat judul berbeda. Cek CSV `adobe_stock_*.csv` lama di folder `metadata/` supaya tidak ada judul yang sama persis dengan aset sebelumnya.

## 4. Keyword

- Maksimal 50, ideal 35 sampai 49. Huruf kecil, tanpa duplikat, hanya menggambarkan apa yang benar-benar ada di aset.
- Urutan menentukan ranking; 10 pertama paling berpengaruh:
  1. Posisi 1 sampai 10: subjek utama dan kata-kata dari judul.
  2. Posisi 11 sampai 25: gaya dan konsep (futuristic, minimal, sci-fi, digital, technology, data, progress).
  3. Posisi 26 sampai 40: kegunaan bagi editor (overlay, intro, transition, presentation, social media, vertical, screen). Semua kegunaan dari brief wajib ada di sini, kecuali yang sudah masuk 10 pertama.
  4. Posisi 41 sampai 50: pendukung (warna, background, motion graphics, animation).
- Campur keyword umum dan spesifik (misalnya "interface", "hud", "loading bar", "progress indicator").
- Tanpa data teknis di keyword (resolusi, fps, codec). "alpha channel", "loop", dan "vertical" boleh karena itu sifat konten.

## 5. Kategori

Isi nomor kategori Adobe Stock. Untuk aset ini biasanya 19 (Technology), atau 8 (Graphic Resources) untuk elemen overlay murni. Kalau ragu nomornya masih berlaku, cek halaman resmi daftar kategori Adobe Stock.

## 6. Filter penolakan (wajib)

Di judul maupun keyword, tidak boleh ada:
- Nama merek, perusahaan, atau produk (termasuk nama OS, browser, kamera, aplikasi).
- Nama platform sosial (TikTok, Instagram, YouTube, dan lain-lain), nama orang, karakter fiksi, atau judul film dan game.
- Kata yang tidak terkait dengan isi aset (keyword spam).

Kalau aset itu sendiri menampilkan logo, nama platform, atau UI yang bisa dikenali, beri tahu pengguna sebelum membuat metadata, karena kemungkinan besar akan ditolak.

## 7. Tulis CSV

- Lokasi: `metadata/adobe_stock_<nama-project>_<YYYY-MM-DD>.csv` di root project. Kalau file batch hari itu sudah ada, tambahkan baris; jangan menimpa.
- Header persis: `Filename,Title,Keywords,Category,Releases`
- Filename: nama file render persis, termasuk ekstensi dan huruf besar kecilnya, maksimal 30 karakter. Kalau lebih dari 30, beri tahu pengguna dan usulkan nama yang lebih pendek; jangan mengganti nama file sendiri.
- Keywords dalam satu sel, dipisah koma, dan dibungkus tanda kutip ganda.
- Releases dikosongkan (aset grafis tanpa model atau properti).
- Pemisah koma (bukan titik koma), encoding UTF-8, tanpa formula atau format khusus.
- Tulis CSV dengan modul csv bawaan Python atau cara lain yang meng-quote dengan benar, jangan merangkai string manual.

## 8. Cek akhir

Baca ulang CSV dan pastikan untuk setiap baris: judul paling banyak 70 karakter tanpa koma dan memuat frasa "for" dengan kegunaan dari brief, keyword paling banyak 50 tanpa duplikat, filename paling banyak 30 karakter dan file-nya benar ada di folder output, kategori terisi, dan tidak ada judul yang sama dengan baris lain atau CSV lama.

## 9. Laporan ke pengguna

Tampilkan ringkasan per aset yang baru dibuatkan: filename, judul (dengan jumlah karakter), kegunaan yang dipakai di judul, 10 keyword teratas, jumlah total keyword, kategori, dan lokasi file CSV. Sebutkan juga jumlah aset yang dilewati karena sudah punya metadata, dan aset yang belum dirender. CSV batch hari ini hanya berisi aset baru, jadi bisa langsung di-upload tanpa menimpa metadata lama. Ingatkan langkah upload: upload video ke Contributor Portal dulu, lalu di tab New pilih Upload CSV, dan jangan centang label generative AI.