# Brief: 2027 Loading Bar

Sumber: Google Sheet "Riset Microstock Mingguan", tab Ide Harian, baris Jumat 06 Nov 2026.

| | |
|---|---|
| Keyword pencarian | 2027 loading bar, new year loading bar, 2027 HUD |
| Kategori | Seasonal (Tahun Baru) |
| Level | 1 (elemen tunggal, gerakan sederhana) |
| Skor | 9.0 (Demand 4, Supply 2, Kecocokan 5, Kemudahan 5) |

## Isi animasi

Loading bar putih di background hitam terisi 0 sampai 100% dengan label
"LOADING 2027" dan persen berjalan. Di 100%, bar menghilang dan angka 2027
muncul dengan glow tipis. Durasi 10 sampai 15 detik, 4K, 30 fps.

## Kegunaan untuk buyer

Urut dari yang paling laku:

1. New year countdown: angka 2027 muncul tepat di detik 10, jadi bisa
   disinkronkan dengan hitungan mundur 10 detik menjelang tengah malam.
2. Intro video tahun baru atau rekap tahunan.
3. Overlay di atas footage (blend Screen di latar hitam, atau versi alpha).
4. Layar event dan panggung (4K horizontal).

### Keputusan desain untuk mendukung kegunaan

- Timing (14 detik, 420 frame di 30 fps):
  - 0 sampai 10 detik: bar terisi 0 sampai 100% secara linear, jadi tiap
    detik bulat sama dengan kelipatan 10% (detik 3 = 30%). Editor bisa
    menempel angka hitung mundur 10, 9, 8, dan seterusnya tanpa menebak.
  - Tepat detik 10 (frame 300): bar sampai 100%, langsung menyusut cepat,
    dan angka 2027 muncul di frame yang sama. Bar tidak menyusut lebih
    awal supaya persen tiap detik tetap bulat.
  - 10 sampai 14 detik: kondisi akhir bersih ditahan untuk intro dan
    freeze frame.
- Kegunaan overlay dipenuhi oleh aset alpha tersendiri (bukan salinan
  aset solid). Cek di atas latar terang dan gelap.
- Judul metadata: aset solid memakai kegunaan 1 dan 2 (countdown, intro).
  Kata "Overlay" hanya di judul aset alpha.

## Catatan Remotion

- `interpolate()` untuk lebar bar dan angka persen.
- `spring()` untuk kemunculan angka 2027.
- Versi alpha: render ProRes 4444 dengan background transparan.

## Alasan

Aset tahun 2027 bergaya HUD masih jarang, sementara format loading bar bertahun
sudah terbukti untuk tahun lain (2026, 2029). Kode scanning bar bisa dipakai
ulang. Upload sekarang memberi sekitar 8 minggu sebelum 31 Desember.

## Risiko

Laku musiman saja (November sampai Januari). Countdown generik sangat ramai,
jadi tonjolkan angka 2027 dan gaya minimal putih.

## Turunan variasi

- 2026 to 2027 number flip
- new year countdown HUD
- vertical 2027 loading bar (2160x3840)
- 2027 loading bar alpha channel
- system update 2027

Catatan: daftar ini ditulis sebelum ada "Aturan variasi". Versi vertikal
atau alpha dari desain yang sudah ada tidak boleh dibuat; lihat "Daftar
aset" di bawah untuk yang dipakai.

## Draft metadata

- Judul: Futuristic HUD Loading Bar 2027, Minimal White New Year Progress
  Animation on Black Background
- Keyword: 2027, new year, loading bar, hud, futuristic, progress bar, loading,
  technology, digital, interface, minimal, black background, overlay,
  celebration, year end, countdown, percent, sci-fi, ui, motion graphics

Catatan: judul Adobe maksimal 70 karakter tanpa koma, jadi draft ini perlu
dipendekkan saat membuat metadata.

## Daftar aset (11, semua 3840x2160, 14 detik, 30 fps, momen kunci di frame 300)

Sesuai "Aturan variasi" di CLAUDE.md: tiap aset desain sendiri, tidak ada
pasangan yang bedanya hanya latar, warna, atau orientasi. Versi solid dari
LoadingBar, Countdown, SystemUpdate, dan versi vertikal sudah dihapus.

### Batch 1, latar hitam

