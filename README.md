# NOVA — Product Operations Console

> A modern product management admin dashboard built with Next.js 16, React 19, Tailwind CSS 4, Axios, and Supabase.

---

## 🚀 Live Demo & Setup

### Prerequisites
- Node.js 18+ installed
- npm package manager

### Local Installation & Running
```bash
# 1. Clone the repository
git clone https://github.com/om-pokalwar/nova-product-console.git
cd nova-product-console

# 2. Install dependencies
npm install

# 3. (Optional) Configure Supabase credentials
#    Copy .env.example to .env.local and add your Supabase project URL and anon key
cp .env.example .env.local

# 4. Start development server
npm run dev

# 5. Open in browser
# Open http://localhost:3000
```

### Credentials for Testing
- **Username:** `emilys`
- **Password:** `emilyspass`
*(Pre-filled helper button available on the login page)*

---

## 💡 Key Architectural Choices

1. **Shared Axios Instance (`src/lib/axios.ts`)**
   - Single Axios client configured with base URL `https://dummyjson.com`.
   - Request interceptor automatically attaches the authentication Bearer token from local session.
   - Response interceptor normalizes all API errors into a standardized `AppError` shape `{ message, status, retryable }`.

2. **URL as Single Source of Truth (`src/lib/urlState.ts`)**
   - The view state (search query `q`, `category`, `sort`, `page`, and `limit`) is stored in and driven by URL search parameters.
   - Reloading or sharing `/products?page=2&limit=20&q=phone&sort=price-asc` reproduces the exact view.
   - Invalid parameters (e.g., `?page=abc` or `?page=-5`) are safely sanitized to defaults without breaking the UI.

3. **Race-Safe Debounced Search (`src/hooks/useProducts.ts`)**
   - Search input is debounced using `useDebounce` (400ms delay).
   - Uses `AbortController` (Axios cancellation) to cancel obsolete pending requests when typing quickly.
   - Implements request signature validation so older delayed responses (e.g. tested with `&delay=2000`) can **never** overwrite newer query results.

4. **Deterministic Precedence Rule**
   - When a search query `q` is active, search owns the result set.
   - When a `category` filter is active without search, category owns the result set.
   - The UI explicitly displays the active data mode ("⚡ Search Precedence Active").

5. **Local Session Mutation Layer (`src/context/MutationContext.tsx`)**
   - DummyJSON endpoints (`POST /products/add`, `PUT /products/{id}`, `DELETE /products/{id}`) simulate CRUD operations without persisting them permanently on the server.
   - NOVA maintains a session-level mutation store (`addedProducts`, `updatedProducts`, `deletedProductIds`) merged into API responses so that all added, updated, and deleted products reflect immediately across the app during the session.

6. **Supabase Integration (`src/lib/supabase.ts`)**
   - When Supabase credentials are provided via environment variables, authentication supports both DummyJSON and Supabase sign-in.
   - Product CRUD operations sync data to Supabase in parallel with DummyJSON, with graceful fallback if Supabase is unavailable.
   - The integration is fully optional — the app works standalone with DummyJSON when Supabase is not configured.

---

## 🛠️ Project Structure

