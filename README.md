# View Points

A web application to manage geographic viewpoints - scenic locations, landmarks, and points of interest with coordinates, photos, and descriptions.

![Dark Theme](https://img.shields.io/badge/theme-dark-1a1a1a)
![Flask](https://img.shields.io/badge/backend-Flask-blue)
![React](https://img.shields.io/badge/frontend-React-61dafb)
![SQLite](https://img.shields.io/badge/database-SQLite-003B57)

## Features

- **CRUD Operations** - Create, read, update, and delete viewpoints
- **Photo Gallery** - Upload and manage multiple photos per viewpoint
- **Categories** - Organize viewpoints with custom categories and colors
- **GPS Coordinates** - Store precise latitude, longitude, and elevation
- **Star Ratings** - Rate viewpoints from 0-5 stars
- **Search & Filter** - Find viewpoints by name or category
- **Dark Theme** - Modern dark UI with Tailwind CSS
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

**Backend:**
- Python 3.x
- Flask 3.0
- Flask-SQLAlchemy
- SQLite database
- Flask-CORS

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Project Structure

```
cc_view_points/
├── backend/
│   ├── app/
│   │   ├── __init__.py      # Flask app factory
│   │   ├── models.py        # SQLAlchemy models
│   │   └── routes/
│   │       ├── viewpoints.py
│   │       └── categories.py
│   ├── uploads/             # Photo storage
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/geneweng/cc_view_points.git
   cd cc_view_points
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend** (Terminal 1)
   ```bash
   cd backend
   source venv/bin/activate
   python run.py
   ```
   Backend runs at: http://localhost:5000

2. **Start the frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs at: http://localhost:3000

3. **Open your browser** at http://localhost:3000

## API Endpoints

### Viewpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/viewpoints` | List all viewpoints |
| GET | `/api/viewpoints/:id` | Get single viewpoint |
| POST | `/api/viewpoints` | Create viewpoint |
| PUT | `/api/viewpoints/:id` | Update viewpoint |
| DELETE | `/api/viewpoints/:id` | Delete viewpoint |

### Photos

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/viewpoints/:id/photos` | Upload photo |
| DELETE | `/api/photos/:id` | Delete photo |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

## Database Schema

### ViewPoints Table
- `id` - Primary key
- `name` - Viewpoint name
- `description` - Text description
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `elevation` - Meters above sea level
- `category_id` - Foreign key to categories
- `rating` - 0-5 star rating
- `is_public` - Visibility flag
- `created_at` / `updated_at` - Timestamps

### Categories Table
- `id` - Primary key
- `name` - Category name
- `description` - Text description
- `icon` - Icon identifier
- `color` - Hex color code

### Photos Table
- `id` - Primary key
- `viewpoint_id` - Foreign key to viewpoints
- `filename` - Stored filename
- `original_filename` - Original upload name
- `caption` - Photo caption
- `is_primary` - Primary display photo flag

## Screenshots

The application features a modern dark theme with:
- Card-based viewpoint grid
- Category color badges
- Photo galleries with lightbox
- Responsive navigation

## License

MIT License
