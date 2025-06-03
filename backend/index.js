// backend/index.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", async (req, res) => {
  try {
    res.json({ message: "Hello World" });
  } catch (err) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});


app.get("/recipes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipes");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

app.post("/recipes", async (req, res) => {
  console.log("Reçu dans le backend :", req.body); 
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO recipes (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la recette" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
