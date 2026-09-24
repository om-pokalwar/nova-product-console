# NOVA — Backend Scheme
> API, Data & State Contract · v1.0

## 1. Backend Reality

NOVA does **not** introduce a custom backend.

The assignment explicitly requires DummyJSON, so the application treats DummyJSON as the remote API and adds a small client-side state layer for behavior that the API cannot persist.

This distinction is important:

```text
Remote API = source of server responses
Local UI state = source of visible mutation results during the session
```

---

## 2. API Boundary

```text
src/services/
├── auth.service.ts
└── products.service.ts

src/lib/
└── axios.ts
```

The UI imports service functions, not Axios directly.

Example conceptual interface:

```ts
login(credentials)
getProducts(params)
searchProducts(query, params)
getCategories()
getProduct(id)
addProduct(payload)
updateProduct(id, payload)
deleteProduct(id)
```

---

## 3. Axios Configuration

### Base

```text
https://dummyjson.com
```

### Request interceptor

```text
request
 ↓
read token
 ↓
Authorization: Bearer <token>
 ↓
send
```

### Response interceptor

```text
response
  ↓
success → return data

error
  ↓
normalize
  ↓
throw AppError
```

The interceptor is the single place for cross-cutting HTTP behavior.

---

## 4. Core Types

### Product

```ts
type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
};
```

### Review

```ts
type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};
```

### Product Query

```ts
type ProductQuery = {
  page: number;
  limit: 10 | 20 | 50;
  search: string;
  category: string;
  sort: "title" | "price" | "rating";
  direction: "asc" | "desc";
};
```

---

## 5. URL Contract

```text
/products
/products?page=2
/products?page=2&limit=20
/products?q=phone
/products?category=smartphones
/products?sort=price-desc
```

Combined:

```text
/products?page=2&limit=20&q=phone&sort=rating-desc
```

The application must sanitize URL input before using it.

---

## 6. Query Precedence

DummyJSON does not provide the exact combined search + category operation expected by a rich admin filter.

NOVA therefore uses:

```text
if search:
    search mode
else if category:
    category mode
else:
    normal product mode
```

The category control remains available, but the UI should make the active data mode clear.

This is preferable to silently making two API requests and presenting a result that appears server-filtered when it is not.

---

## 7. Mutation Cache / Session Layer

Since DummyJSON mutations are not durable:

```text
server response
      ↓
mutation reducer
      ↓
session product state
```

Possible state:

```ts
type MutationState = {
  added: Product[];
  updated: Record<number, Partial<Product>>;
  deleted: number[];
};
```

The visible product list can combine API data with this mutation layer.

---

## 8. Mutation Rules

### Add

- Call API
- Take returned product
- Add to local mutation state
- Show success
- Do not claim database persistence

### Update

- Call API
- Store returned changes locally
- Immediately reflect them

### Delete

- Call API
- Add product ID to local deleted set
- Remove from visible UI

---

## 9. Search Concurrency

Use one cancellation controller per active search request.

```text
search: "lap"
controller A

new search: "lapt"
cancel A
controller B

new search: "laptop"
cancel B
controller C
```

Only the current request can commit results.

This directly addresses the assignment's delayed-response test.

---

## 10. Error Categories

```text
AUTH_ERROR
NOT_FOUND
VALIDATION_ERROR
NETWORK_ERROR
SERVER_ERROR
UNKNOWN_ERROR
```

The presentation layer maps these to human-readable messages.

---

## 11. Security Boundary

The client token is used because the assignment is a browser application.

Do not place secrets in the frontend.

The DummyJSON credentials and API configuration required by the assignment are not treated as private application secrets.

---

## 12. Backend Scheme Summary

```text
             ┌─────────────────┐
             │   React UI      │
             └────────┬────────┘
                      │
                 hooks/state
                      │
             ┌────────▼────────┐
             │ service layer   │
             └────────┬────────┘
                      │
             ┌────────▼────────┐
             │ shared Axios    │
             │ auth + errors   │
             └────────┬────────┘
                      │
             ┌────────▼────────┐
             │   DummyJSON     │
             └─────────────────┘

             + local mutation state
               for session-visible CRUD
```
