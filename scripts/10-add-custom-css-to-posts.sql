-- Add custom_css column to posts table for storing generated CSS
ALTER TABLE posts ADD COLUMN IF NOT EXISTS custom_css TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_posts_custom_css ON posts(id) WHERE custom_css IS NOT NULL;
