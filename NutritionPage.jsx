import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { listMealsApi, createMealApi, deleteMealApi } from "../api/mealsApi";
import { searchFoodsApi } from "../api/foodsApi";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function NutritionPage() {
  const { token } = useAuth();
  const qc = useQueryClient();

  const [date, setDate] = useState(todayISO());

  // add form
  const [mealType, setMealType] = useState("breakfast");
  const [name, setName] = useState("");
  const [servingSize, setServingSize] = useState("1 serving");
  const [quantity, setQuantity] = useState(1);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);

  // search
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchErr, setSearchErr] = useState("");

  const queryKey = useMemo(() => ["meals", date], [date]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => listMealsApi(token, date),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createMealApi(token, payload),
    onSuccess: () => {
      setName("");
      setServingSize("1 serving");
      setQuantity(1);
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFats(0);
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMealApi(token, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  async function runSearch() {
    setSearchErr("");
    try {
      if (!search.trim()) return;
      const res = await searchFoodsApi(token, search.trim());
      setResults(res.foods || []);
    } catch (e) {
      setSearchErr(e.message);
    }
  }

  const totals = data?.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 };

  return (
    <div className="pageStack">
      {/* Header */}
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Nutrition</h1>
          <p className="pageSubtitle">Log meals + track macros</p>
        </div>

        <div className="pageHeaderRight">
          <div className="dateWrap">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Link to="/" className="chipLink">
            ← Homepage
          </Link>
        </div>
      </div>

      {/* Totals */}
      <div className="grid4">
        <Card>
          <div className="kicker">Calories</div>
          <div className="statBig">{Math.round(totals.calories)}</div>
        </Card>
        <Card>
          <div className="kicker">Protein</div>
          <div className="statBig">{Math.round(totals.protein)} g</div>
        </Card>
        <Card>
          <div className="kicker">Carbs</div>
          <div className="statBig">{Math.round(totals.carbs)} g</div>
        </Card>
        <Card>
          <div className="kicker">Fats</div>
          <div className="statBig">{Math.round(totals.fats)} g</div>
        </Card>
      </div>

      {/* USDA Search */}
      <Card>
        <h2 className="sectionTitle">Search foods (USDA)</h2>

        <div className="row">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g., banana"
          />
          <Button onClick={runSearch}>Search</Button>
        </div>

        {searchErr && <p className="errorText">{searchErr}</p>}

        <div className="stack">
          {results.map((f) => (
            <div key={f.fdcId} className="rowCard">
              <div>
                <div className="rowTitle">{f.name}</div>
                <div className="muted">
                  Cals {Math.round(f.macros.calories)} • P {Math.round(f.macros.protein)} • C{" "}
                  {Math.round(f.macros.carbs)} • F {Math.round(f.macros.fats)}
                </div>
              </div>

              <Button
                onClick={() => {
                  setName(f.name);
                  setServingSize(f.servingSize || "100g");
                  setCalories(f.macros.calories || 0);
                  setProtein(f.macros.protein || 0);
                  setCarbs(f.macros.carbs || 0);
                  setFats(f.macros.fats || 0);
                }}
              >
                Use
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Food */}
      <Card>
        <h2 className="sectionTitle">Add food</h2>

        <div className="formGrid">
          <div className="field">
            <label className="fieldLabel">Meal type</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="select"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className="field">
            <label className="fieldLabel">Quantity</label>
            <Input
              type="number"
              min="0"
              step="0.25"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="field span2">
            <label className="fieldLabel">Food name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Greek yogurt"
            />
          </div>

          <div className="field span2">
            <label className="fieldLabel">Serving size</label>
            <Input
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              placeholder="1 cup"
            />
          </div>

          <div className="field">
            <label className="fieldLabel">Calories</label>
            <Input type="number" min="0" value={calories} onChange={(e) => setCalories(e.target.value)} />
          </div>
          <div className="field">
            <label className="fieldLabel">Protein (g)</label>
            <Input type="number" min="0" value={protein} onChange={(e) => setProtein(e.target.value)} />
          </div>
          <div className="field">
            <label className="fieldLabel">Carbs (g)</label>
            <Input type="number" min="0" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
          </div>
          <div className="field">
            <label className="fieldLabel">Fats (g)</label>
            <Input type="number" min="0" value={fats} onChange={(e) => setFats(e.target.value)} />
          </div>
        </div>

        <div className="stack">
          <Button
            className="btnBlock"
            disabled={createMutation.isPending || !name.trim()}
            onClick={() =>
              createMutation.mutate({
                date,
                mealType,
                name: name.trim(),
                servingSize: servingSize.trim() || "1 serving",
                quantity: Number(quantity) || 1,
                macros: {
                  calories: Number(calories) || 0,
                  protein: Number(protein) || 0,
                  carbs: Number(carbs) || 0,
                  fats: Number(fats) || 0,
                },
                source: results.length ? "usda" : "custom",
              })
            }
          >
            {createMutation.isPending ? "Adding..." : "Add food"}
          </Button>

          {createMutation.isError && (
            <p className="errorText">{createMutation.error.message}</p>
          )}
        </div>
      </Card>

      {/* Meals List */}
      {isLoading && (
        <Card>
          <p className="muted">Loading meals...</p>
        </Card>
      )}

      {isError && (
        <Card>
          <p className="errorText">{error.message}</p>
        </Card>
      )}

      {data?.items?.length === 0 && (
        <Card>
          <p className="muted">No foods logged for this date.</p>
        </Card>
      )}

      <div className="stack">
        {data?.items?.map((m) => (
          <Card key={m._id}>
            <div className="rowCard">
              <div>
                <div className="rowTitle">
                  {m.name} <span className="muted">({m.mealType})</span>
                </div>
                <div className="muted">{m.quantity} × {m.servingSize}</div>
                <div className="muted">
                  Calories {m.macros?.calories || 0} • P {m.macros?.protein || 0} • C{" "}
                  {m.macros?.carbs || 0} • F {m.macros?.fats || 0}
                </div>
              </div>

              <Button
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(m._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
