-- Blog and Comments Schema for Aura Home

-- Blog posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  meta_title VARCHAR(200),
  meta_description VARCHAR(300),
  meta_keywords TEXT,
  views INTEGER DEFAULT 0
);

-- Post categories (reuse existing categories table or create blog-specific)
CREATE TABLE IF NOT EXISTS post_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post to category mapping
CREATE TABLE IF NOT EXISTS post_category_map (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES post_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Post tags
CREATE TABLE IF NOT EXISTS post_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post to tag mapping
CREATE TABLE IF NOT EXISTS post_tag_map (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES post_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, spam
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- Updated_at trigger
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Posts: Public read for published, author can read own drafts
CREATE POLICY "Posts public read published" ON posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Posts author read own" ON posts FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Posts author insert" ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Posts author update" ON posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Posts admin all" ON posts FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.settings.admin_email', true));

-- Post categories: Public read
CREATE POLICY "Post categories public read" ON post_categories FOR SELECT
  USING (true);

-- Post tags: Public read
CREATE POLICY "Post tags public read" ON post_tags FOR SELECT
  USING (true);

-- Comments: Public read approved, users can read own pending
CREATE POLICY "Comments public read approved" ON comments FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Comments user read own" ON comments FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Comments authenticated insert" ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR guest_email IS NOT NULL);

CREATE POLICY "Comments user update own" ON comments FOR UPDATE
  USING (auth.uid() = author_id);

-- Sample blog categories
INSERT INTO post_categories (name, slug) VALUES
  ('Furniture Tips', 'furniture-tips'),
  ('Interior Design', 'interior-design'),
  ('Home Decor', 'home-decor'),
  ('Product Updates', 'product-updates'),
  ('Company News', 'company-news')
ON CONFLICT (slug) DO NOTHING;

-- Sample tags
INSERT INTO post_tags (name, slug) VALUES
  ('Sofa', 'sofa'),
  ('Dining Table', 'dining-table'),
  ('Bedroom', 'bedroom'),
  ('Living Room', 'living-room'),
  ('Office', 'office'),
  ('Sri Lanka', 'sri-lanka'),
  ('Vavuniya', 'vavuniya')
ON CONFLICT (slug) DO NOTHING;
