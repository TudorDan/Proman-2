from flask import Flask, render_template, request, jsonify, url_for

import boards_manager

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


# returns json object
@app.route('/api/get-boards')
def get_boards():
    boards = boards_manager.get_boards()
    return jsonify(boards)


# returns json object
@app.route('/api/get-statuses')
def get_statuses():
    statuses = boards_manager.get_statuses()
    return jsonify(statuses)


# returns json object
@app.route('/api/get-tasks')
def get_tasks():
    tasks = boards_manager.get_tasks()
    return jsonify(tasks)


# receives json (id, title)
# returns json
@app.route('/api/update-board', methods=['POST'])
def update_board():
    request_content = request.json
    data = {'id': request_content['id'], 'title': request_content['title']}
    boards_manager.update_board(data)
    return jsonify({'success': True})


# receives json (id, title)
# returns json
@app.route('/api/update-status', methods=['POST'])
def update_status():
    request_content = request.json
    data = {'id': request_content['id'], 'title': request_content['title']}
    boards_manager.update_status(data)
    return jsonify({'success': True})


# receives (card_id, title)
# return json
@app.route('/api/update-task', methods=['POST'])
def update_task():
    request_content = request.json
    data = {'id': request_content['id'], 'title': request_content['title']}
    boards_manager.update_task(data)
    return jsonify({'success': True})


# receives (title)
# returns json
@app.route('/api/create-board', methods=['POST'])
def create_board():
    request_content = request.json
    title = request_content['title']
    boards_manager.create_board(title)
    return jsonify({'success': True})


# receives (board_id, title)
# returns json
@app.route('/api/create-status', methods=['POST'])
def create_status():
    request_content = request.json
    data = {
        'title': request_content['title'],
        'board_id': request_content['board_id']
    }
    boards_manager.create_status(data)
    return jsonify({'success': True})


@app.route('/api/getdata')
def get_data():
    data = [
        {'key': 'value', 'other': 123},
        {'key': 'value', 'other': 456},
        {'key': 'value', 'other': 789},
    ]

    return jsonify(data)


# receives (id)
# returns json
@app.route('/api/delete-board', methods=['POST'])
def delete_board():
    request_content = request.json()
    boards_manager.delete_board(request_content['id'])
    return jsonify({'success': True})


# receives (id)
# returns json
@app.route('/api/delete-card', methods=['POST'])
def delete_card():
    request_content = request.json()
    boards_manager.delete_card(request_content['id'])
    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(
        debug=True
    )
