#!/usr/bin/env python3
"""Module for basic Flask app."""
from flask import Flask, render_template
from flask_babel import Babel
babel = Babel()


class Config:
    """Represents a Flask Babel configuration."""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@app.route('/')
def get_index() -> str:
    """The home / index page."""
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run()
