-- Create posts table to store blog posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  content TEXT,
  excerpt TEXT,
  published BOOLEAN DEFAULT FALSE,
  featured_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blog_id, slug)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_blog_id ON posts(blog_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(blog_id, slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only access posts from their own blogs
CREATE POLICY "Users can only access posts from their own blogs" ON posts
  FOR ALL USING (
    blog_id IN (
      SELECT id FROM blogs WHERE user_id = auth.uid()
    )
  );

-- Create policy for public read access to published posts
CREATE POLICY "Anyone can read published posts" ON posts
  FOR SELECT USING (published = TRUE);
