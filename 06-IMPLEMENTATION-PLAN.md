# NOVA — Implementation Plan
> Two-Day Delivery Plan · v1.0

The plan is intentionally ordered around dependency risk. The goal is to get a working vertical slice early, then refine it.

---

## Day 1 — Foundation + Core Product Flow

### 09:00–09:45 · Project setup

- Create Next.js app
- Configure Tailwind
- Create folder structure
- Add Axios
- Add shared environment configuration
- Create initial Git commit

**Commit:** `chore: initialize nova admin dashboard`

---

### 09:45–10:45 · Axios + authentication

Build:

- Axios instance
- Request interceptor
- Error normalization
- Login service
- Auth state
- Protected route behavior
- Logout

Test:

- Correct credentials
- Wrong credentials
- Refresh after login
- Logout
- Repeated login clicks

**Commit:** `feat: add authentication and protected routes`

---

### 10:45–12:30 · Product API layer

Create:

- Product types
- Product service
- Category service
- Product detail service
- Mutation service methods

No UI API calls yet.

**Commit:** `feat: add product api services`

---

### 13:30–15:30 · Product list

Build:

- Desktop table
- Mobile cards
- Product image
- Title
- Category
- Price
- Rating
- Stock
- Loading state
- Empty state
- Error + Retry

**Commit:** `feat: build responsive product list`

---

### 15:30–17:00 · URL-driven pagination

Implement:

- `page`
- `limit`
- `skip`
- Range label
- Previous / Next
- Page numbers
- 10 / 20 / 50 selector
- Invalid query sanitization

Test:

```text
?page=abc
?page=0
?page=-4
?page=999999
?limit=7
```

The page should remain usable.

**Commit:** `feat: add url driven pagination`

---

### 17:00–18:00 · First integration pass

Verify:

```text
login → products → pagination → logout
```

Fix architecture problems before adding more features.

**Commit:** `test: verify core product flow`

---

# Day 2 — Search + CRUD + Polish

## 09:00–10:30 · Search

Implement:

- Search input
- Debounce
- URL synchronization
- Page reset
- Request cancellation
- Empty search state

Test with:

```text
/products/search?q=phone&delay=2000
```

Type quickly:

```text
p → ph → pho → phon → phone
```

Expected result:

Only the latest query controls the UI.

**Commit:** `feat: add debounced race safe search`

---

## 10:30–11:30 · Category + sort

Implement:

- Category loading
- Category selector
- Sort selector
- URL synchronization
- Page reset

Document search/category precedence.

**Commit:** `feat: add category filter and sorting`

---

## 11:30–13:00 · Product details

Implement:

- `/products/[id]`
- Image gallery
- Description
- Price
- Rating
- Reviews
- Invalid ID state

**Commit:** `feat: add product details`

---

## 14:00–16:00 · Add / edit / delete

Implement:

- Shared product form
- Validation
- Add
- Edit
- Delete confirmation
- Submission locks
- Session mutation layer

Important: make the UI reflect mutations even though DummyJSON does not permanently save them.

**Commit:** `feat: add product mutations`

---

## 16:00–17:00 · UI refinement

Polish:

- Responsive breakpoints
- Focus states
- Skeleton loading
- Empty states
- Error states
- Toast / inline feedback
- Consistent spacing
- Product-health indicator

**Commit:** `style: refine nova interface`

---

## 17:00–18:00 · Final verification

### Functional checklist

- [ ] Login works
- [ ] Wrong credentials show an error
- [ ] Product routes are protected
- [ ] Logout works
- [ ] Desktop table works
- [ ] Mobile cards work
- [ ] Pagination works
- [ ] Page size works
- [ ] Search is debounced
- [ ] Search cannot be overwritten by stale responses
- [ ] Category works
- [ ] Sort works
- [ ] Product details works
- [ ] Wrong ID shows not-found
- [ ] Add works visually
- [ ] Edit works visually
- [ ] Delete confirms
- [ ] Retry works
- [ ] Empty state works
- [ ] Invalid URL state does not crash
- [ ] Repeated Save/Login clicks are blocked

---

## 7. Deployment

### GitHub

Use regular commits rather than one final dump.

Suggested history:

```text
chore: initialize nova admin dashboard
feat: add authentication and protected routes
feat: add product api services
feat: build responsive product list
feat: add url driven pagination
test: verify core product flow
feat: add debounced race safe search
feat: add category filter and sorting
feat: add product details
feat: add product mutations
style: refine nova interface
docs: add architecture and setup notes
```

### Vercel / Netlify

After local verification:

1. Push repository
2. Connect repository to deployment platform
3. Configure environment values if needed
4. Build
5. Test production URL
6. Add live URL to README

---

## 8. Interview Readiness

Before submission, be able to explain these five decisions without reading the code:

### Why Axios interceptor?

To centralize authentication and error handling.

### Why URL state?

The assignment requires refresh/share persistence, and URL state naturally provides that.

### How did you prevent stale searches?

Debounce + cancellation + current-request validation.

### Why don't CRUD changes persist?

DummyJSON simulates mutations. The app keeps a session-level mutation layer so the user still sees the requested change.

### Why no React Query?

The assignment prohibits it. More importantly, implementing the request lifecycle directly makes the core behavior transparent and easy to discuss.

---

## 9. Definition of Done

NOVA is ready to submit when the reviewer can:

```text
login
  ↓
find a product
  ↓
change the view
  ↓
open details
  ↓
edit it
  ↓
return to the list
  ↓
delete it
  ↓
recover from an error
```

without encountering a dead end, confusing state or unexplained behavior.
