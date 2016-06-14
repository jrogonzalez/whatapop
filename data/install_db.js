/**
 * Created by iMac on 23/04/16.
 */
'use strict';


var mongoose = require('mongoose');

// Define JSON File
var fs = require('fs');
var path = require('path');
var async = require('async');
var readLine = require('readline');

//var conn = mongoose.connection;
//var pathDataBase = 'mongodb://localhost:27017/whatapopdb';

var db = require('../lib/connectMongoose');

require('../models/Product');
require('../models/User');
require('../models/Category');

var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Pepe = mongoose.model('Pepe');

var sha256 = require('sha256');

db.once('open', function() {

    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Are you sure you want to empty DB? (no) ', function(answer) {
        rl.close();
        if (answer.toLowerCase() === 'yes') {
            runInstallScript();
        } else {
            console.log('DB install aborted!');
            return process.exit(0);
        }
    });

});

function runInstallScript() {

    async.series([
        //openDb,
        initProducts,
        initUsers,
        initCategories
        ], (err) => {
            if (err) {
                console.error('Hubo un error: ', err);
                return process.exit(1);
            }

            return process.exit(0);
        }
    );

}


function openDb() {

    //Handlers de eventos de conexion
    conn.on('error', console.log.bind(console, 'Connection error!'));

    conn.once('open', function() {
        console.log('Connected to mongodb');
    });

    // Conect to BBDD
    mongoose.connect(pathDataBase);

}

function initProducts(cb){
    var file = path.join(__dirname, 'products.json');

    console.log('\n *STARTING PRODUCTS* ');

    // Check that the file exists locally
    if (!fs.existsSync(file)) {
        console.log('File not found');
    }
    // The file *does* exist
    else {

        // Drop the 'Product' collection from the current database
        Product.remove({}, ()=>{

            fs.readFile(file, 'utf-8', function (err, data) {
                if (err) {
                    return console.log('Products can not be created');
                }

                var data2 = JSON.parse(data);
                //console.log(data2);


                for (var i = 0; i < data2.length; i++) {
                    var product = new Product();
                    product.id = data2[i].id;
                    product.name = data2[i].name;
                    product.description = data2[i].description;
                    product.published_date = data2[i].published_date;
                    product.state = data2[i].state;
                    product.price = data2[i].price;
                    product.photo = data2[i].photos;

                    var user = new User();
                    user = data2[i].seller;
                    product.seller = user;

                    var pepe = new Pepe();
                    pepe = data2[i].category;
                    product.category = pepe;

                    var errors = product.validateSync(); //This method is Sync
                    if (errors) {
                        return console.log('Errors in Products Model Validation', errors);
                    }

                    product.save(function (err) {
                        if (err) {
                            return console.log('Products load error: ' + product.name + ' can not be created:' + err);
                        }
                    });
                }
                console.log('\n *FINISHED PRODUCTS* ');
                return cb(null, data2.length);
            });
          });
    }
}

/*function removeUsers(callback){

    // Drop the 'User' collection from the current database
    User.remove({}).exec(function (err) {
        if (err) {
            console.log('User BBDD removed error');
        } else {
            console.log('User database reset');
            callback();
        }

    });

}*/

function initUsers(cb){

    var file = path.join(__dirname, 'users.json');

    console.log('\n *STARTING USERS* ');

    // Check that the file exists locally
    if (!fs.existsSync(file)) {
        console.log('File not found');
    }
    // The file *does* exist
    else {

        // Drop the 'User' collection from the current database
        User.remove({} , ()=> {
            fs.readFile(file, 'utf-8', function (err, dataUser) {
                if (err) {
                    return console.log('Advertisement can not be created', err);
                }

                var dataU = JSON.parse(dataUser);


                for (var i = 0; i < dataU.length; i++) {

                    var user = new User();
                    user.name = dataU[i].name;
                    user.nick = dataU[i].nick;
                    user.avatar = dataU[i].avatar;
                    user.latitude = dataU[i].latitude;
                    user.longitude= dataU[i].longitude;

                    user.email = dataU[i].email;
                    user.id = dataU[i].id;
                    user.password = sha256(dataU[i].password);  // We do a HASH algorithm with the password

                    var errors = user.validateSync(); //This method is Sync
                    if (errors) {
                        console.log(errors);
                        return console.log('Errors in User Model Validation', err);
                    }

                    user.save(function (err) {
                        if (err) {
                            return console.log('User load error: ' + user.name + ' can not be created:' + err);
                        }
                    });
                }
                console.log('\n *FINISHED USERS* ');
                return cb(null, dataU.length);
            });
        });


    }
}

function initCategories(cb){

    var file = path.join(__dirname, 'categories.json');
    console.log(file);

    console.log('\n *STARTING CATEGORIES* ');

    // Check that the file exists locally
    if (!fs.existsSync(file)) {
        console.log('File not found');
    }
    // The file *does* exist
    else {

        // Drop the 'Pepe' collection from the current database
        Pepe.remove({} , ()=> {
            fs.readFile(file, 'utf-8', function (err, dataUser) {
                if (err) {
                    return console.log('Categories can not be created', err);
                }


                var dataU = JSON.parse(dataUser);


                for (var i = 0; i < dataU.length; i++) {
                    var pepe = new Pepe();
                    pepe.id = dataU[i].id;
                    pepe.name = dataU[i].name;

                    var errors = pepe.validateSync(); //This method is Sync
                    if (errors) {
                        console.log(errors);
                        return console.log('Errors in Category Model Validation', err);
                    }

                    console.log(pepe);
                    pepe.save( function(err) {

                        if (err) {
                            console.log("traza2");
                            return cb(err);
                            //return console.log('Category load error: ' + category.name + ' can not be created:' + err);
                        }
                        console.log("traza1");
                    });
                }
                console.log('\n *FINISHED CATEGORIES* ');
                return cb(null);
            });

        });


    }
}


// ******** INVOQUE INITIAL FUNCTION
//openDb();
//runInstallScript();