```text
src/
├── app/
│   ├── layout.tsx              # Root layout with Auth & Mutation providers
│   ├── page.tsx                # Root redirect to /products or /login
│   ├── globals.css             # Tailwind CSS global styles
│   ├── login/
│   │   └── page.tsx            # Protected authentication page
│   └── products/
│       ├── page.tsx            # Products directory with table/cards, search & pagination
│       └── [id]/
│           └── page.tsx        # Product details & image gallery page
├── components/
│   ├── auth/
│   │   └── AuthGuard.tsx       # Route guard enforcing authentication
│   ├── layout/
│   │   └── Header.tsx          # App header with user profile & logout
│   ├── products/
│   │   ├── ProductTable.tsx    # Desktop table layout with health badges
│   │   ├── ProductCard.tsx     # Mobile card grid layout
│   │   ├── ProductFilters.tsx  # Search input, category filter & sort controls
│   │   ├── Pagination.tsx      # Custom pagination & page size dropdown
│   │   ├── ProductFormModal.tsx# Add/Edit form modal with validation & submission lock
│   │   └── DeleteConfirmModal.tsx # Delete confirmation popup
│   └── ui/
│       ├── HealthBadge.tsx     # Product health cues (low stock / top rated)
│       ├── Skeleton.tsx        # Loading skeleton placeholders
│       ├── EmptyState.tsx      # Empty & error state displays with retry
│       └── Toast.tsx           # Toast feedback notifications
├── context/
│   ├── AuthContext.tsx         # Global auth state & login/logout actions
│   └── MutationContext.tsx     # Local session CRUD mutation store
├── hooks/
│   ├── useDebounce.ts          # Custom debouncing hook
│   └── useProducts.ts          # Race-safe product fetching hook
├── lib/
│   ├── axios.ts                # Shared Axios setup & interceptors
│   ├── supabase.ts             # Supabase client (optional integration)
│   ├── formatters.ts           # Currency formatting (INR ₹)
│   └── urlState.ts             # URL state parser & sanitizer
├── services/
│   ├── auth.service.ts         # Auth API service calls (DummyJSON + Supabase)
│   └── products.service.ts     # Products API service calls (DummyJSON + Supabase)
└── types/
    ├── auth.ts                 # User & Auth types
    └── product.ts              # Product, Review & Error types
```

---

## 📝 Short Submission Note

### One Problem Faced & How It Was Fixed
**Problem:** When typing rapidly in search or testing with simulated latency (`&delay=2000`), faster subsequent requests could complete before earlier slow requests, leading to stale data overwriting the user's latest query. In addition, DummyJSON mutations (Add, Edit, Delete) are not saved permanently on their server backend.

**Solution:** 
1. Implemented `AbortController` cancellation in `useProducts.ts` to abort in-flight requests as soon as a new query starts. Added a request key validation guard (`latestQueryKeyRef`) to discard any response that doesn't match the current query signature.
2. Built a lightweight session mutation store (`MutationContext.tsx`) using `localStorage` that intercepts product list/detail rendering to seamlessly overlay added items, updated fields, and hide deleted products.

### Where AI Helped
AI helped accelerate boilerplate creation for TypeScript interfaces, craft responsive Tailwind CSS layouts (desktop table vs mobile card grid), and refine edge-case sanitization for invalid URL parameters (`?page=abc`).

---

## 🎓 Interview Quick-Reference Cheat Sheet

When asked to explain any part of the project live during the interview:

1. **"Where are API calls handled?"**  
   - "API calls are strictly separated from UI components. They live in `src/services/products.service.ts` and `src/services/auth.service.ts`."

2. **"How does authentication work across requests?"**  
   - "In `src/lib/axios.ts`, an Axios request interceptor reads the saved token from `localStorage` and appends `Authorization: Bearer <token>` to every outgoing request."

3. **"How did you prevent stale search results?"**  
   - "Input is debounced by 400ms (`useDebounce`). Before fetching, `useProducts` calls `abort()` on the previous `AbortController`. When a response returns, it checks if `latestQueryKeyRef` still matches before updating state."

4. **"Why custom pagination instead of a library?"**  
   - "Custom pagination logic in `src/components/products/Pagination.tsx` computes `skip = (page - 1) * limit`, generates smart page numbers with ellipsis, and drives page changes directly through URL parameters."

5. **"How are CRUD changes displayed if DummyJSON doesn't save them?"**  
   - "DummyJSON only returns a simulated response for POST/PUT/DELETE. We capture those returned objects in `MutationContext.tsx` and merge them into the fetched list so edits remain visible throughout the user session."

6. **"How does Supabase integration work?"**  
   - "Supabase is optional. The client in `src/lib/supabase.ts` only initializes if credentials are set. `auth.service.ts` tries Supabase first for email logins, otherwise falls back to DummyJSON. `products.service.ts` syncs CRUD to Supabase in parallel."
