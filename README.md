# 🌍 Endless Explorer — Travel Booking Website

<div align="center">

![Endless Explorer Banner](https://img.shields.io/badge/Endless_Explorer-Travel_Website-ff6b1a?style=for-the-badge&logo=airplane&logoColor=white)

**A modern, full-stack travel booking website with lead capture system, admin dashboard, and cinematic UI.**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

</div>

---

## 📖 About The Project

**Endless Explorer** is a fully functional travel booking website built for a real travel agency. Instead of a traditional booking flow, it uses a **lead capture strategy** — automatically prompting visitors to share their contact details, which are stored in a MongoDB database and managed via a secure admin dashboard.

### 🎯 Problem Solved
Most small travel agencies lose potential customers because visitors browse and leave without contacting them. This website solves that by:
- Capturing visitor details via an auto-popup after 10 seconds
- Providing instant WhatsApp & Call buttons for direct communication
- Giving the agency owner a real-time dashboard to manage all inquiries

---

## ✨ Key Features

### 🌐 User-Facing Website
- 🎬 **Cinematic Hero Slideshow** — Auto-rotating background images with smooth transitions
- 🌓 **Dark/Light Theme Toggle** — User preference saved in localStorage
- ⏱️ **Smart Lead Capture Popup** — Appears after 30 seconds, 24-hour cooldown after submission
- 💬 **Floating WhatsApp & Call Buttons** — With pulse animation for attention
- 🔍 **Advanced Package Search** — Filter by category, sort by price/rating
- 📦 **Dynamic Package Cards** — Loaded from MongoDB via REST API
- 📱 **Fully Responsive** — Mobile-first design with hamburger menu
- 🎨 **Glassmorphism UI** — Modern frosted-glass effects
- ⚡ **Scroll Animations** — Elements fade in as you scroll (IntersectionObserver API)

### 🔐 Admin Dashboard
- 🔑 **Password-Protected Access** — Secure admin authentication
- 📊 **Real-Time Statistics** — Total leads, today's leads, conversions
- 📋 **Lead Management** — View, update status (New → Called → Confirmed → Completed)
- 📞 **One-Click Contact** — Call/WhatsApp leads directly from dashboard
- 🎒 **Package CRUD Operations** — Add, edit, delete tour packages
- 🖼️ **Image Upload Support** — Multi-file upload via Multer
- 🗑️ **Lead Deletion** — Clean up test/spam entries

### ⚙️ Technical Features
- 🔄 RESTful API architecture
- 🗄️ MongoDB Atlas cloud database
- 🔒 CORS-enabled backend
- 📦 Modular code structure
- 🎯 Environment variables for secrets
- 🚀 Zero framework dependencies on frontend (pure vanilla JS)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic markup structure |
| **CSS3** | Custom properties, Grid, Flexbox, Animations |
| **Vanilla JavaScript** | ES6+ classes, async/await, Fetch API |
| **Font Awesome** | Icons (CDN) |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework & routing |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **Multer** | File upload middleware |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

### Deployment (Recommended)
- **Frontend:** Netlify / Vercel / GitHub Pages
- **Backend:** Render / Railway / Cyclic
- **Database:** MongoDB Atlas
- **Images:** Cloudinary (optional)

---

## 📂 Project Structure

```
endless-explorer/
│
├── backend/
│   ├── uploads/              # Uploaded package images
│   ├── node_modules/
│   ├── .env                  # Environment variables (not in git)
│   ├── package.json
│   └── server.js             # Main backend server
│
├── frontend/
│   ├── assets/
│   │   └── images/           # Hero slideshow images
│   │       ├── hero-1.jpg
│   │       ├── hero-2.jpg
│   │       └── ...
│   │
│   ├── css/
│   │   └── style.css         # All styling (theme, animations, responsive)
│   │
│   ├── js/
│   │   └── main.js           # Frontend logic (slideshow, popup, API calls)
│   │
│   ├── index.html            # Homepage
│   └── admin.html            # Admin dashboard
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (free tier works)
- [VS Code](https://code.visualstudio.com/) with Live Server extension

### Installation

#### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/endless-explorer.git
cd endless-explorer
```

#### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/endless-explorer
PORT=5000
ADMIN_PASSWORD=YourSecurePassword@2024
```

Start the backend server:
```bash
node server.js
```

You should see:
```
MongoDB Connected
Server running on port 5000
```

#### 3️⃣ Setup Frontend

In VS Code:
1. Right-click on `frontend/index.html`
2. Select **"Open with Live Server"**
3. Website will open at `http://127.0.0.1:5500/index.html`

#### 4️⃣ Access Admin Panel
- URL: `http://127.0.0.1:5500/admin.html`
- Password: (whatever you set in `.env`)

---

## 🎨 Adding Content

### Adding Hero Slideshow Images
1. Download HD travel images from [Unsplash](https://unsplash.com) or [Pexels](https://pexels.com)
2. Save them in `frontend/assets/images/` as `hero-1.jpg`, `hero-2.jpg`, etc.
3. Recommended size: **1920x1080** (Full HD)

### Adding Tour Packages (Admin)
1. Login to admin panel
2. Go to **"Add Package"** tab
3. Fill in details (title, price, description, images, etc.)
4. Click **"Add Package"**
5. Package will instantly appear on the homepage

---

## 📡 API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/packages` | Get all active packages |
| `GET` | `/api/packages/:slug` | Get single package by slug |
| `POST` | `/api/leads` | Submit lead form |

### Admin Endpoints (Requires `x-admin-password` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/stats` | Dashboard statistics |
| `GET` | `/api/admin/leads` | Get all leads |
| `PATCH` | `/api/admin/leads/:id` | Update lead status |
| `DELETE` | `/api/admin/leads/:id` | Delete a lead |
| `GET` | `/api/admin/packages` | Get all packages (including inactive) |
| `POST` | `/api/admin/packages` | Add new package |
| `PUT` | `/api/admin/packages/:id` | Update package |
| `DELETE` | `/api/admin/packages/:id` | Delete package |

### Example API Request
```javascript
// Fetch packages with filters
fetch('http://localhost:5000/api/packages?category=Beach&sort=price-low')
  .then(res => res.json())
  .then(data => console.log(data));

// Submit a lead
fetch('http://localhost:5000/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    phone: '9876543210',
    message: 'Interested in Goa trip'
  })
});
```

---

## 🗄️ Database Schema

### `packages` Collection
```javascript
{
  title: String,
  slug: String,
  destination: String,
  description: String,
  price: Number,
  originalPrice: Number,
  duration: String,
  groupSize: String,
  difficulty: String,
  category: String,
  highlights: [String],
  itinerary: [{ day: Number, title: String, details: String }],
  inclusions: [String],
  exclusions: [String],
  images: [String],
  rating: Number,
  reviewCount: Number,
  featured: Boolean,
  isActive: Boolean,
  createdAt: Date
}
```

### `leads` Collection
```javascript
{
  name: String,
  phone: String,
  email: String,
  message: String,
  source: String,        // "popup" or "contact-form"
  page: String,
  status: String,        // "new", "called", "confirmed", "completed"
  adminNotes: String,
  createdAt: Date
}
```

---

## 🎯 How It Works

### Lead Capture Flow
```
User visits website
       ↓
Browses packages
       ↓
10 seconds elapsed → Popup appears
       ↓
User fills form (Name, Phone, Message)
       ↓
POST /api/leads → MongoDB save
       ↓
Success message + 24hr cooldown set
       ↓
Admin sees lead in dashboard
       ↓
Admin calls/WhatsApps user
       ↓
Status updated: New → Called → Confirmed
```

### Theme Toggle Logic
- User clicks moon/sun icon
- JavaScript changes `data-theme` attribute on `<html>`
- CSS variables automatically switch (light ↔ dark)
- Preference saved in `localStorage` for future visits

### Hero Slideshow Logic
- 5 background images preloaded
- Random image shown on page load
- Auto-rotates every 6 seconds
- Pauses on hover
- Clickable indicator dots for manual navigation
- Smooth 1.5s fade transitions

---

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications (Nodemailer)
- [ ] User reviews & ratings system
- [ ] Multi-language support (i18n)
- [ ] Blog section for travel tips
- [ ] SEO optimization with meta tags
- [ ] Google Analytics integration
- [ ] Booking calendar with date picker
- [ ] Image gallery for each package
- [ ] Progressive Web App (PWA) support

---

## 📸 Screenshots

> Add screenshots of your website here after taking them

- Homepage with slideshow
- Package cards grid
- Popup form
- Admin dashboard
- Mobile responsive view

---

## 🐛 Known Issues

- Images must be manually optimized before upload for best performance
- Admin authentication uses basic password (recommend upgrading to JWT for production)
- No email confirmation system currently

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Priyanshu Nautiyal**

- GitHub: [priyanshu-nautiyal](https://github.com/your-username)
- LinkedIn: [Priyanshu Nautiyal](https://linkedin.com/in/your-profile)
- Email: rn7nautiyal555@gmail.com

---

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) — Free HD travel images
- [Font Awesome](https://fontawesome.com) — Icon library
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Free database hosting
- Built with ❤️ for travel enthusiasts

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with 💻 and 🌿🚬 by Priyanshu Nautiyal

</div>