const url_api = 'http://127.0.0.1:5000/api/';
const url_boards = url_api + "get-boards";
const url_statuses = url_api + "get-statuses";
const url_tasks = url_api + "get-tasks";
const url_create_board = url_api + "create-board";
const url_create_status = url_api + "create-status";
const url_create_task = url_api + "create-task";

async function getBoards() {
    let serverResponse = await fetch(url_boards);
    let jsonResponse = await serverResponse.json();
    await showBoards(jsonResponse);
}

async function getStatuses() {
    let serverResponse = await fetch(url_statuses);
    let jsonResponse = await serverResponse.json();
    await showStatuses(jsonResponse);
}

async function getTasks() {
    let serverResponse = await fetch(url_tasks);
    let jsonResponse = await serverResponse.json();
    await showTasks(jsonResponse);
}

async function showBoards(boards) {
    for (let board of boards) {
        let boards_container = document.getElementById('boards-container');
        let board_template;
        if (board.user_id === null) {
            board_template = `
        <div class="card mb-2">
            <div class="card-body board-css" id="boardd-${board.id}">
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
                <div class="collapse" id="collapse-board-${board.id}"></div>
            </div>
        </div>`;
        } else {
            board_template = `
        <div class="card mb-2">
            <div class="card-body board-css-private" id="board-${board.id}">
                <div class="row mb-2">
                    <h5 class="card-title float-left" id="board-title-${board.id}" contenteditable="true" 
                    onfocusout="updateBoardTitle(${board.id})">${board.title}</h5>
                    <span>(private)</span>
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
                <div class="collapse" id="collapse-board-${board.id}"></div>
            </div>
        </div>`;
        }
        boards_container.innerHTML += board_template;
    }
}

function addDragula() {
    let statuses = document.querySelectorAll("[id^='statuss-']");
    let statusesArray = Array.from(statuses);
    dragula(statusesArray);
}

async function showStatuses(statuses) {
    for (let status of statuses) {
        let board = document.querySelector(`#collapse-board-${status.board_id}`);
        let statusTemplate = `
        <div class="float-left card border border-secondary status-css mb-2" id="statuss-${status.id}">
            <h5 id="status-title-${status.id}" contenteditable="true" class="mx-auto"
            onfocusout="updateStatusTitle(${status.id})">
                ${status.title}
            </h5>
        </div>`;
        // let statusTemplate = `
        // <div class="collapse" id="collapse-board-${status.board_id}">
        //     <div class="float-left card border border-secondary status-css mb-2" id="status-${status.id}"
        //      ondrop="drop(event)" ondragover="allowDrop(event)">
        //         <h5 id="status-title-${status.id}" contenteditable="true" class="mx-auto"
        //         onfocusout="updateStatusTitle(${status.id})" ondrop="preventDrop(event)">
        //             ${status.title}
        //         </h5>
        //     </div>
        // </div>`;
        board.innerHTML += statusTemplate;
    }
}

async function showTasks(tasks) {
    for (let task of tasks) {
        let status = document.querySelector(`#statuss-${task.status_id}`);
        let taskTemplate = `
        <div id="task-${task.id}" class="border border-secondary task-css mb-2">
            <h5 id="task-title-${task.id}" contenteditable="true" onfocusout="updateTaskTitle(${task.id})" 
            class="mx-auto">
                ${task.title}
            </h5>
        </div>`;
        // let taskTemplate = `
        // <div id="task-${task.id}" class="border border-secondary task-css mb-2" draggable="true"
        // ondragstart="drag(event)" ondrop="preventDrop(event)">
        //     <h5 id="task-title-${task.id}" contenteditable="true" onfocusout="updateTaskTitle(${task.id})"
        //     class="mx-auto">
        //         ${task.title}
        //     </h5>
        // </div>`;
        status.innerHTML += taskTemplate;
    }
}

function updateBoardTitle(boardId) {
    let elementToSelect = "board-title-" + boardId;
    let titleValue = document.getElementById(elementToSelect);

    let data = {
        'id': boardId,
        'title': titleValue.innerText,
    }

    let settings = {
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
}

function updateStatusTitle(statusId) {
    let elementToSelect = "status-title-" + statusId;
    let titleValue = document.getElementById(elementToSelect);

    let data = {
        'id': statusId,
        'title': titleValue.innerText,
    }

    let settings = {
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
}

function updateTaskTitle(taskId) {
    let elementToSelect = "task-title-" + taskId;
    let titleValue = document.getElementById(elementToSelect);

    let data = {
        'id': taskId,
        'title': titleValue.innerText,
    }

    let settings = {
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
        let dataToBePosted = {
            title: boardTitle,
            user_id: null
        };
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

async function makePrivateBoard() {
    const privateButton = document.querySelector('#make-private-board');
    await privateButton.addEventListener('click', createNewPrivateBoard);
}

async function createNewPrivateBoard(event) {
    event.preventDefault();
    const labelModal = document.querySelector('#label-modal');
    labelModal.innerText = 'Board title:';
    $('#template-modal').modal('show');
    const modalButton = document.querySelector('#modal-button');
    await modalButton.addEventListener('click', processNewPrivateBoard);
}

async function processNewPrivateBoard(event) {
    const userId = obtainUserId();

    let boardTitle = document.querySelector('[name="modal-data"]').value;
    if (boardTitle) {
        let dataToBePosted = {
            title: boardTitle,
            user_id: userId
        };
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

// function allowDrop(ev) {
//     ev.preventDefault();
// }

// function drag(ev) {
//     ev.dataTransfer.setData("text", ev.target.id);
// }

// async function drop(ev) {
//     ev.preventDefault();
//     const data = ev.dataTransfer.getData("text");
//
//     ev.target.appendChild(document.getElementById(data));
//     const taskId = data.replace('task-', '');
//     const statusId = ev.target.id.replace('status-', '');
//
//     let dataToBePosted = {
//             task_id: taskId,
//             status_id: statusId
//         };
//     let serverResponse = await fetch(url_drag_update_task, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         body: JSON.stringify(dataToBePosted)
//     });
//     let jsonResponse = await serverResponse.json();
//     console.log(jsonResponse['success']);
// }

// function preventDrop(ev) {
//     ev.stopPropagation();
// }

function obtainUserId() {
    const userLoggedIn = document.querySelector('#user-logged-in');
    if (userLoggedIn.innerText.startsWith('Signed in as')) {
        return userLoggedIn.dataset.userId;
    } else {
        return null;
    }
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

    addDragula();
    await makePrivateBoard();
}

init();