const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


io.on('connection', (socket) => {
  socket.on('change username', (username) => {
    socket.username = username
  })
  
  socket.on('change room', (roomCode) => {
    socket.on(roomCode, (message) => {
      messageObj = {
        sender: {
          username: socket.username
        },
        message: message
      }
      socket.broadcast.emit(roomCode, messageObj)
    })
    
    socket.on(`${roomCode}:typing`, () => {
      socket.broadcast.emit(`${roomCode}:typing`, socket.username + ' está digitando...')
    })
  })
})


const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${8000}`)
})
