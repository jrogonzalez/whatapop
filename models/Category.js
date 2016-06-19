'use strict';

var mongoose = require('mongoose');
var Error = require('./Error');

var categorySchema = mongoose.Schema({
    id: Number,
    name: String
});

var Category = mongoose.model('Category', categorySchema);

var operationsCategory = function() {
    return {
        createCategory: function(req, res) {
            let id = req.body.id;
            let name = req.body.name;

            let category = new Category({
                id: id,
                name: name
            });

            var errors = category.validateSync(); //Este metodo es sincrono
            if (errors) {
                return Error('err006', req, res, 400);

            }

            category.save(function(err) {
                if (err) {
                    return Error('err007', req, res, 400);

                }else{
                    res.json({success: true, message: 'Category created in bbdd'});
                }


            });
        },
        removeCategory: function(req, res) {
            let id = req.query.id;

            if (typeof id === 'undefined'){
                return Error('err020', req, res, 500);
            }

            Category.remove({'id': id}).exec(function(err, result) {
                if (err) {
                    return Error('err002', req, res, 400);
                } else {
                    return res.json({success: true, message: 'Category removed in bbdd'});
                }
            });
        },
        searchCategory: function (req, res) {
            let id = req.query.id;

            if (typeof id == "undefined"){
                return Error('err020', req, res, 500);
            }


            Category.findOne({'id': id}).exec(function (err, result) {
                if (err){
                    return Error('err002', req, res, 500);
                }

                res.json({success: true, category: result});

            });

        },
        showCategories: function (req, res) {

            Category.find().exec(function (err, result) {
                if (err){
                    return Error('err002', req, res, 500);
                }

                res.json({success: true, categories: result});

            });

        }
    };

};

var operations = operationsCategory();

module.exports = operations;
