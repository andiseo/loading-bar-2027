# CLAUDE.md

Project Remotion untuk aset microstock "2027 Loading Bar". Brief lengkap ada
di [docs/brief.md](docs/brief.md).

## Struktur

- `src/Root.tsx`: daftar semua `<Composition>`.
- `src/compositions/`: satu file per komposisi atau varian.
  `render-config.ts` berisi preset render ProRes 4444 dengan alpha.
- `src/components/`: komponen yang dipakai ulang (bar, label, angka).
- `src/styles/`: warna, tipografi, dan ukuran kanvas. Ubah nilai di sini,
  bukan di dalam komposisi.
- `public/fonts/`: Space Grotesk (lisensi OFL 1.1, aman komersil).
  Untuk angka yang berubah (persen, counter), pakai
  `fontVariantNumeric: TYPOGRAPHY.numeric` supaya tidak goyang.
- `out/`: hasil render, tidak masuk git.
- `metadata/`: CSV Adobe Stock dan Shutterstock.
- `references/`: gambar atau video referensi gaya dari pengguna. Lihat
  "Aturan memakai referensi" di bawah.

## Aturan aset microstock

Aturan ini wajib untuk setiap komposisi baru maupun perubahan komposisi lama.

- Semua teks dan elemen di dalam video harus generik. Dilarang
  memakai merek dagang, nama produk, nama format milik perusahaan
  (XAVC, ProRes, dll), merek kamera, nama OS, browser, aplikasi,
  atau platform sosial.
- Dilarang meniru UI asli platform atau software yang bisa dikenali.
  UI harus desain orisinal.
- Dilarang memakai emoji bawaan Apple/Google; gambar ikon sendiri.
- Teks di layar memakai istilah umum: REC, LIVE, 4K, 30P, ISO 800,
  F2.8, 1/60, 5600K, 4:2:2 10-BIT, RAW, LOG, BATTERY, dan sejenisnya.
- Kalau ragu suatu istilah adalah merek, tanyakan dulu sebelum dipakai.

## Aturan memakai referensi

Isi `references/` hampir selalu karya orang lain yang sudah dijual di
microstock. Kalau hasil kita terlalu mirip, aset bisa ditolak sebagai
similar content atau melanggar hak cipta. Aturan ini wajib setiap kali
referensi dipakai.

- Referensi hanya untuk menangkap suasana: kesan warna, tingkat
  kerapatan, rasa gerak (cepat, tenang, mekanis). Jangan menyalin
  layout, komposisi, bentuk elemen, urutan animasi, timing, atau teks.
- Jangan menjiplak atau mengukur ulang posisi dan ukuran dari referensi.
- Setiap aset wajib berbeda dari referensi di minimal tiga hal berikut:
  1. Komposisi dan posisi elemen.
  2. Bentuk elemen (bar, bingkai, garis, ikon).
  3. Palet warna atau aksen.
  4. Tipografi (font, weight, ukuran, kapitalisasi).
  5. Gaya dan urutan gerak (cara masuk, transisi, cara keluar).
  6. Ide tambahan yang tidak ada di referensi.
- Sebelum menulis kode, tulis catatan singkat ke pengguna: apa yang
  diambil dari referensi, dan apa yang diubah untuk tiap poin di atas.
- Setelah render frame contoh, bandingkan dengan referensi. Kalau
  orang awam bisa menganggap keduanya dari kreator yang sama, revisi
  dulu sebelum lanjut.
- Jangan gabungkan banyak elemen dari satu referensi yang sama. Lebih
  aman mengambil satu kesan kecil dari beberapa referensi berbeda.
- Kalau ragu suatu bagian terlalu mirip, tanyakan pengguna dulu.

## Aturan kegunaan untuk buyer

Aset harus mudah dipakai editor tanpa perlu banyak mengubah. Aturan ini
wajib untuk setiap komposisi baru maupun varian.

- Sebelum desain, tentukan 2 sampai 4 kegunaan utama aset dan catat di
  brief, di bagian "Kegunaan untuk buyer". Urutkan dari yang paling
  laku. Kegunaan ini dipakai juga untuk judul dan deskripsi metadata.
- Kegunaan ditulis generik: intro, overlay, transition, countdown,
  event screen, presentation, social media story. Jangan menyebut nama
  platform atau aplikasi.
- Desain harus benar-benar mendukung kegunaan yang ditulis:
  - Momen kunci (misalnya angka tahun muncul) jatuh tepat di detik
    bulat, supaya mudah disinkronkan dengan musik atau hitungan mundur.
  - Akhir video ditahan minimal 2 detik di kondisi final, supaya editor
    bisa memperpanjang atau membekukan frame. Selama masa tahan, elemen
    utama (angka atau teks) diam dan terbaca, tapi elemen pendukung tetap
    bergerak pelan dengan meneruskan gerakan khas aset itu (misalnya
    cincin tetap berputar pelan), bukan efek berdenyut. Gerakan ini mulai
    dari nol tepat di momen kunci, jadi frame momen kunci tidak berubah.
    (Berlaku mulai batch 3. Batch 1 dan 2 tetap diam di akhir.)
  - Elemen penting berada di dalam area aman 90% kanvas. Untuk versi
    vertikal, kosongkan sekitar 15% atas dan bawah.
  - Teks tetap terbaca saat video diperkecil ke 1080p atau layar HP.
  - Teks di layar berbahasa Inggris atau istilah universal, supaya
    cocok untuk pasar mana pun.
  - Untuk kegunaan overlay: latar polos gelap yang bisa dipakai dengan
    blend Screen, atau aset alpha. Aset alpha harus desain sendiri,
    bukan salinan aset lain (lihat "Aturan variasi" di bawah). Cek
    tampilannya di atas latar terang dan gelap.
- Jangan menulis kegunaan di metadata yang tidak didukung oleh aset.

## Aturan variasi

Microstock menolak aset yang hanya beda tipis dari aset lain di portofolio
yang sama (similar content). Aturan ini wajib untuk setiap batch.

- Setiap aset harus punya desain sendiri: bentuk elemen, komposisi, atau
  gaya gerak yang jelas berbeda dari aset lain di project.
- Dilarang membuat aset yang bedanya hanya di latar, misalnya satu versi
  alpha dan satu versi latar solid dari desain yang sama. Kalau sebuah
  desain dibuat alpha, jangan ada versi solid atau hitamnya, dan sebaliknya.
- Dilarang juga membuat aset yang bedanya hanya di warna (palet atau tema
  diganti, bentuk dan gerak sama), atau hanya di orientasi (horizontal
  dan vertikal dari desain yang sama).
- Komponen dan kode boleh dipakai ulang, asalkan hasil akhirnya terlihat
  sebagai desain yang berbeda.
- Sebelum membuat batch baru, cek daftar aset di brief dan pastikan tidak
  ada pasangan yang melanggar aturan ini.
