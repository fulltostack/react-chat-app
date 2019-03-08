const ChatSocketHelper = {
  users: [],

  onConnection(socketIO) {
    socketIO.on('connection', (socket) => {
      console.log('connection establishment is in progress...');

      socket.on('join', (socketData) => {
        socket.join(socketData);
        const {
          id
        } = socket;

        this.users.push({
          id,
          nickname: socketData,
          online: true,
        });
        let sockets = [];

        Object.keys(socketIO.sockets.sockets).forEach((id) => {
          for (const user of this.users) {
            if (user.id == id) {
              sockets.push(user);
            }
          }
        });

        socketIO.sockets.emit('users', sockets)
      });

      socket.on('send', (socketData) => {
        socketIO.sockets.to(socketData.receiver).emit('receiver', socketData)
      });

      socket.on('typing', (socketData) => {
        console.log('typing', socketData)
        socketIO.sockets.to(socketData.chatId).emit('typing', socketData)
      });
      
      socket.on('stop-typing', (socketData) => {
        console.log('stop-typing', socketData)
        socketIO.sockets.to(socketData.chatId).emit('stop-typing', socketData)
      });

      socket.on('disconnect', (socketData) => {
        this.users = this.users.map(user => {
          if (user.id === socket.id) {
            user.online = false;
          }

          return user;
        });

        socketIO.sockets.emit('user-offline', this.users)
      });
    })
  }

};

export default ChatSocketHelper;