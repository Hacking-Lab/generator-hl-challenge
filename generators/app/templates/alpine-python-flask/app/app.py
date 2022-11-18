from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World! Welcome to Hacking-Lab alpine python flask'
