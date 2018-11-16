import express from 'express'
import socketIo from 'socket.io'
import path from 'path'
import { createServer } from 'http'
// import routes from './routes'

import { argv, mlog } from './libs/utils'

// Instantiate express application
const app = express()

// app.use('/api', routes)
// Setting the application port depending to environment
const port = process.env.PORT || parseInt(argv[0], 10)

// Entry point function
const start = async () => {
  try {
    // app is a request handler function that we must pass to http server instance
    
    const server = createServer(app)

    // socket.io take a server and not an express application
    const io = socketIo(server)

    // ... and finally server listening not the app
    server.listen(port, (err) => {
      if (err) throw err

      mlog(`Server is running on port ${port}`) 
    })

    io.on('connection', (socket) => {
      mlog('client connected', 'yellow')

      socket.on('change color', (color) => { 
        console.log('Color Changed to:  ------->', color)
        io.sockets.emit('change color', color)
      })

      // disconnect is fired when a client leaves the server
      socket.on('disconnect', () => {
        console.log('user disconnected')
      })

      // socket.on('disconnect', () => {
      //   mlog('client disconnected', 'yellow')
      // })

      // socket.on('join', (nickname) => {
      //   console.log(`${nickname} has joined the channel`)
      //   io.emit('hello', 'Welcome to the jungle!')
      // })

      // socket.on('message', (content) => {
      //   socket.broadcast.emit('newMessage', content)
      // })
    })
  } catch (err) {
    mlog(err, 'red')
    process.exit(42)
  }
}

// Let's Rock!
start()
