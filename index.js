const express = require("express");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
console.log("eee");

require("dotenv").config();

const fileUpload = require("express-fileupload");
const isAuthenticated = require("./middlewares/isAuthenticated");
const app = express();
app.use(express());
const uid = require("uid2");
const Offer = require("./models/offer");

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// app.get("/", (req, res) => {
//   res.json({ message: "Bienvenue !" });
// });

//
app.post("/upload", isAuthenticated, fileUpload(), async (req, res) => {
  try {
    console.log(req.files);
    const convertedFile = convertToBase64(req.files.picture);
    // console.log(convertedFile);
    const token = uid(16);
    const cloudinaryResponse = await cloudinary.uploader.upload(convertedFile);
    console.log(cloudinaryResponse.secure_url);

    const {
      brand,
      price,
      size,
      color,
      title,
      picture,
      description,
      condition,
    } = req.body;
    const newOffer = new Offer({
      product_name: title,
      product_description: description,
      product_price: price,
      product_details: [brand, size, condition, color],

      product_image: cloudinaryResponse.secure_url,
    });

    console.log(newOffer);
    return res.status(200).json(newOffer);
    // await newOffer.save();
    //     const responseObject = {
    //       _id: newOffer._id,
    //       token: newOffer.token,
    //       account: {
    //         product_name: req.body.name,}

    //

    console.log(req.files.picture);

    console.log("En construction !!");
    return res.status(200).json("Route upload connected");
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(404).json("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("Serveur en route");
});
