# Jairus Car Shop

Philippine car e-commerce app. **Sa akin quality at mura, san kapa.**

- Browse Toyota, Mitsubishi, and Honda cars
- Add to cart (persisted with Supabase)
- Checkout with customer details; orders stored in Supabase

## Tech

- **Next.js 16** (App Router)
- **Tailwind CSS**, **Framer Motion**, **shadcn-style UI** (Radix)
- **Supabase** for cart and orders

## Quick start

1. **Clone this repo** (your project):

   ```bash
   git clone https://github.com/owenlim225/JairusCarShop.git
   cd JairusCarShop/starter-pack
   ```

2. **Install and run**

   ```bash
   npm install
   npm run dev
   ```

3. **Supabase** (optional for cart/checkout):

   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL in `StarterPack/starter-pack/supabase/schema.sql` in the SQL Editor
   - Copy Project URL and anon key → add to `starter-pack/.env.local` (see `.env.example`)

## Structure

- `starter-pack/` – Next.js app (car shop)
- `starter-pack/supabase/schema.sql` – DB schema for cart and orders

## Push to your GitHub

This repo is yours. To push to your own GitHub account:

1. Create a new repository on GitHub named `JairusCarShop` (or another name).
2. If you use a different username than `owenlim225`, set the remote:

   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/JairusCarShop.git
   ```

3. Commit and push:

   ```bash
   git add .
   git commit -m "Initial commit: Jairus Car Shop"
   git push -u origin master
   ```

   If your default branch on GitHub is `main`, rename and push:

   ```bash
   git branch -M main
   git push -u origin main
   ```

## License

MIT
