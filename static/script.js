document.addEventListener('DOMContentLoaded', () => {

// Connect to websocket
      var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// Prevents Enter key to submit all form inputs
      const formList = document.querySelectorAll('.inputForm');
      formList.forEach(form => {
          form.addEventListener('submit', e => {
              e.preventDefault();
          });
      })

// When connected, do:
          socket.on('connect', () => {
              // Logs in
              login();
          })

          /*
          For messaging related
          */

// Prevents sending empty messages
          validInput('#sendButton','#chatInput');
// Listens for clicks and submits message to server
      document.getElementById('sendButton').onclick = () => {
          const channel = localStorage.getItem('channel');
          const message = document.getElementById('chatInput').value;
          sendMessage(message, channel);
      }

// Sends message through Enter key if not empty
         document.getElementById('chatInput').addEventListener('keyup', e => {
             if (e.keyCode === 13) {
                 const channel = localStorage.getItem('channel');
                 const message = document.getElementById('chatInput');
                 if (message.value.length > 0) {
                     sendMessage(message.value, channel)
                     message.value = '';
                 }
             }
         })
// Display sent messages in page
         socket.on('return message', data => {
             const user = data['user'];
             const message = data['messageField'];
             const time = data['currentTime'];
             createMessage(user, message, time);
         })
})

// Display previous messages in the room from messagesArchive
 socket.on('receive previous messages', data => {
     document.querySelector('#messagesList').innerHTML = "";
     data.forEach(message => {
         // receiving previous messages from server
         createMessage(message[3], message[0], message[2]);
     })
 })
