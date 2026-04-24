# 🔐 Google OAuth Setup Guide for UniFlowX

## ⚠️ Current Issue
Your app is showing `Error 401: invalid_client` because:
1. **Missing or incorrect client secret** - This is required for OAuth2 to work
2. **Credentials not passed to the application** - Environment variables must be properly loaded

## ✅ How to Fix It

### Step 1: Get a New Google Client Secret
Since you can't view the full secret in Google Console, create a new one:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your **"UniFlowX"** OAuth 2.0 Client ID
3. Click the **edit icon** (pencil)
4. Scroll down to **"Client secrets"** section
5. Click **"+ Create New Client Secret"**
6. **Copy the ENTIRE secret value** (it will look like: `GOCSPX-...`)
7. **Save it somewhere safe** - You can only see it once!

### Step 2: Add Your Credentials to `.env.local`

Edit `/backend/.env.local`:

```bash
GOOGLE_CLIENT_ID=246344158848-aosispjgdmudvm50nb9n0f5kn02hdqoj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=PASTE_YOUR_NEW_SECRET_HERE
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google
JWT_SECRET======================UniFlowXSmartCampusSecretKeyByAntigravity=====================
JWT_EXPIRATION_MS=86400000
DB_URL=jdbc:h2:mem:testdb;MODE=MySQL
DB_USERNAME=sa
DB_PASSWORD=
```

### Step 3: Run the Backend

Make the script executable and run it:

```bash
cd /Users/aathilhakam/Desktop/paf\ project/UniFlowX/backend
chmod +x run.sh
./run.sh
```

**OR** manually set environment variables:

```bash
export GOOGLE_CLIENT_ID="246344158848-aosispjgdmudvm50nb9n0f5kn02hdqoj.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="YOUR_SECRET_HERE"
export GOOGLE_REDIRECT_URI="http://localhost:8080/login/oauth2/code/google"
mvn spring-boot:run -DskipTests
```

## 🔍 Verify Your Configuration

After starting the app, check:
1. ✅ Backend running on `http://localhost:8080`
2. ✅ Frontend running on `http://localhost:5173`
3. ✅ Google OAuth redirect URI in Console: `http://localhost:8080/login/oauth2/code/google`
4. ✅ Authorised JavaScript origins in Console: `http://localhost:5173`

## 🛠️ Troubleshooting

**Still getting "invalid_client"?**
- [ ] Verify the client secret is not empty
- [ ] Check the client secret hasn't expired
- [ ] Ensure redirect URI matches **exactly** in both your config and Google Console
- [ ] Wait a few minutes - Google sometimes takes time to propagate settings

**"Redirect URI mismatch"?**
- Go to Google Console and verify:
  - **Authorised redirect URIs** includes: `http://localhost:8080/login/oauth2/code/google`
  - **Authorised JavaScript origins** includes: `http://localhost:5173`

**Port 8080 already in use?**
```bash
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## 📝 Your Current Configuration

- **Client ID**: `246344158848-aosispjgdmudvm50nb9n0f5kn02hdqoj.apps.googleusercontent.com`
- **Redirect URI**: `http://localhost:8080/login/oauth2/code/google`
- **Frontend URL**: `http://localhost:5173`
- **Backend URL**: `http://localhost:8080`

---

**Next Steps**: After adding your client secret to `.env.local`, restart the backend and try Google login again.
