# 🏎️ TracklabX — F1 25 Setup Database & Race Calendar

![TracklabX Hero](public/assets/Logo/logo.svg)

> **Pit Wall Futurism.** A premium, data-dense F1 dashboard for the modern era.

TracklabX is a community-driven platform for F1 25 players to share, discover, and compare car setups across all 24 global circuits. Built with a focus on visual excellence and real-time data precision.

---

## ✨ Core Features

- **🏆 Championship Standings**: Live-updating driver and constructor leaderboards (2021–2026) with automated Firestore caching and Jolpica API integration.
- **📊 Performance Analytics**: Staggered progression charts and detailed race-by-race point accumulation heatmaps.
- **🏗️ Setup Database**: A sophisticated hub for F1 25 car setups, optimized for performance and ease of use.
- **📅 Smart Calendar**: A 2026-ready interactive race calendar with session countdowns, track layouts (SVG), and dynamic race status tracking.
- **🚀 Ultra-Fast UX**: Zero-layout-shift typography using Next.js local font optimization and Framer Motion micro-animations.

## 🎨 Design Philosophy: "Pit Wall Futurism"

TracklabX isn't just a leaderbord; it's a digital command center. Our design system utilizes:
- **Typography**: Barlow Condensed (Display), Plus Jakarta Sans (Body), and Geist Mono (Data).
- **Colors**: Deep Gunmetal foundations, High-Contrast Snow text, and "TracklabX Red" glow accents.
- **Motion**: Staggered reveals and industrial-luxury transitions that feel like high-end telemetry software.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend / Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Data Source**: [Jolpica F1 API](https://jolpica.io/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project (for Standings & Auth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/WARD3NXD/tracklabx.git
   cd tracklabx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## 📅 Maintenance

TracklabX includes automated maintenance scripts:
- **Cache Refresh**: A Firebase Cloud Function (`refreshStandings`) automatically clears current season data every Sunday at midnight.
- **Seeding**: Use `npm run seed-standings` to pre-populate historical data from the Jolpica API.

---

## 🛡️ License

Built for the F1 Community. All rights reserved. 🏁
