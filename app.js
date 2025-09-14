const express = require("express");
const serverless = require("serverless-http");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.set("layout", "layouts/boilerplate");

// Redirect root to /CFC
app.get("/", (req, res) => res.redirect("/CFC"));

app.get("/CFC", 
  (req, res) => 
    res.render("index"));

app.get("/CFC/calculate",
   (req, res) => 
    res.render("calculate"));

app.get("/about", 
  (req, res) => 
    res.render("about"));

app.get("/learn", 
  (req, res) => 
    res.render("learn"));

app.post("/calculate", (req, res) => {
  const { vehicleType, distance, electricity, cookingFuel, dietType, waste, recycle } = req.body;
  let footprint = 0;
  let transportFactor = { car: 0.2, bike: 0.1, bus: 0.1, train: 0.04, plane: 0.25 }[vehicleType] || 0;
  footprint += (parseFloat(distance) || 0) * 52 * transportFactor;
  footprint += (parseFloat(electricity) || 0) * 12 * 0.9;
  footprint += (parseFloat(cookingFuel) || 0) * 12 * 41;
  footprint += { veg: 1700, nonveg: 2500, vegan: 1500, mixed: 2000 }[dietType] || 0;
  let wasteEmission = (parseFloat(waste) || 0) * 52 * 0.45;
  if (recycle === "yes") wasteEmission *= 0.7;
  footprint += wasteEmission;
  res.render("result", { footprint: footprint.toFixed(2) });
});

// Export for Vercel
module.exports = serverless(app);
