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
            let dist = req.query.dist;
            let date = req.query.date;
            let state = req.query.state;
            var minprice = req.query.minprice || null;
            var maxprice = req.query.maxprice || null;

            // NORMA: no se suele usar las variables directamente de lo que llega del metodo sino que se pasan a variables y se usan desde ahi
            var criteria = {};
            var start = parseInt(req.query.start) || 0; //esto quiere decir que si no me pasan parametro start empiezo desde la 0. Esto es pa paginacion
            var limit = parseInt(req.query.limit) || null;
            var sort = req.query.sort || null;

            var includeTotal = req.query.includeTotal || 'true';

            // NAME FILTER
            if (typeof name !== 'undefined' && name !== null){
                console.log('entra name');
                criteria.name = new RegExp('^' + name, 'i');
            }

            // DESCRIPTION FILTER (not impplemented yet)
            /*if (typeof description !== 'undefined') {
                console.log('entra description');
                criteria.description = new RegExp('^' + description, 'i');
            }
            */

            // SELLET FILTER (not impplemented yet)
            /*
            if (typeof seller !== 'undefined'){
                console.log('entra seller');
                criteria.seller = seller;
            }
            */

            // Añadimos siempre el estado de vendiendose y no sacamos los que ya han sido vendidos
            console.log('entra state');
            criteria.state = 'selling';


            // PRICE FILTER
            if ((typeof minprice !== 'undefined' && minprice !== null) && (typeof maxprice !== 'undefined' && maxprice !== null)){
                console.log("entra por ambos");
                criteria.price = { '$gte': minprice, '$lte': maxprice };
            }
            else if (typeof minprice !== 'undefined' && minprice !== null){
                console.log("entra por el minprice");
                criteria.price = { '$gte': minprice };
            }
            else if (typeof maxprice !== 'undefined' && maxprice !== null){
                console.log("entra por el maxprice");

                criteria.price = { '$lte': maxprice };
            }


            // DATE FILTER
            let searchDate =  new Date();
            console.log("fechaActual", searchDate);
            console.log("PRODUCT CRITERIA", criteria);

            if (typeof date !== 'undefined' && date !== null && date === '1'){
                console.log('entra searchDate1');
                console.log(sumarDias(searchDate, -1));
                criteria.published_date = { '$gte': searchDate.getTime() };
                console.log(searchDate.getTime());
            }
            else if (typeof date !== 'undefined' && date !== null && date === '2'){
                console.log('entra searchDate2');
                console.log(sumarDias(searchDate, -7));
                criteria.published_date = { '$gte': searchDate.getTime() };
                console.log(searchDate.getTime());
            }
            else if (typeof date !== 'undefined' && date !== null && date === '3'){
                console.log('entra searchDate3');
                console.log(sumarDias(searchDate, -30));
                criteria.published_date = { '$gte': searchDate.getTime() };
                console.log(searchDate.getTime());
            }
            else if (typeof date !== 'undefined' && date !== null && date === '4'){
                console.log('entra category4');

            }



            // CATEGORY FILTER
            var category = [];
            var cri = "";
            if (typeof cat1 !== 'undefined' && cat1 !== null){
                console.log('entra category2');
                category.push(cat1);
            }
            else if (typeof cat2 !== 'undefined' && cat2 !== null){
                console.log('entra category2');
                category.push(cat2);
            }
            else if (typeof cat3 !== 'undefined' && cat3 !== null){
                console.log('entra category3');
                category.push(cat3);
            }
            if (category.length > 0){
                criteria.category.name = category
                console.log("creiteria, cat: ", criteria.category)
            }


            // DESCRIPTION FILTER (not impplemented yet)
            if (typeof dist !== 'undefined' && dist !== null){

            }





            Product.list(criteria, start, limit, sort, function(err, rows) {
                if (err){
                    console.log("Error en BUSQUEDA");
                    return Error('err002', req, res, 400);
                }
                if (includeTotal === 'true'){
                    console.log("ROWS TOTAL", rows);
                    res.json({success: true, total: rows.length, products: rows});
                }else{
                    console.log("ROWS", rows);
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
function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}


var operations = productOperations();

module.exports = operations;
