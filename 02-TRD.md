# NOVA — Technical Requirements Document
> Technical Design · v1.0

## 1. Technical Objective

Build a small, maintainable product admin application using:

- **Next.js**
- **React**
- **Tailwind CSS**
- **Axios**
- **DummyJSON**

The implementation must respect the assignment constraints: no React Query, SWR or ready-made table/pagination libraries; API calls stay outside UI components.

---

## 2. Architecture

```text
Browser
  │
  ├── App Router
  │     ├── Login
  │     ├── Products
  │     └── Product Details
  │
  ├── UI Components
  │
  ├── Feature Hooks / State
  │
  └── API Layer
        └── Shared Axios Client
              │
              └── DummyJSON
```

### Separation rule

**UI renders. Hooks coordinate. API modules communicate.**

A component should not know how an Axios request is constructed.

---

## 3. Suggested Project Structure

```text
src/
├── app/
│   ├── login/
│   ├── products/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   └── new/
│   └── layout.tsx
│
├── components/
│   ├── products/
│   ├── pagination/
│   ├── search/
│   └── feedback/
│
├── hooks/
│   ├── useProducts.ts
│   ├── useDebouncedValue.ts
│   └── useAuth.ts
│
├── lib/
│   ├── axios.ts
│   ├── auth.ts
│   └── queryState.ts
│
├── services/
│   ├── auth.service.ts
│   └── products.service.ts
│
├── types/
│   ├── auth.ts
│   └── product.ts
│
└── styles/
```

---

## 4. API Contract

### Authentication

`POST /auth/login`

Purpose: obtain authentication token.

The token is stored locally and injected by the shared Axios request interceptor.

### Products

`GET /products?limit={limit}&skip={skip}`

### Search

`GET /products/search?q={query}`

### Categories

`GET /products/categories`

### Category Products

Use the API's category endpoint when category mode is active.

### Single Product

`GET /products/{id}`

### Add

`POST /products/add`

### Edit

`PUT /products/{id}`

### Delete

`DELETE /products/{id}`

---

## 5. Shared Axios Client

One Axios instance is responsible for:

1. Base URL
2. Authentication header
3. Request configuration
4. Central error normalization

Conceptually:

```text
request
  ↓
Axios interceptor
  ↓
read auth token
  ↓
attach token
  ↓
DummyJSON
  ↓
normalize error
  ↓
service / hook
  ↓
UI
```

This prevents authentication and error handling from being duplicated across pages.

---

## 6. Race-Safe Search

The assignment explicitly asks for protection against stale search results.

NOVA uses **request cancellation** with `AbortController` / Axios cancellation support.

```text
User types "iph"
      ↓
debounce
      ↓
request A

User types "iphone"
      ↓
cancel request A
      ↓
request B

Only B may update visible results.
```

A request should also verify that it still represents the current query before committing data to UI state.

This remains correct when the API is tested with `&delay=2000`.

---

## 7. URL State

The product page treats the URL as the source of truth for view state.

Example:

```text
/products?page=2&limit=20&q=phone&sort=price-asc&category=smartphones
```

State includes:

- `page`
- `limit`
- `q`
- `category`
- `sort`

### Sanitization

Before rendering:

```text
page → integer >= 1
limit → one of 10, 20, 50
sort → one of supported values
q → trimmed string
category → known category or empty
```

Unknown values fall back safely.

---

## 8. Pagination Model

Given:

```text
limit = page size
skip = (page - 1) × limit
```

Range:

```text
start = skip + 1
end = min(skip + limit, total)
```

Example:

```text
page = 2
limit = 20

skip = 20
range = Showing 21–40
```

---

## 9. Mutation Strategy

DummyJSON mutations are simulated rather than durable.

NOVA therefore treats the API response as a confirmation of the requested operation and maintains a **local UI mutation layer**.

```text
API mutation
    ↓
receive response
    ↓
update local product state
    ↓
render changed UI
```

This is deliberately documented rather than pretending the remote API is a permanent database.

A page refresh may restore the API's original dataset.

---

## 10. Duplicate Submission Protection

For Login and Save:

```text
idle
 ↓
submitting
 ↓
disable action
 ↓
request
 ↓
success / error
 ↓
idle
```

The same principle applies to Delete.

---

## 11. Error Model

Normalize API failures into a small UI-safe shape:

```ts
type AppError = {
  message: string;
  status?: number;
  retryable: boolean;
};
```

The UI should not expose raw Axios internals.

---

## 12. Performance Requirements

- Debounce search input
- Cancel obsolete requests
- Avoid unnecessary product refetches
- Keep components small
- Use stable keys
- Load product details only when required
- Avoid client-side loading of all products when the API supports pagination

---

## 13. Accessibility Requirements

- Keyboard-accessible controls
- Visible focus states
- Labels for form fields
- Semantic buttons
- Meaningful alt text
- Error messages associated with fields
- Confirmation dialogs that clearly identify the product being deleted

---

## 14. Technical Trade-off

NOVA intentionally favors explicit React state and URL synchronization over a data-fetching library.

That adds some code, but it makes the assignment's core behaviors visible and explainable during the interview.
