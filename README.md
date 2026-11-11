# Property react app frontend

React frontend for a property listing site. Visitors browse homes for sale and rent, sign in with an email OTP, and book viewings. Admins manage listings, users, bookings, and contact messages from a separate dashboard.

This repo holds the frontend only. It talks to a Spring Boot REST API that runs on `http://localhost:3060` and is kept in a separate repository.

## Tech stack

- React 18 with Vite 7
- Tailwind CSS 4, plus Bootstrap 5 loaded from a CDN in `index.html`
- React Router 6 for routing
- Axios for API calls, with a JWT interceptor in `src/services/axiosInstance.js`
- Framer Motion for page animations
- lucide-react icons, react-hot-toast notifications, react-select dropdowns
- jsPDF and jspdf-autotable for the admin PDF report

Prices are shown in Indian rupees.

## Getting started

You need Node.js 20.19 or newer (or 22.12 and up), which Vite 7 requires.

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`. Start the backend first, or every page that loads data will show empty results.

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## Backend connection

Most requests go through `src/services/axiosInstance.js`, which has `baseURL` set to `http://localhost:3060`. A few components (login, OTP, admin login, contact form) call full `http://localhost:3060/...` URLs directly.

`src/.env` defines `VITE_API_URL`, but Vite only reads `.env` from the project root, so that file has no effect where it sits now. To deploy against a different API host, move the file to the root and replace the hardcoded URLs with `import.meta.env.VITE_API_URL`.

## Pages

Public:

| Route | Page |
|---|---|
| `/` | Landing page with featured listings loaded from the API |
| `/login` | User sign-in by email and phone, then a 6-digit OTP sent by email |
| `/adminlogin` | Admin sign-in with email and password |
| `/adminregister` | Admin registration |

Signed-in users:

| Route | Page |
|---|---|
| `/home` | All listings, plus the user's own bookings |
| `/buy` | Listings for sale |
| `/rent` | Listings for rent |
| `/featured` | Featured listings |
| `/contact` | Contact form |

Admins:

| Route | Page |
|---|---|
| `/admin` | Dashboard with counts, recent listings, a featured toggle, and a PDF report |
| `/admin/properties` | Add, edit, and delete listings, with image upload |
| `/admin/users` | User list, with delete |
| `/admin/bookings` | Approve or reject viewing requests |
| `/admin/contacts` | Messages sent through the contact form |

User routes are wrapped in `PrivateRoute` and admin routes in `AdminRoute`. Both check the tokens saved in `localStorage` after login.

## Project layout

```
src/
  Component/
    Admin/        admin dashboard
    Auth/         login, OTP, admin login and registration
    pages/        landing, home, buy, rent, featured, contact
    MyRoutes.jsx  route table
    ...           navbar, footer, property card, booking modal, admin pages
  services/       axios setup, API helpers, PDF report
  assets/Images/  fallback and hero photos
  index.css       Tailwind import and theme tokens
```

## Theme

Colors, fonts, and corner radius live in the `@theme` block in `src/index.css`. The palette is forest green with stone neutrals and a brass accent. Headings use Fraunces and body text uses Manrope, both loaded from Google Fonts. Tailwind's `blue`, `indigo`, `slate`, and `gray` scales are remapped there too, so changing those values restyles every page at once.
