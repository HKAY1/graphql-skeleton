'use strict'
// const socketIo = require('socket.io');
// const meetingHandler = require('./handlers/meetingHandler');

const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const UserModel = mongoose.model('user');

module.exports = (io) => {
    console.log('getting socket -> ', io.sockets.adapter.rooms.size);
    console.log('total socket now 1', new Date(), io.sockets.sockets.size);

    io.on('connection', (socket) => {
        // console.log('user connected : ', socket.id,  socket.handshake.address);
        console.log('A new user connected with socket id %s', socket.id);
        console.log('total socket now 2', new Date(), io.sockets.sockets.size);
        
        //join room & send today's lecture
        // meetingHandler(io, socket);
        
       socket.on('connect_error', (err)=>{
          console.log('Socket connection error : ', err.message);
          socket.emit('connection:error', err.message);
       });

       socket.on('disconnect', ()=>{
         console.log('%s is disconnected %s', socket.id);
       });
    });

    //middleware
   io.use((socket, next) => {
        console.log('socket in the middleware ', socket.handshake.auth, socket.handshake.address);        
        try{
            if (!socket.handshake.auth.token) {
                console.log('no token');
                let err = new Error("no token received");
                // socket.emit("handler:error", JSON.stringify({type: 'NO_AUTH', message: "No token"}));
                 return next(err);
                }
            console.log('still here');
            //otherwise extract the user from token
            const token = socket.handshake.auth.token;
    
            jwt.verify(token, _config.jwt_secret, (err, data) => {
                if (err) {
                    console.log('invalid token');
                    // socketErrorHandler(socket, "handler:error", {type: 'INVALID_TOKEN', message: "Invalid token"});
                    return next(new Error('Invalid token.'));
                }

    
                if (!['Teacher', 'Student'].includes(data.role)){
                    // socketErrorHandler(socket, "handler:error", {type: 'UN_AUTH', message: "Unauthorised roles"});
                    return next(new Error("Unauthorised roles"));
                }
    
                UserModel.findById(data.userId).exec(function (err, user) {
                    if (err) {
                        // socketErrorHandler(socket, "handler:error", {type: 'NO_USER', message: "No user found"});
                        return next(new Error('Error while getting user from token'));
                    }
                    socket.user = user;
                   return next();
                });
            });
        }
        catch(err){
            console.log("socket middleware error : ",  err);
            return next(err);
        }
        
    }); 

}
