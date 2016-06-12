'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../local_config');
var sha256 = require('sha256');
var Error = require('./Error');

var userSchema = mongoose.Schema({
    id: Number,
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        unique: true,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        required: false
    },
    latitude: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    pushToken:[ {
        type: String,
        required: false
    }]
});

var User = mongoose.model('User', userSchema);

var userOperations = function() {
    return {
        createUser: function(req, res) {
            console.log('he entrado en el createUser');
            var id = req.body.id;
            var username = req.body.username;
            var password = req.body.password;
            var nick = req.body.nick;
            var avatar = req.body.avatar;
            var longitude = req.body.longitude;
            var latitude = req.body.latitude;
            var email = req.body.email;

            // first try to find if this user already exists en BBDD
            User.findOne({ 'name': username, 'email': email}).exec(function(err, result) {
                if (err){
                    return Error('err010', req, res, 400);
                }else{
                    if (result){
                        return Error('err016', req, res, 500);
                    }else{
                        //User doesnt exists and we create it
                        // We do a HASH algorithm with the password
                        var passSHA = sha256(password);

                        var user = new User({
                            id: id,
                            name: username,
                            password: passSHA,
                            nick: nick,
                            avatar: avatar,
                            longitude: longitude,
                            latitude: latitude,
                            email: email
                        });

                        var errors = user.validateSync(); //This method is Sync
                        if(errors){
                            console.log(errors);
                            return Error('err001', req, res, 400);
                        }

                        user.save(function(err)  {
                            if (err){
                                return Error('err011', req, res, 400);
                            }else{
                                return res.json({success: true, message: 'User created'});
                            }
                        });
                    }
                }
            });
        } ,
        showUsers: function(req, res) {
            User.find( {}).exec(function (err, result) {
                if (err){
                    return Error('err002', req, res, 400);
                }
                console.log(result);
                res.json({success: true,result: result});
            });

        },
        authenticate: function(req, res) {
            var email = req.body.email;
            var password = req.body.password;

            if (typeof email === 'undefined'){
                return Error('err018', req, res, 500);
            }

            if (typeof password === 'undefined'){
                return Error('err017', req, res, 500);
            }
            
            //Usamos el findOne porque solo deberia haber uno en BBDD
            User.findOne({email: email, password: sha256(password)}).exec(function(err, user) {
                if (err){
                    return Error('err002', req, res, 500);
                }
                if (!user){
                    return Error('err014', req, res, 401);
                }
                if (user.password !== sha256(password)){  //We compare two HASH
                    return Error('err015', req, res, 500);
                }
                //genero el token y esta funcion es SINCRONA
                var token = jwt.sign({id: user._id}, config.jwt.secret, {
                    expiresIn: 60 * 24 * 2       //pongo el token para que expire en 2 dias
                    //expiresInMinutes: '2 days'       //pongo el token para que expire en 2 dias
                });

                res.json({success: true, token:token});
            });
        },
        removeUser: function(req, res) {
            var email = req.body.email;
            var password = req.body.password;

            if (typeof email === 'undefined'){
                return Error('err018', req, res, 500);
            }

            if (typeof password === 'undefined'){
                return Error('err017', req, res, 500);
            }

            User.findOneAndRemove({email: email, password: sha256(password)}).exec(function(err, result) {
                if (err){
                    return Error('err002', req, res, 400);
                }else {
                    if (result){
                        res.json({success: true,result: 'User removed from bbdd'});
                    }else {
                        return Error('err012', req, res, 400);
                    }
                }
            });
        },
        updateUser: function(req, res) {
            var username = req.body.username;
            var password = req.body.password;
            var email = req.body.email;
            var query = {'name': username};
            var update = {$set: {password: sha256(password), email: email}};

            if (typeof username === 'undefined'){
                return Error('err019', req, res, 500);
            }

            User.findOneAndUpdate(query, update).exec(function(err, result) {
                if (err){
                    return Error('err002', req, res, 400);
                }else {
                    if (result){
                        res.json({success: true, result: 'User updated in bbdd'});
                    }else {
                        console.log(result);
                        return Error('err012', req, res, 400);
                    }
                }
            });
        },
        showUser: function(req, res) {
            let id = req.params.id;

            if (typeof id === 'undefined'){
                return Error('err019', req, res, 500);
            }

            User.findOne( {'id': id}).exec(function (err, result) {
                if (err){
                    return Error('err002', req, res, 400);
                }
                console.log(result);
                res.json({success: true,result: result});
            });

        }
    };
};

var operations = userOperations();

module.exports = operations;
