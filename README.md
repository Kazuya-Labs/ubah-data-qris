# 🚀 QRIS Merchant & Dynamic Generator

Aplikasi berbasis web modern untuk memodifikasi **Nama Merchant** dan mengubah **QRIS Statis menjadi Dinamis** secara instan. Alat ini dirancang untuk memudahkan pemilik bisnis dalam mengelola tampilan dan fungsionalitas kode QRIS mereka.

## ✨ Fitur Utama

- **Edit Nama Merchant:** Ubah tampilan nama merchant pada template QRIS tanpa merusak struktur data.
- **QRIS Dinamis:** Tambahkan nominal pembayaran sehingga pelanggan tidak perlu input manual (Tag 54 EMVCo).
- **Proses Sisi Klien:** Gambar diproses langsung di browser menggunakan JavaScript—cepat dan lebih aman.
- **Preview Instan:** Lihat hasil perubahan secara langsung sebelum mengunduh.
- **UI Classic Modern:** Antarmuka responsif menggunakan Tailwind CSS yang dioptimalkan untuk desktop dan mobile.

## 🛠️ Teknologi yang Digunakan

- **Frontend:** [React.js](https://reactjs.org) dengan [Vite](https://vitejs.dev) (HMR yang super cepat).
- **Styling:** [Tailwind CSS](https://tailwindcss.com) untuk UI yang bersih dan profesional.
- **QR Processing:** Library kustom untuk membaca dan mengupdate data string QRIS (EMVCo standard).

## 🚀 Cara Menjalankan Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com
   cd qris-generator
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan aplikasi dalam mode pengembangan:**
   ```bash
   npm run dev
   ```

4. **Build untuk produksi:**
   ```bash
   npm run build
   ```

## 📋 Cara Penggunaan

1. **Upload:** Masukkan foto QRIS statis milik merchant Anda.
2. **Konfigurasi:**
   - Isi **Nama Merchant** untuk mengganti teks yang tampil.
   - Isi **Nominal** jika ingin membuat QRIS Dinamis (opsional).
3. **Generate:** Klik tombol proses dan tunggu beberapa detik.
4. **Download:** Simpan hasilnya dan QRIS baru siap digunakan untuk transaksi.

## ⚠️ Keamanan & Privasi

Aplikasi ini tidak menyimpan data QRIS atau gambar yang Anda unggah ke server mana pun. Semua pemrosesan data dilakukan secara lokal di perangkat Anda menggunakan JavaScript. Pastikan Anda hanya menggunakan alat ini untuk keperluan legal dan kepemilikan merchant yang sah.

---
Dibuat dengan ❤️ untuk kemudahan transaksi digital Indonesia.
