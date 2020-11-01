const express = require('express');
const morgan = require('morgan');
const path = require('path');
const port = '8086';

require('dotenv').config();

const indexRouter = require('./routes/index');

const app = express();

app.set('view engine', 'ejs');
app.use(morgan('dev'));

app.use('/phaser', indexRouter);
app.use('/phaser/game/static', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Listening on port:${port}`);
});
