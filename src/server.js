import express from "express";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

app.get("/categories", async (req, res) => {
  const categoria = await connection.query("SELECT * FROM categories");
  res.send(categoria.rows);
});

app.post("/categories", async (req, res) => {
  const categoria = req.body;

  const categoriaExist = await connection.query(
    "SELECT * FROM categories WHERE name = $1",
    [categoria.name]
    );

    if (categoriaExist){
        res.send(409);
        return
    }

  const result = await connection.query(
    "INSERT INTO categories ( categoria ) VALUES ($1)",
    [ categoria ]
    );

  console.log(result)

  res.send(201);
});

app.get("/games", async (req, res) => {
  const games = await connection.query(
    "SELECT games.*, categories.nome FROM games JOIN categories ON games.categoryId = categories.id"
    );

  res.send(games.rows);
});

app.post("/games", async (req, res) => {
  const game = req.body;

  const gameExist = await connection.query(
    "SELECT * FROM games WHERE name = $1",
    [game.name]
    );

    if (gameExist){
        res.send(409);
        return
    }

  const result = await connection.query(
    "INSERT INTO games ( game ) VALUES ($1)",
    [ game ]
  );

  res.send(201);
});

app.get("/customers", async (req, res) => {
  const customer = await connection.query("SELECT * FROM customers");

  res.send(customer.rows);
});

app.post("/customers", async (req, res) => {
  const customer = req.body;

  const customerExist = await connection.query(
    "SELECT * FROM customers WHERE cpf = $1",
    [customer.cpf]
    );

    if (customerExist){
        res.send(409);
        return
    }

  const result = await connection.query(
    "INSERT INTO customers ( customer ) VALUES ( $1 )",
    [ customer ]
  );

  res.send(201);
});

app.get("/customers/:id", async (req, res) => {
  const { id } = req.params;

  const result = await connection.query(
    "SELECT * FROM customers WHERE id = $1;",
    [id]
  );

  if (!result){
    res.sendStatus(404);
    return
  }

  res.send(result.rows[0]);
});

app.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const customer = req.body;

  const customerExist = await connection.query(
    "SELECT * FROM customers WHERE cpf = $1",
    [customer.cpf]
  );
  
  if (customerExist){
    res.send(409);
    return
  }

  const result = await connection.query(
    "UPDATE usuarios SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5;",
    [customer.name, customer.phone, customer.cpf, customer.birthday, id ]
  );

  res.send(200);
});

app.post("/rentals", async (req, res) => {
  const rental = req.body;

  const customerExist = await connection.query(
    "SELECT * FROM customers WHERE id = $1",
    [rental.customerId]
    );

    if (customerExist){
        res.sendStatus(409);
        return
    }
  const gameExist = await connection.query(
    "SELECT * FROM games WHERE cpf = $1",
    [rental.gameId]
    );

    if (gameExist){
        res.sendStatus(409);
        return
    }

  if(rental.daysRented <= 0){
    res.sendStatus(409);
    return
  }

  const finalPrice = gameExist.pricePerDay * rental.daysRented;

  const completeRental = {
    ...rental,
    rentDate: dayjs().format('DD/MM/YYYY'),
    originalPrice: finalPrice,
    returnDate: null,
    delayFee: null
  }

  const result = await connection.query(
    "INSERT INTO rentals ( rental ) VALUES ( $1 )",
    [ completeRental ]
  );

  res.send(201);
});

app.get("/rentals", async (req, res) => {
   const rentals = await connection.query(
     "SELECT rentals.*, customers.id, customers.name, games.* FROM rentals JOIN customers ON rentals.customersId =customers.id JOIN games ON games.id = rentals.gameId"
   );
    
   res.send(rentals.rows);
});

app.post("/rentals/:id/return", async (req, res) => {
  const { id } = req.params;

  const result = await connection.query(
    "SELECT * FROM receitas WHERE id = $1;",
    [id]
  );


  res.sendStatus(200);
});

app.delete("/rentals/:id", async (req, res) => {
  const { id } = req.params;

  const rentalExist = await connection.query(
    "SELECT * FROM rentals WHERE id = $1",
    [ id ]
    );

    if (!rentalExist){
        res.sendStatus(404);
        return
    }

    if (rental.returnDate){
        res.sendStatus(400);
        return
    }

  const result = await connection.query(
    "DELETE FROM rentals WHERE id = $1;",
    [id]
  );

  res.sendStatus(200);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port ${port}`));