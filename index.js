const path = require('path');
const express = require('express');
const config = require('./config/env');
const dbConnection = require('./config/database');
const routes = require('./routes/index');
const multer = require('multer');
const { fileStorage, fileFilter } = require('./utils/helper');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(routes);


dbConnection((response) => {
    if (response.error) {
        console.log('Database is not connected');
    } else {
        app.listen(config.PORT, () => {
            console.log("Server is running");
        })
    }
})

