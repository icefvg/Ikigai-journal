# ikigai Journal - Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account (for authentication)
- Git (for version control)

## 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd ikigai-journal

# Install dependencies
npm install
```

## 2. Database Setup

The application uses SQLite with Prisma ORM. The database file will be created automatically.

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to create the database
npm run db:push
```

## 3. Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Authentication in the Authentication section
4. Enable Google Sign-In and Email/Password authentication methods

### Get Firebase Configuration

1. In your Firebase project, go to Project Settings
2. In the "General" tab, scroll down to "Your apps"
3. Click the web app icon (</>)
4. Register your app (use any name)
5. Copy the configuration object - you'll need these values

### Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Fill in your Firebase credentials in `.env`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

## 4. Run the Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 5. Optional: Set Up External Services

### Market Data APIs (for real-time data)

For market data integration, you can sign up for:

- **Alpha Vantage**: Free tier available for stocks and forex
- **Polygon.io**: Professional market data
- **Yahoo Finance API**: Free alternative

Add your API keys to `.env`:
```env
ALPHA_VANTAGE_API_KEY="your_key_here"
POLYGON_API_KEY="your_key_here"
```

### Email Service (for notifications)

Using Resend for email notifications:

1. Sign up at [Resend](https://resend.com)
2. Get your API key
3. Add to `.env`:
```env
RESEND_API_KEY="resend_api_key_here"
FROM_EMAIL="your_email@domain.com"
```

### Cloud Storage (for screenshots)

Using Cloudinary for file uploads:

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your credentials
3. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## 6. Production Deployment

### Build the Application

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Make sure to set all environment variables in your production environment:

- **Vercel**: Use Vercel Environment Variables
- **Netlify**: Use Netlify Environment Variables
- **Docker**: Use Docker secrets or environment files
- **Traditional Server**: Use `.env` file (not committed to git)

### Database for Production

For production, consider:

1. **PostgreSQL**: More robust than SQLite for production
2. **Database Hosting**: Use services like Supabase, PlanetScale, or AWS RDS
3. **Backups**: Set up regular database backups

To switch to PostgreSQL:

1. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

2. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Run migrations:
```bash
npm run db:migrate
```

## 7. Security Considerations

### Firebase Security Rules

Set up Firebase Security Rules in your Firebase project:

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Environment Variables

Never commit `.env` to version control. It's already in `.gitignore`.

### API Security

- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting
- Use CORS appropriately

## 8. Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 9. Troubleshooting

### Common Issues

**Firebase Authentication Issues:**
- Make sure all Firebase config values are correct
- Check that Authentication is enabled in Firebase console
- Verify domain is authorized in Firebase Auth settings

**Database Issues:**
- Run `npm run db:push` if schema changes
- Check `DATABASE_URL` is correct
- Ensure SQLite file has write permissions

**Build Issues:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors

### Getting Help

- Check the console for error messages
- Review browser developer tools
- Check network requests for API issues
- Verify environment variables are set correctly

## 10. Feature Extensions

The application is ready for additional features:

1. **Real-time Market Data**: Integrate with market data APIs
2. **Advanced Charts**: Add trading charts with technical indicators
3. **Backtesting**: Implement strategy backtesting engine
4. **Mobile App**: Use React Native for mobile version
5. **API Endpoints**: Add REST API for external integrations
6. **Webhooks**: Set up webhook notifications
7. **Export/Import**: Add data export functionality
8. **Multi-tenancy**: Add support for multiple users per organization

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the code comments
- Check browser console for errors
- Verify all environment variables are set correctly