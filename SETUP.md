# Setup Guide - Thread of Hope

Panduan lengkap untuk setup dan menjalankan Thread of Hope platform.

## 🚀 Quick Start

### 1. Prerequisites Check

\`\`\`bash

# Check Node.js version (harus 18+)

node --version

# Check npm version

npm --version
\`\`\`

### 2. Clone & Install

\`\`\`bash

# Clone repository

git clone https://github.com/krstop29-oss/thread-of-hope.git
cd thread-of-hope

# Install dependencies

npm install
\`\`\`

### 3. Supabase Setup

#### A. Buat Project Supabase

1. Buka [supabase.com](https://supabase.com)
2. Klik "New Project"
3. Isi nama project: "thread-of-hope"
4. Set password database
5. Pilih region terdekat

#### B. Ambil Credentials

Di Supabase Dashboard → Settings → API:

\`\`\`env

# Copy values ini ke .env.local

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

#### C. Setup Database

Di Supabase → SQL Editor, jalankan scripts berikut secara berurutan:

**1. Create Tables (`scripts/001_create_tables.sql`)**
\`\`\`sql
-- User profiles table
CREATE TABLE user_profiles (
id UUID REFERENCES auth.users(id) PRIMARY KEY,
email TEXT,
full_name TEXT,
avatar_url TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Curhat submissions table
CREATE TABLE curhat_submissions (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
name TEXT,
email TEXT,
age INTEGER,
story TEXT NOT NULL,
is_approved BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-books table
CREATE TABLE ebooks (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
title TEXT NOT NULL,
author TEXT NOT NULL,
description TEXT,
cover_image_url TEXT,
file_url TEXT,
category TEXT,
download_count INTEGER DEFAULT 0,
is_published BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community members table
CREATE TABLE community_members (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
full_name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
phone TEXT,
motivation TEXT,
is_approved BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
title TEXT NOT NULL,
description TEXT,
event_date TIMESTAMP WITH TIME ZONE,
location TEXT,
image_url TEXT,
is_published BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery items table
CREATE TABLE gallery_items (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
title TEXT NOT NULL,
description TEXT,
image_url TEXT NOT NULL,
category TEXT,
is_published BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
email TEXT NOT NULL UNIQUE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**2. Enable RLS (`scripts/002_enable_rls.sql`)**
\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE curhat_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for public read access to approved content
CREATE POLICY "Public can read approved curhat" ON curhat_submissions FOR SELECT USING (is_approved = true);
CREATE POLICY "Public can read published ebooks" ON ebooks FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published events" ON events FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read published gallery" ON gallery_items FOR SELECT USING (is_published = true);

-- Policies for public insert (submissions)
CREATE POLICY "Anyone can submit curhat" ON curhat_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can join community" ON community_members FOR INSERT WITH CHECK (true);

-- Admin policies (will be created by function)
\`\`\`

**3. Create Functions (`scripts/003_create_functions.sql`)**
\`\`\`sql
-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
RETURN EXISTS (
SELECT 1 FROM admin_users
WHERE email = user_email
);
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user email from JWT
CREATE OR REPLACE FUNCTION get_user_email()
RETURNS TEXT AS
$$

BEGIN
RETURN (auth.jwt() ->> 'email');
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies using functions
CREATE POLICY "Admins can do everything on curhat" ON curhat_submissions
  FOR ALL USING (is_admin(get_user_email()));

CREATE POLICY "Admins can do everything on ebooks" ON ebooks
  FOR ALL USING (is_admin(get_user_email()));

CREATE POLICY "Admins can do everything on community" ON community_members
  FOR ALL USING (is_admin(get_user_email()));

CREATE POLICY "Admins can do everything on events" ON events
  FOR ALL USING (is_admin(get_user_email()));

CREATE POLICY "Admins can do everything on gallery" ON gallery_items
  FOR ALL USING (is_admin(get_user_email()));

CREATE POLICY "Admins can read admin_users" ON admin_users
  FOR SELECT USING (is_admin(get_user_email()));
\`\`\`

**4. Seed Data (`scripts/004_seed_data.sql`)**
\`\`\`sql
-- Insert sample admin user (ganti dengan email Anda)
INSERT INTO admin_users (email) VALUES ('your-email@example.com');

-- Insert sample ebook
INSERT INTO ebooks (title, author, description, category, is_published) VALUES
('Panduan Kesehatan Mental', 'Tim Thread of Hope', 'Panduan lengkap untuk menjaga kesehatan mental', 'Self Help', true);

-- Insert sample event
INSERT INTO events (title, description, event_date, location, is_published) VALUES
('Workshop Mindfulness', 'Workshop untuk belajar teknik mindfulness', NOW() + INTERVAL '7 days', 'Jakarta', true);
\`\`\`

### 4. Environment Variables

**Langkah 1: Copy Template**
\`\`\`bash
# Copy template environment file
cp .env.example .env.local
\`\`\`

**Langkah 2: Edit .env.local**
Buka file `.env.local` dan isi dengan credentials Supabase Anda:

\`\`\`env
# Supabase Configuration (dari Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Development URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Database URLs (dari Supabase Settings → Database → Connection string)
POSTGRES_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
POSTGRES_PRISMA_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:6543/postgres?pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
POSTGRES_USER=postgres
POSTGRES_HOST=db.[project-id].supabase.co
POSTGRES_PASSWORD=your-database-password
POSTGRES_DATABASE=postgres
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_ANON_KEY=your-anon-key
\`\`\`

**⚠️ Penting:**
- Jangan commit file `.env.local` ke Git (sudah ada di .gitignore)
- Gunakan `.env.example` sebagai template
- Ganti `your-project-id` dengan ID project Supabase Anda
- Ganti `[password]` dengan password database Anda

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Buka [http://localhost:3000](http://localhost:3000)

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Error**
\`\`\`bash
# Check environment variables
cat .env.local

# Test Supabase connection di browser
https://your-project.supabase.co/rest/v1/
\`\`\`

**2. Authentication Not Working**
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` benar
- Check di Supabase → Authentication → Settings → Site URL: `http://localhost:3000`

