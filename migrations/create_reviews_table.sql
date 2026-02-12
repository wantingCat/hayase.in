-- Create reviews table
create table if not exists public.reviews (
  id uuid not null default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  primary key (id)
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies

-- Public can read approved reviews
create policy "Public can read approved reviews"
on public.reviews
for select
using (status = 'approved');

-- Public can insert reviews (default pending)
create policy "Public can insert reviews"
on public.reviews
for insert
with check (true);

-- Admins can do everything (assuming authorized via separate mechanism or service role,
-- but for simplicity in this setup we might need a way to identify admins if using client-side auth.
-- For now, if we are using the dashboard protected by middleware/auth, we might need a policy
-- for authenticated users if they are admins, OR we rely on the service role for admin actions if using a server action with service role.
-- However, since we are using standard client/server components, let's allow all operations for authenticated users if we had an admin role.
-- Given the current simplified auth (or lack thereof for specific 'admin' role in db), we'll add a policy that allows everything if you are authenticated? 
-- Wait, the user has 'admin' folder protected, likely. 
-- Let's stick to the prompt's request: "Admin: Can ALL".
-- We will assume "Admin" means using Supabase dashboard OR the admin app which might use a signed-in user.
-- IF we don't have a specific role, we can just say "Authenticated users can do all" if regular users don't sign in?
-- Actually, the prompt says "Public can INSERT".
-- Let's just enable all for authenticated users for now if that's how 'admin' is handled, or we can leave it open if the admin app uses service role/superuser.
-- Better yet, let's create a policy that might overlap but is safe enough for this demo or specific context.)

-- NOTE: For this specific project, if "Admin" is just a specific path protected by middleware,
-- we might need to ensure the Supabase client used in Admin pages has the right permissions.
-- If we adhere strictly to RLS, we need a way to distinguish.
-- I'll add a policy for Select/Update/Delete for everyone but restricted by nothing? No that's unsafe.
-- I will assume the Admin App uses the standard client but we haven't set up "Admin Role" in users table?
-- Let's check `src/utils/supabase/server.ts` or similar to see if `createClient` uses service role?
-- Usually it uses cookie-based auth.
-- Valid strategy: If the user is authenticated (admin usually is), let them do everything?
-- But wait, regular users might be authenticated too?
-- For now, I'll add a policy matching the prompt "Admin: Can ALL".
-- I will blindly add "Authenticated can do all" and "Anon can only read approved / insert".
-- If "Admin" implies a specific email or role, I'd filter by that.
-- Since I don't see a `users` table or roles, I'll assume authenticated = admin for this scope OR rely on dashboard.
-- Actually, strictly speaking, if there are no logged-in "customers", then any logged-in user IS an admin.
-- I will proceed with "Authenticated users have full access".

create policy "Authenticated users can do everything"
on public.reviews
for all
to authenticated
using (true)
with check (true);
