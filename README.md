# Nadlan Premium – Israel Real Estate MVP

Premium real-estate listings platform focused on Israel properties, marketed to buyers abroad. English-first, WooCommerce-style storefront (product grid + product page) for properties.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS**
- **PostgreSQL** + Prisma
- **Auth**: Env-based admin password gate (NextAuth structure prepared for later)
- **File storage**: Local `public/uploads` with abstraction to switch to S3/R2 later
- **Maps**: Area text + Google Maps link (no embedded paid maps in MVP)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` – PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/nadlan`). **macOS Homebrew (postgresql@16)**: use your Mac username, no password — e.g. `postgresql://YOUR_MAC_USERNAME@localhost:5432/nadlan?schema=public`. Add PostgreSQL to PATH: `export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"`.
- `ADMIN_PASSWORD` – Password for admin area (default in dev: use `admin` if unset)
- `UPLOAD_DIR` – Optional; defaults to `public/uploads`
- `NEXTAUTH_URL` – Optional for dev; e.g. `http://localhost:3000`
- `NEXTAUTH_SECRET` – Optional for future NextAuth; generate with `openssl rand -base64 32`

### 3. Database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

Or with migrations:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Public**: Home, `/properties` (catalog), `/properties/[slug]` (detail + inquiry form).
- **Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) – log in with `ADMIN_PASSWORD` (or `admin` if unset), then Dashboard, Properties list, New property, Edit property.

## Project Structure

```
/app
  /properties          # Catalog + [slug] detail
  /admin               # Login, dashboard, properties CRUD
  /api
    /leads             # POST inquiry
    /admin/login       # POST admin login (sets cookie)
    /admin/upload      # POST image upload (admin only)
/components
  /layout              # Header, Footer
  /property            # PropertyCard, PropertyGallery, InquiryForm
  /catalog             # FilterPanel, CatalogSort, Pagination
  /admin               # AdminNav, PropertyForm
/lib
  db.ts                # Prisma client
  auth.ts              # Auth placeholder for NextAuth
  upload.ts            # File storage abstraction (local → S3/R2 later)
  i18n.ts              # EN dictionary (i18n-ready)
  validations.ts       # Zod schemas
  slug.ts              # Slug helper
/prisma
  schema.prisma
  seed.ts
```

## Core Entities

- **Property**: slug, title, price/currency/priceOnRequest, location (country, city, neighborhood, addressLine, areaText), propertyType, bedrooms/bathrooms/sizeSqm/lotSqm, features[], description (markdown), images (url, alt, sortOrder), status (Draft/Published/Sold), isFeatured.
- **Lead**: propertyId, name, email, phone?, message, createdAt.

## Admin (MVP)

- Access: `/admin` – password gate via `ADMIN_PASSWORD` (cookie).
- No public signup; admin-only property upload.
- **Dashboard**: Counts (properties, published, leads).
- **Properties**: List all, link to edit, link to view public page.
- **New property**: Full form, multiple image upload, slug auto from title+city (override allowed), Save as Draft / Publish.
- **Edit property**: Same form, reorder/remove images, change status.

## Future-Proofing (not built in MVP)

- User registration + roles: admin, subscriber-seller, viewer.
- Only subscribed sellers can create listings; subscription payments; gated listing creation.
- Multi-language content per listing (translation later).
- NextAuth + hardcoded admin email list when auth is added.

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start dev server           |
| `npm run build`| Build for production       |
| `npm run start`| Start production server    |
| `npm run db:generate` | Prisma generate   |
| `npm run db:push`     | Prisma db push     |
| `npm run db:seed`     | Seed database      |
| `npm run db:studio`   | Open Prisma Studio |

## SEO

- Meta title/description and OpenGraph on property detail pages.
- Default site title/description in root layout.

## Security

- Admin routes protected by middleware (cookie check).
- Input validation with Zod on API and server actions.
- File upload restricted to admin; stored under `UPLOAD_DIR`.
