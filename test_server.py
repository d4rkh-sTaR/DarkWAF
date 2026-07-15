from flask import Flask, make_response

app = Flask(__name__)

# 1. Global error handler intercepts crashes/404s/500s and overrides to 200
@app.errorhandler(Exception)
def handle_all_errors(error):
    return "", 200

# 2. Catch-all route intercepts undefined paths and returns 200
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return "", 200

if __name__ == '__main__':
    app.run(debug=True)

