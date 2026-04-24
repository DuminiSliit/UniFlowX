#!/bin/bash
# Setup script to run UniFlowX backend with Google OAuth

echo "🚀 Starting UniFlowX Backend with Google OAuth..."
echo ""

# Load environment variables
if [ -f .env.local ]; then
    echo "📝 Loading credentials from .env.local..."
    export $(cat .env.local | xargs)
else
    echo "⚠️  .env.local not found! Please create it with your Google credentials."
    exit 1
fi

# Verify required variables
if [ -z "$GOOGLE_CLIENT_SECRET" ] || [ "$GOOGLE_CLIENT_SECRET" = "YOUR_NEW_CLIENT_SECRET_HERE" ]; then
    echo "❌ ERROR: GOOGLE_CLIENT_SECRET is not set or still has placeholder value"
    echo "   Please edit .env.local and add your actual client secret"
    exit 1
fi

echo "✅ Client ID: $GOOGLE_CLIENT_ID"
echo "✅ Redirect URI: $GOOGLE_REDIRECT_URI"
echo "✅ Client Secret: ${GOOGLE_CLIENT_SECRET:0:10}... (hidden)"
echo ""

# Kill any existing process on port 8080
echo "🔄 Checking port 8080..."
lsof -i :8080 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null
sleep 1

# Start Maven
echo "📦 Starting Maven..."
mvn spring-boot:run -DskipTests \
  -Dspring.security.oauth2.client.registration.google.client-id="$GOOGLE_CLIENT_ID" \
  -Dspring.security.oauth2.client.registration.google.client-secret="$GOOGLE_CLIENT_SECRET" \
  -Dspring.security.oauth2.client.registration.google.redirect-uri="$GOOGLE_REDIRECT_URI"

echo ""
echo "🌐 Backend running at: http://localhost:8080"
