/**
 * Created by iMac on 28/04/16.
 */
'use strict';

var express = require('express');
var router = express.Router();
var Product = require('./../../models/Product');

// Auth
var jwtAuth = require('../../lib/jwtAuth');

// Apply de Authentication only for middleware we need

router.get('/searchProduct', jwtAuth(), function(req, res, next) {
    Product.searchProduct(req, res, next);
});

router.post('/createProduct', jwtAuth(), function(req, res, next) {
    Product.createProduct(req, res, next);
});

router.get('/showProducts', function(req, res, next) {
    Product.showProducts(req, res, next);
});

router.get('/:id', function(req, res, next) {

    Product.showProduct(req, res, next);
});

module.exports = router;
