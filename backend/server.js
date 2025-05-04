const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const path = require("path")
const dotenv = require("dotenv")
const  user = require("./Schema/Newuser")
const bcrypt = require("bcrypt")

const route = require("./Routes/route")


dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(route) 
app.use(express.static("public"))

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err))



// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in .env file")
  process.exit(1)
}
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]
  if (!token) {
    return res.status(403).send("A token is required for authentication")
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid Token")
    }
    req.user = decoded
    next()
  })
}


// Routes
// app.get("/", (req, res) => {
//   res.send("Welcome to the backend server")
// })  
// app.post("/login", (req, res) => {
//   const { username, password } = req.body
//   // Dummy authentication
//   if (username === "admin" && password === "password") {
//     const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" })
//     return res.json({ token })
//   }
//   return res.status(401).send("Invalid credentials")
// })
// app.get("/protected", verifyToken, (req, res) => {
//   res.send("This is a protected route")
// })
// app.get("/api", (req, res) => {
//   res.json({ message: "Hello from the backend!" })
// })
// app.get("/api/data", (req, res) => {
//   res.json({ data: "This is some data from the backend" })
// })



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})
// 404 Not Found middleware
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"))
})


