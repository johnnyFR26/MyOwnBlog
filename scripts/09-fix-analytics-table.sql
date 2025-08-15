-- Drop existing analytics table if it exists with conflicting policies
DROP TABLE IF EXISTS analytics CASCADE;

-- Create analytics table to track page views and statistics
CREATE TABLE analytics (
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
CREATE INDEX idx_analytics_blog_id ON analytics(blog_id);
CREATE INDEX idx_analytics_post_id ON analytics(post_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX idx_analytics_page_type ON analytics(page_type);
CREATE INDEX idx_analytics_blog_created ON analytics(blog_id, created_at DESC);

-- Insert some sample analytics data for testing
INSERT INTO analytics (blog_id, page_type, visitor_ip, user_agent, created_at) 
SELECT 
  b.id,
  'blog_home',
  '192.168.1.' || (RANDOM() * 255)::INT,
  'Mozilla/5.0 (compatible; TestBot/1.0)',
  NOW() - (RANDOM() * INTERVAL '30 days')
FROM blogs b
LIMIT 50;
