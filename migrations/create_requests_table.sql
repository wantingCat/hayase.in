-- Create Requests Table
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  character_name TEXT NOT NULL,
  budget TEXT,
  reference_image_url TEXT
);

-- Enable Row Level Security
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Allow public to insert requests (anyone can request)
CREATE POLICY "Public can create requests" ON requests
  FOR INSERT WITH CHECK (true);

-- Allow only admins to view requests (assuming admin policies exist or will be handled via dashboard)
-- For now, just simplistic policy or you'll need to use Supabase Service Role for admin view
