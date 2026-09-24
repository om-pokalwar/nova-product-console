# NOVA — Application Flow
> User Journey & State Flow · v1.0

## 1. High-Level Journey

```text
                 ┌──────────────┐
                 │   Open NOVA  │
                 └──────┬───────┘
                        │
                 authenticated?
                   /          \
                 no            yes
                 │              │
                 ▼              ▼
             ┌───────┐    ┌────────────┐
             │ Login │    │  Products  │
             └───┬───┘    └─────┬──────┘
                 │              │
          invalid │              ├── Search
                 ▼              ├── Filter
            show error          ├── Sort
                                ├── Pagination
                                ├── Add
                                ├── Edit
                                ├── Delete
                                └── Details
```

---

## 2. Login Flow

```text
Login page
   ↓
Enter username + password
   ↓
Validate fields
   ↓
Submit
   ↓
Disable Login
   ↓
POST /auth/login
   ├── error → show message → enable Login
   │
   └── success
         ↓
      save token
         ↓
      redirect /products
```

Repeated clicks while submitting are ignored.

---

## 3. Product List Flow

```text
/products
   ↓
Read URL state
   ↓
Sanitize values
   ↓
Select data mode
   │
   ├── q exists → Search API
   ├── category exists → Category API
   └── neither → Product API
   ↓
Fetch
   ↓
Loading skeleton
   ↓
Results
   ├── empty → Empty state
   ├── error → Retry
   └── data → Render
```

---

## 4. Search Flow

```text
Typing
  ↓
local input changes
  ↓
debounce
  ↓
reset page = 1
  ↓
cancel previous request
  ↓
search API
  ↓
update URL
  ↓
render latest result
```

The old response is not allowed to overwrite the current query.

---

## 5. Filter Flow

```text
Category selected
       ↓
set category in URL
       ↓
page = 1
       ↓
category API
       ↓
render result
```

If a search query is already active, search mode takes precedence and the UI makes that state explicit.

---

## 6. Sort Flow

```text
Sort selected
       ↓
update URL
       ↓
fetch current data
       ↓
sort result
       ↓
render
```

Supported values:

```text
title
price
rating
```

---

## 7. Product Details

```text
click product
      ↓
/products/[id]
      ↓
GET /products/{id}
   ├── invalid / missing → not-found
   │
   └── success
         ↓
      gallery
      description
      price
      reviews
```

---

## 8. Add Product

```text
Add Product
     ↓
Form
     ↓
Validate
     ↓
Save
     ↓
POST /products/add
     ↓
merge returned product into local UI
     ↓
success feedback
     ↓
return to list
```

---

## 9. Edit Product

```text
Product
  ↓
Edit
  ↓
Pre-filled form
  ↓
Validate
  ↓
PUT /products/{id}
  ↓
update local UI
  ↓
success feedback
```

---

## 10. Delete Product

```text
Delete
  ↓
Confirmation
  ├── Cancel → stay
  │
  └── Confirm
        ↓
      DELETE
        ↓
      remove from local UI
        ↓
      success feedback
```

---

## 11. Logout

```text
Logout
  ↓
clear token
  ↓
clear auth state
  ↓
redirect /login
```

Protected routes must reject access after logout.

---

## 12. URL as a Shareable State

Example:

```text
/products?page=3&limit=50&q=laptop&sort=rating-desc
```

Another user opening the same URL sees the same requested view state, subject to current API data.

That makes the product list bookmarkable and shareable without introducing global state machinery.
