require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const dbConnection = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const { globalErrorHandling } = require('./utils/AppError');


dbConnection();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));
app.use(mongoSanitize());


app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);

app.use(globalErrorHandling);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})