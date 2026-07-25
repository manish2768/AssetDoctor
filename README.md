# 🚀 AssetDoctor — Smart Care & Warranty Vault

> **Conceptualized & Supervised by Ashutosh Rai**  
> *Offline-First Smart Vault for Home Appliances, Bills, Warranties, Vehicles & FASTag Management*

---

## 🌟 Mobile PWA & Design Refresh Highlights

### 1. 🎨 Design & Branding
- **Apple-Style 3D Glassmorphic Icon**: Native vector SVG (`public/icons/assetdoctor-512.svg`) featuring a glassmorphic shield, glowing medical cross, and heartbeat ECG line.
- **PWA Web App Manifest**: Full `manifest.json` configured with maskable SVG app icons, `#0f172a` theme colors, and standalone mobile app display.

### 2. 📱 Mobile UX & App-Shell Optimization
- **Native App-Shell Architecture**: Bottom thumb-zone navigation bar with elevated primary camera scan trigger.
- **Notch & Safe-Area Padding**: Dynamic `--sat` and `--sab` CSS variables to handle iPhone notches, Android punch-holes, and gesture navigation bars seamlessly.
- **Full-Height Camera Viewfinder**: A4 document guide frame overlay, grid alignment lines, camera torch/flashlight toggle, and gallery upload fallback.

### 3. 🔐 Bank-Grade Security & Offline Specs
- **AES-256-GCM Web Crypto Engine**: PBKDF2 key derivation (100,000 iterations, SHA-256) for local client-side bill encryption.
- **WebAuthn Biometric Lock**: Face ID & Fingerprint authentication (`navigator.credentials.get`) to unlock sensitive vault documents.
- **Screen Privacy Guard**: Automatic blur overlay when switching tabs/apps, blocking `PrintScreen` clipboard captures and print shortcuts.
- **PWA Service Worker**: Cache-First strategy with dynamic network caching, offline support, and Web Push notifications.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS v4 + Vanilla CSS Custom Safe-Area Insets
- **Authentication**: Firebase Auth (Google 1-Click Sign-In + Email Verification)
- **Database & Storage**: Firebase Firestore + Local IndexedDB Storage
- **AI OCR Engine**: Gemini 2.5 Flash / Gemini 1.5 Flash Vision OCR
- **PDF Generation**: jsPDF + jsPDF-AutoTable (1-Click CA Tax Audit Reports)
- **Deployment & Edge**: Vercel + Express Node.js Server

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/manish2768/AssetDoctor.git
cd AssetDoctor

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file with GEMINI_API_KEY and Firebase credentials

# 4. Start the local server
npm run dev
```

---

## 📄 License & Credits

- **Conceptualized & Supervised by**: Ashutosh Rai
- **Developed by**: Manish & AssetDoctor Team
- **Repository**: [https://github.com/manish2768/AssetDoctor.git](https://github.com/manish2768/AssetDoctor.git)