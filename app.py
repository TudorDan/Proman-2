from flask import Flask, render_template, request, jsonify, redirect, url_for, session

import boards_manager

app = Flask(__name__)
app.secret_key = 'Zalmodegikos'


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
    user_id = request_content['user_id']
    boards_manager.create_board(title, user_id)
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


# receives (board_id, title)
# returns json
@app.route('/api/create-task', methods=['POST'])
def create_task():
    request_content = request.json
    data = {
        'title': request_content['title'],
        'board_id': request_content['board_id']
    }
    boards_manager.create_task(data)
    return jsonify({'success': True})


@app.route('/registration', methods=['GET', 'POST'])
def register_user():
    user_ok = True
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user_ok = boards_manager.check_user(username)

        if user_ok:
            hashed_password = boards_manager.hash_password(password)
            boards_manager.add_new_user(username, hashed_password)
            return redirect(url_for('index'))
        else:
            user_ok = False
    return render_template('register.html', user_ok=user_ok)


@app.route('/user-login', methods=['GET', 'POST'])
def login():
    user_ok = True
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user_data = boards_manager.get_user_data_by_username(username)

        if user_data is None or boards_manager.verify_password(password, user_data['password']) is False:
            user_ok = False
        else:
            session['logged_in'] = True
            session['username'] = user_data['name']
            session['user_id'] = user_data['id']
            return redirect(url_for('index'))
    return render_template('login.html', user_ok=user_ok)


@app.route('/user-logout')
def logout():
    session.clear()
    session['logged_in'] = False
    return redirect(url_for('index'))


# receives (id)
# returns json
@app.route('/api/delete-board', methods=['POST'])
def delete_board():
    request_content = request.json
    boards_manager.delete_board(request_content['board_id'])
    return jsonify({'success': True})


@app.route('/api/drag-drop-update-task', methods=['POST'])
def drag_update_task():
    request_content = request.json
    boards_manager.drag_drop_update_task(request_content['id'], request_content['status_id'], request_content['rank'])
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
@app.route('/api/delete-card', methods=['POST'])
def delete_card():
    request_content = request.json()
    boards_manager.delete_card(request_content['id'])
    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(
        debug=True
    )
