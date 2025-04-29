require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const dbConnection = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./utils/AppError');


dbConnection();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(mongoSanitize());


app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);

app.use(errorHandler);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})