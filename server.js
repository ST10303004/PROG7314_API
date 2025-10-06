const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Use Render's dynamic port if available
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Fake properties list (you can later connect to Firestore or MongoDB)
let properties = [
  {
    id: 1,
    title: "2BR Apartment",
    price: 750000,
    bedrooms: 2,
    bathrooms: 1,
    type: "Apartment",
    location: "Sandton"
  },
  {
    id: 2,
    title: "3BR House",
    price: 1250000,
    bedrooms: 3,
    bathrooms: 2,
    type: "House",
    location: "Soweto"
  }
];

// ✅ GET properties (supports filters if needed)
app.get("/properties", (req, res) => {
  let { minPrice, maxPrice, bedrooms, bathrooms, type } = req.query;

  minPrice = parseInt(minPrice) || 0;
  maxPrice = parseInt(maxPrice) || Number.MAX_SAFE_INTEGER;
  bedrooms = bedrooms ? parseInt(bedrooms) : null;
  bathrooms = bathrooms ? parseInt(bathrooms) : null;
  type = type ? type.toLowerCase() : null;

  let results = properties.filter(
    p =>
      p.price >= minPrice &&
      p.price <= maxPrice &&
      (!bedrooms || p.bedrooms === bedrooms) &&
      (!bathrooms || p.bathrooms === bathrooms) &&
      (!type || p.type.toLowerCase() === type)
  );

  res.json(results);
});

// ✅ POST property
app.post("/properties", (req, res) => {
  const { title, price, bedrooms, bathrooms, type, location } = req.body;

  if (!title || !price || !type) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newProperty = {
    id: properties.length + 1,
    title,
    price,
    bedrooms: parseInt(bedrooms),
    bathrooms: parseInt(bathrooms),
    type,
    location
  };

  properties.push(newProperty);
  res.status(201).json({
    message: "Property added successfully",
    property: newProperty
  });
});

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("🏡 HomeFinder API is running!");
});

// ✅ Start the server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
