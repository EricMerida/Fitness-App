const axios = require("axios");

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

async function searchFoods(req, res, next) {
  try {
    const { q, pageSize = 10, pageNumber = 1 } = req.query;
    if (!q) return res.status(400).json({ error: "q query param is required" });
    if (!process.env.USDA_API_KEY) return res.status(500).json({ error: "USDA_API_KEY not set" });

    const response = await axios.get(`${USDA_BASE_URL}/foods/search`, {
      params: {
        api_key: process.env.USDA_API_KEY,
        query: q,
        pageSize,
        pageNumber,
      },
      timeout: 15000,
    });

    const foods = (response.data.foods || []).map((food) => {
      const nutrients = food.foodNutrients || [];
      const get = (name) => nutrients.find((n) => n.nutrientName === name)?.value ?? 0;

      return {
        fdcId: food.fdcId,
        name: food.description,
        brand: food.brandName || "",
        servingSize: food.servingSize ? `${food.servingSize}${food.servingSizeUnit || ""}` : "100g",
        macros: {
          calories: get("Energy"),
          protein: get("Protein"),
          carbs: get("Carbohydrate, by difference"),
          fats: get("Total lipid (fat)"),
        },
      };
    });

    return res.json({
      query: q,
      totalHits: response.data.totalHits || 0,
      pageNumber: response.data.currentPage || Number(pageNumber),
      foods,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { searchFoods };