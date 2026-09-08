const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const {
  getAllShops,
  createShop,
  getShopById,
  updateShop,
  deleteShop
} = require("../controllers/shopController");


router.get("/", getAllShops);
//router.post("/", createShop);
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Shop name is required"),

    body("city")
      .trim()
      .notEmpty()
      .withMessage("City is required")
  ],
  createShop
);

router.get("/:id", getShopById);

router.put(
  "/:id",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Shop name is required"),

    body("city")
      .trim()
      .notEmpty()
      .withMessage("City is required")
  ],
  updateShop
);
router.delete("/:id", deleteShop);

module.exports = router;