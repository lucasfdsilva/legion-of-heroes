const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;

