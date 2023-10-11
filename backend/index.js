const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
// const cors = require("cors"); 

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");

// Express Application
const app = express();

dotenv.config();

// Middleware
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
// app.use(cors());

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

// Uploading the Images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, req.body.name);
  },
});

const upload = multer({storage:storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded :)");
})

// Connect to Mongo Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for Request
    app.listen(process.env.PORT, () => {
      console.log("Conneted to DB & Listening on Port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
