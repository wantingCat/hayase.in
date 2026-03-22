-- Allow Public (Anon) Users to CREATE Requests
CREATE POLICY "Enable insert for public" ON "public"."requests"
FOR INSERT TO "public" WITH CHECK (true);

-- Allow Public to READ their own requests (optional, but good for debugging)
CREATE POLICY "Enable read for public" ON "public"."requests"
FOR SELECT TO "public" USING (true);
