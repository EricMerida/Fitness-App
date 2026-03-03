const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SALT_ROUNDS = 12;

async function register(req, res, next) {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

        const existing = await User.findOne({ username });
        if (existing) return res.status(409).json({ error: "Username already exists" });

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({ username, passwordHash });

        return res.status(201).json({ id: user._id, username: user.username });
    } catch (err) {
        return next(err);
    }
}

async function login(req, res, next) {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { sub: String(user._id), username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({ token });
    } catch (err) {
        return next(err);
    }
}

module.exports = { register, login };
