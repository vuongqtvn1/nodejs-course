import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './app'
import { logger } from './utils/logger'

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: 'http://localhost:5173' } })

// io.use((socket, next) => {
//   const token = socket.handshake.auth.token
//   if (token === 'websocket') {
//     // userId
//     return next()
//   }
//   return next(new Error('Authentication error'))
// })

// const socketIds: string[] = []

io.on('connection', (socket) => {
  // socketIds.push(socket.id)
  // console.log('connected', socket.id)

  // socketIds.forEach((socketId) => {
  //   io.to(socketId).emit('some event')
  // })

  // socket.on('message', (data) => {
  //   console.log('message', data)

  //   io.emit('message', data)
  // })

  // socket.on('disconnect', () => {
  //   console.log('User disconnected:', socket.id)
  // })

  // socket.on('joinRoom', (room) => {
  //   console.log({ room })
  //   socket.join(room)
  // })

  // socket.on('sendMessage', ({ room, message }) => {
  //   io.to(room).emit('message', message)
  // })

  // socket.on('leaveRoom', (room) => {
  //   socket.leave(room)
  // })

  console.log('User connected:', socket.id)

  socket.on('joinRoom', ({ room, name }) => {
    socket.join(room)
    io.to(room).emit('room-invited', `${name} joined room: ${room}`)
    console.log(`${socket.id} joined room: ${room}`)
  })

  socket.on('message', ({ name, room, message }) => {
    console.log(`[${room}] ${name}: ${message}`)
    io.to(room).emit('message', { name, message })
  })

  socket.on('leaveRoom', (room) => {
    socket.leave(room)
    console.log(`${socket.id} left room: ${room}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

httpServer.listen(4000, () => {
  logger.info('Websocket opening port 4000')
})

export default io
