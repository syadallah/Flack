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

 function createMessage(user, message, time) {
     const div = document.createElement('div');
     div.classList.add('container-chat');
     const span = document.createElement('span');
     span.classList.add('time-left');
     span.append(time);
     const p = document.createElement('p');
     p.innerHTML = '<strong>' + user + '</strong>' + ' ' + message;
     div.append(p);
     div.append(span);
     document.getElementById('messagesList').append(div);
     const messagesWindow = document.querySelector('#mainContent');
     // messagesWindow.scrollTop = messagesWindow.scrollHeight;
     window.scrollTo(0, document.body.scrollHeight);
 }

 /*
For channel related
*/

// Receiving channel as list and displaying on page
socket.on('receive channels', data => {
    document.querySelector('#channelList').innerHTML = '';
    // Gets array of channels and create html for each one
    data.forEach(item => {
        const a = document.createElement('a');
        a.classList.add('singleChannel', 'list-group-item', 'list-group-item-action');
        a.setAttribute('data-channel', item);
        a.innerHTML = item;
        document.querySelector('#channelList').append(a);
    })
    socket.on('alert message', data => {
        document.getElementById('alertMessage').textContent = data.message;
        $('#alertSystem').fadeTo(1, 1).show();
        setTimeout(function() {
            $("#alertSystem").fadeTo(500, 0).slideUp(500, function(){
                $(this).hide();
            });
        }, 3000);
    })

    // Listens for clicks in each channel in channel list and sends a join signal to server if clicked
document.querySelectorAll('.singleChannel').forEach((channel) => {
    if (channel.querySelector('active') == null) {
        // Active channel does not exist
        const storedChannel = localStorage.getItem('channel');
        console.log(storedChannel)
        const currentChannel = document.querySelector(`[data-channel=${CSS.escape(storedChannel)}]`);
        currentChannel.classList.add('active');
    }

    channel.onclick = () => {
        // Removes previous channel with active class
        const remove = document.querySelectorAll('.singleChannel');
        remove.forEach(item => {
            item.classList.remove('active');
        })
        // Gets data attribute and selects corresponding element, adding class active to it
        const selectedChannel = channel.getAttribute('data-channel');
        const activeChannel = document.querySelector(`[data-channel=${CSS.escape(selectedChannel)}]`);
        selectedChannel.classList.append('active');
        // Sends time and channel data to server to join room
        let currentTime = new Date().toLocaleString();
        const currentChannel = localStorage.getItem('channel');
        const user = localStorage.getItem('username');
        console.log(user)
        document.querySelector('#messagesList').innerHTML = '';
        socket.add('join channel', {'selectedChannel': selectedChannel, 'currentTime': currentTime, 'currentChannel': currentChannel, 'user': user});
        localStorage.setItem('channel', selectedChannel);
    }
})
})
