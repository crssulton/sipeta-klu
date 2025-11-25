# Custom Fields Implementation Guide

## Overview

Sistem custom fields dinamis telah berhasil diimplementasikan untuk form tanah. Fitur ini memungkinkan admin untuk menambahkan field tambahan secara dinamis tanpa perlu mengubah kode.

## Fitur Utama

### 1. **Tipe Field yang Didukung**
- **Text**: Input teks biasa
- **Textarea**: Input teks multi-baris
- **Select**: Dropdown dengan pilihan
- **Radio**: Radio button dengan pilihan tunggal
- **Checkbox**: Checkbox dengan pilihan multiple
- **Number**: Input angka
- **Date**: Date picker

### 2. **Pengaturan Field**
Setiap custom field memiliki pengaturan:
- **Field Key**: Identifier unik (snake_case, contoh: `sumber_data`)
- **Field Label**: Label yang ditampilkan (contoh: "Sumber Data")
- **Field Type**: Tipe input field
- **Options**: Pilihan untuk select/radio/checkbox
- **Required**: Apakah field wajib diisi
- **Visible in List**: Tampilkan di tabel list tanah
- **Visible in Detail**: Tampilkan di halaman detail tanah
- **Active**: Field aktif dan dapat digunakan
- **Order**: Urutan tampilan field

## Cara Menggunakan

### Menambah Custom Field Baru

1. Login sebagai Super Admin
2. Buka menu **Custom Fields** (`/custom-fields`)
3. Klik tombol **"Tambah Field"**
4. Isi form:
   - **Label Field**: Nama field yang akan ditampilkan (contoh: "Sumber Data")
   - **Field Key**: Otomatis di-generate dari label (contoh: `sumber_data`)
   - **Tipe Field**: Pilih tipe input yang diinginkan
   - **Pilihan (Options)**: Jika memilih select/radio/checkbox, tambahkan pilihan
   - **Urutan**: Nomor urutan tampilan (default: 0)
   - Centang checkbox sesuai kebutuhan:
     - ✓ Field wajib diisi (Required)
     - ✓ Tampilkan di tabel list tanah
     - ✓ Tampilkan di detail tanah
     - ✓ Field aktif dan dapat digunakan
5. Klik **"Simpan"**

### Mengedit Custom Field

1. Buka menu **Custom Fields**
2. Klik ikon **Edit** (pencil) pada field yang ingin diubah
3. Ubah pengaturan sesuai kebutuhan
4. Klik **"Simpan"**

### Menghapus Custom Field

1. Buka menu **Custom Fields**
2. Klik ikon **Hapus** (trash) pada field yang ingin dihapus
3. Konfirmasi penghapusan

**⚠️ Perhatian**: Menghapus custom field akan menghilangkan data field tersebut dari semua record tanah!

## Struktur Database

### Tabel `custom_field_definitions`
Menyimpan definisi custom fields:
```sql
- id: bigint (PK)
- field_key: varchar (unique)
- field_label: varchar
- field_type: enum (text, textarea, select, radio, checkbox, number, date)
- field_options: json (nullable)
- is_visible_in_list: boolean
- is_visible_in_detail: boolean
- is_required: boolean
- is_active: boolean
- order: integer
- created_at, updated_at: timestamp
```

### Kolom `additional_data` di Tabel `lands`
Data custom fields disimpan sebagai JSON:
```json
{
  "sumber_data": "BPN",
  "status_pembayaran": "Lunas",
  "tahun_terbit": 2023
}
```

## Contoh Penggunaan

### Contoh 1: Field "Sumber Data" (Select)
```
Field Key: sumber_data
Field Label: Sumber Data
Field Type: Select
Options: ["BPN", "Desa", "Survey", "Lainnya"]
Required: Ya
Visible in List: Ya
Visible in Detail: Ya
```

### Contoh 2: Field "Status Pembayaran" (Radio)
```
Field Key: status_pembayaran
Field Label: Status Pembayaran
Field Type: Radio
Options: ["Lunas", "Belum Lunas", "Cicilan"]
Required: Ya
Visible in List: Ya
Visible in Detail: Ya
```

### Contoh 3: Field "Keterangan Tambahan" (Textarea)
```
Field Key: keterangan_tambahan
Field Label: Keterangan Tambahan
Field Type: Textarea
Required: Tidak
Visible in List: Tidak
Visible in Detail: Ya
```

### Contoh 4: Field "Dokumen Pendukung" (Checkbox)
```
Field Key: dokumen_pendukung
Field Label: Dokumen Pendukung
Field Type: Checkbox
Options: ["KTP", "KK", "Surat Kuasa", "Akta", "PBB"]
Required: Tidak
Visible in List: Tidak
Visible in Detail: Ya
```

