const chatForm = document.getElementById('chat-form')
const socket = io()

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})

socket.emit('joinRoom', { username, room })

const outputMessage = (message) => {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

socket.on('message', message => {
    outputMessage(message)
})

const updateRoomName = (room) => {
    const userRoom = document.querySelector('#room-name')
    userRoom.innerHTML = room
}

const updatedUsers = (users) => {
    const userList = document.querySelector('#users')
    userList.innerHTML = `${users.map(({ username }) => `<li>${username}</li>`).join('')}`
}

socket.on('roomUsers', ({ room, users }) => {
    updateRoomName(room)
    updatedUsers(users)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    socket.emit('chatMessage', msg)
})


