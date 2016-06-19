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
    var query = Product.find(filter);
    query.skip(start);
    query.limit(limit);
    query.sort(sort);
    return query.exec(cb);
};

var Product = mongoose.model('Product', productSchema);

var productOperations = function() {
    return {
        searchProduct: function(req, res) {
            let name = req.query.name;
            let description = req.description;
            let cat1 = req.query.cat1;
            let cat2 = req.query.cat2;
            let cat3 = req.query.cat3;
            let seller = req.query.seller;
            let date = req.query.date;
            let state = req.query.state;
            var minprice = req.query.minprice || null;
            var maxprice = req.query.maxprice || null;


            // CATEGORY FILTER
            var category = [];


            if (typeof cat1 !== 'undefined' && cat1 !== null && cat1 !== "NO"){
                category.push(cat1);
            }
            if (typeof cat2 !== 'undefined' && cat2 !== null && cat2 !== "NO"){
                category.push(cat2);
            }
            if (typeof cat3 !== 'undefined' && cat3 !== null && cat3 !== "NO"){
                category.push(cat3);
            }


            // NORMA: no se suele usar las variables directamente de lo que llega del metodo sino que se pasan a variables y se usan desde ahi
            var criteria = {
                'category.name': { $in: category }
            };

            if (category.length == 0){
                criteria = {}
            }


            var start = parseInt(req.query.start) || 0; //esto quiere decir que si no me pasan parametro start empiezo desde la 0. Esto es pa paginacion
            var limit = parseInt(req.query.limit) || null;
            var sort = req.query.sort || null;

            var includeTotal = req.query.includeTotal || 'true';

            // NAME FILTER
            if (typeof name !== 'undefined' && name !== null){
                criteria.name = new RegExp('^' + name, 'i');
            }

            // STATE FILTER
            if (typeof state !== 'undefined' && state !== null && state === '1'){
                criteria.state = 'sold';
            }else if (typeof state !== 'undefined' && state !== null && state === '0'){
                criteria.state = 'selling';
            }



            // PRICE FILTER
            if ((typeof minprice !== 'undefined' && minprice !== null) && (typeof maxprice !== 'undefined' && maxprice !== null)){
                criteria.price = { '$gte': minprice, '$lte': maxprice };
            }
            else if (typeof minprice !== 'undefined' && minprice !== null){
                criteria.price = { '$gte': minprice };
            }
            else if (typeof maxprice !== 'undefined' && maxprice !== null){

                criteria.price = { '$lte': maxprice };
            }

            // DATE FILTER
            let searchDate =  new Date();

            if (typeof date !== 'undefined' && date !== null && date === '1'){
                addDays(searchDate, -1);
                criteria.published_date = { '$gte': searchDate.getTime() };
            }
            else if (typeof date !== 'undefined' && date !== null && date === '2'){
                addDays(searchDate, -7);
                criteria.published_date = { '$gte': searchDate.getTime() };
            }
            else if (typeof date !== 'undefined' && date !== null && date === '3'){
                addDays(searchDate, -30);
                criteria.published_date = { '$gte': searchDate.getTime() };
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
                res.json({success: true, total: results.length, results: results});
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


/* Función que suma o resta días a una fecha, si el parámetro
 días es negativo restará los días*/
function addDays(date, days){
    date.setDate(date.getDate() + days);
    return date;
}


var operations = productOperations();

module.exports = operations;
