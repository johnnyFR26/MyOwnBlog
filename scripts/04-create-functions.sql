-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at 
  BEFORE UPDATE ON blogs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(base_slug TEXT, table_name TEXT, column_name TEXT DEFAULT 'slug')
RETURNS TEXT AS $$
DECLARE
  new_slug TEXT;
  counter INTEGER := 1;
BEGIN
  new_slug := base_slug;
  
  LOOP
    -- Check if slug exists
    IF table_name = 'blogs' THEN
      IF NOT EXISTS (SELECT 1 FROM blogs WHERE slug = new_slug) THEN
        EXIT;
      END IF;
    ELSIF table_name = 'posts' THEN
      -- For posts, we need to check within the same blog
      -- This will be handled in the application layer
      EXIT;
    END IF;
    
    -- Generate new slug with counter
    new_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;
