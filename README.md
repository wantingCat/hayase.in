# Hayase - Premium Anime Collectibles Store

Hayase is a modern, high-performance e-commerce platform built for anime figure collectors in India. It features a "Cyber-Kawaii" aesthetic, a robust admin dashboard, and a seamless shopping experience.

![Hero Banner](/public/logo.png)

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion (Animations)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **State Management:** React Hooks + Server Components
- **Icons:** Lucide React

## Features

### 🛍️ Storefront (Customer Facing)
- **Immersive Home Page:** Full-screen hero section with abstract animations.
- **Floating Navbar:** "Mobile-First" glassmorphism pill navigation.
- **Featured Drops:** Dynamic grid showcasing the latest high-value figures.
- **Responsive Design:** Optimized for all devices, from mobile phones to 4K desktops.

### 🛡️ Admin Dashboard (Protected)
- **Secure Authentication:** Custom login flow restricted to admin users via RLS.
- **Product Management:**
  - Slide-over form for adding/editing products.
  - Client-side image compression & optimization.
  - Multi-image upload to Supabase Storage.
  - Strict deletion logic (removes images from bucket + DB row).
- **Order Management:**
  - Real-time order tracking (Pending -> Shipped -> Delivered).
  - **Secure Payment Verification:** View private payment screenshots via short-lived Signed URLs.
  - Auto-cleanup of sensitive proof images upon verification.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone git@github.com:wantingCat/hayase.in.git
   cd hayase.in
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open:** [http://localhost:3000](http://localhost:3000)

## Database Schema

The project uses Supabase Postgres with specific tables for `products`, `orders`, and `admins` secured by Row Level Security (RLS) policies. See `schema.sql` for details.

## License

Private / Proprietary.
