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

if __name__ == "__main__":
    socketio.run(app)