| Komposisi | Isi |
|---|---|
| YearFlip2027 | 2026 dengan garis waktu JAN sampai DEC, garis scan mengganti 6 jadi 7 |
| Counter2027 | Angka menghitung 0000 ke 2027, melambat, tiap digit terkunci; akhir WELCOME TO THE NEW YEAR |
| SignalBars2027 | 10 batang sinyal bertingkat, satu per detik; akhir 2027 + CONNECTED |
| Transfer2027 | Paket data dari node 2026 ke node 2027; node membesar jadi angka + TRANSFER COMPLETE |
| Hourglass2027 | Jam pasir geometris 10 detik, berputar hilang; tutupnya membingkai 2027 |

### Batch 2, latar biru es solid

| Komposisi | Isi |
|---|---|
| PixelBuild2027Ice | 2027 dari grid kotak 5x7 yang menyala acak 10% per detik, lalu menyatu jadi solid |
| PrintScan2027Ice | Garis cetak turun dan mencetak 2027 bergaris, lalu garis merapat jadi solid |
| Battery2027Ice | Baterai terisi mulus, 2027 tembus di isi baterai + FULLY CHARGED |

### Batch 2, alpha (hanya ada versi alpha)

| Komposisi | Isi |
|---|---|
| LoadingBar2027Alpha | Bar penggaris tipis 10% per detik, menyusut jadi garis aksen di bawah 2027 |
| Countdown2027Alpha | Hitung mundur 10 sampai 1 dalam ring 10 segmen, akhir 2027 + HAPPY NEW YEAR |
| SystemUpdate2027Alpha | Panel update 5 langkah, akhir UPDATE COMPLETE + 2027 |

Catatan:
- Tema warna ada di `src/styles/theme.ts` (dark, ice, alpha).
- Versi alpha diberi bayangan gelap tipis supaya tetap terbaca di footage
  terang. Dicek lewat folder "Checks" di Studio (bukan untuk upload).
- Kegunaan "overlay" hanya untuk metadata ketiga aset alpha.
- Metadata dibuat setelah semua aset final.

## Batch 3 (9 aset, 8 sampai 9 detik, tema HUD biru)

### Timing: momen terbaik di detik 5

- Catatan pengguna: Adobe Stock mengambil thumbnail video di sekitar
  detik 5, jadi detik 5 harus jadi frame terbaik. (Belum diverifikasi
  dari dokumentasi resmi, tapi tetap dipakai sebagai patokan.)
- 2027 sudah tampil penuh dan diam tepat di frame 150 (detik 5). Animasi
  masuk berjalan sekitar 10 sampai 12 frame sebelumnya.
- Masa tahan: aset 8 detik ditahan 2 detik (detik 5 sampai 7), aset 9
  detik ditahan 3 detik (detik 5 sampai 8). 2027 diam, tapi gerakan khas
  aset tetap berjalan pelan (idle) dan menyambung ke animasi keluar.
- 1 detik terakhir adalah animasi keluar yang khusus per desain (bukan
  glitch), dan frame terakhir kosong (latar polos atau transparan). Ini
  jadi penanda selesai dan memudahkan dipakai sebagai transition.
  Durasi awalnya 7 dan 8 detik, ditambah 1 detik untuk animasi keluar.
- Karena durasi pendek, kegunaan countdown di batch ini adalah hitung
  mundur 5 detik (bukan 10).

### Palet

A. Navy + Cyan (5 aset): latar #020A14, elemen #3FD0FF, garis sekunder
#1F6FD1, garis redup #0E2A44, teks #E4F6FF, aksen oranye #FF9F43 hanya
untuk penanda kecil.

B. Electric Blue monokrom (4 aset): latar #01040C, elemen #2F7BFF, biru
muda #7FB2FF, garis redup #0B1F3F, teks #D6E6FF. Glow lebih kuat.

### Kegunaan untuk buyer (batch 3)

1. Intro pendek tahun baru.
2. Countdown 5 detik.
3. Overlay (hanya aset alpha).
4. Transition atau bumper di video sosial dan presentasi.

### Daftar

