const express = require("express");
const cookiePasrser = require("cookie-parser");
const cors = require("cors")
const path = require("path")

const app = express()
app.use(express.json());
app.use(cookiePasrser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.static("./public"))

// Routes

const authRoutes = require("./routes/auth.routes")
const songRoutes = require("./routes/song.routes")

app.use("/api/auth", authRoutes)
app.use("/api/songs", songRoutes)

module.exports=app