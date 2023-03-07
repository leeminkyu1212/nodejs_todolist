//express 가져온다
const express = require("express");
const morgan = require("morgan");
const app = express();
//ip는 집주소 port번호는 방번호 
const PORT = 8080;

app.use(express.json());
app.use(morgan("dev"));



const cors = require("cors");

app.use(cors());
const { pool } = require("./db");



app.get("/api/menus/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
        SELECT * FROM menus 
        WHERE id=${req.params.id}
      `
    );
    if (data[0][0]) {
      return res.json(data[0][0]);
    }
  } catch (error) {
    console.log(error);
  }
});


app.get("/api/menus", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM menus");
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    console.log(error);
  }
});


app.post("/api/menus", async (req, res) => {
  try {
    const data = await pool.query(
      `
        INSERT INTO menus 
        (menu_name, menu_description, menu_img_link) 
        VALUES 
        ("${req.body.name}", "${req.body.description}", "${req.body.image_src}")
      `
    );
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

app.patch("/api/menus/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
        UPDATE menus 
        SET name="${req.body.name}", menu_description="${req.body.description}", menu_img_link="${req.body.image_src}"
        WHERE id=${req.params.id}
      `
    );
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/menus/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
        DELETE FROM menus WHERE id=${req.params.id}
      `
    );
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

////////////////////////////////////////////////




app.get("/api/orders", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM orders");
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
        SELECT * FROM  orders
        WHERE id=${req.params.id}
      `
    );
    if (data[0][0]) {
      return res.json(data[0][0]);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const data = await pool.query(
      `
        INSERT INTO orders 
        (quantity, request_detail, menus_id) 
        VALUES 
        ("${req.body.quantity}", "${req.body.request_detail}", "${req.menus_id}")
      `
    );
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

app.patch("/api/orders/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
        UPDATE orders 
        SET quantity="${req.body.quantity}", request_detail="${req.body.request_detail}", menus_id="${req.body.menus_id}"
        WHERE id=${req.params.id}
      `
    );
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
        DELETE FROM orders WHERE id=${req.params.id}
      `
    );
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    console.log(error);
  }
});




app.listen(PORT, () => console.log(`this server is listening on ${PORT}`));
