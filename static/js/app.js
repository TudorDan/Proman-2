url_api = 'http://127.0.0.1:5000/api/';
url_boards = url_api + "get-boards";
url_cards = url_api + "get-cards/";

function getBoards() {
    fetch(url_boards)
    .then((serverResponse)=>{
        return serverResponse.json();
    })
    .then((jsonResponse)=>{
        showBoards(jsonResponse);
    });
}


function getCardsForBoard(id) {
    //fetch
    fetch(url_cards + id)
        .then((serverResponse)=>{
            return serverResponse.json();
        })
        .then((jsonResponse)=>{
            console.table(jsonResponse);
        });
}

function showBoards(boards) {
    for (board of boards){
        boards_container = document.getElementById('boards-container');
        card_template = `<div class="card float-left mb-2" style="width:120px;">
        <div class="card-body">
        <h5 class="card-title" id="board-title-`+board.id+`" contenteditable="true" onfocusout="updateBoardTitle(` + board.id + `)">` + board.title + `</h5>
        <a href="#" class="btn btn-primary" onClick="getCardsForBoard(` + board.id + `)">Show Cards</a>
        </div>
        </div>`
        boards_container.innerHTML += card_template;
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
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify(data),
    }

    fetch('/api/update-board',settings)
        .then((serverResponse)=>{
            return serverResponse.json();
        })
        .then((jsonResponse)=>{
            console.log(jsonResponse);
        })
}


getBoards();