/**
 * Created by iMac on 23/04/16.
 */
'use strict';

var mongoose = require('mongoose');
var Error = require('./Error');
var Category = require('./Category');
var User = require('./User');

// Regex expressions
var regex_gte_lte = new RegExp('-' , 'i');
var regex_gte = new RegExp('-' + '$', 'i');
var regex_lte = new RegExp('^' + '-', 'i');

// Define JSON File
var fs = require('fs');
var path = require('path');

var productSchema = mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required: true
    },
    description: String,
    category: { type: JSON, ref: Category },
    seller: { type: JSON, ref: User },
    published_date: Number,
    state: String,
    price: Number,
    photo: [String]
});

// Hacer método estático
productSchema.statics.list = function(filter, start, limit, sort, cb) {
    var query = Advertisement.find(filter);
    query.skip(start);
    query.limit(limit);
    query.sort(sort);
    return query.exec(cb);
};

var Product = mongoose.model('Product', productSchema);

var productOperations = function() {
    return {
        searchProduct: function(req, res) {
            let id = req.query.id;
            let name = req.query.name;
            let description = req.description;
            let category = req.query.category;
            let seller = req.query.seller;
            let published_date = req.query.published_date;
            let state = req.query.state;

            // NORMA: no se suele usar las variables directamente de lo que llega del metodo sino que se pasan a variables y se usan desde ahi
            var criteria = {};
            var start = parseInt(req.query.start) || 0; //esto quiere decir que si no me pasan parametro start empiezo desde la 0. Esto es pa paginacion
            var limit = parseInt(req.query.limit) || null;
            var sort = req.query.sort || null;
            var price = req.query.price || null;
            var includeTotal = req.query.includeTotal || 'true';

            if (typeof id !== 'undefined'){
                console.log('entra id');
                criteria.id = id;
            }
            if (typeof name !== 'undefined'){
                console.log('entra name');
                criteria.name = new RegExp('^' + name, 'i');
            }
            if (typeof description !== 'undefined'){
                console.log('entra description');
                criteria.description = new RegExp('^' + description, 'i');
            }
            if (typeof category !== 'undefined'){
                console.log('entra category');
                criteria.category = category;
            }
            if (typeof published_date !== 'undefined'){
                console.log('entra published_date');
                criteria.published_date = published_date;
            }
            if (typeof seller !== 'undefined'){
                console.log('entra seller');
                criteria.seller = seller;
            }
            if (typeof state !== 'undefined'){
                console.log('entra state');
                criteria.state = state;
            }

            if ((typeof price !== 'undefined')){

                var priceNumber = '0';

                // 10- buscará los que tengan precio mayor que 10
                if (regex_gte.test(price)){
                    priceNumber = price.substring(0,price.length-1);
                    criteria.price = { '$gte': priceNumber };
                }
                else if (regex_lte.test(price)){    // ­50 buscará los que tengan precio menor de 50
                    priceNumber = price.substr(1);
                    criteria.price = { '$lte': priceNumber };
                }else if (regex_gte_lte.test(price)){ // 10­50 buscará anuncios con precio incluido entre estos valores
                    var posicion = price.indexOf('-');
                    priceNumber = price.substr(0,posicion);
                    var priceNumber2 = price.substr(posicion+1);
                    criteria.price = { '$gte': priceNumber, '$lte': priceNumber2 };
                }else if (price !== null){ // 50 buscará los que tengan precio igual a 50
                    criteria.price = { '$lte': price};
                }else{ // buscamos por defecto los mayores que 0
                    criteria.price = { '$gte': priceNumber };
                }
            }

            Product.list(criteria, start, limit, sort, function(err, rows) {
                if (err){
                    return Error('err002', req, res, 400);
                }
                if (includeTotal === 'true'){
                    res.json({success: true, total: rows.length, products: rows});
                }else{
                    res.json({success: true, products: rows});
                }
            });
        },
        createAProduct: function(req, res) {
             let name = req.body.name;
             let description = req.body.description;
             let category = req.body.category;
             let seller = req.body.seller;
             let published_date = req.body.published_date;
             let state = req.body.state;
             let price = req.body.price;
             let photo = req.body.photo;


            let product = new Product({
                name: name,
                description: description,
                category: category,
                seller: seller,
                published_date: published_date,
                state: state,
                price: price,
                photo: photo
             });

             let errors = product.validateSync(); //This method is Sync
             if(errors){
                 return Error('err001', req, res, 400);
             }

            product.save(function(err) {
                 if (err){
                    res.send({success:false, message: 'error en el guardado'});
                 }else{
                    res.send({success:true, message:'anuncio guardado en BBDD'});
                 }
             });
        },
        showProducts: function(req, res) {
            Product.find({}).exec(function (err, results) {
                if (err){
                    return Error('err002', req, res, 400);
                }
                res.json({success: true, results: results});
            });
        },
        showProduct: function(req, res) {
            let id = req.params.id;

            Product.findOne({'id': id}).exec(function (err, results) {
                if (err){
                    return Error('err002', req, res, 400);
                }
                res.json({success: true, results: results});
            });
        }
        /*,
        tagList: function(req, res) {
            Advertisement.find({}, {tags:1, _id:0}).exec(function(err, rows) {

                if (err){
                    return Error('err002', req, res, 400);
                }

                var salida = [];
                for(var i = 0; i < rows.length; i++) {
                    var tag = rows[i].tags;
                    for(var j = 0; j < tag.length; j++) {
                        var elem = tag[j];

                        if (salida.indexOf(elem) === -1){
                            salida.push(elem);
                        }
                    }
                }
                res.json({success: true, taglist: salida});
            });
        }
        */
    };
};

var operations = productOperations();

module.exports = operations;
