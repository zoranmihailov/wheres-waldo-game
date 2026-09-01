# Where's Waldo Game

A full-stack "Where's Waldo?" style spot-the-character game, built as a project for [The Odin Project](https://www.theodinproject.com/) curriculum. Players search for hidden characters within an image, race against the clock, and compete on a persistent leaderboard.

## Features

- Multiple selectable levels, each with its own scene and set of hidden characters
- Click-to-select detection with a coordinate-based hit box system
- Live timer tracking elapsed search time
- Win screen with name entry on completing a level
- Persistent, per-level leaderboard showing the top 10 fastest times
- Character coordinates are never exposed to the client until validated, preventing simple DevTools cheating

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS

**Backend**
- Node.js / Express
- Prisma ORM
- PostgreSQL

## Architecture

The frontend and backend are separate applications communicating over a REST API. Game state (elapsed time, characters found so far) is tracked entirely client-side; the backend is stateless and only validates character clicks and persists leaderboard scores.

```
client/   → React app (Vite)
server/   → Express API
```

## Getting Started Locally

### Prerequisites

- Node.js
- A PostgreSQL database (local or hosted)

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/zoranmihailov/wheres-waldo-game.git
   cd wheres-waldo-game
   ```

2. Install dependencies for both apps
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. Configure environment variables

   In `server/.env`:
   ```
   DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>
   FRONTEND_URL=http://localhost:5173
   ```

   In `client/.env` (optional — defaults to `http://localhost:5000/api` if omitted):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Run database migrations and seed the initial levels
   ```bash
   cd server
   npx prisma migrate deploy
   node prisma/seed.js
   ```

5. Start both apps (in separate terminals)
   ```bash
   # Terminal 1 — backend
   cd server
   npm run dev

   # Terminal 2 — frontend
   cd client
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173)

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/images` | List all available levels |
| GET | `/api/game/:imageId/start` | Start a level (returns the scene and character list, without hit box coordinates) |
| POST | `/api/game/validate` | Validate a click against a character's hit box |
| POST | `/api/leaderboard` | Save a completed run's score |
| GET | `/api/leaderboard/:imageId` | Get the top 10 scores for a level |

## Acknowledgements

Built as part of [The Odin Project](https://www.theodinproject.com/) full-stack JavaScript curriculum.

## Author

[Zoran Mihailov](https://github.com/zoranmihailov)