# vamos - Video Management and SEO Platform

## Overview

Vamos is a comprehensive video management and SEO platform designed for efficient video processing, watermarking, subtitle embedding, and SEO text generation. It provides a role-based access control system with three user types: Admin, Editor, and Translator, each with specific permissions and responsibilities.

## Key Features

- **Video Upload and Processing**

  - Upload videos from local storage or external links
  - Apply custom watermarks with various position presets
  - Embed subtitles from SRT files

- **SEO Text Generation**

  - RAG-based model for generating optimized titles and descriptions
  - Editor review and approval workflow

- **Role-Based Access Control**

  - Admin: Full control over all aspects of the platform
  - Editor: Focused on SEO content generation
  - Translator: Manages subtitle creation and editing

- **Asynchronous Processing**
  - Queue-based video processing for efficient resource management
  - Status tracking for all processing jobs

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Next.js API Routes, FFmpeg
- **Database & Auth**: Supabase
- **Queue Management**: BullMQ/RabbitMQ
- **SEO Generation**: RAG-based model (anythingLLM)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## User Roles and Workflow

### Admin

- Upload and manage videos
- Configure watermark settings
- Review and approve SEO content
- Manage user roles and permissions

### Editor

- Generate SEO titles and descriptions
- Review assigned videos
- Submit content for admin approval

### Translator

- Create and edit subtitle files
- Preview subtitles on videos
- Submit subtitles for integration

## Workflow

1. Admin uploads a video (local file or external link)
2. The video enters processing queue for watermarking and other operations
3. Translator adds/edits subtitles if needed
4. Once processed, Admin assigns to an Editor for SEO content
5. Editor generates title and description using the RAG engine
6. Admin reviews and approves the content
7. The video becomes ready for publishing

## Project Structure

The project follows a modular structure with clear separation of concerns:

- `/app` - Next.js App Router pages and API routes
- `/components` - Reusable UI components
- `/lib` - Utility functions and service integrations
- `/public` - Static assets including watermark samples

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

## Deployment

The application can be deployed on [Vercel](https://vercel.com/new) for optimal performance and integration with Next.js.

## License

This project is proprietary software. All rights reserved.
