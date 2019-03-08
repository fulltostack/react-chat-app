
import express from 'express';
import {Server} from 'http';

import socket from 'socket.io';
import ChatSocketHelper from '../sockets/chatSocket';

const app = express();

const server = Server(app);
const io = socket(server);

app.get('/', (req,res) => {
  res.status(200).send('Welcome to the chatting app...');
})

ChatSocketHelper.onConnection(io);

server.listen(8080, () => {
  console.log('Server starting on port 8080....');
})
