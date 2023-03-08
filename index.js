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

app.get("/api/menus", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM menus");
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "전체 메뉴 목록 조회에 실패하였습니다",
    });
  }
});

app.get("/api/menus/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
        SELECT * FROM menus 
        WHERE id=${req.params.id}
      `
    );
    if (!data[0].length) {
      return res.json({
        success: false,
        message: "메뉴 조회에 실패하였습니다. ",
      });
    }
    if (data[0][0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "메뉴 조회에 실패하였습니다.",
    });
  }
});

app.post("/api/menus", async (req, res) => {
  try {
    const data = await pool.query(
      `
        INSERT INTO menus 
        (name, description, image_src) 
        VALUES 
        ("${req.body.name}", "${req.body.description}", "${req.body.image_src}")
      `
    );
    if (data[0]) {
      return res.json({
        success: true,
        message: "메뉴 등록에 성공하였습니다.",
      });
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
      return res.json({
        success:true,
        message:"메뉴 정보 수정에 성공하였습니다"
      });
    }
  } catch (error) {
    return res.json({
      success:false,
      message:"메뉴 정보 수정에 실패하였습니다"
    });
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
      return res.json({
        success:true,
        message:"메뉴 삭제에 성공하였습니다"
      });
    }
  } catch (error) {
    return res.json({
      success:false,
      message:"메뉴 삭제에 실패하였습니다"
    });
  }
});

////////////////////////////////////////////////

app.get("/api/orders", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT orders.id,name,quantity,request_detail FROM orders inner join menus on menus.id=orders.menus_id order by orders.id desc;"
    );
    if (data[0]) {
      return res.json(data[0]);
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "전체 메뉴 목록 조회에 실패하였습니다",
    });
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
        ("${req.body.quantity}", "${req.body.request_detail}", "${req.body.menus_id}")
      `
    );
    if (data[0].affectedRows) {
      const data = await pool.query(
        `select * from orders order by id desc limit 1`
      );
      return res.json({
        success: true,
        message: data[0][0].id,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "주문에 실패하였습니다.",
    });
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
    if (data[0].affectedRows) {
      const data = await pool.query(
        `select * from orders order by id desc limit 1`
      );
      return res.json({
        success: true,
        message: "주문 수정에 성공하였습니다",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "주문 수정에 실패하였습니다.",
    });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
        DELETE FROM orders WHERE id=${req.params.id}
      `
    );
    if (data[0].affectedRows) {
      const data = await pool.query(
        `select * from orders order by id desc limit 1`
      );
      return res.json({
        success: true,
        message: "주문 삭제에 성공하였습니다",
      });
    }
  } catch (error) {
    return res.json({
      success: true,
      message: "주문 삭제에 실패하였습니다",
    });
  }
});

app.listen(PORT, () => console.log(`this server is listening on ${PORT}`));
