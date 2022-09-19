require('dotenv').config();
const express = require('express');
const api_ = require('./../routes/api_');


module.exports = function(app) {
    app.use(express.urlencoded({ extended: true, limit:'500mb', parameterLimit:50000 }));
    app.use(express.json({limit: '500mb'}));

    app.use('/', api_);

    app.get('*', (req,res) => {
        console.log('Somthing wrong path :' + req.path);
        res.send('Call proper routes');
    })
}
