const io = require('socket.io')(3001);
const jsdom = require("jsdom");
const { JDOM } = jsdom;

//global.document = new JDOM(html).document;

//const messageForm = document.getElementById('send-container');

io.on('connection', socket =>  {
  console.log('connected user');
  socket.emit('chat-message','hello world')
})

/*messageForm.addEventListener('submit', e => {s
    
    //e.preventDefault();
})*/