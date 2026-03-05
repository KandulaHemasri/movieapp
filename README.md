# 🎬 MovieMood – AI Based Movie Recommendation App

MovieMood is a **React + Vite movie recommendation web application** that suggests movies based on the user's **mood or search query**.
It uses **Google Gemini AI** to interpret the user's mood and **TMDB API** to fetch movie details such as posters, ratings, and descriptions.

The application provides a **fast, responsive, and user-friendly interface** for discovering movies.

---
# Demo Link - https://movieapp-dmtd.vercel.app/
# 🚀 Features

* 🔍 **Search Movies by Name**
* 😊 **Mood-Based Movie Suggestions** (Happy, Romance, Horror, etc.)
* 🎥 **Movie Posters and Details**
* ⭐ **Movie Ratings**
* 🧠 **AI-powered movie suggestions using Gemini**
* 📱 **Fully Responsive (Mobile + Desktop)**
* 🔄 **Home navigation resets to original movie list**
* ⏳ **Loading message while fetching movies**

---

# 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* CSS

### Backend
* Node.js
  
### APIs

* Google Gemini AI API
* TMDB (The Movie Database) API

---

# 🔑 API Services Used

## 1️⃣ TMDB API

Used to fetch:

* Movie title
* Movie poster
* Ratings
* Overview

Website:
https://www.themoviedb.org/



---

# 📱 Responsive Design

The application is optimized for:

* Desktop
* Mobile devices

Media queries ensure smooth UI across all screen sizes.

---

# ⏳ Loading Feature

While fetching movie data from the API, the app shows:

```
Please wait... Fetching movies
```

This improves **user experience during API delays**.

---

# ❗ Error Handling

The application handles common errors:

* Movie not found
* API connection failure
* AI fallback response
* Network errors

