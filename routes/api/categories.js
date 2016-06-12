/**
 * Created by iMac on 07/05/16.
 */
'use strict';

var express = require('express');
var router = express.Router();
var Categories = require('./../../models/Category');

// Auth
var jwtAuth = require('../../lib/jwtAuth');

router.post('/createCategory', function(req, res, next) {
    Categories.createCategory(req, res, next);
});

router.delete('/removeCategory', jwtAuth(),function(req, res, next) {
    Categories.removeCategory(req, res, next);
});

router.get('/searchCategory', jwtAuth(),function(req, res, next) {
    Categories.searchCategory(req, res, next);
});

module.exports = router;
