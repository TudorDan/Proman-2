import db


@db.use
def get_boards(cursor):
    query = """
        SELECT *
        FROM boards ORDER BY id DESC;
    """
    cursor.execute(query)
    return cursor.fetchall()


@db.use
def get_statuses(cursor):
    query = """
        SELECT *
        FROM statuses ORDER BY board_id, position;
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
def update_board(cursor, data):
    query = """
        UPDATE boards SET title = %(title)s WHERE id = %(id)s;
    """
    return cursor.execute(query, {
        'id': data['id'],
        'title': data['title']
    })


@db.use
def create_board(cursor, title):
    query = """
        INSERT INTO boards (title) VALUES (%(title)s);
    """
    cursor.execute(query, {
        'title': title
    })

    query = """
        SELECT * FROM boards
        WHERE title = %(title)s ORDER BY id DESC;
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
def create_task(cursor, data):
    query = """
        INSERT INTO tasks (title, status_id) 
            VALUES (%(title)s, %(status_id)s);
    """
    return cursor.execute(query, {
        'title': data['title'],
        'status_id': data['status_id']
    })


@db.use
def update_task(cursor, data):
    query = """
        UPDATE tasks SET title = %(title)s WHERE id = %(id)s;
    """
    return cursor.execute(query, {
        'id': data['card_id'],
        'title': data['title']
    })


@db.use
def delete_board(cursor, board_id):
    query = """
        DELETE FROM boards WHERE id = %(board_id)s
    """
    # delete cards
    return cursor.execute(query, {'board_id': board_id})
