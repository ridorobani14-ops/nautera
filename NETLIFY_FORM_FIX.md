# Netlify Forms — Contact

Form contact pada `contact.html` sudah menggunakan Netlify Forms.

## WAJIB setelah deploy

1. Buka Netlify Dashboard dan pilih site.
2. Masuk ke **Project configuration → Forms** (atau **Forms** pada menu site).
3. Pastikan **Form detection** aktif.
4. Deploy ulang folder/ZIP ini setelah perubahan.
5. Setelah deploy, buka **Forms** dan pastikan ada form bernama `contact`.
6. Untuk menerima email Gmail: buka **Project configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification**, pilih form `contact`, lalu masukkan alamat Gmail tujuan.

## Cara kerja

Pengunjung mengirim form → Netlify menerima submission → submission muncul di Forms → Netlify mengirim notification ke Gmail yang kamu tentukan.

Tidak membutuhkan PHP, XAMPP, database, atau server sendiri.
