const pool = require("../config/db");
const { validationResult } = require("express-validator");

const getAllShops = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM shops ORDER BY id ASC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting shops:", error);

    res.status(500).json({
      message: "Failed to get shops"
    });
  }
};

const createShop = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
     return res.status(400).json({
    errors: errors.array()
  });
}
    const { name, city } = req.body;

    const result = await pool.query(
      `INSERT INTO shops (name, city)
       VALUES ($1, $2)
       RETURNING *`,
      [name, city]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Error creating shop:", error);

    res.status(500).json({
      message: "Failed to create shop"
    });
  }
};

const getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM shops WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Shop not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error getting shop:", error);

    res.status(500).json({
      message: "Failed to get shop"
    });
  }
};

const updateShop = async (req, res) => {
  try {

    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
        errors: errors.array()
    });
    }
    const { name, city } = req.body;

    const result = await pool.query(
      `UPDATE shops
       SET name = $1, city = $2
       WHERE id = $3
       RETURNING *`,
      [name, city, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Shop not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error updating shop:", error);

    res.status(500).json({
      message: "Failed to update shop"
    });
  }
};

const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM shops
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Shop not found"
      });
    }

    res.status(200).json({
      message: "Shop deleted successfully",
      shop: result.rows[0]
    });

  } catch (error) {
    console.error("Error deleting shop:", error);

    res.status(500).json({
      message: "Failed to delete shop"
    });
  }
};

module.exports = {
  getAllShops,
  createShop,
  getShopById,
  updateShop,
  deleteShop
};
