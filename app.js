require("dotenv").config();
require("express-async-errors");

//express

const express = require("express");
const app = express();

//rest of the packages
const path = require("path");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const morgan = require("morgan");
const cron = require("node-cron");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileUpload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//database
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
