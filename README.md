# Logan Sincliar Development Frontend

A React TypeScript frontend for the Logan Sinclair Development Website

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
Copy the example environment file to create environment-specific configuration files:

```bash
# Copy the example environment file to create your local environment files
cp .env.example .env.development
cp .env.example .env.test
cp .env.example .env.production

# Then edit each file to set the appropriate values for each environment
```

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

The application is configured to connect to your backend API running on port 3001.

## Authentication

The application uses Google OAuth for authentication. Users must sign in with their Google account to access the LinkedIn search functionality.