# LinkedIn Mapping Tool Frontend

A React TypeScript frontend for searching companies on LinkedIn based on keywords and business models.

## Features

- Keyword search input
- Searchable business model dropdown
- API integration for company search
- LinkedIn URL generation and navigation
- Environment-based configuration (dev, test, prod)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
   - Copy `env.shared` to `.env.local` for shared configuration
   - Copy `env.development` to `.env.development.local` for development
   - Copy `env.test` to `.env.test.local` for testing
   - Copy `env.production` to `.env.production.local` for production

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`.

## Environment Configuration

### Development
```bash
npm run start:dev
```

### Test
```bash
npm run start:test
```

### Production
```bash
npm run start:prod
```

## API Integration

The application is configured to connect to your backend API running on port 3003.

### Endpoints
- `GET /api/business-models` - Fetch available business models
- `POST /api/search-companies` - Search companies based on keywords and business model

### Request Format
```json
{
  "keywords": "your keywords",
  "businessModel": "selected business model"
}
```

### Response Format
```json
{
  "companyIds": ["id1", "id2", "id3"]
}
```

## Project Structure

```
src/
├── components/
│   └── SearchComponent.tsx    # Main search component
├── config/
│   └── api.ts                 # API configuration
├── services/
│   └── api.ts                 # API service layer
└── App.tsx                    # Main app component
```

## Environment Variables

### Shared (env.shared)
- `REACT_APP_SEARCH_COMPANIES_ENDPOINT` - Search companies endpoint path
- `REACT_APP_BUSINESS_MODELS_ENDPOINT` - Business models endpoint path

### Environment-Specific
- `REACT_APP_ENV` - Environment name (development, test, production)
- `REACT_APP_API_BASE_URL` - Base URL for API calls

## TODO

- Implement proper URL formatting logic using company IDs
- Add more comprehensive error handling
- Add loading states and user feedback
- Add styling and UI improvements
- Add unit tests 