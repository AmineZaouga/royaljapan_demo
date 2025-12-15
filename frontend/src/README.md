# Frontend (src) - Project Summary

This README documents the structure of the `src/` folder, the files that make network requests, which files use `axios` or the `safeRequest` wrapper, which pages act as layouts (implement child pages), the main page, router usage, and the most important component props passed between pages and components.

## Quick Project Overview
- Framework: Next.js 13 (App Router)
- UI: React
- HTTP: `axios` is used directly in many places; a centralized `safeRequest` wrapper is available at `src/lib/api.js`.
- Key UX helpers: `src/components/Loading.jsx`, `src/components/ErrorAlert.jsx`.

## How to run (frontend)
- Install: `npm install` (in `frontend/`)
- Start dev server: `npm run dev`
- Make sure `NEXT_PUBLIC_API_BASE_URL` is set in `.env.local` (used throughout the app)

## Files that make network requests
Grouped by pattern found in the source tree.

- Uses `safeRequest` (centralized wrapper):
  - [src/lib/api.js](frontend/src/lib/api.js#L1)
  - [src/components/subPage.jsx](frontend/src/components/subPage.jsx#L1)
  - [src/components/PageSetting.jsx](frontend/src/components/PageSetting.jsx#L1)
  - [src/components/Detail.jsx](frontend/src/components/Detail.jsx#L1)
  - [src/app/[id]/page.js](frontend/src/app/[id]/page.js#L1)
  - [src/app/page.js](frontend/src/app/page.js#L1)
  - [src/app/delivery/page.js](frontend/src/app/delivery/page.js#L1)

- Uses `axios` directly (many admin/dashboard forms and update endpoints):
  - [src/components/Home.jsx](frontend/src/components/Home.jsx#L1)
  - [src/components/ProductSetting.jsx](frontend/src/components/ProductSetting.jsx#L1)
  - [src/components/PageSetting.jsx](frontend/src/components/PageSetting.jsx#L1)
  - [src/app/products/[user_id]/[product_id]/page.jsx](frontend/src/app/products/[user_id]/[product_id]/page.jsx#L1)
  - [src/app/order/testcomp.js](frontend/src/app/order/testcomp.js#L1)
  - [src/app/delivery/page.js](frontend/src/app/delivery/page.js#L1)
  - [src/app/dashboard/layout.js](frontend/src/app/dashboard/layout.js#L1)
  - [src/app/dashboard/product-stting/page.js](frontend/src/app/dashboard/product-stting/page.js#L1)
  - [src/app/dashboard/page-stting/page.js](frontend/src/app/dashboard/page-stting/page.js#L1)
  - [src/app/admin/login/page.js](frontend/src/app/admin/login/page.js#L1)
  - [src/app/admin/(protected)/UserSetting.jsx](frontend/src/app/admin/(protected)/UserSetting.jsx#L1)
  - [src/app/admin/(protected)/UserList.jsx](frontend/src/app/admin/(protected)/UserList.jsx#L1)
  - [src/app/(unprotected)/register/page.js](frontend/src/app/(unprotected)/register/page.js#L1)
  - [src/app/(unprotected)/login/page.js](frontend/src/app/(unprotected)/login/page.js#L1)

> Note: Some files import `axios` but have been converted to use `safeRequest` in parts — check the file for updated usage.

## Pages and Layouts (that implement child pages)
- **Main page (root):** [src/app/page.js](frontend/src/app/page.js#L1) — the public landing / product listing.
- **Root layout:** [src/app/layout.js](frontend/src/app/layout.js#L1) — wraps all app pages; receives `children` prop.
- **Unprotected layout:** [src/app/(unprotected)/layout.jsx](frontend/src/app/(unprotected)/layout.jsx#L1) — wraps public auth pages.
- **Admin protected layout:** [src/app/admin/(protected)/layout.jsx](frontend/src/app/admin/(protected)/layout.jsx#L1) — admin child pages live under this route.
- **Dashboard layout:** [src/app/dashboard/layout.js](frontend/src/app/dashboard/layout.js#L1) — fetches user/dashboard data and renders `Home` or settings pages; passes props down.

## Router usage
- Uses Next.js App Router APIs: `useParams`, `useRouter`, `usePathname` from `next/navigation` in various files:
  - `useParams` used in: [src/app/[id]/page.js](frontend/src/app/[id]/page.js#L1), [src/app/page.js](frontend/src/app/page.js#L1), [src/app/order/testcomp.js](frontend/src/app/order/testcomp.js#L1), admin user pages, etc.
  - `useRouter` / `router.push` used in components for navigation (see [src/components/Home.jsx](frontend/src/components/Home.jsx#L8) and [src/components/Header.jsx](frontend/src/components/Header.jsx#L1)).

## Notable component props (examples)
- `Home` component: `Home({ userid, username, products = [], coupons = [], sellCount, profit, loading = false, error = false, errorMsg = "", onRetry })` — provided by `dashboard/layout.js`.
- `Detail` component: `Detail({ id, user, coupon, count, setPrice })` — product detail component expects `id` and callbacks.
- `ProductDetail` page: `ProductDetail({ params })` — Next page receives `params` object for dynamic segments.
- Layouts: `RootLayout({ children })` and other layouts receive `children`.

## Static assets / common runtime errors seen
- Fonts and images request 404: the app requests fonts under `/assets/fonts/...` and some image files that may not be present in `public/assets/images`.
- Missing or broken `NEXT_PUBLIC_API_BASE_URL` will cause network calls to attempt the production domain or `undefined` (you saw requests to `https://royaljapan.asia/.../undefined`). To reproduce and test error UI: remove or change `NEXT_PUBLIC_API_BASE_URL` in `.env.local` and reload — the pages using `safeRequest` and the ones updated to guard the base URL will show friendly errors.

## Where loading/error UI is implemented
- `src/components/Loading.jsx` — small loading UI
- `src/components/ErrorAlert.jsx` — dismissible error message
- Core pages (`src/app/page.js`, `src/app/[id]/page.js`, `src/app/dashboard/layout.js`, `src/components/Home.jsx`, `src/components/Detail.jsx`) include loading/error or empty states.

## Next steps / suggestions
- Convert remaining `axios` calls to `safeRequest` to standardize error handling and simplify tests.
- Add a small dev-only diagnostics page that reads `window.__API_LOGS__` and `window.__ERROR_LOGS__` (if present) to inspect failed calls during local development.

---
If you'd like I can:
- expand this README to include code snippets and example requests, or
- auto-convert remaining `axios` usages to `safeRequest` with a single pass.

Generated on: December 15, 2025
