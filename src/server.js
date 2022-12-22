//const express = require("express") <-- OLD SYNTAX (we don't want to use old stuff)
import express from "express"; // NEW SYNTAX (you can use this only if type:"module" is added on package.json)
import listEndpoints from "express-list-endpoints";
// import blogsRouter from "./api/blogposts/index.js";
// import usersRouter from "./api/users/index.js";
import cors from "cors";
import path from "path";
import multer from "multer";

const server = express();
const port = 3001;
server.use(cors());
server.use(express.json()); // If you don't add this line BEFORE the endpoints, all requests' bodies will be UNDEFINED

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
server.set("view engine", "ejs");
//
server.get("/upload", (req, res) => {
  res.render("upload");
  response.status(201).send("all good");
});
//posting here
server.post("/upload", upload.single("image"), (req, res) => {
  res.send("Image uploaded!");
});

// // ************************************* ENDPOINTS ******************************************
// server.use("/authors", usersRouter); // /users will be the prefix that all the endpoints in the usersRouter will have
// server.use("/blogposts", blogsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
