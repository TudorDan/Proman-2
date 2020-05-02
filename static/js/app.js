url_api = 'http://127.0.0.1:5000/api/';
url_boards = url_api + "get-boards";
url_statuses = url_api + "get-statuses";
url_tasks = url_api + "get-tasks";
url_add_new_board = url_api + "create-board";

async function getBoards() {
    let serverResponse = await fetch(url_boards);
    let jsonResponse = await serverResponse.json();
    await showBoards(jsonResponse);
    // fetch(url_boards)
    //     .then((serverResponse) => {
    //         return serverResponse.json();
    //     })
    //     .then((jsonResponse) => {
    //         console.log('1');
    //         showBoards(jsonResponse);
    //     });
}

async function getStatuses() {
    let serverResponse = await fetch(url_statuses);
    let jsonResponse = await serverResponse.json();
    await showStatuses(jsonResponse);
    // fetch(url_statuses)
    //     .then((serverResponse) => {
    //         return serverResponse.json();
    //     })
    //     .then((jsonResponse) => {
    //         console.log('2');
    //         showStatuses(jsonResponse);
    //     });
}

async function getTasks() {
    let serverResponse = await fetch(url_tasks);
    let jsonResponse = await serverResponse.json();
    await showTasks(jsonResponse);
    // fetch(url_tasks)
    //     .then((serverResponse) => {
    //         return serverResponse.json();
    //     })
    //     .then((jsonResponse) => {
    //         console.log('3');
    //         showTasks(jsonResponse);
    //     });
}

async function showBoards(boards) {
    for (let board of boards) {
        let boards_container = document.getElementById('boards-container');
        // card_template = `<div class="card float-left mb-2" style="width:120px;">
        // <div class="card-body">
        // <h5 class="card-title" id="board-title-`+board.id+`" contenteditable="true"
        // onfocusout="updateBoardTitle(` + board.id + `)">` + board.title + `</h5>
        // <a href="#" class="btn btn-primary" onClick="getCardsForBoard(` + board.id + `)">Show Cards</a>
        // </div>
        // </div>`
        let board_template = `
        <div class="card mb-2">
            <div class="card-body" id="board-${board.id}">
                <div class="row mb-2">
                    <h5 class="card-title ml-4" id="board-title-${board.id}" contenteditable="true" 
                    onfocusout="updateBoardTitle(${board.id})">${board.title}</h5>
                    <a href="" class="btn btn-outline-info mx-auto" id="create-board" data-toggle="modal"
                       data-target="#template-modal">
                       <i class="fas fa-plus"></i>
                       New status
                    </a>
                    <a class="mr-4" data-toggle="collapse" href="#collapse-board-${board.id}" role="button" 
                    aria-expanded="false" aria-controls="collapse-board">
                        <i class="far fa-caret-square-down fa-2x"></i>
                    </a>
                </div>
            </div>
        </div>`;
        boards_container.innerHTML += board_template;
    }
}

async function showStatuses(statuses) {
    for (let status of statuses) {
        let board = document.querySelector(`#board-${status.board_id}`);
        let statusTemplate = `
        <div class="collapse" id="collapse-board-${status.board_id}">
            <div class="col-3 float-left border border-secondary" id="status-${status.id}">
                <h5 id="status-title-${status.id}" contenteditable="true" 
                onfocusout="updateStatusTitle(${status.id})">${status.title}</h5>
            </div>
        </div>`;
        board.innerHTML += statusTemplate;
    }
}

async function showTasks(tasks) {
    for (let task of tasks) {
        let status = document.querySelector(`#status-${task.status_id}`);
        let taskTemplate = `
        <div id="task-${task.id}">
            <h5 id="task-title-${task.id}" class="border border-secondary" contenteditable="true" 
            onfocusout="updateTaskTitle(${task.id})">${task.title}</h5>
        </div>`;
        status.innerHTML += taskTemplate;
    }
}

function updateBoardTitle(boardId) {
    elementToSelect = "board-title-" + boardId;
    titleValue = document.getElementById(elementToSelect);

    data = {
        'id': boardId,
        'title': titleValue.innerText,
    }

    settings = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    }

    fetch('/api/update-board', settings)
        .then((serverResponse) => {
            return serverResponse.json();
        })
    // .then((jsonResponse) => {
    //     console.log(jsonResponse);
    // })
}

function updateStatusTitle(statusId) {
    elementToSelect = "status-title-" + statusId;
    titleValue = document.getElementById(elementToSelect);

    data = {
        'id': statusId,
        'title': titleValue.innerText,
    }

    settings = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    }

    fetch('/api/update-status', settings)
        .then((serverResponse) => {
            return serverResponse.json();
        })
    // .then((jsonResponse) => {
    //     console.log(jsonResponse);
    // })
}

function updateTaskTitle(taskId) {
    elementToSelect = "task-title-" + taskId;
    titleValue = document.getElementById(elementToSelect);

    data = {
        'id': taskId,
        'title': titleValue.innerText,
    }

    settings = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data),
    }

    fetch('/api/update-task', settings)
        .then((serverResponse) => {
            return serverResponse.json();
        })
    // .then((jsonResponse) => {
    //     console.log(jsonResponse);
    // })
}

async function createNewBoard() {
    const labelModal = document.querySelector('#label-modal');
    labelModal.innerText = 'Board title:';
    $('#template-modal').modal('show');
    const modalButon = document.querySelector('#modal-button');
    modalButon.addEventListener('click', processNewBoard);
}

async function processNewBoard(event) {
    let boardTitle = document.querySelector('[name="modal-data"]').value;
    if (boardTitle) {
        let dataToBePosted = {title: boardTitle}
        let serverResponse = await fetch(url_add_new_board, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataToBePosted)
        });
        let jsonResponse = await serverResponse.json();
        console.log(jsonResponse['success']);
    } else {
        let warn = document.querySelector('div.alert.alert-danger');
        warn.style.display = 'block';
        setTimeout(() => {
            warn.style.display = 'none';
        }, 1500);
    }
}

async function init() {
    await getBoards();
    await getStatuses();
    await getTasks();

    const createButton = document.querySelector('#create-board');
    await createButton.addEventListener('click', createNewBoard);
}

init();