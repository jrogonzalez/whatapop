/**
 * Created by iMac on 24/05/16.
 */
var mongoose = require('mongoose');

// Define JSON File
var fs = require('fs');
var path = require('path');


var conn = mongoose.connection;
var pathDataBase = 'mongodb://localhost:27017/nodepopdb';

require('../models/Advertisement');
require('../models/User');

var Advertisement = mongoose.model('Advertisement');
var User = mongoose.model('User');

var sha256 = require('sha256');

module.exports.openDb= function() {

    //Handlers de eventos de conexion
    conn.on('error', console.log.bind(console, 'Connection error!'));

    conn.once('open', function() {
        console.log('Connected to mongodb');
    });

    // Conect to BBDD
    mongoose.connect(pathDataBase);

}
