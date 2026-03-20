const MealLog = require("../models/MealLog");
const Workout = require("../models/Workout");

function dayStart(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function dayEnd(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function toISODate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

// GET /dashboard?date=YYYY-MM-DD
async function getDashboard(req, res, next) {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "date query param is required (YYYY-MM-DD)" });

    const start = dayStart(date);
    const end = dayEnd(date);

    // Meals for the day
    const meals = await MealLog.find({
      user: req.user.id,
      date: { $gte: start, $lte: end },
    });

    const mealTotals = meals.reduce(
      (acc, m) => {
        const q = Number(m.quantity || 1);
        acc.calories += Number(m.macros?.calories || 0) * q;
        acc.protein += Number(m.macros?.protein || 0) * q;
        acc.carbs += Number(m.macros?.carbs || 0) * q;
        acc.fats += Number(m.macros?.fats || 0) * q;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    // Workouts for the day
    const workouts = await Workout.find({
      user: req.user.id,
      date: { $gte: start, $lte: end },
    });

    const workoutSummary = {
      count: workouts.length,
      totalVolume: workouts.reduce((sum, w) => sum + Number(w.totalVolume || 0), 0),
    };

    // Very simple streak placeholder:
    // streak = number of consecutive days (including selected date) with EITHER a workout OR any meals logged.
    // This is basic and we can improve later (rules, timezones, etc.)
    let streak = 0;
    let cursor = dayStart(date);

    // Limit to 365 days to avoid infinite loops
    for (let i = 0; i < 365; i++) {
      const cs = dayStart(cursor);
      const ce = dayEnd(cursor);

      const [hasWorkout, hasMeal] = await Promise.all([
        Workout.exists({ user: req.user.id, date: { $gte: cs, $lte: ce } }),
        MealLog.exists({ user: req.user.id, date: { $gte: cs, $lte: ce } }),
      ]);

      if (!hasWorkout && !hasMeal) break;

      streak += 1;
      // move to previous day
      cursor = new Date(cs);
      cursor.setDate(cursor.getDate() - 1);
    }

    return res.json({
      date: toISODate(date),
      meals: {
        count: meals.length,
        totals: mealTotals,
      },
      workouts: workoutSummary,
      streak,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getDashboard };