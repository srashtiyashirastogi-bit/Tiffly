# Tiffly (MERN)

Find, compare and subscribe to nearby mess and tiffin providers.

- **MongoDB + Mongoose**: providers, subscription requests, waitlist
- **Express (Node)**: REST API in `server/`
- **React (Vite)**: frontend in `client/`

## What works

- Search messes by area or name, filter by budget, veg/non-veg and meals, and sort by distance, rating or price
- Provider details: menu, reviews, plans
- "Request subscription" form, saved in MongoDB (no online payment; the user pays the provider directly)
- "List your mess" form: saved as pending (`approved: false`) until you approve it in the database
- Early-access waitlist (emails saved, duplicates ignored)

## Run it locally

You need **Node.js 18+** and **MongoDB** (local install, or a free MongoDB Atlas cluster).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env        # Windows: copy .env.example .env
# open .env and set MONGO_URI if you use Atlas
npm run seed                # adds 5 SAMPLE providers (made-up demo data)
npm run dev                 # API on http://localhost:5000
```

### 2. Frontend (new terminal)

```bash
cd client
npm install
npm run dev                 # app on http://localhost:5173
```

Open http://localhost:5173. In development, Vite forwards `/api` requests to the server.

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Check the server is up |
| GET | `/api/providers?q=&minPrice=&maxPrice=&type=&meal=&sort=` | List approved providers |
| GET | `/api/providers/:id` | One provider |
| POST | `/api/providers` | Submit a mess for review |
| POST | `/api/subscriptions` | Send a subscription request |
| POST | `/api/waitlist` | Join early access |

## Approving a mess that someone listed

Open the `providers` collection (MongoDB Compass or Atlas) and set `approved: true` on the entry. Providers' phone numbers are stored but never returned by the public API.

## Deploying

- **Backend** (Render, Railway): root `server`, start command `npm start`, set `MONGO_URI` and `CLIENT_ORIGIN` (your frontend URL).
- **Frontend** (Netlify, Vercel): root `client`, build `npm run build`, publish `dist`, set `VITE_API_URL` to your backend URL.

## Not included yet

User login, online payments, provider dashboard, an admin screen for approvals, reviews submitted by users. Add these next once the basics are validated.
