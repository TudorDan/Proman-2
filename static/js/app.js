url_api = 'http://127.0.0.1:5000/api/';
url_boards = url_api + "get-boards";
url_statuses = url_api + "get-statuses";
url_tasks = url_api + "get-tasks";
url_create_board = url_api + "create-board";
url_create_status = url_api + "create-status";
url_create_task = url_api + "create-task";
url_drag_update_task = url_api + "drag-update-task";

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
                    <h5 class="card-title float-left" id="board-title-${board.id}" contenteditable="true" 
                    onfocusout="updateBoardTitle(${board.id})">${board.title}</h5>
                    <a href="" class="btn btn-info mx-auto create-status" data-board-id="${board.id}"
                        data-toggle="modal" data-target="#template-modal">
                       <i class="fas fa-plus-circle"></i>
                       New status
                    </a>
                    <a href="" class="btn btn-secondary mx-auto create-task" data-board-id="${board.id}"
                        data-toggle="modal" data-target="#template-modal">
                       <i class="fas fa-plus-circle"></i>
                       New task
                    </a>
                    <a class="float-right" data-toggle="collapse" href="#collapse-board-${board.id}" role="button" 
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
            <div class="float-left card border border-secondary status mb-2" id="status-${status.id}"
             ondrop="drop(event)" ondragover="allowDrop(event)">
                <h5 id="status-title-${status.id}" contenteditable="true" 
                onfocusout="updateStatusTitle(${status.id})" ondrop="preventDrop(event)">${status.title}</h5>
            </div>
        </div>`;
        board.innerHTML += statusTemplate;
    }
}

async function showTasks(tasks) {
    for (let task of tasks) {
        let status = document.querySelector(`#status-${task.status_id}`);
        let taskTemplate = `
        <div id="task-${task.id}" class="border border-secondary task mb-2" draggable="true" ondragstart="drag(event)" 
        ondrop="preventDrop(event)">
            <h5 id="task-title-${task.id}" contenteditable="true" 
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
    const modalButton = document.querySelector('#modal-button');
    await modalButton.addEventListener('click', processNewBoard);
}

async function processNewBoard(event) {
    let boardTitle = document.querySelector('[name="modal-data"]').value;
    if (boardTitle) {
        let dataToBePosted = {title: boardTitle};
        let serverResponse = await fetch(url_create_board, {
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
        }, 2000);
    }
}

async function createNewStatus(event) {
    const labelModal = document.querySelector('#label-modal');
    labelModal.innerText = 'Status title:';

    $('#template-modal').modal('show');

    const modalButton = document.querySelector('#modal-button');
    modalButton.boardId = this.dataset.boardId;
    await modalButton.addEventListener('click', processNewStatus);
}

async function processNewStatus(event) {
    let statusTitle = document.querySelector('[name="modal-data"]').value;
    const boardId = event.target.boardId;
    if (statusTitle) {
        let dataToBePosted = {
            title: statusTitle,
            board_id: boardId
        };
        let serverResponse = await fetch(url_create_status, {
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
        }, 2000);
    }
}

async function createNewTask() {
    const labelModal = document.querySelector('#label-modal');
    labelModal.innerText = 'Task title:';

    $('#template-modal').modal('show');

    const modalButton = document.querySelector('#modal-button');
    modalButton.boardId = this.dataset.boardId;
    await modalButton.addEventListener('click', processNewTask);
}

async function processNewTask() {
    let taskTitle = document.querySelector('[name="modal-data"]').value;
    const boardId = event.target.boardId;
    if (taskTitle) {
        let dataToBePosted = {
            title: taskTitle,
            board_id: boardId
        };
        let serverResponse = await fetch(url_create_task, {
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
        }, 2000);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

async function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");

    ev.target.appendChild(document.getElementById(data));
    const taskId = data.replace('task-', '');
    const statusId = document.getElementById(data).parentElement.id.replace('status-', '');

    let dataToBePosted = {
            task_id: taskId,
            status_id: statusId
        };
    let serverResponse = await fetch(url_drag_update_task, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dataToBePosted)
    });
    let jsonResponse = await serverResponse.json();
    console.log(jsonResponse['success']);
}

function preventDrop(ev) {
    ev.stopPropagation();
}

async function init() {
    await getBoards();
    await getStatuses();
    await getTasks();

    const createBoardButton = document.querySelector('#create-board');
    await createBoardButton.addEventListener('click', createNewBoard);

    const createStatusButtons = document.querySelectorAll('.create-status');
    for (let button of createStatusButtons) {
        await button.addEventListener('click', createNewStatus);
    }

    const createTaskButtons = document.querySelectorAll('.create-task');
    for (let button of createTaskButtons) {
        await button.addEventListener('click', createNewTask);
    }
}

init();