import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  website_url: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  demo_url: string;
  github_url: string;
  tags: string[];
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  level: string;
  order_index: number;
  created_at: string;
};

export type Experience = {
  id: string;
  user_id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  order_index: number;
  created_at: string;
};
