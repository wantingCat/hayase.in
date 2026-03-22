-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS "public"."newsletter_subscribers" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "email" text NOT NULL UNIQUE,
    "subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
    "status" text DEFAULT 'active'
);

-- Enable RLS
ALTER TABLE "public"."newsletter_subscribers" ENABLE ROW LEVEL SECURITY;

-- Allow Public (Anon) Users to CREATE Subscribers (Sign up)
CREATE POLICY "Enable insert for public" ON "public"."newsletter_subscribers"
FOR INSERT TO "public" WITH CHECK (true);

-- Allow Admin (Authenticated) Users to VIEW Subscribers
CREATE POLICY "Enable select for authenticated" ON "public"."newsletter_subscribers"
FOR SELECT TO "authenticated" USING (true);
