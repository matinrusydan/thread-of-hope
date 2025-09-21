# Thread of Hope - Platform Kesehatan Mental

*Platform berbagi cerita dan dukungan kesehatan mental berbasis komunitas*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/krstops-projects/v0-threadofhope)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/RgCV38wsasA)

## 📖 Tentang Project

Thread of Hope adalah platform digital yang menyediakan ruang aman untuk berbagi cerita, mengakses e-book kesehatan mental, dan bergabung dengan komunitas yang mendukung. Platform ini dibangun dengan teknologi modern untuk memberikan pengalaman yang responsif dan aman.

## 🚀 Fitur Utama

- **Curhat System**: Berbagi cerita secara anonim dengan moderasi admin
- **E-Book Library**: Koleksi e-book kesehatan mental yang dapat diunduh
- **Community Join**: Sistem pendaftaran anggota komunitas
- **Admin Panel**: Dashboard lengkap untuk mengelola konten dan anggota
- **Authentication**: Sistem login/register dengan Supabase Auth
- **Responsive Design**: Tampilan yang optimal di semua perangkat

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **UI Components**: shadcn/ui

## 📋 Prerequisites

Pastikan Anda memiliki:

- Node.js 18+ 
- npm atau yarn
- Akun Supabase
- Akun Vercel (untuk deployment)

## 🔧 Setup Local Development

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/krstop29-oss/thread-of-hope.git
cd thread-of-hope
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# atau
yarn install
\`\`\`

### 3. Setup Environment Variables

Buat file `.env.local` di root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Development Redirect URL
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Database URLs (dari Supabase)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
\`\`\`

### 4. Setup Database

Jalankan SQL scripts untuk membuat tabel dan konfigurasi:

\`\`\`bash
# Jalankan scripts secara berurutan di Supabase SQL Editor:
# 1. scripts/001_create_tables.sql
# 2. scripts/002_enable_rls.sql  
# 3. scripts/003_create_functions.sql
# 4. scripts/004_seed_data.sql
\`\`\`

### 5. Jalankan Development Server

\`\`\`bash
npm run dev
# atau
yarn dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🗄️ Database Schema

### Tables

- **user_profiles**: Profil pengguna yang terhubung dengan Supabase Auth
- **curhat_submissions**: Cerita yang dikirim pengguna
- **ebooks**: Koleksi e-book kesehatan mental
- **community_members**: Anggota komunitas yang terdaftar
- **events**: Event dan kegiatan komunitas
- **gallery_items**: Galeri foto kegiatan
- **admin_users**: Daftar admin yang dapat mengakses panel admin

### Row Level Security (RLS)

Semua tabel menggunakan RLS untuk keamanan:
- Public read access untuk konten yang disetujui
- Admin-only access untuk operasi CRUD
- User-specific access untuk data pribadi

## 👨‍💼 Admin Panel

### Akses Admin

1. Daftar akun melalui `/auth/sign-up`
2. Tambahkan email Anda ke tabel `admin_users` di database
3. Login dan akses `/admin` untuk dashboard admin

### Fitur Admin

- **Dashboard**: Statistik dan overview platform
- **Curhat Management**: Approve/reject cerita pengguna
- **E-Book Management**: Upload dan kelola e-book
- **Member Management**: Kelola anggota komunitas
- **Content Moderation**: Moderasi semua konten platform

## 🚀 Deployment

### Deploy ke Vercel

1. Push code ke GitHub repository
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy otomatis akan berjalan

### Environment Variables untuk Production

Pastikan semua environment variables sudah diset di Vercel:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
POSTGRES_URL
# ... dan semua variables lainnya
\`\`\`

## 📱 API Endpoints

### Public Endpoints

- `GET /api/curhat` - Ambil daftar cerita yang disetujui
- `POST /api/curhat` - Submit cerita baru
- `GET /api/ebooks` - Ambil daftar e-book
- `POST /api/community/join` - Daftar sebagai anggota komunitas

### Admin Endpoints

- `PUT /api/curhat/[id]` - Update status cerita
- `DELETE /api/curhat/[id]` - Hapus cerita
- `POST /api/ebooks` - Upload e-book baru
- `GET /api/ebooks/[id]/download` - Track download e-book

## 🎨 Customization

### Colors

Platform menggunakan color scheme:
- Primary: `#F9B827` (Warm Yellow)
- Secondary: `#E4E0E1` (Light Gray)
- Accent: `#8B5CF6` (Purple)

### Typography

- Headings: Inter font family
- Body: Inter font family
- Monospace: JetBrains Mono

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini menggunakan MIT License. Lihat file `LICENSE` untuk detail.

## 📞 Support

Jika mengalami masalah atau butuh bantuan:

1. Buka issue di GitHub repository
2. Hubungi tim development
3. Cek dokumentasi Supabase dan Next.js

## 🔗 Links

- **Live Demo**: [https://vercel.com/krstops-projects/v0-threadofhope](https://vercel.com/krstops-projects/v0-threadofhope)
- **v0 Project**: [https://v0.app/chat/projects/RgCV38wsasA](https://v0.app/chat/projects/RgCV38wsasA)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)

---

**Thread of Hope** - Membangun komunitas yang peduli kesehatan mental 💛
