/*
  # Portfolio Generator Database Schema

  ## Overview
  Creates the complete database structure for a portfolio generator application
  that allows users to create and manage their professional portfolios.

  ## New Tables

  ### `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `title` (text) - Professional title/headline
  - `bio` (text) - About/bio section
  - `email` (text) - Contact email
  - `github_url` (text) - GitHub profile link
  - `linkedin_url` (text) - LinkedIn profile link
  - `twitter_url` (text) - Twitter/X profile link
  - `website_url` (text) - Personal website
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `projects`
  - `id` (uuid, primary key) - Unique project identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `title` (text) - Project title
  - `description` (text) - Project description
  - `image_url` (text) - Project thumbnail/image
  - `demo_url` (text) - Live demo link
  - `github_url` (text) - Source code link
  - `tags` (text array) - Technology tags
  - `featured` (boolean) - Whether project is featured
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `skills`
  - `id` (uuid, primary key) - Unique skill identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `name` (text) - Skill name
  - `category` (text) - Skill category (e.g., Frontend, Backend, Tools)
  - `level` (text) - Proficiency level
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Record creation timestamp

  ### `experiences`
  - `id` (uuid, primary key) - Unique experience identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `company` (text) - Company name
  - `position` (text) - Job position/role
  - `description` (text) - Job description
  - `start_date` (date) - Start date
  - `end_date` (date) - End date (null if current)
  - `current` (boolean) - Whether this is current position
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Profiles are publicly readable but only editable by owner
  - Projects, skills, and experiences are publicly readable but only manageable by owner
  - All tables require authentication for write operations

  ## Notes
  1. User profiles are created automatically on signup
  2. All content is publicly viewable to allow portfolio sharing
  3. Only authenticated users can modify their own data
  4. Foreign key constraints ensure data integrity
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  title text DEFAULT '',
  bio text DEFAULT '',
  email text DEFAULT '',
  github_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  twitter_url text DEFAULT '',
  website_url text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  demo_url text DEFAULT '',
  github_url text DEFAULT '',
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text DEFAULT 'General',
  level text DEFAULT 'Intermediate',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company text NOT NULL,
  position text NOT NULL,
  description text DEFAULT '',
  start_date date NOT NULL,
  end_date date,
  current boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Projects are publicly readable"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Skills are publicly readable"
  ON skills FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Experiences policies
CREATE POLICY "Experiences are publicly readable"
  ON experiences FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own experiences"
  ON experiences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiences"
  ON experiences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiences"
  ON experiences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS skills_user_id_idx ON skills(user_id);
CREATE INDEX IF NOT EXISTS experiences_user_id_idx ON experiences(user_id);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON projects(featured) WHERE featured = true;