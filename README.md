# 📹 Yappr — Language Exchange with Video Calls

Yappr is a full-stack language exchange platform where users can find language partners, chat in real time, and jump into video calls — all in one place. Built with React, Node.js, MongoDB, and Stream.

---

## 🌟 Features

- 🔐 **JWT Authentication** — Secure cookie-based signup, login, and logout
- 🧭 **Onboarding Flow** — Set your native language, learning language, bio, location, and profile avatar
- 🤝 **Friend System** — Send, accept, and track friend requests; view incoming and accepted notifications
- 🌍 **User Discovery** — Browse onboarded users you haven't friended yet, filtered from your existing connections
- 💬 **Real-Time Chat** — Powered by Stream Chat with full message history, threads, and input
- 📹 **Video Calls** — One-click video calls via Stream Video SDK; share call links directly in chat
- 🎨 **32 Themes** — DaisyUI theme switcher (Dracula, Synthwave, Forest, Nord, and more) with Zustand-persisted preference
- 🏳️ **Language Flags** — Country flag icons for native and learning languages via flagcdn.com
- 📱 **Responsive Layout** — Sidebar visible on desktop (lg+), collapsed on mobile

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v7 | Client-side routing |
| TanStack Query | Server state, caching, mutations |
| Zustand | Client state (theme persistence) |
| Stream Chat React | Real-time messaging UI |
| Stream Video React SDK | Video calling UI |
| DaisyUI + Tailwind CSS | Component styling & theming |
| Axios | HTTP client |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens | Auth tokens (stored in HTTP-only cookies) |
| bcryptjs | Password hashing |
| Stream Chat (server SDK) | User upsert & token generation |
| dotenv | Environment config |

---

## 📁 Project Structure

```
Yappr-video-calls1/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js      # signup, login, logout, onboard
│   │   ├── user.controller.js      # friends, recommendations, friend requests
│   │   └── chat.controller.js      # Stream token generation
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT protectRoute guard
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt hooks
│   │   └── FriendRequest.js        # Sender/recipient/status schema
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   └── chat.route.js
│   └── lib/
│       ├── db.js                   # MongoDB connection
│       └── stream.js               # Stream client, upsertUser, generateToken
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── HomePage.jsx         # Friends grid + user discovery
        │   ├── ChatPage.jsx         # Stream Chat UI + video call trigger
        │   ├── CallPage.jsx         # Stream Video SDK call room
        │   ├── NotificationPage.jsx # Incoming & accepted friend requests
        │   ├── OnboardingPage.jsx   # Profile setup after signup
        │   ├── LoginPage.jsx
        │   └── SignUpPage.jsx
        ├── components/
        │   ├── Layout.jsx           # Sidebar + Navbar wrapper
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── FriendCard.jsx       # Friend card with language badges
        │   ├── CallButton.jsx       # Video call trigger in chat
        │   ├── ThemeSelector.jsx    # 32-theme palette dropdown
        │   ├── ChatLoader.jsx
        │   ├── PageLoader.jsx
        │   ├── NoFriendsFound.jsx
        │   └── NoNotificationsFound.jsx
        ├── hooks/
        │   ├── useAuthUser.js
        │   ├── useLogin.js
        │   ├── useLogout.js
        │   └── useSignUp.js
        ├── lib/
        │   ├── api.js               # All Axios API calls
        │   ├── axios.js             # Axios instance with base URL + credentials
        │   └── utils.js             # capitalize helper
        ├── store/
        │   └── useThemeStore.js     # Zustand theme store (localStorage)
        ├── constants/
        │   └── index.js             # THEMES, LANGUAGES, LANGUAGE_TO_FLAG
        ├── App.jsx                  # Routes + auth guards
        ├── main.jsx                 # React root + QueryClient + BrowserRouter
        └── index.css                # Tailwind directives + Stream Chat overrides
```

---

## ⚙️ Environment Variables

### Backend — create a `.env` file in `/backend`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
NODE_ENV=development
```

### Frontend — create a `.env` file in `/frontend`:

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- A [Stream](https://getstream.io/) account (for chat & video)

### Installation

```bash
# Clone the repository
git clone https://github.com/saqib7903/Yappr-video-calls1.git
cd Yappr-video-calls1
```

#### Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:5001`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | Login | ❌ |
| POST | `/logout` | Clear JWT cookie | ❌ |
| POST | `/onboarding` | Complete profile setup | ✅ |
| GET | `/me` | Get current user | ✅ |

### Users — `/api/users`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/` | Get recommended users | ✅ |
| GET | `/friends` | Get your friends list | ✅ |
| POST | `/friend-request/:id` | Send a friend request | ✅ |
| PUT | `/friend-request/:id/accept` | Accept a friend request | ✅ |
| GET | `/friend-requests` | Incoming & accepted requests | ✅ |
| GET | `/outgoing-friend-requests` | Your pending sent requests | ✅ |

### Chat — `/api/chat`
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/token` | Get Stream Chat/Video token | ✅ |

---

## 🔄 App Flow

```
Signup → Onboarding → Home (friends + discovery)
                              ↓
                     Send Friend Request
                              ↓
                   Notifications (accept)
                              ↓
                Chat Page (Stream Chat)
                              ↓
               📹 Video Call (Stream Video)
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Saqib**  
GitHub: [@saqib7903](https://github.com/saqib7903)