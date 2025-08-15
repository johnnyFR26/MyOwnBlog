-- Insert sample data for testing (optional)
-- This script can be run to create sample blogs and posts for development

-- Note: This will only work if there are users in the auth.users table
-- The user_id should be replaced with actual user IDs from your auth system

-- Example blog (uncomment and modify user_id when testing)
/*
INSERT INTO blogs (user_id, name, slug, description, primary_color, secondary_color, accent_color)
VALUES (
  'your-user-id-here',
  'My Tech Blog',
  'my-tech-blog',
  'A blog about technology and programming',
  '#3b82f6',
  '#1f2937',
  '#10b981'
);

-- Example post (uncomment and modify blog_id when testing)
INSERT INTO posts (blog_id, title, slug, content, excerpt, published)
VALUES (
  'your-blog-id-here',
  'Welcome to My Blog',
  'welcome-to-my-blog',
  '<h1>Welcome!</h1><p>This is my first blog post. I''m excited to share my thoughts on technology and programming.</p>',
  'Welcome to my new blog where I share thoughts on technology.',
  true
);
*/
