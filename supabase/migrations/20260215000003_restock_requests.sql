-- Create restock_requests table
CREATE TABLE IF NOT EXISTS "public"."restock_requests" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    "product_id" uuid NOT NULL REFERENCES "public"."products"("id") ON DELETE CASCADE,
    "email" text NOT NULL,
    "is_notified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE "public"."restock_requests" ENABLE ROW LEVEL SECURITY;

-- Allow Public (Anon) Users to CREATE Requests (Sign up for notification)
CREATE POLICY "Enable insert for public" ON "public"."restock_requests"
FOR INSERT TO "public" WITH CHECK (true);

-- Allow Admin (Authenticated) Users to VIEW/UPDATE Requests
CREATE POLICY "Enable select for authenticated" ON "public"."restock_requests"
FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable update for authenticated" ON "public"."restock_requests"
FOR UPDATE TO "authenticated" USING (true);
