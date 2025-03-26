import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('ws://localhost:4000')

export default function Chat() {
  const [messages, setMessages] = useState<{ name: string; message: string }[]>(
    []
  )
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [messageJoinRoom, setMessageJoinRoom] = useState<string[]>([])
  const [chatType, setChatType] = useState('group')

  useEffect(() => {
    socket.on('message', (data) => {
      console.log({ data })
      setMessages((prev) => [...prev, data])
    })

    socket.on('room-invited', (message) => {
      console.log(message)
      setMessageJoinRoom((prev) => [...prev, message])
    })
    return () => {
      socket.off('message')
    }
  }, [])

  const joinRoom = () => {
    const targetRoom = chatType === 'private' ? `HUY-VUONG` : room

    console.log('joinRoom', targetRoom)
    if (targetRoom) {
      socket.emit('joinRoom', { room: targetRoom, name })
    }
  }

  const leaveRoom = () => {
    if (room) {
      socket.emit('leaveRoom', room)
      setMessages([])
    }
  }

  const sendMessage = () => {
    if (input && name) {
      const targetRoom = chatType === 'private' ? `HUY-VUONG` : room
      socket.emit('message', { name, room: targetRoom, message: input })
      setInput('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          Messenger Clone
        </h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 border rounded-lg mb-3"
        />
        <select
          onChange={(e) => setChatType(e.target.value)}
          className="w-full p-2 border rounded-lg mb-3"
        >
          <option value="group">Group Chat</option>
          <option value="private">Private Chat</option>
        </select>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder={
            chatType === 'group' ? 'Enter group name' : 'Enter recipient name'
          }
          className="w-full p-2 border rounded-lg mb-3"
        />
        <div className="flex justify-between">
          <button
            onClick={joinRoom}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Join
          </button>
          <button
            onClick={leaveRoom}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Leave
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-4 h-64 overflow-y-auto bg-gray-200 p-3 rounded-lg">
          <div className="flex-1">
            {messages.map((msg, idx) => (
              <p key={idx} className="p-2 bg-white rounded-lg shadow mb-2">
                <strong>{msg.name}:</strong> {msg.message}
              </p>
            ))}

            <div>
              {messageJoinRoom.map((message) => {
                return (
                  <p
                    key={message}
                    className="p-2 bg-white rounded-lg shadow mb-2"
                  >
                    {message}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
