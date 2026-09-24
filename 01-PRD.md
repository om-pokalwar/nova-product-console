# NOVA — Product Operations Console
> Product Requirements Document · v1.0

**A small admin dashboard designed around one idea:** product management should feel like an operations console, not a spreadsheet.

NOVA keeps the required product workflows fast and obvious while adding lightweight product-health cues from the data already available: stock, rating, price and category.

---

## 1. Product Definition

### Problem

A product admin needs to answer three questions quickly:

1. **What exists?**
2. **What needs attention?**
3. **What can I change right now?**

The assignment requires authentication, product browsing, search, filtering, sorting, pagination and CRUD interactions. NOVA packages those requirements into one focused workflow rather than treating them as disconnected pages.

### Goal

Build a responsive Next.js admin dashboard where an authenticated user can:

- Browse products
- Search without stale results winning
- Filter by category
- Sort by title, price or rating
- Navigate large result sets
- Inspect product details and reviews
- Add, edit and delete products
- Recover cleanly from loading, empty, invalid and API-error states

### Non-goals

- Real payment or order management
- Persistent database ownership
- Role-based permissions
- Analytics beyond lightweight product-health signals
- Replacing DummyJSON with a custom backend

---

## 2. Primary User

**Admin / product operator**

They are assumed to be comfortable with basic product management but should not need technical knowledge to use NOVA.

---

## 3. Core Experience

### Dashboard

The first authenticated screen is a product command center.

**Top bar**
- NOVA wordmark
- Search
- Category filter
- Sort
- Page-size control
- Logout

**Main content**
- Product result count
- Product table on desktop
- Product cards on mobile
- Pagination
- Inline product-health cue

**Product health cue**

A deliberately small visual signal derived from existing fields:

| Signal | Rule |
|---|---|
| Low stock | stock < 10 |
| Strong rating | rating >= 4.5 |
| Normal | anything else |

This is not presented as business truth. It is a convenience layer for scanning.

---

## 4. Functional Requirements

### Authentication

- Login using `POST /auth/login`
- Required credentials supplied by the assignment
- Show a clear error for invalid credentials
- Protect product routes
- Persist the authenticated token locally
- Attach the token through the shared Axios client
- Logout clears the local session

### Product List

Display:

- Image
- Title
- Category
- Price
- Rating
- Stock
- Action affordance

Desktop uses a table. Mobile uses cards.

### Search

- Endpoint: `/products/search?q=`
- Debounce user input
- Reset to page 1 when query changes
- Cancel or invalidate older requests
- Never allow an older response to overwrite a newer query

### Filter

- Load categories from `/products/categories`
- Category selection updates the URL
- Because DummyJSON does not combine search and category filtering in the required way, NOVA uses a deterministic precedence rule:

**When search is active, search owns the result set. When category is active without search, category owns the result set.**

The UI makes the active mode visible rather than pretending both filters are being applied server-side.

### Sort

Support:

- Title
- Price
- Rating

Sorting is represented in the URL so the view is reproducible.

### Pagination

- `limit`
- `skip`
- Page numbers
- Previous / Next
- Page size: 10 / 20 / 50
- Range label such as `Showing 21–40 of 194`

Invalid URL state is sanitized instead of crashing the page.

### Product Details

Route:

`/products/[id]`

Show:

- Product title
- Image gallery
- Description
- Price
- Reviews

Invalid product IDs resolve to a dedicated not-found state.

### Add / Edit

- Shared form component
- Client-side validation
- Disable Save while submitting
- Prevent duplicate submissions
- Show success feedback
- Optimistically reflect the mutation in the local product view

### Delete

- Require confirmation
- Disable the action while deleting
- Remove the product from the current UI immediately after a successful request
- Explain that DummyJSON does not provide durable persistence for these mutations

---

## 5. UX States

Every API-driven surface has four intentional states:

**Loading**  
Quiet skeletons instead of a blank screen.

**Empty**  
A useful message with a reset action when appropriate.

**Error**  
Short explanation + Retry.

**Success**  
Small confirmation feedback without interrupting the workflow.

---

## 6. Success Criteria

The implementation is successful when:

- An unauthenticated visitor cannot access product pages.
- Search is debounced and race-safe.
- Refreshing or sharing a URL preserves page/search/filter/sort state.
- Invalid query parameters do not break the UI.
- Desktop and mobile layouts remain usable.
- Repeated Login/Save clicks do not create duplicate requests.
- CRUD changes are visible in the application even though the API is not a persistent database.
- API access is separated from UI components.

---

## 7. Product Principle

> **Every control should answer one question: “What do I want to do next?”**

NOVA avoids turning every available API feature into another button. The interface prioritizes scan → decide → act.
