-- Fix the foreign key constraint in blogs table to reference our custom users table
-- instead of auth.users

-- First, drop the existing foreign key constraint
ALTER TABLE blogs DROP CONSTRAINT IF EXISTS blogs_user_id_fkey;

-- Add the correct foreign key constraint referencing our users table
ALTER TABLE blogs ADD CONSTRAINT blogs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Also drop the RLS policy that references auth.uid() since we're not using Supabase Auth
DROP POLICY IF EXISTS "Users can only access their own blogs" ON blogs;

-- Disable RLS since we're handling authorization in our application code
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
