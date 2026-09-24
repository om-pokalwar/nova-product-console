# NOVA — UI/UX Design Brief
> Visual Direction · v1.0

## 1. Design Idea

NOVA should feel closer to a **quiet operations console** than a generic admin template.

The visual language is intentionally restrained:

- White / near-white surfaces
- One strong accent
- Thin borders
- Compact typography
- Generous spacing around primary content
- Minimal decoration
- Data gets the visual priority

The interface should look designed, not decorated.

---

## 2. Design Principles

### 01 — Scan before click

A user should understand the product row without opening it.

### 02 — Actions stay close to context

Edit and delete belong to the product, not a distant toolbar.

### 03 — State is visible

Loading, empty, error and success states should never feel like exceptions.

### 04 — Mobile is a different layout

Do not squeeze the desktop table into a phone.

---

## 3. Suggested Visual System

### Typography

Use a clean sans-serif stack.

Hierarchy:

```text
Page title       28–32px / semibold
Section title    18–20px / semibold
Body             14–16px
Metadata         12–13px
```

Keep line-height comfortable. Avoid excessive font weights.

### Spacing

Use a simple 4px base rhythm:

```text
4 / 8 / 12 / 16 / 24 / 32 / 48
```

### Shape

- Card radius: 12–16px
- Input radius: 8–10px
- Buttons: 8–10px
- Avoid excessive pill-shaped UI

---

## 4. Desktop Layout

```text
┌─────────────────────────────────────────────────────────────┐
│ NOVA                                      Search   User  ↪ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Products                              + Add product         │
│ 194 products · filtered view                                │
│                                                             │
│ [Search................] [Category] [Sort] [20 / page]      │
│                                                             │
│ ┌────┬──────────────┬────────┬────────┬───────┬──────────┐ │
│ │    │ Product      │Category│ Price  │ Stock │ Actions  │ │
│ ├────┼──────────────┼────────┼────────┼───────┼──────────┤ │
│ │img │ iPhone ...   │phones  │ $999   │ 18    │ •••      │ │
│ │img │ Laptop ...   │laptop  │ $799   │ 7     │ •••      │ │
│ └────┴──────────────┴────────┴────────┴───────┴──────────┘ │
│                                                             │
│ Showing 21–40 of 194             ‹ 1 2 3 4 5 ›              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Mobile Layout

Replace the table with cards.

```text
┌──────────────────────┐
│ NOVA             ☰   │
│                      │
│ Products             │
│ 194 products         │
│                      │
│ [ Search........ ]   │
│ [Category] [Sort]    │
│                      │
│ ┌──────────────────┐ │
│ │ image            │ │
│ │ iPhone 15        │ │
│ │ Smartphones      │ │
│ │ $999     ★ 4.8   │ │
│ │ Stock: 18        ⋮│ │
│ └──────────────────┘ │
│                      │
│      1  2  3  ...    │
└──────────────────────┘
```

---

## 6. Product Details

Use a two-column desktop composition:

```text
Gallery            Product information
────────            ───────────────────
Main image         Title
Thumbnails         Category
                   Price
                   Description
                   Rating
                   Reviews
                   [Edit]
```

On mobile, stack the image and information.

---

## 7. Product Form

Keep the form intentionally short.

### Fields

- Title
- Description
- Price
- Category
- Stock
- Rating where appropriate

Use clear inline validation.

Avoid displaying every validation rule at once. Tell the user what is wrong where it happens.

---

## 8. Interaction Details

### Search

Do not show a full-screen loading state for every keystroke.

Use a small loading indicator inside the search/result region.

### Delete

Confirmation copy should identify the product:

> Delete “Product Name”? This action will remove it from the current view.

Two actions:

**Cancel** · **Delete**

### Errors

Prefer:

> We couldn't load products. Try again.

over exposing raw API errors.

---

## 9. Accessibility

Minimum standard:

- Keyboard navigation
- Focus-visible states
- Semantic buttons
- Labels for inputs
- `aria-label` for icon-only controls
- Alt text for product images
- Sufficient contrast
- Dialog focus management

---

## 10. Visual Personality

NOVA should have one memorable detail without becoming flashy:

**Product health is represented by a tiny vertical signal beside the stock value.**

It gives the table a subtle visual rhythm while keeping the actual required fields readable.

No charts are necessary. No dashboard wallpaper. No decorative gradients everywhere.

---

## 11. Empty State

Example:

```text
No products found

Try a different search or clear your filters.

[Clear filters]
```

## 12. Not Found State

Example:

```text
Product not found

The product may have been removed or the URL may be incorrect.

[Back to products]
```
