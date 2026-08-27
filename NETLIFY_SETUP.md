# RIDOK — Netlify Contact Form Setup

Versi ini sudah mengaktifkan **Netlify Forms** pada halaman `contact.html`.
Tidak membutuhkan PHP, database, atau server backend tambahan.

## Cara deploy

1. Upload/deploy seluruh isi folder project ini ke Netlify.
2. Setelah deploy selesai, buka **Netlify Dashboard → project kamu → Forms**.
3. Pastikan form bernama **contact** muncul.
4. Untuk menerima notifikasi ke Gmail, buka pengaturan form **contact** dan tambahkan **Form submission notification / Email notification** ke alamat Gmail yang kamu inginkan.
5. Lakukan test dari website yang sudah live, bukan dari file HTML yang dibuka langsung di komputer.

## Data yang dikirim

- first-name
- last-name
- business-name
- email
- whatsapp
- requirement-type
- message
- consent

Form menggunakan `POST` ke root site dan dikirim sebagai `application/x-www-form-urlencoded`, sehingga tetap cocok dengan Netlify Forms meskipun JavaScript melakukan validasi sendiri.
