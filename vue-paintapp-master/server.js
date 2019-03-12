require('dotenv').config();
require('rootpath')();
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');

var networkInterfaces = os.networkInterfaces();

const app = express();
const cors = require('cors');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

io.on('connection', function(socket) {
  socket.on('sending message', message => {
    io.sockets.emit('new message', { message: message });
  });
});
// start server
const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000;
const server = app.listen(port, function() {
  console.log('Server listening on port ' + port);
});

io.listen(server, { log: false, origins: '*:*' });
