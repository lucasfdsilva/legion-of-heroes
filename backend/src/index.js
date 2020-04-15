const express = require('express');

const app = express();

//Middlewares
app.use(express.json());

app.listen(3333);

