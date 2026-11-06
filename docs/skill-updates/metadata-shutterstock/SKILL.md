---
name: "metadata-shutterstock"
description: "Buat metadata Shutterstock (deskripsi, keyword, kategori) dan file CSV siap upload untuk animasi Remotion di project ini, hanya untuk aset yang belum punya metadata Shutterstock."
---

# Metadata Shutterstock dari project Remotion

Dipakai di Claude Code, di dalam project Remotion, setelah pengguna puas dengan hasil preview. Tujuannya membuat deskripsi, keyword, dan kategori yang akurat, lalu menulis CSV yang bisa langsung di-upload di halaman Submit Shutterstock. Bicara dengan pengguna dalam bahasa Indonesia; isi metadata wajib bahasa Inggris.

Pengguna membuat aset HUD/tech (loading bar, scanning bar, overlay kamera REC, countdown, callout, UI generik), umumnya putih minimal di background hitam atau transparan. Pengguna upload metadata lewat CSV.

## Aturan Shutterstock yang berbeda dari Adobe

- Tidak ada kolom judul terpisah: kolom Description berfungsi sebagai judul. Maksimal 200 karakter, boleh memakai koma.
- Keyword minimal 7, maksimal 50. Shutterstock keras terhadap keyword spam, jadi jangan mengisi sampai 50 kalau tidak relevan. Target 25 sampai 40 keyword yang benar-benar menggambarkan aset.
- Kategori berupa nama dari daftar resmi Shutterstock (bukan nomor), 1 atau 2, dipisah koma.
- Tidak menerima merek dagang atau logo, baik di konten maupun di metadata.

## 1. Tentukan aset yang diproses

Default: hanya aset yang belum punya metadata Shutterstock.

1. Kumpulkan semua file video hasil render di folder output (biasanya `out/`; cek konfigurasi render kalau foldernya lain).
2. Baca hanya CSV dengan awalan `shutterstock_` di folder `metadata/`, dan kumpulkan nilai kolom Filename yang sudah ada. Jangan menghitung CSV Adobe (`adobe_stock_*.csv`) sebagai sudah selesai.
3. Aset yang diproses = file render yang nama file-nya belum ada di CSV Shutterstock mana pun. Cocokkan nama persis, termasuk ekstensi.
4. Sebelum mulai, tampilkan ringkasan: berapa aset dilewati karena sudah punya metadata Shutterstock, dan daftar aset yang akan dibuatkan. Kalau tidak ada yang baru, katakan begitu dan berhenti.

Pengecualian:
- Kalau pengguna menyebut nama komposisi atau file tertentu, proses itu saja walaupun sudah punya metadata (anggap permintaan perbaikan), dan ingatkan bahwa baris lama sebaiknya tidak di-upload lagi.
- Kalau pengguna minta "buat ulang semua", proses semua aset.
- Komposisi di `src/Root.tsx` yang belum punya file render: sebutkan sebagai "belum dirender", jangan dibuatkan metadata.

Nama file diambil dari file hasil render yang sebenarnya. Ikuti pola penamaan pengguna; jangan mengganti nama file tanpa izin.

## 2. Pahami isi aset

Kalau aset sudah punya metadata Adobe di `adobe_stock_*.csv`, pakai judul dan keyword-nya sebagai titik awal, lalu sesuaikan dengan aturan Shutterstock. Tetap cek kodenya untuk memastikan faktanya.

Dari kode komposisi, catat fakta (bukan perkiraan):
- Elemen yang terlihat, teks di layar, dan gerakannya.
- Warna dan background (hitam, transparan, atau lainnya).
- Resolusi dan orientasi dari `width` dan `height`.
- Durasi (`durationInFrames / fps`) dan apakah loop.
- Alpha channel: benar hanya kalau background transparan dan render memakai codec dengan alpha (misalnya ProRes 4444).

Kalau ada fakta yang tidak bisa dipastikan dari kode, tanyakan, jangan menebak.

Kegunaan untuk buyer: baca bagian "Kegunaan untuk buyer" di brief project (biasanya `docs/brief.md`), yang sudah diurutkan dari yang paling laku. Pakai hanya kegunaan yang benar-benar didukung aset (misalnya "overlay" hanya kalau latarnya polos gelap atau ada alpha). Kalau bagian itu tidak ada, usulkan 2 sampai 4 kegunaan dari isi aset dan minta pengguna memastikan sebelum lanjut.

