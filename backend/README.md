# GHATVERSE API

Flask API using PostgreSQL for strict travel entities and transactions, and MongoDB for media-heavy reels.

## Local with Docker

From repository root:

```bash
docker compose up --build
```

Then seed PostgreSQL:

```docker compose exec api python seed.py```

API health: `http://localhost:5000/api/v1/health`

## Without Docker

Install PostgreSQL and MongoDB, copy `.env.example` to `.env`, install requirements, then:

```python seed.py
python app.py```

## API
- GET /api/v1/health
- GET /api/v1/states
- GET /api/v1/destinations?q=&state=
- GET /api/v1/packages?state=
- GET /api/v1/stays?state=
- GET /api/v1/reels
- GET /api/v1/search?q=
- POST /api/v1/planner/recommend

The production architecture should add authentication, rate limiting, pagination, object-storage uploads, database migrations and transactional booking endpoints before deployment.
