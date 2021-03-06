import db
import bcrypt


@db.use
def get_boards(cursor):
    query = """
        SELECT * FROM boards 
        ORDER BY id DESC;
    """
    cursor.execute(query)
    return cursor.fetchall()


@db.use
def get_statuses(cursor):
    query = """
        SELECT * FROM statuses 
        ORDER BY board_id, position;
    """
    cursor.execute(query)
    return cursor.fetchall()


@db.use
def get_tasks(cursor):
    query = """
        SELECT * FROM tasks 
        ORDER BY status_id, rank;
    """
    cursor.execute(query)
    return cursor.fetchall()


@db.use
def create_board(cursor, title, user_id):
    query = """
        INSERT INTO boards (title, user_id) 
        VALUES (%(title)s, %(user_id)s);
    """
    cursor.execute(query, {
        'title': title,
        'user_id': user_id
    })
    # get the board_id the database created
    query = """
        SELECT * FROM boards 
        WHERE title = %(title)s 
        ORDER BY id DESC;
    """
    cursor.execute(query, {
        'title': title
    })
    board_id = cursor.fetchone()['id']

    cursor.execute(f"INSERT INTO statuses (title, position, board_id) VALUES ('New', 100, {board_id});")
    cursor.execute(f"INSERT INTO statuses (title, position, board_id) VALUES ('In progress', 200, {board_id});")
    cursor.execute(f"INSERT INTO statuses (title, position, board_id) VALUES ('Testing', 300, {board_id});")
    cursor.execute(f"INSERT INTO statuses (title, position, board_id) VALUES ('Done', 400, {board_id});")


@db.use
def create_status(cursor, data):
    # get the last status position
    query = """
        SELECT * FROM statuses
        WHERE board_id = %(board_id)s 
        ORDER BY position DESC;
    """
    cursor.execute(query, {
        'board_id': data['board_id']
    })
    position = cursor.fetchone()['position'] + 100

    query = """
        INSERT INTO statuses (title, position, board_id) 
        VALUES (%(title)s, %(position)s, %(board_id)s);
    """
    return cursor.execute(query, {
        'title': data['title'],
        'position': position,
        'board_id': data['board_id']
    })


@db.use
def create_task(cursor, data):
    # get the first status position
    query = """
        SELECT * FROM statuses 
        WHERE board_id = %(board_id)s 
        ORDER BY position;
    """
    cursor.execute(query, {
        'board_id': data['board_id']
    })
    status_id = cursor.fetchone()['id']

    # get the last rank for the tasks from the status_id
    query = """
        SELECT * FROM tasks 
        WHERE status_id = %(status_id)s 
        ORDER BY rank DESC;
    """
    cursor.execute(query, {
        'status_id': status_id
    })
    temp = cursor.fetchone()
    if temp is None:
        rank = 100
    else:
        rank = temp['rank'] + 100

    query = """
        INSERT INTO tasks (title, rank, status_id, archived) 
        VALUES (%(title)s, %(rank)s, %(status_id)s, %(archived)s);
    """
    return cursor.execute(query, {
        'title': data['title'],
        'rank': rank,
        'status_id': status_id,
        'archived': False
    })


@db.use
def update_board(cursor, data):
    query = """
        UPDATE boards 
        SET title = %(title)s 
        WHERE id = %(id)s;
    """
    return cursor.execute(query, {
        'id': data['id'],
        'title': data['title']
    })


@db.use
def update_status(cursor, data):
    query = """
        UPDATE statuses 
        SET title = %(title)s 
        WHERE id = %(id)s;
    """
    return cursor.execute(query, {
        'id': data['id'],
        'title': data['title']
    })


@db.use
def update_task(cursor, data):
    query = """
        UPDATE tasks 
        SET title = %(title)s 
        WHERE id = %(id)s;
    """
    return cursor.execute(query, {
        'id': data['id'],
        'title': data['title']
    })


@db.use
def drag_drop_update_task(cursor, task_id, status_id, rank):
    query = """
        UPDATE tasks 
        SET status_id = %(status_id)s, rank = %(rank)s 
        WHERE id = %(task_id)s;
    """
    return cursor.execute(query, {'task_id': task_id, 'status_id': status_id, 'rank': rank})


def hash_password(plain_text_password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


@db.use
def check_user(cursor, username):
    query = """
        SELECT * FROM users 
        WHERE name = %(username)s;
    """
    cursor.execute(query, {'username': username})
    result = cursor.fetchone()
    if result is None:
        return True
    return False


@db.use
def add_new_user(cursor, username, password):
    query = """
        INSERT INTO users (name, password) 
        VALUES(%(username)s, %(password)s);
    """
    cursor.execute(query, {'username': username, 'password': password})


@db.use
def get_user_data_by_username(cursor, username):
    query = """
        SELECT * FROM users 
        WHERE name = %(username)s;
    """
    cursor.execute(query, {'username': username})
    return cursor.fetchone()


@db.use
def delete_board(cursor, board_id):
    # firstly, delete tasks from board
    query = """
        DELETE FROM tasks 
        USING statuses 
        WHERE tasks.status_id = statuses.id AND statuses.board_id = %(board_id)s;
    """
    cursor.execute(query, {'board_id': board_id})

    # secondly, delete statuses from board
    query = """
        DELETE FROM statuses 
        WHERE board_id = %(board_id)s;
    """
    cursor.execute(query, {'board_id': board_id})

    query = """
        DELETE FROM boards
        WHERE id = %(board_id)s;
    """
    cursor.execute(query, {'board_id': board_id})


@db.use
def delete_task(cursor, task_id):
    query = """
        DELETE FROM tasks
        WHERE id = %(task_id)s;
    """
    cursor.execute(query, {'task_id': task_id})


@db.use
def archive_task(cursor, task_id):
    query = """
        UPDATE tasks
        SET archived = TRUE
        WHERE id = %(task_id)s;
    """
    cursor.execute(query, {'task_id': task_id})


@db.use
def activate_task(cursor, task_id):
    query = """
        UPDATE tasks
        SET archived = FALSE
        WHERE id = %(task_id)s;
    """
    cursor.execute(query, {'task_id': task_id})