**3. Admin Panel Access Denied**
- Pastikan email Anda ada di tabel `admin_users`
- Login dengan akun yang sama

**4. RLS Policies Error**
- Jalankan ulang `scripts/002_enable_rls.sql`
- Check di Supabase → Authentication → Policies

### Development Tips

**Hot Reload Issues**
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run dev
\`\`\`

**Database Reset**
\`\`\`bash
# Di Supabase SQL Editor, drop semua tabel:
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS curhat_submissions CASCADE;
DROP TABLE IF EXISTS ebooks CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS gallery_items CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

# Lalu jalankan ulang semua scripts
\`\`\`

## 📱 Testing

### Authentication redirect & creating a test user

1. In Supabase Dashboard → Authentication → Settings:
  - Set "Site URL" to `http://localhost:3000`
  - Under "Redirect URLs" add `http://localhost:3000/auth/login`

2. To create a local test user (uses your service_role key). From project root run in PowerShell:

```powershell
# Ensure .env.local contains SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL
node .\\scripts\\create_test_user.mjs test+local@example.com P4ssw0rd!
```

This will create a confirmed user in your Supabase auth and allow you to log in using the project's `/auth/login` page. Do not commit your service role key to source control.


### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] User can submit curhat story
- [ ] Admin can login and access dashboard
- [ ] Admin can approve/reject stories
- [ ] E-book page shows published books
- [ ] Community join form works
- [ ] Responsive design on mobile

### API Testing

\`\`\`bash
# Test curhat submission
curl -X POST http://localhost:3000/api/curhat \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","story":"Test story"}'

# Test ebooks endpoint
curl http://localhost:3000/api/ebooks
\`\`\`

## 🚀 Production Deployment

### Vercel Deployment

1. Push ke GitHub
2. Connect repository di Vercel
3. Set environment variables (tanpa `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`)
4. Deploy

### Environment Variables untuk Production

**File: `.env.production` (untuk Vercel)**
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Production redirect (ganti dengan domain production Anda)
NEXT_PUBLIC_REDIRECT_URL=https://your-production-domain.com

# Database (sama seperti development, tapi bisa berbeda untuk production)
POSTGRES_URL=your-production-postgres-url
POSTGRES_PRISMA_URL=your-production-postgres-url
POSTGRES_URL_NON_POOLING=your-production-postgres-url
POSTGRES_USER=postgres
POSTGRES_HOST=db.your-project-id.supabase.co
POSTGRES_PASSWORD=your-database-password
POSTGRES_DATABASE=postgres
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_ANON_KEY=your-anon-key
\`\`\`

### Post-Deployment

1. Update Supabase Site URL ke production domain
2. Test semua fitur di production
3. Setup monitoring dan analytics

---

**Need Help?** Buka issue di GitHub atau hubungi tim development.
$$
