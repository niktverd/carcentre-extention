console.log("crunchbase--investors-list started");
// Organization/Person Name
// Location
// Description
// Investment Stage
// Investor Type

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("\n\ncrunchbase--investors-list (on url changes) is running");
    console.log("123",  request, request.txt, request.id, request.url);
    setTimeout(function () {
        // getRecomendedPeopleFromTheRightSide();
        getTable();
    }, 15000);
});

window.onload = function () {
    console.log("\n\ncrunchbase--investors-list (onload) is running");
    // console.log(request.txt, request.id);
    setTimeout(function () {
        // getRecomendedPeopleFromTheRightSide();
        getTable();
    }, 12000);
};

function parseRow(_row) {
    newCard = {};
    // console.log(_card);
    const cells = _row.getElementsByTagName("grid-cell");
    for( let i=0;i<cells.length;i++ ){
        const cell = cells[i];
        if( !cell ) continue;
        if( i === 0 )continue;
        if( i === 1 ){
            let id = cell.innerText;

            
            newCard.name = id.split(".")[1];
        }
        if( i === 2 ){
            newCard.location = cell.innerText;   
        }
        if( i === 3 ){
            newCard.description = cell.innerText;   
        }
        if( i === 4 ){
            newCard.stage = cell.innerText;   
        }
        if( i === 5 ){
            newCard.type = cell.innerText;   
        }
        
        

    }
    newCard.id = newCard.name + newCard.location;   
    return newCard;
}

function getTable() {
    const rows = document.getElementsByTagName("grid-row");
    const newInstance = [];
    for (let i = 0; i < rows.length; i++) {
        // console.log( "hi", i)
        const row = rows[i];
        if (!row) continue;
        // // console.log(i, card);
        let newCard = parseRow(row);
        // console.log( newCard )
        if (newCard != 0) newInstance.push(newCard);
    }
    const payload = {
        func: "crunchbase-search-result",
        // func: "ADD_PERSON_DETAILS",
        data: newInstance,
        platfrom: "crunchbase"
    }
    fetch("https://script.google.com/macros/s/AKfycbxiHhaHZsuKr8GudthTVzv4WDuWymS2SZG6uyOoIQPT4QGn7c8/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(payload),
    })
    console.log(newInstance);
    console.log( "sent" )
}

