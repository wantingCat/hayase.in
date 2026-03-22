-- Add missing columns to requests table if they don't exist
ALTER TABLE "public"."requests" ADD COLUMN IF NOT EXISTS "budget" text;
ALTER TABLE "public"."requests" ADD COLUMN IF NOT EXISTS "character_name" text;
ALTER TABLE "public"."requests" ADD COLUMN IF NOT EXISTS "reference_image_url" text;
