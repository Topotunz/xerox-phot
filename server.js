const express = require("express");
const multer = require("multer");
const Jimp = require("jimp");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));
app.use("/processed", express.static("processed"));

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send("Файл не загружен");

  const inputPath = req.file.path;
  const outputPath = `processed/${req.file.filename}.jpg`;

  try {
    const image = await Jimp.read(inputPath);
    image
      .greyscale()
      .contrast(1)
      .writeAsync(outputPath);

    fs.unlinkSync(inputPath);

    res.json({ url: `/processed/${req.file.filename}.jpg` });
  } catch (err) {
    res.status(500).send("Ошибка обработки изображения");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порт ${PORT}`));
