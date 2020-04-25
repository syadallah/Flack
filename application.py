import os

from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room
socketio = SocketIO(app)


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")



@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("connect")
def test_connect():
    print(request.sid)

@socketio.on("disconnect")
def test_connect():
    print("DISCONNECTED!")

# For returning current channels
@socketio.on("available channels")
def availableChannel():
    # Get keys from messagesArchive dict as a list
    channelList = list(messagesArchive)
    emit("receive channels", channelList)

# For adding a new channel to List
@socketio.on("submit channel")
def channel(data):
    channel = data.get('channelName')
    # Checks if submitted channel exists as a key in dict
    if channel in messagesArchive.keys():
        #Channel exists
        emit('alert message', {'message': "Channel already exists"}, room=request.sid)
        return False
    # Creates a new key and initializes with a deque with max length 100, if key already exists, do nothing
    # Saw on https://docs.quantifiedcode.com/python-anti-patterns/correctness/not_using_setdefault_to_initialize_a_dictionary.html
    messagesArchive.setdefault(channel, deque([], maxlen=100))
    # Get keys from dict as a list
    channelList = list(messagesArchive)
    emit("receive channels", channelList, broadcast=True)
    #emit("return message", channel)

# For joining a channel
@socketio.on("join channel")
def joinChannel(data):
    selectedChannel = data.get('selectedChannel')
    if selectedChannel == 'empty':
        # joining a channel for the first time
        join_room()
        try:
            if messagesArchive[]:
                messages = list(messagesArchive[])
                emit('receive previous messages', messages)
        except KeyError:
            emit('alert message', {'message': "Saved channel does not exist, please log off"}, room=request.sid)

        emit('return message', {'messageField': 'has joined the room ' + currentChannel, 'currentChannel': currentChannel, 'currentTime': data.get('currentTime'), 'user': data.get('user')}, room=currentChannel)

if __name__ == "__main__":
    socketio.run(app)
