# Teleperson Prototype Generator

A simple web app that generates demo versions of customer websites with a Teleperson chat/voice bot embedded. This tool helps show prospects what the Teleperson product would look like on their website.

## Features

- **Automated Research**: Uses Perplexity AI to research any company website
- **AI-Generated Prompts**: Creates custom chatbot prompts tailored to each company
- **Instant Prototypes**: Generates branded demo websites with embedded chat widgets
- **Smart Chat**: AI-powered chatbot using OpenAI that understands each company's unique context

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
  - Perplexity API (company research + prompt generation)
  - Langfuse API (prompt storage and retrieval)
  - OpenAI API (chat responses)

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
- OpenAI

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
OPENAI_API_KEY=your_openai_api_key
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

## Notes

- Prototypes are saved as static HTML files in the `/prototypes` directory
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
