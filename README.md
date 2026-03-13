# 🎧 Moodify – Mood Based Music Recommendation Platform

Moodify is a full-stack web application that recommends music based on a user’s facial expression.
The platform combines authentication, face expression detection, and a music player to create a personalized listening experience.

Users first create an account through the registration system. After logging in, the application opens a camera interface that detects the user's facial expression. Based on the detected emotion, the system selects and plays a suitable song.

The project focuses on integrating a modern frontend with a scalable backend architecture, including authentication, caching, and media handling.

---

## 🚀 Key Features

* User **Registration and Login System**
* Secure **JWT Authentication**
* **Logout with Token Blacklisting**
* **Face Expression Detection**
* **Mood Based Song Recommendation**
* Built-in **Music Player**
* **Image Upload and Media Handling**
* Backend **API testing with Postman**
* **Caching and session management using Redis**

---

## 🧩 How the Application Works

1. A new user registers using the registration form.
2. The account is stored securely in the database.
3. The user logs into the application using their credentials.
4. After login, the system opens the expression detection interface.
5. The user's facial expression is detected.
6. Based on the detected mood, a suitable song is fetched from the server.
7. The song is played using the integrated player.

---

## 🛠 Tech Stack

### Frontend

* React.js
* SCSS
* JavaScript
* Vite

### Backend

* Node.js
* Express.js
* REST API Architecture

### Database

* MongoDB

### Caching

* Redis

### Authentication & Security

* JWT (JSON Web Tokens)
* Token Blacklisting for Logout

### Media Handling

* ImageKit (for image storage and delivery)

### Development Tools

* Postman (API Testing)
* Git & GitHub

---

## 🔐 Authentication System

The platform implements a secure authentication flow:

* **User Registration**
* **User Login**
* **JWT Token Generation**
* **Protected Routes**
* **Logout with Token Blacklisting using Redis**

Blacklisting ensures that logged-out tokens cannot be reused, improving application security.

---

## 🗂 Project Structure

```
Moodify
│
├── client        # React frontend
│
├── server        # Node.js / Express backend
│
├── controllers
├── models
├── routes
├── middleware
│
└── README.md
```

---

## ⚙️ Environment Variables

The application uses environment variables for secure configuration.

Examples include:

* JWT Secret
* Redis Host
* Redis Port
* Redis Password
* MongoDB Connection URI
* ImageKit Public Key
* ImageKit Private Key
* ImageKit URL Endpoint

These variables are stored in a `.env` file and are not committed to the repository.

---

## 📡 API Testing

All backend routes were tested using **Postman** to verify:

* Authentication routes
* Expression detection endpoints
* Song fetching APIs
* User session management

---

## 📌 Future Improvements

* Integration with external music APIs (e.g., Spotify)
* Playlist generation based on mood history
* Improved UI animations and transitions
* Mobile responsive enhancements

---

## 👩‍💻 Author

**Madhavi Porte**

This project was built as part of a learning journey in full-stack development, focusing on combining authentication, backend APIs, and interactive frontend features into a single application.

If you found this project interesting, feel free to explore the code and give the repository a ⭐.