## Cara Kerja di Form Tanah

### Form Create/Edit
1. System otomatis membaca semua custom fields yang aktif
2. Field ditampilkan di section **"Data Tambahan"**
3. Field dirender sesuai tipe (text, select, dll)
4. Validasi diterapkan sesuai pengaturan (required/optional)
5. Data disimpan ke kolom `additional_data` dalam format JSON

### Tabel List Tanah
1. System membaca custom fields dengan `is_visible_in_list = true`
2. Kolom tambahan ditampilkan di tabel
3. Data diambil dari JSON `additional_data`
4. Array values ditampilkan sebagai comma-separated (untuk checkbox)

## API Endpoints

### Custom Fields Management
```
GET    /custom-fields           - List semua custom fields
GET    /custom-fields/create    - Form tambah custom field
POST   /custom-fields           - Simpan custom field baru
GET    /custom-fields/{id}/edit - Form edit custom field
PUT    /custom-fields/{id}      - Update custom field
DELETE /custom-fields/{id}      - Hapus custom field
POST   /custom-fields/reorder   - Update urutan fields (untuk drag & drop di masa depan)
```

### Land Management (Updated)
```
GET  /land/create - Menyertakan customFields
POST /land       - Validasi additional_data berdasarkan custom field definitions
GET  /land/{id}/edit - Menyertakan customFields dan existing additional_data
PUT  /land/{id}  - Update dengan validasi additional_data
GET  /land       - Menyertakan customFields untuk render kolom dinamis
```

## Best Practices

### Naming Conventions
- **Field Key**: Gunakan snake_case, huruf kecil, hanya huruf dan underscore
  - ✅ Baik: `sumber_data`, `status_pembayaran`, `tahun_terbit`
  - ❌ Buruk: `SumberData`, `status-pembayaran`, `Tahun Terbit`

### Field Organization
- Gunakan **Order** untuk mengurutkan field secara logis
- Kelompokkan field yang related dengan order yang berdekatan
- Contoh: Order 10, 20, 30 (bukan 1, 2, 3) agar mudah menyisipkan field baru

### Visibility Settings
- **Visible in List**: Hanya untuk data penting/sering dilihat (max 2-3 field)
- **Visible in Detail**: Untuk semua field yang relevan dengan detail tanah
- Jangan tampilkan terlalu banyak kolom di list (table jadi terlalu lebar)

### Required Fields
- Berhati-hati menambahkan required fields baru jika sudah ada data lama
- Data lama tidak akan memiliki nilai untuk field baru
- Pertimbangkan membuat field optional terlebih dahulu

## Troubleshooting

### Field tidak muncul di form
- Pastikan field `is_active = true`
- Clear cache browser (Ctrl+F5)
- Periksa console browser untuk error

### Data tidak tersimpan
- Periksa validasi di browser console
- Cek error message di form
- Untuk checkbox, pastikan minimal 1 pilihan tercentang jika required

### Kolom tidak muncul di tabel list
- Pastikan `is_visible_in_list = true`
- Refresh halaman
- Periksa apakah customFields sudah di-pass dari controller

## File-file Penting

### Backend
- `database/migrations/*_create_custom_field_definitions_table.php`
- `database/migrations/*_add_additional_data_to_lands_table.php`
- `app/Models/CustomFieldDefinition.php`
- `app/Http/Controllers/CustomFieldDefinitionController.php`
- `app/Http/Controllers/LandController.php` (updated)
- `routes/web.php` (added custom-fields routes)

### Frontend
- `resources/js/types/index.d.ts` (added CustomFieldDefinition interface)
- `resources/js/components/dynamic-field.tsx` (reusable field renderer)
- `resources/js/pages/land/custom-fields/index.tsx`
- `resources/js/pages/land/custom-fields/create.tsx`
- `resources/js/pages/land/custom-fields/edit.tsx`
- `resources/js/pages/land/index.tsx` (updated with dynamic columns)
- `resources/js/pages/land/create.tsx` (updated with dynamic fields)
- `resources/js/pages/land/edit.tsx` (updated with dynamic fields)

## Future Enhancements

Fitur yang bisa ditambahkan di masa depan:
- Drag & drop untuk reorder fields
- Field dependencies (field A muncul jika field B memiliki nilai tertentu)
- Conditional validation (required jika kondisi tertentu)
- Import/Export custom field definitions
- Field templates (preset untuk use case umum)
- Rich text editor untuk textarea
- File upload field type
- Custom field di modal detail tanah
- Filter berdasarkan custom fields
- Export Excel dengan kolom custom fields

## Support

Untuk pertanyaan atau masalah, hubungi tim developer atau buka issue di repository project.
