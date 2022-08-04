require('app-module-path').addPath(__dirname);
const express = require('express');
global._config = require('./config/config');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const { ApolloServer }  = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const cors = require('cors');
const {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
  } = require ('apollo-server-core');

async function startApp(){
    const app = express();

    //create server and pass down to socket
    const server1 = require('http').createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
      });
      const socketIo = require('socket.io');
      const io = socketIo(server1, {
        cors: {
            origin: "*"
        }
    });
    require('./sockets/socket')(io);
    
    // io.on('connection', (socket)=>{
    //     console.log('socket connected just now', socket.id);
    // });
    
    await server.start();

    //cors 
    app.use(cors());
    server.applyMiddleware({ app });
    //  Serving static files
     app.use(express.static('public'));

    //  Body parser, reading data from body into req.body
     app.use(express.json());
     app.use(express.urlencoded({ extended: true }));

    require('bootstrap/express')(app, _config);

    server1.listen(app.get('port'), ()=>{
        console.log('running app on port %d in %s environment', app.get('port'), _config.node_env);
    })

}

/* configure database */
require('bootstrap/db')(_config, eventEmitter);

/* run seeds after db connection establishment */
eventEmitter.once('db-connection-done', startApp);

/*
eventEmitter.once('db-connection-done', function(){
     require('bootstrap/seed-data')(eventEmitter);
})

eventEmitter.once('seeding-done', startApp);
*/