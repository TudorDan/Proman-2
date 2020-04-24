import db

@db.use
def get_statuses(cursor):
    query = """
        SELECT *
        FROM statuses ORDER BY id DESC;
    """
    cursor.execute(query)
    return cursor.fetchall()

@db.use
def get_boards(cursor):
    query = """
        SELECT *
        FROM boards ORDER BY id DESC;
    """
    cursor.execute(query)
    return cursor.fetchall()

@db.use
def get_cards(cursor, board_id):
    query = """
        SELECT cards.title as card_title, 
                cards.id as card_id, 
                statuses.title as status_name,
                cards.rank, 
                cards.status_id,
                cards.board_id
        FROM cards JOIN statuses ON cards.status_id = statuses.id
        WHERE cards.board_id = %(board_id)s
        ;
    """
    cursor.execute(query, {
        'board_id': board_id
    })
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
    return cursor.execute(query, {
        'title': title
    })

@db.use
def create_card(cursor, data):
    query = """
        INSERT INTO cards (board_id, title, status_id) 
            VALUES (%(board_id)s,%(title)s, %(status_id)s);
    """
    return cursor.execute(query, {
        'board_id': data['board_id'],
        'title': data['title'],
        'status_id': data['status_id']
    })
@db.use
def update_card(cursor, data):
    query = """
        UPDATE cards SET title = %(title)s WHERE id = %(id)s;
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
    #delete cards
    return cursor.execute(query, {'board_id': board_id})