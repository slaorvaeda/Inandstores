const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const path = require("path")
const dotenv = require("dotenv")
const user = require("./Schema/Newuser")
const bcrypt = require("bcrypt")

const route = require("./Routes/route")
// Import database configuration to ensure connection
require("./config/db.config")
const ApiError = require("./utils/ApiError")
const clientRoutes = require("./Routes/clientRoutes")
const itemRoutes = require("./Routes/itemRoutes")
const vendorRoutes = require("./Routes/vendorRoutes")
const purchaseBillRoutes = require("./Routes/purchaseBillRoutes")
const dashboardRoutes = require('./Routes/dashboard')
const orderRoutes = require('./Routes/orderRoutes')
const googleAuthRoutes = require('./Routes/googleAuthRoutes')
const userRoutes = require('./Routes/userRoutes')
const khataRoutes = require('./Routes/khataRoutes')


const { ErrorHandling } = require("./middleware/ErrorHandler")

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
app.use('/api', dashboardRoutes);
app.use('/api/purchasebills', purchaseBillRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/khata', khataRoutes);



// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in .env file")
  process.exit(1)
}


// Remove this duplicate route as it's handled in itemRoutes

// Handle undefined routes
app.use((req, res, next) => {
  const error = new ApiError(404, "Route not found")
  next(error)
})


app.use(ErrorHandling)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  

})
