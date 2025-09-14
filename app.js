const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const serverless = require("serverless-http");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/boilerplate");

// Redirect root to /CFC
app.get("/", (req, res) => {
  res.redirect("/CFC");
});

app.get("/CFC", (req, res) => {
  res.render("index");
});

app.get("/CFC/calculate", (req, res) => {
  res.render("calculate");
});

app.post("/calculate", (req, res) => {
  const { vehicleType, distance, electricity, cookingFuel, dietType, waste, recycle } = req.body;

  let footprint = 0;
  let transportFactor = 0;

  if (vehicleType === "car") transportFactor = 0.2;
  if (vehicleType === "bike") transportFactor = 0.1;
  if (vehicleType === "bus") transportFactor = 0.1;
  if (vehicleType === "train") transportFactor = 0.04;
  if (vehicleType === "plane") transportFactor = 0.25;

  footprint += (parseFloat(distance) || 0) * 52 * transportFactor;
  footprint += (parseFloat(electricity) || 0) * 12 * 0.9;
  footprint += (parseFloat(cookingFuel) || 0) * 12 * 41;

  if (dietType === "veg") footprint += 1700;
  else if (dietType === "nonveg") footprint += 2500;
  else if (dietType === "vegan") footprint += 1500;
  else if (dietType === "mixed") footprint += 2000;

  let wasteEmission = (parseFloat(waste) || 0) * 52 * 0.45;
  if (recycle === "yes") wasteEmission *= 0.7;
  footprint += wasteEmission;

  res.render("result", { footprint: footprint.toFixed(2) });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/learn", (req, res) => {
  res.render("learn");
});

// Run locally only
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/CFC`);
  });
}

module.exports.handler = serverless(app);