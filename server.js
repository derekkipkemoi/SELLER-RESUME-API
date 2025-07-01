// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.SERVER_PORT || 5000;
const HOST = process.env.SERVER_HOST || "localhost";
const URL = process.env.MONGODB_URI;

// Middleware
const corsOptions = {
  origin: "*", // Allow all, or restrict to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Routes
const user = require("./routes/userRoutes");
app.use("/api/user", user);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// MongoDB connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Connected to the database");

    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

startServer();
