import os

from flask import Flask
from redis import Redis
from flask import request

app = Flask(__name__)
redis = Redis(host=os.getenv('TEST_STORAGE_REDIS', '__redis_storage_not_defined__'), port=os.getenv('TEST_STORAGE_PORT', 6379))

@app.route('/')
def hello():
    count = redis.incr('hits')
    message = '<h1>Hello World!</h1><h3>I have been seen {} times.</h3>\n'.format(count)
    headers = '<table border="1" cell-padding=3px style="border: solid 1px silver; text-align: left;">'
    headers = headers + '<tr style="background-color: #A0A0A0"><th>Headers</th><th>Values</th></tr>'
    headers = headers + '<tr><td>X-Forwarded-For</td><td>' + request.headers.get('X-Forwarded-For') + '</tr>'
    headers = headers + '<tr><td>X-Real-IP</td><td>' + request.headers.get('X-Real-IP') + '</tr>'
    headers = headers + '<tr><td>Host</td><td>' + request.headers.get('Host') + '</tr>'
    headers = headers + '</table>'
    return '<html><head><title>Python Test</title></head><body>' + message + headers + '</body></html>'

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)