import express from "express";
import multer from "multer";
import cors from "cors";
import sharp from "sharp";

const app = express();
const PORT = 8080;

// cors setup to receive request from frontend
app.use(
  // could write the url in env
  cors({
    origin: "http://localhost:3000",
  })
);

app.post(
  "/picture",
  multer({ storage: multer.memoryStorage() }).single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("Error. No File Received.");
    }

    try {
      // resize the received image to fit in the frame
      const metadata = await sharp("./assets/frames/frame1.png").metadata();
      const resizeWidth: number = metadata.width ? metadata.width * 0.66 : 800;
      const resizeHeight: number = metadata.height
        ? metadata.height * 0.66
        : 1000;

      const resizedImage = await sharp(req.file.buffer)
        .resize({ width: resizeWidth, height: resizeHeight })
        .png()
        .toBuffer();

      // we combine image from bottom to top: white background -> received image -> frame
      const resizedBackgroud = await sharp(
        "./assets/background/white_background.jpg"
      )
        .resize({ width: metadata.width, height: metadata.height })
        .png()
        .toBuffer();

      const combinedImage = await sharp(resizedBackgroud)
        .composite([
          { input: resizedImage },
          { input: "./assets/frames/frame1.png" },
        ])
        .png()
        .toBuffer();

      // send the processed image back to frontend
      res.setHeader("Content-Type", "image/png");
      res.send(combinedImage);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error processing the images");
    }
  }
);

app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
});
