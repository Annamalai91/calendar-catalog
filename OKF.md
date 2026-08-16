# Overall Knowledge File (OKF)

This document serves as an architectural overview and knowledge base for the Calendar Catalogue project, intended to provide context for AI assistants and LLMs.

## 1. Project Overview

**Calendar Catalogue** is a web application that allows users to browse through various calendar products. It features dynamic filtering by categories, subcategories, tags, and paper types.

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Radix UI primitives.
- **Backend/DB:** Supabase (PostgreSQL database + Storage for images).
- **Hosting:** Vercel (Edge-compatible optimizations).
- **Package Manager:** pnpm.

## 2. Directory Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components (buttons, dialogs, filters).
- `/lib`: Utility functions and clients (e.g., Supabase client setup in `/lib/supabase`).
- `/shared`: Shared TypeScript types and constants across the app (e.g., `Product`, `Category`).
- `/public`: Static assets (fonts, icons, etc.).
- `/scripts`: Custom Node scripts (e.g., `migrate.js` for DB/Storage migration).

## 3. Key Concepts & State

- **Product Filtering:** Product lists are dynamically filtered on the client side based on selection state (categories, sub-categories, etc.).
- **Data Fetching:** Data is fetched from Supabase, mostly leveraging Next.js caching where applicable.
- **Image Optimization:** Product images are stored in Supabase storage (`product-images` bucket). Images were recently optimized to WebP format to save bandwidth and Vercel image optimization costs.

## 4. Types and Data Models

The core types are maintained in `shared/types/product.ts`:

- `Product`: The main entity containing name, category, sub_category, dimensions, paper type, and image URLs.
- `Category` / `SubCategory`: Defined taxonomy for grouping products.

## 5. Database Schema (Supabase / PostgreSQL)

Below is the structural schema of the database, including all tables, columns, and constraints.

### Tables & Columns

| Table | Column | Type | Nullable | Default |
|-------|--------|------|----------|---------|
| `categories` | `id` | `uuid` | NO | `gen_random_uuid()` |
| `categories` | `name` | `text` | NO | `null` |
| `categories` | `display_order` | `integer` | NO | `null` |
| `categories` | `created_at` | `timestamp with time zone` | YES | `now()` |
| `sub_categories` | `id` | `uuid` | NO | `gen_random_uuid()` |
| `sub_categories` | `category_id` | `uuid` | YES | `null` |
| `sub_categories` | `name` | `text` | NO | `null` |
| `sub_categories` | `display_order` | `integer` | NO | `null` |
| `sub_categories` | `created_at` | `timestamp with time zone` | YES | `now()` |
| `products` | `id` | `uuid` | NO | `gen_random_uuid()` |
| `products` | `name` | `text` | NO | `null` |
| `products` | `category_id` | `uuid` | YES | `null` |
| `products` | `sub_category_id` | `uuid` | YES | `null` |
| `products` | `description` | `text` | YES | `''::text` |
| `products` | `advt_space` | `text` | YES | `''::text` |
| `products` | `size` | `text` | YES | `''::text` |
| `products` | `paper_type` | `text` | YES | `''::text` |
| `products` | `cover_image` | `text` | NO | `null` |
| `products` | `full_image` | `text` | NO | `null` |
| `products` | `tag` | `text` | YES | `''::text` |
| `products` | `meta_title` | `text` | YES | `''::text` |
| `products` | `meta_description` | `text` | YES | `''::text` |
| `products` | `created_at` | `timestamp with time zone` | YES | `now()` |

### Relationships & Constraints

- **`categories`**
  - Primary Key: `id`
  - Unique: `name`, `display_order`

- **`sub_categories`**
  - Primary Key: `id`
  - Foreign Key: `category_id` -> `categories.id`
  - Unique: `(category_id, name)`
  - Unique: `(category_id, display_order)`

- **`products`**
  - Primary Key: `id`
  - Foreign Key: `category_id` -> `categories.id`
  - Foreign Key: `sub_category_id` -> `sub_categories.id`
  - Unique: `name`

## 6. Deployment & Environment

- **Vercel:** Hosts the Next.js application. Ensure that server and client hydration matches perfectly to avoid React hydration errors (e.g., Minified React error #418).
- **Supabase:** Ensure the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in the environment. `SUPABASE_SERVICE_ROLE_KEY` is required for the migration script.

---
*End of OKF.*
