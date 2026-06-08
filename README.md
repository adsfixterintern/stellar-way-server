# 🚀 Stellar Way — Backend Server

The REST API & real-time Socket.IO server powering the **Stellar Way** e-commerce and delivery platform. Built with **Express.js**, **TypeScript**, and **MongoDB**.

---

## 🌐 Live API

> `https://stellar-way-server.onrender.com/api/v1`

Health check: [https://stellar-way-server.onrender.com](https://stellar-way-server.onrender.com)

---

## ✨ Key Capabilities

- 🔐 **Authentication & Authorization** — JWT-based auth with bcrypt password hashing, cookie sessions
- 📦 **Order Management** — Full order lifecycle: create, track, update, complete
- 🛵 **Rider System** — Rider applications, assignments, and real-time location updates
- 💬 **Real-Time Messaging** — Socket.IO for live customer ↔ rider chat and order status push
- 🖼️ **File Uploads** — Image uploads via Multer + Cloudinary
- 💳 **Payment Gateway** — Stripe and SSLCommerz integration
- 📧 **Email Notifications** — Transactional emails via Nodemailer
- 🔳 **QR Code Generation** — Order QR codes via the `qrcode` library
- 🌍 **CORS-protected** — Whitelist of allowed frontend origins

---

## 🛠️ Tech Stack

| Layer        | Technology          |
| ------------ | ------------------- |
| Runtime      | Node.js             |
| Framework    | Express.js v5       |
| Language     | TypeScript          |
| Database     | MongoDB + Mongoose  |
| Real-time    | Socket.IO           |
| Auth         | JWT + bcrypt        |
| File Storage | Cloudinary + Multer |
| Payments     | Stripe, SSLCommerz  |
| Email        | Nodemailer          |
| Dev Server   | tsx watch           |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** URI (Atlas or local)
- **Cloudinary** account
- **Stripe** account (and/or SSLCommerz)

### Installation

```bash
git clone https://github.com/your-username/stellar-way-server.git
cd stellar-way-server
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/stellar-way

# Auth
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Stripe
STRIPE_SECRET_KEY=sk_live_...

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore`.

### Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`.

---

## 📜 Available Scripts

| Command         | Description                                    |
| --------------- | ---------------------------------------------- |
| `npm run dev`   | Start dev server with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/`                  |
| `npm run start` | Run compiled production build                  |

---

## 📁 Project Structure

```
stellar-way-server/
├── src/
│   ├── index.ts                  # App entry point
│   └── app/
│       ├── config/               # Environment config, DB connection
│       ├── routes/               # Global route aggregator
│       ├── middlewares/          # Error handler, auth middleware
│       ├── modules/              # Feature modules (user, order, rider, etc.)
│       │   └── [module]/
│       │       ├── model.ts
│       │       ├── controller.ts
│       │       ├── service.ts
│       │       ├── route.ts
│       │       └── validation.ts
│       └── utils/
│           ├── socket.ts         # Socket.IO setup
│           └── ...
├── dist/                         # Compiled output (after build)
├── .env                          # Environment variables (do not commit)
├── tsconfig.json
└── package.json
```

---

## 🔌 API Base URL

```
/api/v1
```

### API Modules

| Prefix                   | Module           | Description                      |
| ------------------------ | ---------------- | -------------------------------- |
| `/api/v1/auth`           | User             | Register, login, logout, profile |
| `/api/v1/menu`           | Menu             | CRUD for menu items              |
| `/api/v1/categories`     | Category         | Menu categories                  |
| `/api/v1/orders`         | Order            | Place, update, cancel orders     |
| `/api/v1/bookings`       | Booking          | Table/service reservations       |
| `/api/v1/event-bookings` | Event Booking    | Book events                      |
| `/api/v1/riders`         | Rider            | Rider applications, assignments  |
| `/api/v1/tracking`       | Tracking         | Real-time delivery tracking      |
| `/api/v1/chats`          | Chat             | Customer ↔ rider chat rooms      |
| `/api/v1/messages`       | Message          | Chat messages                    |
| `/api/v1/notifications`  | Notification     | Push/in-app notifications        |
| `/api/v1/chefs`          | Chef             | Chef profiles and management     |
| `/api/v1/events`         | Event            | Event listings                   |
| `/api/v1/gallery`        | Gallery          | Restaurant image gallery         |
| `/api/v1/blogs`          | Blog             | Blog posts                       |
| `/api/v1/faq`            | FAQ              | Frequently asked questions       |
| `/api/v1/feedback`       | Feedback         | Customer feedback & reviews      |
| `/api/v1/contact`        | Contact          | Contact form submissions         |
| `/api/v1/offer`          | Offer            | Discounts and promotions         |
| `/api/v1/table`          | Table            | Restaurant table management      |
| `/api/v1/settings`       | Settings         | Platform-wide settings           |
| `/api/v1/analytics`      | Analytics        | Orders, revenue, user stats      |
| `/api/v1/stats`          | Restaurant Stats | Restaurant-specific statistics   |
| `/api/v1/owner-message`  | Owner Message    | Direct messages to/from owner    |
| `/api/v1/uploads`        | Upload           | File/image upload via Cloudinary |

> Full API documentation coming soon.

---

## 🔌 Real-Time Events (Socket.IO)

| Event             | Direction       | Description                 |
| ----------------- | --------------- | --------------------------- |
| `order:update`    | Server → Client | Order status changed        |
| `rider:location`  | Client → Server | Rider sends GPS coordinates |
| `message:send`    | Client → Server | Send chat message           |
| `message:receive` | Server → Client | Receive chat message        |

---

## 🌍 Allowed Origins (CORS)

The following frontend origins are whitelisted:

- `https://stellar-way.vercel.app` — Customer app
- `https://stellar-way-coral.vercel.app` — Customer app (alternate)
- `https://stellar-way-admin.vercel.app` — Admin panel
- `https://stellar-way.onrender.com` — Render deployment
- `http://localhost:3000` — Local development

---

## 🚢 Deployment

This server is hosted on **Render**.

### Steps to Deploy on Render

1. Push your repository to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm run start`
5. Add all environment variables in the Render dashboard
6. Deploy

> Render spins down free-tier services after inactivity. The first request may take ~30s to cold-start.

---

## 🔐 Security Notes

- All passwords are hashed using **bcrypt** before storage
- JWT access tokens are short-lived; refresh tokens handle re-authentication
- Sensitive keys (`JWT secrets`, `Stripe keys`, `DB URI`) must never be committed
- CORS is restricted to known frontend origins only

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

> Part of the [Stellar Way](https://github.com/imamhossenbu/stellar-way) platform · Powered by [Express.js](https://expressjs.com) & [Socket.IO](https://socket.io)
