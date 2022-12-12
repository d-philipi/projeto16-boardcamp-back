import express from "express";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

app.get("/categories", async (req, res) => {
  const categories = await connection.query("SELECT * FROM categories");
  console.log(categories);
  res.send(categories.rows);
});

app.post("/categories", async (req, res) => {
  const { titulo, ingredientes, preparo } = req.body;

  const result = await connection.query(
    "INSERT INTO receitas (titulo, ingredientes, preparo) VALUES ($1, $2, $3)",
    [titulo, ingredientes, preparo]
  );

  console.log(result)

  res.send(201);
});

app.get("/games", async (req, res) => {
  const receitas = await connection.query("SELECT * FROM receitas");
  console.log(receitas);
  res.send(receitas.rows);
});

app.post("/games", async (req, res) => {
  const { titulo, ingredientes, preparo } = req.body;

  const result = await connection.query(
    "INSERT INTO receitas (titulo, ingredientes, preparo) VALUES ($1, $2, $3)",
    [titulo, ingredientes, preparo]
  );

  console.log(result)

  res.send(201);
});

app.get("/customers", async (req, res) => {
  const receitas = await connection.query("SELECT * FROM receitas");
  console.log(receitas);
  res.send(receitas.rows);
});

app.post("/customers", async (req, res) => {
  const { titulo, ingredientes, preparo } = req.body;

  const result = await connection.query(
    "INSERT INTO receitas (titulo, ingredientes, preparo) VALUES ($1, $2, $3)",
    [titulo, ingredientes, preparo]
  );

  console.log(result)

  res.send(201);
});

app.get("/customers/:id", async (req, res) => {
  const { id } = req.params;

  const result = await connection.query(
    "SELECT * FROM receitas WHERE id = $1;",
    [id]
  );
  console.log(result.rows);
  res.send(result.rows[0]);
});

app.put("/customers/:id", async (req, res) => {
  const { id } = req.params;

  const result = await connection.query(
    "SELECT * FROM receitas WHERE id = $1;",
    [id]
  );
  console.log(result.rows);
  res.send(result.rows[0]);
});

app.post("/rentals", async (req, res) => {
  const { titulo, ingredientes, preparo } = req.body;

  const result = await connection.query(
    "INSERT INTO receitas (titulo, ingredientes, preparo) VALUES ($1, $2, $3)",
    [titulo, ingredientes, preparo]
  );

  console.log(result)

  res.send(201);
});

app.get("/rentals", async (req, res) => {
  const { id } = req.params;

  const result = await connection.query(
    "SELECT * FROM receitas WHERE id = $1;",
    [id]
  );
  console.log(result.rows);
  res.send(result.rows[0]);
});

app.post("/rentals/:id/return", async (req, res) => {
  const { id } = req.params;

  const result = await connection.query(
    "SELECT * FROM receitas WHERE id = $1;",
    [id]
  );
  console.log(result.rows);
  res.send(result.rows[0]);
});

app.delete("/rentals/:id", async (req, res) => {
  const { id } = req.params;

  const result = await connection.query(
    "SELECT * FROM receitas WHERE id = $1;",
    [id]
  );
  console.log(result.rows);
  res.send(result.rows[0]);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port ${port}`));