## 3. Deskripsi (kolom Description)

- Maksimal 200 karakter, minimal sekitar 5 kata. Bahasa Inggris.
- Berupa frasa atau kalimat deskriptif yang menjelaskan apa, gaya, dan kegunaannya. Bukan daftar keyword.
- Pola: [elemen utama dan gerakannya] + [gaya] + [background/format] + for [kegunaan].
- Wajib diakhiri frasa kegunaan "for ..." berisi 2 sampai 3 kegunaan teratas dari brief. Contoh: `Minimal HUD loading bar filling to 100 percent and revealing 2027, futuristic new year animation on dark background for new year countdown, video intro and overlay`
- Boleh menyebut "4K", "seamless loop", "alpha channel", "vertical" hanya kalau memang benar untuk aset itu.
- Setiap file mendapat deskripsi yang unik. Varian (vertikal, alpha, warna lain) dibedakan di deskripsinya. Cek CSV Shutterstock lama supaya tidak ada deskripsi yang sama persis.

## 4. Keyword

- 25 sampai 40 keyword, huruf kecil, bahasa Inggris, tanpa duplikat, hanya yang benar-benar ada di aset.
- Keyword bisa berupa satu kata atau kata majemuk (misalnya "loading bar", "progress bar").
- Isi: subjek utama, kata dari deskripsi, gaya dan konsep (futuristic, minimal, sci-fi, digital, technology), kegunaan bagi editor (overlay, intro, transition, presentation), dan pendukung (warna, background, motion graphics, animation). Semua kegunaan dari brief wajib masuk keyword.
- Tetap taruh keyword terpenting di depan supaya mudah dicek, walaupun urutan tidak sepenting di Adobe.
- Tanpa data teknis kamera atau codec.

## 5. Kategori

Pilih 1 atau 2 nama kategori dari daftar resmi Shutterstock. Untuk aset ini biasanya "Technology", ditambah salah satu dari "Backgrounds/Textures", "Abstract", atau "Holidays" (untuk aset musiman seperti Tahun Baru) kalau cocok. Kalau ragu nama kategorinya masih berlaku, cek daftar kategori di halaman bantuan kontributor Shutterstock.

## 6. Filter penolakan (wajib)

Di deskripsi maupun keyword, tidak boleh ada:
- Nama merek, perusahaan, atau produk (termasuk nama OS, browser, kamera, aplikasi).
- Nama platform sosial (TikTok, Instagram, YouTube, dan lain-lain), nama orang, karakter fiksi, atau judul film dan game.
- Keyword yang tidak terkait dengan isi aset.

Kalau aset itu sendiri menampilkan logo, nama platform, atau UI yang bisa dikenali, beri tahu pengguna sebelum membuat metadata, karena kemungkinan besar akan ditolak.

## 7. Tulis CSV

- Lokasi: `metadata/shutterstock_<nama-project>_<YYYY-MM-DD>.csv` di root project. Kalau file batch hari itu sudah ada, tambahkan baris; jangan menimpa.
- Header: `Filename,Description,Keywords,Categories,Illustration,Mature Content,Editorial`
- Filename: nama file render persis, termasuk ekstensi dan huruf besar kecilnya.
- Description, Keywords, dan Categories dibungkus tanda kutip ganda karena berisi koma.
- Illustration, Mature Content, Editorial diisi `No` (aset grafis komersial, bukan editorial).
- Pemisah koma (bukan titik koma), encoding UTF-8.
- Tulis CSV dengan modul csv bawaan Python atau cara lain yang meng-quote dengan benar, jangan merangkai string manual.

## 8. Cek akhir

Baca ulang CSV dan pastikan untuk setiap baris: deskripsi paling banyak 200 karakter, unik, dan memuat frasa "for" dengan kegunaan dari brief, keyword antara 7 dan 50 tanpa duplikat, 1 atau 2 kategori yang valid, file-nya benar ada di folder output, dan tidak ada merek dagang.

## 9. Laporan ke pengguna

Tampilkan ringkasan per aset yang baru dibuatkan: filename, deskripsi (dengan jumlah karakter), kegunaan yang dipakai, jumlah keyword, kategori, dan lokasi file CSV. Sebutkan juga jumlah aset yang dilewati dan aset yang belum dirender. Ingatkan langkah upload: upload video dulu, lalu di halaman Submit klik tombol CSV dan pilih file-nya. Jangan meng-upload file CSV bersama video lewat FTPS atau halaman upload.