const socket = io('http://localhost:3001');
var messageForm = document.getElementById('send-container');
var messageInput = document.getElementById('message-input');

socket.on('chat', data => {
    console.log('data'+data);
})

messageForm.addEventListener('submit', e =>{
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('chat-message', 'hello');
    socket.on('send-chat-message', message =>{
        socket.broadcast.emit('chat-message');
    })
})


/*
function myFunction()
{
    var checkbox = document.getElementById("myCheck");
    var text = document.getElementById("text");
    if (checkbox.checked == true){
        text.style.display = "none";
    }
        else
        text.style.display = "block";
}*/
