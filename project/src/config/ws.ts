import { createServer, IncomingMessage, ServerResponse, Server } from 'http'
import { Server as SocketServer } from 'socket.io'
import app from '~/app'

export class WebsocketClient {
  private sockets: string[] = []
  private httpServer: Server<typeof IncomingMessage, typeof ServerResponse>

  constructor() {
    this.httpServer = createServer(app)
    const io = new SocketServer(this.httpServer, {
      cors: { origin: 'http://localhost:5173' },
    })

    io.on('connection', (socket) => {
      this.sockets.push(socket.id)
    })
  }

  async handle() {}

  async start() {
    this.httpServer.listen(4050)
  }
}
