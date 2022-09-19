const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db');

const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Theofficeday connect ${port}`);
})