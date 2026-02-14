-- Allow Public (Anon) Users to CREATE Orders
create policy "Enable insert for public" on "public"."orders"
for insert to "public" with check (true);

-- Allow Public (Anon) Users to CREATE Order Items
create policy "Enable insert for public" on "public"."order_items"
for insert to "public" with check (true);

-- Allow Public to READ (Select) orders (for confirmation page success)
-- Note: In a production environment, you might want to restrict this by ID or session, 
-- but ensuring 'true' allows the guest to fetch the order immediately after creation.
create policy "Enable select for public" on "public"."orders"
for select to "public" using (true);

-- Also ensure order_items are readable if needed for confirmation page
create policy "Enable select for public" on "public"."order_items"
for select to "public" using (true);
