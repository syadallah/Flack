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
})
