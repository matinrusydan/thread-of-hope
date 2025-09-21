-- Insert sample ebooks
INSERT INTO public.ebooks (title, description, cover_image_url, author, is_featured) VALUES
('Mengatasi Kecemasan', 'Panduan praktis untuk mengelola kecemasan dalam kehidupan sehari-hari', '/images/e-book-rika.png', 'Dr. Rika Sari', true),
('Mindfulness untuk Pemula', 'Teknik mindfulness sederhana untuk kesehatan mental yang lebih baik', '/images/e-book-rika.png', 'Prof. Ahmad Wijaya', false);

-- Insert sample events
INSERT INTO public.events (title, description, event_date, location, image_url, is_featured) VALUES
('Workshop Kesehatan Mental', 'Workshop interaktif tentang pentingnya kesehatan mental di era modern', '2024-02-15', 'Jakarta Convention Center', '/images/kegiatan-kemanusiaan-mental-health-2.jpg', true),
('Seminar Mindfulness', 'Seminar tentang teknik mindfulness untuk mengurangi stress', '2024-03-20', 'Universitas Indonesia', '/images/kegiatan-kemanusiaan-mental-health-2.jpg', false);

-- Insert sample gallery items
INSERT INTO public.gallery (title, description, image_url, category, is_featured) VALUES
('Kegiatan Kemanusiaan Mental Health', 'Dokumentasi kegiatan workshop kesehatan mental bersama komunitas', '/images/kegiatan-kemanusiaan-mental-health-2.jpg', 'workshop', true),
('Payung Geulis Project', 'Proyek seni terapi untuk kesehatan mental', '/images/payung-geulis.png', 'art-therapy', false);
