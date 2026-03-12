const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const path = require("path")

const app = express()
app.use(express.json());
app.use(cookieParser());

const isDev = process.env.NODE_ENV !== "production";

if(isDev){
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
}
if(!isDev){
app.use(express.static(path.join(__dirname, "./public")))
app.get("*name", (req,res)=>{
    res.sendFile(path.join(__dirname, "../public", "index.htlm"));
})
}
// Routes

const authRoutes = require("./routes/auth.routes")
const songRoutes = require("./routes/song.routes")

app.use("/api/auth", authRoutes)
app.use("/api/songs", songRoutes)

module.exports=app