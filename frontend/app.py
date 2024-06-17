from os import getenv
from flask import Flask, render_template
import requests as r
from requests.exceptions import ConnectionError
from datetime import datetime


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
def homepage():
    try:
        result = r.get(f'{API_ENDPOINT}/', timeout=3)
        body = result.json()

        if result.status_code >= 200 and result.status_code < 400:
            return render_template('index.html', hasPeople=len(body) > 0, people=body)
        else:
            return render_template('error.html')

    except (TimeoutError, ConnectionError, r.exceptions.ReadTimeout):
        return render_template('error.html')

@app.route('/', methods = ['POST'])
def create_person():
    try:
        result = r.post(f'{API_ENDPOINT}/', timeout=3)
        body = result.text

        if result.status_code >= 200 and result.status_code < 400:
            return respond_text_plain(body, 200)
        else:
            return respond_text_plain('NOK', result.status_code)

    except (TimeoutError, ConnectionError, r.exceptions.ReadTimeout):
        return respond_text_plain('NOK', 503)

@app.route('/healthz')
def healthz():
    try:
        result = r.get(f'{API_ENDPOINT}/healthz', timeout=3)

        if result.status_code >= 200 and result.status_code < 400:
            return respond_text_plain('healthy', 200)
        else:
            return respond_text_plain('unhealthy', 503)

    except (TimeoutError, ConnectionError, r.exceptions.ReadTimeout):
        return respond_text_plain('unhealthy', 503)
