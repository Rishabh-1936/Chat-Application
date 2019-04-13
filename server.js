var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
const mongoose = require('mongoose');
const assert = require('assert');
const Users = require('./model/users');

mongoose.connect('mongodb://localhost:27017/rishabhChatApp', { useNewUrlParser: true })


app.use('/', express.static(__dirname + '/www'));
server.listen(4000);


app.get('/forgot', (req, res) => {
    console.log("helolllll");
    res.send("Ohhhhhh you forgot ");
});

// const db = client_for_db.db(dbName);

io.on('connection', (socket) => {
    console.log("connection made " + socket.id);

    socket.on('chat', (data) => {
        io.sockets.emit('chat', data);
        console.log(data.handle + " : " + data.message);
    });

    socket.on('add user', (data) => {
        socket.broadcast.emit('add user', 'User ' + data + ' added');
    });

    socket.on('typing_on', (data) => {
        socket.broadcast.emit('typing_on', data);
    });

    socket.on('typing_off', (data) => {
        socket.broadcast.emit('typing_off', data);
    });

    socket.on('signup_not_verified', (data) => {
        console.log("signup_not_verified -> " + data.message);
        socket.emit('signup_not_verified', data);
    });

    socket.on('signUpUser', (data) => {
        console.log('user trying to sign up: ' + data.userName + " - " + data.email);

        Users.find({ email: data.email })
            .then(result => {
                if (result.length) {
                    socket.emit('alert', { message: 'Username already exist' });
                } else {
                    var user = new Users({
                        userName: data.userName,
                        email: data.email,
                        password: data.password
                    });

                    user.save(function(err) {
                        if (err) throw err;
                        else {
                            console.log(data.userName, data.email, data.password, 'saved');
                            socket.emit('signup_verified', data);
                        }
                    })
                }
            })
            .catch(err => {
                socket.emit('alert', { message: 'some error occured & user was not registered successfully' });
                throw err;
            });
    });

    socket.on('logInUser', (data) => {
        Users.find({ email: data.email, password: data.pass })
            .then(result => {
                console.log('result =>' + result);
                if (result.length != 1) {
                    socket.emit('alert', { message: 'handle or password is incorrect' });
                } else {
                    socket.emit('alert', { message: 'handle or password is correct' });

                    Users.findById(result[0]._id, (err, doc) => {
                        console.log('doc ' + doc);
                        console.log('individual ' + doc.userName);
                        socket.emit('successful_login', { userName: doc.userName });
                    })
                }
            })
            .catch(err => {
                throw err;
            })
    });
});