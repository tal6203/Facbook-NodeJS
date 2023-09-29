const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');
const { checkUser } = require('./middleware/middleware');
const config = require('config');
const cors = require('cors');
const logger = require('./logger/my_logger');



const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


// view engine
app.set('view engine', 'ejs');



// database connection
const dbURI = config.moongodbAtlas.url;

mongoose.set('strictQuery', true);


const port = config.express.port;


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port || 3000, () => {
      console.log(`Listening to port ${port}`);
      logger.info(`Server started and listening to port ${port}`);

    })
  })
  .catch((err) => {
    console.log(err);
    logger.error(`Error connecting to the database: ${err.message}`);
  });


// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.use(routes)



