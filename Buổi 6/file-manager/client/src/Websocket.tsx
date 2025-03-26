import { io } from 'socket.io-client'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { useEffect, useState } from 'react'

const socket = io('ws://localhost:3000', {
  auth: { token: 'websocket' },
  query: { service: 'admin' },
})

console.log(socket)

socket.on('connect', () => {
  console.log(socket.id)
})

// userA lớp Toán

// userB lớp toán

// userC lớp tiếng anh

const Websocket = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')
  const [room, setRoom] = useState<string>('')

  const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleChangeRoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value)
  }

  const sendMessage = () => {
    if (message) {
      socket.emit('sendMessage', { room, message })
    }
  }

  const joinRoom = () => {
    if (room) {
      socket.emit('joinRoom', room)
    }
  }

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message])
    })
  }, [])

  return (
    <div>
      <div className="flex gap-4 p-4">
        <Input value={room} onChange={handleChangeRoom} />
        <Button onClick={joinRoom}>Vào phòng</Button>
      </div>

      <div className="flex gap-4 p-4">
        <Input value={message} onChange={handleChangeMessage} />
        <Button onClick={sendMessage}>Gửi tin nhắn</Button>
      </div>

      <div className="p-4">
        {messages.map((message) => {
          return <div className="p-2 border rounded mb-2">{message}</div>
        })}
      </div>
    </div>
  )
}

export default Websocket
