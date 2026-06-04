# 🎓 SIBEM - Sistem Informasi Manajemen Kegiatan BEM UISI

Sistem Informasi Manajemen terpadu untuk mempermudah tata kelola administrasi, program kerja, dan evaluasi kegiatan di lingkungan Badan Eksekutif Mahasiswa Universitas Internasional Semen Indonesia (BEM UISI).

## Tech Stack

* **Frontend:** React + Vite + Tailwind CSS
* **Backend:** Laravel REST API
* **Database:** PostgreSQL
* **Container:** Docker + Docker Compose

## Prasyarat

* Git
* Docker Desktop (Pastikan sudah dalam keadaan *running*)

---

## Setup Anggota Tim (Instalasi Pertama Kali)

Langkah ini wajib dilakukan oleh setiap anggota kelompok setelah proyek berhasil di-clone ke laptop masing-masing.

**1. Clone repository**
```bash
git clone https://github.com/rkyarc/SIBEM.git
cd SIBEM
git checkout staging
```

**2. Copy environment backend**
```bash
cd backend
cp .env.example .env
cd ..
```

**3. Jalankan Docker**
```bash
docker compose --env-file ./backend/.env up -d
```

**4. Install Dependensi (Wajib)**
```bash
docker exec -it sibem_app composer install
docker exec -it sibem_frontend npm install
```

**5. Generate app key Laravel**
```bash
docker exec -it sibem_app php artisan key:generate
```

**6. Jalankan migration database**
```bash
docker exec -it sibem_app php artisan migrate
```

**7. Akses aplikasi**
* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:8000/api`
* Database (pgAdmin): `localhost:5433`

---

## Workflow Git (Kerja Kelompok)

* `main`: untuk production (Tugas Akhir yang sudah fix).
* `staging`: untuk integrasi/penggabungan kode antar anggota tim.
* `feature/nama-fitur`: untuk pengerjaan fitur masing-masing anggota.

**Contoh alur kerja (Membuat fitur baru):**

```bash
# 1. Pastikan selalu mulai dari staging terbaru
git checkout staging
git pull origin staging

# 2. Buat branch baru khusus fitur yang kamu kerjakan
git checkout -b feature/tambah-data-kegiatan
```

**Setelah selesai ngoding fitur tersebut:**

```bash
git add .
git commit -m "feat: membuat API untuk tambah data kegiatan"
git push origin feature/tambah-data-kegiatan
```
*Lalu, buat **Pull Request (PR)** di website GitHub dari branch `feature/...` diarahkan ke branch `staging`.*

---

## Struktur Project

```text
SIBEM/
├── backend/               # Kode sumber Laravel (API)
├── frontend/              # Kode sumber React Vite (UI)
├── docker/                # Konfigurasi Nginx & PHP
├── docker-compose.yml     # Orkestrasi Container
└── README.md
```

---

## Perintah Penting (Docker)

```bash
# Menyalakan seluruh mesin
docker compose --env-file ./backend/.env up -d

# Mematikan seluruh mesin
docker compose down

# Masuk ke terminal container backend (Laravel)
docker exec -it sibem_app bash

# Membuat Controller, Model, dll (Contoh)
docker exec -it sibem_app php artisan make:model Kegiatan -m -c --api

# Membersihkan cache konfigurasi Laravel (Jika web error)
docker exec -it sibem_app php artisan config:clear
```

---

## Catatan Penting

* **TIDAK PERLU** install PHP, Composer, Node.js, atau PostgreSQL di laptop lokal (Windows). Semuanya sudah berjalan otomatis di dalam Docker.
* Semua perintah `php artisan` atau `composer` **WAJIB** diawali dengan `docker exec -it sibem_app ...`
* **JANGAN PERNAH** melakukan `git push` secara langsung (direct push) ke branch `main` atau `staging`. Selalu gunakan branch `feature/...` dan lakukan Pull Request!
