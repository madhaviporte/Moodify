const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");
const { hashToken } = require("../middlewares/auth.middleware");

function getCookieOptions() {
    const jwtExpiryMs = 3 * 24 * 60 * 60 * 1000;
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        path: "/",
        maxAge: jwtExpiryMs
    };
}

function isValidEmail(email) {
    return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidUsername(username) {
    return typeof username === "string" && username.trim().length >= 3 && username.trim().length <= 30;
}

function isValidPassword(password) {
    return typeof password === "string" && password.length >= 6;
}

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "Email, username, and password are required" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isValidUsername(username)) {
        return res.status(400).json({ message: "Username must be between 3 and 30 characters" });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    const isAlreadyRegistered = await userModel.findOne({
        $or: [
            { email: trimmedEmail },
            { username: trimmedUsername }
        ]
    });

    if (isAlreadyRegistered) {
        return res.status(400).json({
            message: "User with the same email or username already exists"
        });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username: trimmedUsername,
        email: trimmedEmail,
        password: hash
    });

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );

    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function loginUser(req, res) {
    const { email, password, username } = req.body;

    if ((!email && !username) || !password) {
        return res.status(400).json({ message: "Email/username and password are required" });
    }

    const conditions = [];
    if (email) conditions.push({ email: email.trim().toLowerCase() });
    if (username) conditions.push({ username: username.trim() });

    const user = await userModel.findOne({
        $or: conditions
    }).select("+password");

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    );

    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function getMe(req, res) {
    const user = await userModel.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User fetched successfully",
        user
    });
}

async function logoutUser(req, res) {
    const token = req.cookies.token;

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        path: "/"
    });

    if (!token) {
        return res.status(200).json({ message: "Logout successfully." });
    }

    const tokenHash = hashToken(token);

    try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
            const ttlSeconds = Math.max(decoded.exp - Math.floor(Date.now() / 1000), 0);
            if (ttlSeconds > 0) {
                await redis.set("blacklist:" + tokenHash, "1", "EX", ttlSeconds);
            }
        }
    } catch (err) {
        await redis.set("blacklist:" + tokenHash, "1", "EX", 3 * 24 * 60 * 60);
    }

    res.status(200).json({ message: "Logout successfully." });
}

module.exports = { registerUser, loginUser, getMe, logoutUser };