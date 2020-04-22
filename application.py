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

if __name__ == "__main__":
    socketio.run(app)
