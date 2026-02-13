# ImageTransform

A full-stack image transformation service that removes backgrounds and horizontally flips images. Upload an image, get a hosted URL for the processed result.

## Features

- **Background Removal** — Powered by remove.bg API
- **Horizontal Flip** — Server-side processing with Sharp
- **Cloud Hosting** — Processed images hosted on Cloudflare R2 with public URLs
- **Image Management** — View, download, copy URL, and delete processed images
- **Drag & Drop Upload** — Intuitive upload with file validation
- **Responsive Design** — Works on mobile and desktop

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes (TypeScript)
- **Image Processing:** Sharp (flip), remove.bg API (background removal)
- **Storage:** Cloudflare R2 (S3-compatible)
- **Deployment:** Vercel

## Architecture

```
Upload → Validate → Store Original (R2)
       → Remove Background (remove.bg API)
       → Flip Horizontally (Sharp)
       → Store Processed (R2)
       → Return hosted URLs
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/upload` | Upload and process an image |
| GET | `/api/images` | List all processed images |
| GET | `/api/images/[id]` | Get a specific image record |
| DELETE | `/api/images/[id]` | Delete image from storage |

## Getting Started

### Prerequisites

- Node.js 18+
- Cloudflare R2 bucket with public access
- remove.bg API key ([get one free](https://www.remove.bg/api))

### Setup

1. Clone the repo:

```bash
git clone https://github.com/aditya-prakash-git/ImageTransform.git
cd ImageTransform
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

4. Fill in your environment variables:

```
REMOVE_BG_API_KEY=your_remove_bg_key
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-xxxx.r2.dev
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy

## Design Decisions

- **In-memory metadata store:** Chose simplicity for this scope. In production, would use a database (Postgres/Redis). Image URLs remain valid in R2 regardless.
- **Single API call for processing:** The entire pipeline (upload → remove bg → flip → store) runs in one request. For production, would use a job queue for resilience.
- **Simulated progress steps:** Since processing is a single API call, the frontend simulates step-by-step progress for better UX feedback.

## Limitations

- In-memory store resets on server restart (images persist in R2 but metadata is lost)
- remove.bg free tier: 50 API calls/month
- Max file size: 10MB
