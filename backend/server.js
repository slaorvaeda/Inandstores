const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const path = require("path")
const dotenv = require("dotenv")
const user = require("./Schema/Newuser")
const bcrypt = require("bcrypt")

const route = require("./Routes/route")
const dbConfig = require("./config/db.config")
const ApiError = require("./utils/ApiError")
const clientRoutes = require("./Routes/clientRoutes")
const itemRoutes = require("./Routes/itemRoutes")
const vendorRoutes = require("./Routes/vendorRoutes")
const purchaseBillRoutes = require("./Routes/purchaseBillRoutes")
const ErrorHandler = require("./middleware/ErrorHandler")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public")) // Serve static files

// Routes
app.use(route)
app.use('/api/clients',clientRoutes )
app.use('/api/items', itemRoutes);
app.use('/api/vendors', vendorRoutes);

app.use('/api/purchasebills', purchaseBillRoutes);


// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in .env file")
  process.exit(1)
}
  
// Middleware 
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]
  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" })
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" })
    }
    req.user = decoded
    next()
  })
}

// Handle undefined routes
app.use((req, res, next) => {
  const error = new ApiError(404, "Route not found")
  next(error)
})


app.use(ErrorHandler)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
