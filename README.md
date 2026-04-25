# Text Analysis API

A Node.js + TypeScript REST API that wraps the Anthropic Claude API to analyze text and return a concise summary along with up to 3 key action items.

## Build & Run

```bash
npm install
npm run dev
```

## Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server and routing |
| `@anthropic-ai/sdk` | Anthropic Claude API client |
| `dotenv` | Loads environment variables from `.env` |

## Environment Setup

Create a `.env` file in the project root:

```
ANTHROPIC_API_KEY=your-api-key-here
```

## Example Request

`POST http://localhost:3000/api/text-analysis/analyze`

```json
{
  "text": "The frontend team needs to fix the broken navigation menu on Safari. The backend team must upgrade the database to the latest version. The QA team needs to complete regression testing before the release."
}
```

## Example Response

```json
{
  "summary": "Three tasks are assigned across frontend, backend, and QA teams ahead of the release.",
  "actionItems": [
    "The frontend team needs to fix the broken navigation menu on Safari.",
    "The backend team must upgrade the database to the latest version.",
    "The QA team needs to complete regression testing before the release."
  ]
}
```
