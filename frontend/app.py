from os import getenv
from flask import Flask, render_template
import requests as r
from requests.exceptions import ConnectionError


# -------------------
# ENV VARS
# -------------------
API_ADDR = getenv("API_ADDR", None)
API_PORT = getenv("API_PORT", None)

if API_ADDR is None or API_PORT is None:
    raise ValueError("Needs API_ADDR and API_PORT environment variables.")

API_ENDPOINT = f'http://{API_ADDR}:{API_PORT}'

# -------------------
# FLASK APP
# -------------------
app = Flask(__name__)
respond_text_plain = lambda txt, code: (txt, code, {'Content-Type': 'text/plain; charset=UTF-8'})

# -------------------
# ROUTES
# -------------------
@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/healthz')
def healthz():
    try:
        result = r.get(f'{API_ENDPOINT}/healthz', timeout=3)

        if result.status_code >= 200 and result.status_code < 400:
            return respond_text_plain('healthy', 200)
        else:
            return respond_text_plain('unhealthy', 503)

    except (TimeoutError, ConnectionError):
        return respond_text_plain('unhealthy', 503)