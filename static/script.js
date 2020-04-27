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

// Listens for clicks and submits message to server
      document.getElementById('sendButton').onclick = () => {
          const channel = localStorage('channel');
          const message = document.getElementById('chatInput');
          sendMessage(message, channel);
      }
})