| Komposisi | Palet | Latar | Durasi | Isi | Gerak idle | Animasi keluar |
|---|---|---|---|---|---|---|
| ReticleLock2027 | A | Solid | 9s | Bidikan berlingkar melacak lalu mengunci, TARGET LOCKED + 2027 | Cincin putus-putus tetap berputar pelan | Bidikan membesar dan memudar |
| GaugeDial2027 | A | Solid | 9s | Gauge busur 2020 sampai 2030, jarum berhenti di 2027 | Sorotan cahaya menyapu busur skala | Jarum turun kembali ke 2020, gauge memudar |
| SonarPing2027 | A | Solid | 8s | Ping tiap detik dengan hitung mundur 5 sampai 1, lalu 2027 | Ping samar tetap keluar, lebih pelan | Cincin terakhir melebar keluar layar |
| DotRing2027Alpha | A | Alpha | 9s | Cincin 72 titik menyala sampai 100%, lalu 2027 | Rangkaian titik terang berjalan mengelilingi cincin | Titik padam satu per satu mundur |
| TextRing2027Alpha | A | Alpha | 8s | Teks melingkar berputar lalu berhenti, 2027 di tengah | Cincin teks tetap berputar pelan | Cincin teks berputar cepat dan melebar |
| OrbitRings2027Alpha | B | Alpha | 8s | Tiga cincin orbit merapat membingkai 2027 | Cincin dan titik orbit tetap berputar pelan | Cincin orbit terlempar keluar |
| Iris2027 | B | Solid | 8s | Bilah aperture membuka F16 ke F1.4, memperlihatkan 2027 | Cincin skala luar berputar pelan | Aperture menutup lagi |
| WireGlobe2027 | B | Solid | 9s | Bola dunia wireframe berputar dengan satelit, lalu 2027 | Globe berputar pelan, satelit tetap mengorbit | Globe berputar cepat dan mengecil jadi titik |
| YearRoute2027Alpha | B | Alpha | 9s | Perjalanan tahun: cahaya menyusuri jalur berliku melewati halte 2021 sampai 2026, tiba di 2027 | Cahaya samar terus mengalir di jalur, jalan lanjutan putus-putus ke kanan | Jalur menghilang berurutan dari halte pertama, lalu 2027 memudar |

Catatan referensi YearRoute2027Alpha (pengganti MidnightClock): kesan
diambil dari screenshot diagram alur (garis tipis berbelok membulat dan
titik di jalur). Diubah: satu jalur tanpa cabang (bukan pohon), hanya
cincin halte berlabel tahun (tanpa belah ketupat, kotak, atau logo),
warna electric blue di alpha, ada gerak cahaya, dan label tahun sebagai
ide tambahan. Referensi itu memuat logo produk, jadi tidak ada bentuk
yang disalin langsung.

## Batch 4 (8 aset, palet emas, 8 sampai 9 detik)

- Timing sama seperti batch 3: 2027 penuh di detik 5, gerak idle selama
  masa tahan, animasi keluar di detik terakhir, frame terakhir kosong.
- Tanpa label di pojok. Yang tampil hanya elemen utama dan 2027, supaya
  tidak mengganggu dan pojok bebas untuk buyer. Teks yang menyatu dengan
  elemen utama (misalnya tulisan di tiket) boleh.
- Palet emas: latar #0A0805, emas #E8B04B, champagne #F5DFA8, garis
  redup #3A2C14, teks #FFF4DC, kilau putih untuk titik kecil.
- Kegunaan: intro tahun baru, layar event dan pesta, undangan, overlay
  (aset alpha), countdown 5 detik.

| Komposisi | Latar | Durasi | Isi |
|---|---|---|---|
| Constellation2027 | Solid | 9s | Bintang emas menyala dan terhubung garis membentuk 2027 |
| Spotlight2027 | Solid | 9s | Dua sorot lampu panggung menyapu lalu bersilang di 2027 |
| HorizonRise2027 | Solid | 8s | Satu garis cakrawala emas tumbuh dari titik, 2027 terbit dari balik garis |
| GoldFill2027 | Solid | 8s | Garis luar 2027 terisi cairan emas dari bawah |
| GeoBurst2027Alpha | Alpha | 9s | Ledakan geometris tiap detik, ledakan terakhir menyisakan 2027 |
| EventTicket2027Alpha | Alpha | 9s | Tiket ADMIT ONE dipindai, ACCESS GRANTED + 2027 |
| LaserEngrave2027Alpha | Alpha | 8s | Cahaya laser mengukir garis luar 2027 lalu terisi |
| CoinSpin2027Alpha | Alpha | 8s | Koin emas berputar 2026/2027, berhenti di 2027 |

Revisi batch 4:
- Spotlight2027: garis panggung dihapus, hanya sorot lampu dan 2027.
- LineCurtain2027 diganti HorizonRise2027 (lebih minimalis). Idle: kilau
  kecil berjalan pelan di garis. Keluar: 2027 turun ke balik garis, garis
  menyusut jadi titik.
- EventTicket2027Alpha: garis scan cukup satu kali lewat dari kiri ke
  kanan, gerak halus.
- CoinSpin2027Alpha: kilau di tepi koin dihapus, idle cukup goyangan halus.
