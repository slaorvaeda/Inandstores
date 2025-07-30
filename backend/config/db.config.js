const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// MongoDB connection
mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err))
