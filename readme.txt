tables
    boards (id, title)
    cards (id, board_id, title, status_id, rank)
    statuses (id, title)

rename rename-to-db.py to db.py ( db.py is on .gitignore)
add your connection data to db.py


reinstall venv if it is not working

pip: psycopg2, flask
