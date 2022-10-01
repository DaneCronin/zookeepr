const express = require('express');
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

//require data that front-end can request data from
const { animals } = require('./data/animals');

//use test environment portal 3001 if not portal 80
const PORT = process.env.PORT || 3001;

//instantiate the server
const app = express();

//Express.js middleware that instructs server to make front end files available
app.use(express.static('public'));


//Parse(convert) incoming POST data string or array data
app.use(express.urlencoded({ extended : true}));
//Parse(convert) incoming JSON data
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);





//chain listen() method to server to have server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});