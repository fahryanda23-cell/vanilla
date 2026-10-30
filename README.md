# Toko Selaras - Versi Sederhana (HTML, CSS, JS)

Versi ini dibuat murni menggunakan **HTML, CSS, dan JavaScript saja** tanpa memerlukan Node.js, npm, webpack, ataupun vite. 

Semua fitur tetap **100% lengkap & otomatis tersinkronisasi dengan Database Firebase Firestore**:
- Etalase produk lengkap dengan filter kategori & pencarian real-time
- Keranjang belanja (cart) & format pesan WhatsApp otomatis
- Panel Admin / Pemilik Toko dengan keamanan PIN (Default: `1234`)
- Tambah & edit barang langsung tersimpan ke Cloud Firestore
- Fitur kompresi foto otomatis (bisa unggah foto langsung dari HP/Laptop)
- Responsive di HP, Tablet, dan Komputer

---

## Cara Menjalankan di Visual Studio Code (VS Code)

### Langkah 1: Buka Folder di VS Code
1. Buka aplikasi **VS Code**.
2. Pilih menu **File > Open Folder...**.
3. Pilih folder `vanilla` (atau folder utama tempat file `index.html` ini berada).

### Langkah 2: Jalankan Menggunakan Live Server
Karena menggunakan ES Modules (`type="module"`) untuk menghubungkan Firebase, browser memerlukan web server lokal ringan:

1. Di VS Code, buka menu **Extensions** (ikon kotak di sisi kiri, atau tekan `Ctrl + Shift + X`).
2. Cari ekstensi bernama **"Live Server"** (oleh Ritwick Dey) dan klik **Install**.
3. Buka file `index.html`.
4. Klik kanan pada area editor `index.html` lalu pilih **"Open with Live Server"** (atau klik tombol **"Go Live"** di pojok kanan bawah VS Code).
5. Halaman web etalase toko akan langsung terbuka di browser Anda (biasanya di `http://127.0.0.1:5500/index.html`).

---

## Cara Membuka Panel Pemilik Toko (Admin)
Ada 2 cara rahasia yang mudah:
1. **Klik 3x cepat pada nama/logo toko "Toko Selaras"** di bagian atas navbar.
2. Atau tambahkan `?admin=true` di akhir alamat URL browser Anda (contoh: `http://127.0.0.1:5500/index.html?admin=true`).
3. Masukkan PIN keamanan: **`1234`**.

Di dalam panel admin, Anda bisa:
- Menambahkan produk baru beserta foto dari galeri HP/laptop
- Menambah atau mengurangi stok barang dengan tombol `+` dan `-`
- Mengubah nama toko, nomor WhatsApp, dan info rekening bank
- Mengganti PIN keamanan sesuai keinginan Anda

---

## File dalam Folder Ini:
- `index.html` : Struktur halaman etalase, modal detail, keranjang, dan panel admin.
- `style.css` : Desain tipografi, animasi modal, dan tata letak.
- `app.js` : Logika aplikasi, integrasi Cloud Firestore, keranjang belanja, kompresi gambar, dan WhatsApp checkout.
