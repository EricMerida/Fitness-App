require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const { authRequired } = require("./middlewares/auth");
const mealRoutes = require("./routes/meals.routes");
const authRoutes = require("./routes/auth.routes");
const workoutRoutes = require("./routes/workouts.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const profileRoutes = require("./routes/profile.routes");
const foodsRoutes = require("./routes/foods.routes");
const app = express();


app.use(
  cors({
    origin: "https://your-frontend-domain.vercel.app",
    credentials: true
  })
);
app.use(express.json());
app.use("/meals", mealRoutes);
app.use("/workouts", workoutRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/profile", profileRoutes);
app.use("/foods", foodsRoutes);
app.get("/", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);

//protected route to prove jwt works
app.get("/me", authRequired, (req, res) => {
    res.json({ user: req.user });
});

//Basic error handling
app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Server error" });
});

async function start() {
    await connectDB(process.env.MONGO_URI);
    const port = process.env.PORT || 5050;
    app.listen(port, () => console.log(`Server listening on ${port} `));
}

if (require.main === module) {
    start().catch(err => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
}
module.exports = app;
