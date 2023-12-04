const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector('.chat-messages');
const roomName =document.getElementById("room-name")
const userList =document.getElementById("users")
const socket = io()

// getting username & room from url
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})
// console.log(username, room);

// joining chatroom
socket.emit("joinRoom", {username,room})

//getting room & users
socket.on("roomUsers", ({room, users})=>{
    showRoomName(room)
    showUsers(users)
})

//msg from server
socket.on("message", message => {
    // console.log(message)
    outputMessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight;   // Scroll down
})

//submitting message
chatForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value  //getting msg
    socket.emit("chatMessage", msg)       //exit msg to server
    e.target.elements.msg.value = '';   // clearing input
    e.target.elements.msg.focus();
})

// msg output to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = ` <p class="meta"> ${message.username} <span>${message.time}</span></p>
    <p class="text"> ${message.text} </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

// showing room names in DOM
function showRoomName(room){
    roomName.innerText = room
}

// showing users in DOM
function showUsers(users){
    // userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}

// ------------------xxxx-------------------