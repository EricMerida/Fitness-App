const MealLog = require("../models/MealLog");

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

async function createMeal(req, res, next) {
  try {
    const { date, mealType, name, servingSize, quantity, macros, source, externalId, barcode } = req.body || {};

    if (!date) return res.status(400).json({ error: "date is required" });
    if (!name) return res.status(400).json({ error: "name is required" });

    const doc = await MealLog.create({
      user: req.user.id,
      date: new Date(date),
      mealType: mealType || "snack",
      name,
      servingSize: servingSize || "1 serving",
      quantity: quantity ?? 1,
      macros: {
        calories: Number(macros?.calories || 0),
        protein: Number(macros?.protein || 0),
        carbs: Number(macros?.carbs || 0),
        fats: Number(macros?.fats || 0),
      },
      source: source || "custom",
      externalId: externalId || null,
      barcode: barcode || null,
    });

    return res.status(201).json(doc);
  } catch (err) {
    return next(err);
  }
}

async function listMeals(req, res, next) {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "date query param is required (YYYY-MM-DD)" });

    const start = dayStart(date);
    const end = dayEnd(date);

    const items = await MealLog.find({
      user: req.user.id,
      date: { $gte: start, $lte: end },
    }).sort({ createdAt: -1 });

    const totals = items.reduce(
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

    return res.json({ date, totals, items });
  } catch (err) {
    return next(err);
  }
}

async function deleteMeal(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await MealLog.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: "meal log not found" });
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createMeal, listMeals, deleteMeal };