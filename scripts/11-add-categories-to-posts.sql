-- Add categories column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- Create index for better performance on category searches
CREATE INDEX IF NOT EXISTS idx_posts_categories ON posts USING GIN (categories);

-- Create index for text search on title and content
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN (to_tsvector('portuguese', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, '')));
