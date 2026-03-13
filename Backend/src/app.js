const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const path = require("path")

const app = express()
app.use(express.json());
app.use(cookieParser());

// ✅ CSP header middleware
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' https: 'unsafe-inline'"
  );
  next();
});


const isDev = process.env.NODE_ENV !== "production";

if(isDev){
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
}
if(!isDev){
app.use(express.static(path.join(__dirname, "./public")))
app.get((req,res)=>{
    res.sendFile(path.join(__dirname, "../public/index.html"));
})
}
// Routes

const authRoutes = require("./routes/auth.routes")
const songRoutes = require("./routes/song.routes")

app.use("/api/auth", authRoutes)
app.use("/api/songs", songRoutes)

//Dynamic port

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports=app