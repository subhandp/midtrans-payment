require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT | 3000;

const paymentRoute = require("./routes/payment");

//cors
app.use(cors());
// untuk cloudinary

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/payment", paymentRoute);

app.listen(port, () => console.log("Listened on port " + port));