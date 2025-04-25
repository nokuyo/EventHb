const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();

// CORS
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`📥 Incoming request: ${req.method} ${req.url}`);
  next();
});

// 🧠 Correct Static file serving
app.use("/public", express.static("public"));

// Routes
app.use("/api", require("./routes/eventRoutes"));
app.use("/api", require("./routes/userProfileRoutes"));
app.use("/api", require("./routes/adminUserRoutes"));

// Start server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("🚀 Express API running on http://localhost:3000");
  });
});
