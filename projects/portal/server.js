'use strict';

const express = require('express');

// Constants
const PORT = 80;
const cacheTime = 86400000 * 7; // 7 Days

// App
const app = express();

app.use(express.static(__dirname + '/www', {maxAge: cacheTime}));

app.listen(PORT);

console.log('Running on http://localhost:' + PORT);