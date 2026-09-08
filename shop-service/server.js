const app = require("./src/app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 3000;

pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    console.log("Database connected:", result.rows[0]);
  }
});

app.listen(PORT, () => {
  console.log(`Shop Service running on port ${PORT}`);
});