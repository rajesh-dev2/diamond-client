import { io } from 'socket.io-client'

const TOKEN = process.argv[2]
const GMID = process.argv[3]
const URL = process.argv[4] || 'http://192.168.31.114:5000'

console.log('Connecting to', URL)
const socket = io(URL, { auth: { token: TOKEN, scope: 'user' }, transports: ['websocket', 'polling'] })

const timeout = setTimeout(() => {
  console.log('TIMEOUT_NO_EVENTS')
  process.exit(0)
}, 15000)

socket.on('connect', () => {
  console.log('CONNECTED', socket.id)
  socket.emit('join:match', Number(GMID))
})

socket.onAny((event, ...args) => {
  console.log('EVENT:', event, JSON.stringify(args).slice(0, 500))
})

socket.on('connect_error', (err) => {
  console.log('CONNECT_ERROR', err.message, err.data)
})

socket.io.on('error', (err) => console.log('MANAGER_ERROR', err.message))
