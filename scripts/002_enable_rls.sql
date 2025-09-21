-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curhat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Curhat policies (public read for approved, admin can manage all)
CREATE POLICY "curhat_select_approved" ON public.curhat FOR SELECT USING (is_approved = true);
CREATE POLICY "curhat_insert_public" ON public.curhat FOR INSERT WITH CHECK (true);
CREATE POLICY "curhat_admin_all" ON public.curhat FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Ebooks policies (public read, admin manage)
CREATE POLICY "ebooks_select_public" ON public.ebooks FOR SELECT USING (true);
CREATE POLICY "ebooks_admin_all" ON public.ebooks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Community members policies (insert public, admin read all)
CREATE POLICY "community_insert_public" ON public.community_members FOR INSERT WITH CHECK (true);
CREATE POLICY "community_admin_select" ON public.community_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Events policies (public read, admin manage)
CREATE POLICY "events_select_public" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_admin_all" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Gallery policies (public read, admin manage)
CREATE POLICY "gallery_select_public" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "gallery_admin_all" ON public.gallery FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Admin users policies
CREATE POLICY "admin_users_select_own" ON public.admin_users FOR SELECT USING (auth.uid() = id);
