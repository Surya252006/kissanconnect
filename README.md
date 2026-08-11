# KisanConnect

Farmer-to-Buyer Agricultural Marketplace built for the MongoDB Tech-Odyssey Hackathon.

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios, lucide-react
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
- **Auth:** JWT, bcryptjs
- **Media:** Cloudinary, Multer

## Project Structure

```
KisanConnect/
│
├── client/          # React frontend
├── server/          # Express backend
├── image/           # Original product images
└── package.json     # Root scripts for development
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Install root dependencies:

```bash
npm install
```

2. Install client dependencies:

```bash
npm --prefix client install
```

3. Install server dependencies:

```bash
npm --prefix server install
```

4. Configure environment variables:

```bash
cp server/.env.example server/.env
```

Then fill in `server/.env` with your MongoDB URI, JWT secret, and Cloudinary credentials.

### Run Development Servers

Start both client and server together:

```bash
npm run dev
```

Or start them individually:

```bash
npm run client   # React on http://localhost:5173
npm run server   # Express on http://localhost:5000
```

### Health Check

```bash
GET http://localhost:5000/api/health
```

Response:

```json
{
  "success": true,
  "message": "KisanConnect API is running"
}