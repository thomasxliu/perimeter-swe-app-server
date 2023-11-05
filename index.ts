import express from "express";
import multer, { StorageEngine } from "multer";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 8080;

// cors setup to receive request from frontend
app.use(
  // could write the url in env
  cors({
    origin: "http://localhost:3000",
  })
);

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.post(
  "/picture",
  multer({ storage: storage }).single("file"),
  (req, res) => {
    // multer will store the file into the local file system
    console.log(req.file);
    // TODO: convert image with type not supported by jimp to png

    // TODO: add the frame use jimp

    fs.unlinkSync(`./upload/${req.file?.originalname}`);
    res.send(req.file);
  }
);

app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
});
