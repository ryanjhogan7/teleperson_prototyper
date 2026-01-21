# Teleperson Prototype Generator

A simple web app that generates demo versions of customer websites with a Teleperson chat/voice bot embedded. This tool helps show prospects what the Teleperson product would look like on their website.

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ryanjhogan7/teleperson_prototyper&env=PERPLEXITY_API_KEY,LANGFUSE_PUBLIC_KEY,LANGFUSE_SECRET_KEY&envDescription=API%20keys%20required%20for%20Perplexity%20and%20Langfuse&project-name=teleperson-prototype-generator&repository-name=teleperson-prototype-generator)

Click the button above to deploy to Vercel. You'll be prompted to add your API keys during setup.

## Features

- **Automated Research**: Uses Perplexity AI to research any company website
- **AI-Generated Prompts**: Creates custom chatbot prompts tailored to each company
- **Instant Prototypes**: Generates branded demo websites with embedded chat widgets
- **Smart Chat**: AI-powered chatbot using Perplexity AI that understands each company's unique context

## How It Works

1. User pastes a company website URL
2. Perplexity AI researches the company and generates a custom prompt
3. The prompt is saved to Langfuse for management
4. A prototype website is generated with the company's branding
5. Users can interact with an AI chatbot trained on that company's information

## Tech Stack

- **Frontend**: Next.js 15 + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **APIs**:
  - Perplexity API (company research + prompt generation + chat responses)
  - Langfuse API (prompt storage and retrieval)

## Project Structure

```
/teleperson_prototyper
  /app
    page.tsx                          # Main URL input page
    /api
      /generate
        route.ts                      # Generate prototype endpoint
      /chat
        route.ts                      # Chat message endpoint
      /prototype/[id]
        route.ts                      # Serve prototype HTML
  /lib
    perplexity.ts                     # Perplexity API wrapper
    langfuse.ts                       # Langfuse API wrapper
    utils.ts                          # HTML generator & utilities
  /prototypes                         # Generated HTML files
  .env.local                          # Environment variables
```

## Getting Started

### Prerequisites

You'll need API keys for:
- Perplexity AI
- Langfuse

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd teleperson_prototyper
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your API keys:

```env
PERPLEXITY_API_KEY=your_perplexity_api_key
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter a URL**: Paste any company website URL into the input field
2. **Generate Demo**: Click "Generate Demo" and wait 30-60 seconds
3. **View Prototype**: Once complete, click "View Demo" to see the generated website
4. **Test Chat**: Interact with the AI chatbot in the bottom-right corner

## API Endpoints

### POST /api/generate

Generates a prototype for a given URL.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "prototypeId": "company-name",
  "previewUrl": "/api/prototype/company-name",
  "companyName": "Company Name",
  "industry": "Technology",
  "promptName": "teleperson-demo-company-name"
}
```

### POST /api/chat

Handles chat messages and returns AI responses.

**Request Body:**
```json
{
  "prototypeId": "company-name",
  "promptName": "teleperson-demo-company-name",
  "message": "What services do you offer?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ]
}
```

**Response:**
```json
{
  "reply": "We offer..."
}
```

### GET /api/prototype/[id]

Serves the generated prototype HTML.

**Response:** HTML page with embedded chat widget

## How the Prompt Generation Works

The system uses Perplexity AI to both research the company AND generate a comprehensive chatbot prompt in a single API call. The prompt follows this structure:

1. **Identity** - Who the AI represents and the company mission
2. **Core Function** - Main objectives (clarify offering, diagnose intent, guide next steps)
3. **Boundaries** - Tone, response style, what NOT to do
4. **Engagement Style** - How to start conversations and ask questions
5. **Objection Handling** - Industry-specific objections with responses
6. **Escalation** - When to hand off to humans

The generated prompt is then stored in Langfuse for version control and easy retrieval.

## Features of the Generated Prototypes

Each prototype includes:

- **Branded Header**: Uses the company's primary color
- **Welcome Content**: Brief description of the company's services
- **Floating Chat Button**: Fixed bottom-right position
- **Chat Panel**: Full conversational interface
- **Typing Indicator**: Shows when AI is thinking
- **Responsive Design**: Works on all screen sizes
- **"Powered by Teleperson" Badge**: Branding for the demo

## Development

### Building for Production

```bash
npm run build
npm start
```

### Project Configuration

The project uses:
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality
- Next.js 15 with App Router

## Deployment to Vercel

This application is optimized for deployment on Vercel, which provides seamless hosting for Next.js applications.

### Deploy to Vercel

1. **Push your code to GitHub** (if not already done):
```bash
git push origin claude/teleperson-prototype-generator-CrWos
```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**:

   Before deploying, add your API keys in the Vercel dashboard:

   - In your project settings, go to **Settings** → **Environment Variables**
   - Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `PERPLEXITY_API_KEY` | Your Perplexity API key | Production, Preview, Development |
   | `LANGFUSE_PUBLIC_KEY` | Your Langfuse public key | Production, Preview, Development |
   | `LANGFUSE_SECRET_KEY` | Your Langfuse secret key | Production, Preview, Development |

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a live URL (e.g., `your-app.vercel.app`)

### Updating Environment Variables

To update environment variables after deployment:

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Edit or add new variables
4. **Important**: Redeploy your application for changes to take effect
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select "Redeploy"

### Custom Domain (Optional)

To add a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow Vercel's DNS configuration instructions

### Vercel Deployment Features

- **Automatic deployments**: Every push to your branch triggers a new deployment
- **Preview deployments**: Pull requests get their own preview URLs
- **Instant rollbacks**: Easily revert to previous deployments
- **Edge network**: Global CDN for fast loading worldwide
- **Serverless functions**: API routes run as serverless functions

### Important Notes for Vercel Deployment

**Prototype Storage**: On Vercel, prototypes are stored in the `/tmp` directory, which is ephemeral. This means:
- Prototypes are stored temporarily during the serverless function execution
- Each deployment/restart will clear the `/tmp` directory
- Prototypes will persist for the duration of the function's lifecycle (typically several minutes to hours)
- For production use, consider integrating a persistent storage solution like:
  - Vercel Blob Storage
  - AWS S3
  - Cloudflare R2
  - Database with HTML storage

The application automatically detects when running on Vercel and uses the appropriate storage location.

## Notes

- **Local Development**: Prototypes are saved as static HTML files in the `/prototypes` directory
- **Vercel Deployment**: Prototypes are saved to `/tmp` (ephemeral storage)
- No database required - this is an internal demo tool
- No authentication - designed for internal use
- Conversation history is maintained client-side during each session

## Future Enhancements

Possible improvements:
- Add voice chat capability using Web Speech API
- Support for custom branding options
- Prototype management dashboard
- Analytics for chat interactions
- Export chat transcripts
- Multi-language support

## License

Internal tool for Teleperson demonstration purposes.
