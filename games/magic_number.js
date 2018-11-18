import Magic from './magic_player'
// socket.io take a server and not an express application

let io
let gameSocket

const magic = new Magic()

exports.initGame = (sio, socket) => {
  io = sio
  gameSocket = socket
  let winner = [];

  console.log('PLAYER CONNECTED')

  gameSocket.emit('connected', { message: 'welcome to the Game' })

  

  gameSocket.on('join', (data) => {
    if (!data.name && !data.room) {
      // 'Name and room are required');
      return 'Name and room are required'
    }

    let random = magic.generateRandomNumber()
    console.log(random);

    gameSocket.on('try', (input) => {
      console.log(input);

      if (input < random) {
        console.log('ID -->', socket.id)
        console.log('Grand -->')
        io.sockets.in(socket.id).emit('msg', 'plus grand');
      }
      else if (input > random) {
        console.log('petit')
        io.sockets.in(socket.id).emit('msg', 'plus petit');
      }
      else if (input === random) { 
        let player = magic.getPlayerList(data.room).filter(play => play.id === socket.id)
        player.score += 1
      }
    })

    magic.getPlayerList(data.room).forEach(element => {
      if (element.score === 5) {
        winner.push(element)
      }
    });

    gameSocket.broadcast.to(data.room).emit('winner', `winner is ${winner[0]}`)

    gameSocket.join(data.room)
    magic.removePlayer(gameSocket.id)
    magic.addMagicPlayer(gameSocket.id, data.name, data.room)

    console.log('MMMMMMM', magic.getPlayerList(data.room))
    console.log('ROOM', data.room)

    gameSocket.to(data.room).emit('updatePlayerList', magic.getPlayerList(data.room))
    gameSocket.emit('newMessage', 'Welcome to channel')
    gameSocket.broadcast.to(data.room).emit('newMessage', `${data.name} join channel`)
  })


  gameSocket.on('disconnect', () => {
    const player = magic.removePlayer(socket.id)

    if (player) {
      io.to(player.room).emit('updatePlayerList', magic.getPlayerList(player.room))
      io.to(player.room).emit('newMessage', `Player ${player.name} has left.`)
    }
  })
}
