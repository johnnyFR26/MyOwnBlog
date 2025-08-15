-- Create analytics table to track page views and statistics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  page_type VARCHAR(50) NOT NULL, -- 'blog_home', 'post', 'about', etc.
  visitor_ip INET,
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_blog_id ON analytics(blog_id);
CREATE INDEX IF NOT EXISTS idx_analytics_post_id ON analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_page_type ON analytics(page_type);

-- Enable Row Level Security
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only access analytics from their own blogs
CREATE POLICY "Users can only access analytics from their own blogs" ON analytics
  FOR ALL USING (
    blog_id IN (
      SELECT id FROM blogs WHERE user_id = auth.uid()
    )
  );

-- Create policy to allow inserting analytics (for public visitors)
CREATE POLICY "Anyone can insert analytics" ON analytics
  FOR INSERT WITH CHECK (TRUE);
