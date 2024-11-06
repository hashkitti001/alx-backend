#!/usr/bin/env python3
"""Flask app with i18n added"""
from flask import Flask, render_template, request
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


@babel.localeselector
def get_locale() -> str:
    """Retrieves the locale for a web page."""
    queries = request.query_string.decode('utf-8').split('&')
    query_tbl = dict(map(
        lambda x: (x if '=' in x else '{}='.format(x)).split('='),
        queries
    ))
    if 'locale' in query_tbl:
        if query_tbl['locale'] in app.config["LANGUAGES"]:
            return query_tbl['locale']
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route('/')
def get_index() -> str:
    """The home / index page."""
    return render_template('3-index.html')


if __name__ == '__main__':
    app.run()
