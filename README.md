# GHATVERSE

Full-stack Western Ghats travel platform frontend and API starter.

## Stack

- Frontend: React + Vite + Lucide
- API: Flask
- Relational data: PostgreSQL via Flask-SQLAlchemy
- Media/reels: MongoDB
- Local infrastructure: Docker Compose

## Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend defaults to `http://localhost:5000/api/v1`. Change `VITE_API_BASE_URL` in `.env` when the API is hosted elsewhere.

A small green/yellow/red dot in the navigation shows API connectivity. If the API is unavailable, the frontend automatically falls back to its demo data.

## Backend + databases

Start PostgreSQL, MongoDB and Flask:

```bash
docker compose up --build
```

In another terminal, seed the PostgreSQL travel data:

```bash
docker compose exec api python seed.py
```

API health check:

```
http://localhost:5000/api/v1/health
```

## API endpoints

- `GET /api/v1/health`
- `GET /api/v1/states`
- `GET /api/v1/destinations?q=&state=`
- `GET /api/v1/packages?state=`
- `GET /api/v1/stays?state=`
- `GET /api/v1/reels`
- `GET /api/v1/search?q=`
- `POST /api/v1/planner/recommend`

## Architecture

PostgreSQL is the source of truth for states, destinations, packages and stays. MongoDB is reserved for media-heavy reel documents. Media should be stored in S3/Cloudinary/CDN storage rather than database blobs.

The current backend is a project starter, not a production booking system. Before deployment, add authentication, authorization, migrations, pagination, validation, rate limiting, payment/booking transactions, object-storage uploads, audit logs and observability.

See `backend/README.md` for API details.
