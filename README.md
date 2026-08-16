# Calendar Catalogue

A digital catalogue for calendar products, allowing users to browse and filter through various calendar options. Built with modern web technologies for a fast, responsive, and seamless user experience.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL & Storage)
- **Hosting:** [Vercel](https://vercel.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

- **Frontend:** Next.js App Router handling routing and server-side rendering (SSR) where applicable. Client components manage complex interactive UI like product filtering and navigation.
- **Backend/Database:** Supabase provides the PostgreSQL database and object storage for product images. Products, categories, and subcategories are managed here.
- **Deployment:** Automatically deployed to Vercel upon pushing to the main branch.

## Scripts

- `pnpm dev`: Start the local development server.
- `pnpm build`: Build the application for production.
- `pnpm migrate`: Run the custom migration script (`scripts/migrate.js`) to sync product data and upload images from local assets to Supabase storage.

## References
For LLMs and agents, refer to `OKF.md` for a deeper understanding of the codebase structure, state management, and database schema.
