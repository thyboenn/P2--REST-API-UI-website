export { getApiData, bodyFileUpdate, urlCreator, loadIntoTable, createTabs, sortGrid, executeGrid, readTextFile }
import { propertiesSubmitted } from "./LiveFilter.mjs";

/*Vi er nødt til at returnere data fra denne funktion*/
function getApiData(url, restVar, name, bodyData, spotifyToken, endpointType) {
    console.log(`url:`, url);
    if (endpointType == "TrelloKeyObject") {
        if (restVar === `GET`) {
            return new Promise((resolve, reject) => {
                console.log(`Get:`, name);
                fetch(`${url}`, {
                    method: `${restVar}`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        resolve(data)
                    })
                    .catch((error) => {
                        console.error('Error:', error)
                        reject(error);
                    })
            });
        }
        else if (restVar != `GET`) {
            return new Promise((resolve, reject) => {
                console.log(name)
                bodyData = JSON.stringify(bodyData);
                fetch(`${url}`, {
                    method: `${restVar}`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: bodyData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        resolve(data)
                    })
                    .catch((error) => {
                        console.error('Error:', error)
                        reject(error);
                    })
            });
        }
    }
    else if (endpointType == "SpotifyEndpointObject") {
        if (restVar === `GET`) {
            return new Promise((resolve, reject) => {
                console.log(`Get:`, name);
                fetch(`${url}`, {
                    method: `${restVar}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + spotifyToken
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        resolve(data)
                    })
                    .catch((error) => {
                        console.error('Error:', error)
                        reject(error);
                    })
            });
        }
        else if (restVar != `GET`) {
            return new Promise((resolve, reject) => {
                console.log(name)
                bodyData = JSON.stringify(bodyData);
                fetch(`${url}`, {
                    method: `${restVar}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + spotifyToken
                    },
                    body: bodyData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        resolve(data)
                    })
                    .catch((error) => {
                        console.error('Error:', error)
                        reject(error);
                    })
            });
        }
    }
}

function urlCreator(trelloKey, trelloToken, key, id, key2, id2, key3, id3, endpointType) {
    let endpointUrl = "";
    let baseUrl = "";
    let keyAndIdArray = [id, key2, id2, key3, id3];

    if (endpointType == "TrelloKeyObject") {
        baseUrl = `https://api.trello.com/1/`;
        endpointUrl = `${baseUrl}${key}`;
    }
    else if (endpointType == "SpotifyEndpointObject") {
        baseUrl = "https://api.spotify.com/v1/";
        endpointUrl = `${baseUrl}${key}`
    }

    for (let i = 0; i < keyAndIdArray.length; i++) {
        if (keyAndIdArray[i] != `` && keyAndIdArray[i] != undefined) {
                endpointUrl = endpointUrl.concat(`/${keyAndIdArray[i]}`);
                console.log("keyandidarray:", keyAndIdArray[i], "i:", i);
        }
    }
    if (endpointType == "TrelloKeyObject") {
        endpointUrl = endpointUrl.concat(`?key=${trelloKey}&token=${trelloToken}`);
    }
    
    // else if (id === `` && endpointType == "TrelloKeyObject") {
    //     endpointUrl = endpointUrl.concat(`?key=${trelloKey}&token=${trelloToken}`);
    // }
    return endpointUrl;
}

function bodyFileUpdate(selectedContentCard, userInputHolder) {
    let bodyArray = Object.entries(structuredClone(selectedContentCard.bodyFile));
    let bodyObject = structuredClone(selectedContentCard.bodyFile);

    for (let i = 0; i < bodyArray.length; i++) {
        bodyObject[bodyArray[i][0]] = userInputHolder[i];
        if (userInputHolder[i] === undefined) {
            delete bodyObject[bodyArray[i][0]];
        }
    }
    return bodyObject;
}

async function loadIntoTable(table, trelloKeyObject, trelloKey, trelloToken, userInputHolder) {
    let idNames = ["", ""];
    let responseArray = [];
    let spotifyToken;
    let endpointType;
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");
    let userInputHolderClone = structuredClone(userInputHolder);
    for (let i = 0; i < trelloKeyObject.idCounter; i++) {
        idNames[i] = userInputHolderClone.shift();
    }

    endpointType = trelloKeyObject.constructor.name;
    console.log("loadIntoTableEndpointType", endpointType);
    spotifyToken = sessionStorage.getItem('spotifyToken');
    console.log("SPOTIFY TOKEN RIGHT HERE:", spotifyToken);

    const response = await getApiData(urlCreator(trelloKey, trelloToken, trelloKeyObject.key, idNames[0], trelloKeyObject.key2, idNames[1], trelloKeyObject.key3, idNames[2], endpointType), trelloKeyObject.method, trelloKeyObject.name, bodyFileUpdate(trelloKeyObject, userInputHolderClone), spotifyToken, endpointType);


    if (response.length === undefined) {
        responseArray[0] = Object.entries(response);
    }

    else {
        for (let i = 0; i < response.length; i++) {
            responseArray[i] = Object.entries(response[i]);
        }
    }


    for (let i = 0; i < responseArray.length; i++) {
        tableHead.innerHTML = "<tr></tr>";
        tableBody.innerHTML = "";
    }

    for (let i = 0; i < responseArray[0].length; i++) {
        const headerElement = document.createElement("th");
        headerElement.textContent = responseArray[0][i][0];
        tableHead.querySelector("tr").appendChild(headerElement);

    }

    for (let i = 0; i < responseArray.length; i++) {
        const rowElement = document.createElement("tr");

        for (let j = 0; j < responseArray[i].length; j++) {
            const cellElement = document.createElement("td");

            cellElement.textContent = responseArray[i][j][1];
            rowElement.appendChild(cellElement);
        }
        tableBody.appendChild(rowElement);
    }
}

function createTabs(trelloKeyObject, trelloKey, trelloToken, userInputHolder, tabNumber) {
    tabNumber++;
    let myTabs = document.getElementById("mytabs");

    let inputElement = document.createElement("input");
    inputElement.setAttribute("type", "radio");
    inputElement.setAttribute("id", `tab${tabNumber}`);
    inputElement.setAttribute("name", "mytabs");
    if (tabNumber === 1) {
        inputElement.setAttribute("checked", "checked");
    }

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", `tab${tabNumber}`);
    labelElement.innerHTML = `${trelloKeyObject.name}`;
    labelElement.className = "label";

    let divElement = document.createElement("div");
    divElement.setAttribute("class", "fetched-data");

    let tableElement = document.createElement(`table${tabNumber}`);
    let theadElement = document.createElement("thead");
    theadElement.className = "thead";
    let tbodyElement = document.createElement("tbody");
    tbodyElement.className = "tbody";

    tableElement.appendChild(theadElement);
    tableElement.appendChild(tbodyElement);
    divElement.appendChild(tableElement);

    myTabs.appendChild(inputElement);
    myTabs.appendChild(labelElement);
    myTabs.appendChild(divElement);

    loadIntoTable(document.querySelector(`table${tabNumber}`), trelloKeyObject, trelloKey, trelloToken, userInputHolder);

    return tabNumber;
}


function sortGrid(amountOfRows, gridExecution, gridExecutionSorted) {
    let sortedIndex = 0;
    for (let i = 0; i < amountOfRows; i++) {
        for (let j = 0; j < gridExecution.length; j++) {
            if (gridExecution[j][2] == i) {
                gridExecutionSorted[sortedIndex] = gridExecution[j];
                sortedIndex++;
            }
        }
    }
    return gridExecutionSorted;
}


async function executeGrid(gridExecutionSorted, amountOfRows) {
    let gridObjectHolder = {};
    let gridObjectHolderArray = [];
    let gridExecutionSortedClone = [];
    let idNames = [];
    let apiReturn;
    let trelloKey = sessionStorage.getItem("key");
    let trelloToken = sessionStorage.getItem("token");


    for (let i = 0; i < gridExecutionSorted.length; i++) {
        gridExecutionSortedClone[i] = structuredClone(gridExecutionSorted[i]);
    }

    for (let i = 0; i < gridExecutionSorted.length; i++) {
        idNames[i] = ["", ""];
        for (let j = 0; j < gridExecutionSortedClone[i][0][3][1]; j++) {
            idNames[i][j] = gridExecutionSortedClone[i][1].shift();
        }
    }
    let peter = 0;
    for (let i = 0; i < gridExecutionSortedClone.length; i++) {
        for (let j = 0; j < gridExecutionSortedClone[i][0].length; j++) {
            gridObjectHolder[gridExecutionSortedClone[i][0][j][0]] = gridExecutionSortedClone[i][0][j][1];
        }
        gridObjectHolderArray[i] = structuredClone(gridObjectHolder);
    }
    console.log("CHristian: ", gridExecutionSorted);
    console.log("Christina: ", gridExecutionSorted.length);
    for (let i = 0; i < gridExecutionSorted.length; i++) {
        if (gridExecutionSorted[i][3] === "0") {
            console.log("gridExecutionSorted[i][0][5][1]", gridExecutionSorted[i][0][5][1]);
            console.log("idNames[i][0]", idNames[i][0]);
            console.log("gridExecutionSorted[i][0][7][1]", gridExecutionSorted[i][0][7][1]);
            console.log("idNames[i][1]", idNames[i][1]);
            console.log("idNames[i][1]", idNames[i][2]);
            console.log("gridObjectHolderArray", gridObjectHolderArray);
            console.log("gridExecutionSortedClone[i][0][2][1]", gridExecutionSortedClone[i][0][2][1]);
            apiReturn = await getApiData(urlCreator(trelloKey, trelloToken, gridExecutionSorted[i][0][5][1], idNames[i][0], gridExecutionSorted[i][0][7][1], idNames[i][1], "", "", "TrelloKeyObject"), gridExecutionSorted[i][0][2][1], gridExecutionSorted[i][0][0][1], bodyFileUpdate(gridObjectHolderArray[i], gridExecutionSortedClone[i][1]), sessionStorage.getItem('spotifyToken'), "TrelloKeyObject");

            // gridExecutionSorted[i][5] = apiReturn.idModel;
        }
    }
    let flag = 0;
    console.log("Hans: ", gridExecutionSorted);
    setInterval(() => {
        let timeElement = document.getElementById("timeNotification")
        flag = readTextFile(timeElement, gridExecutionSorted, flag, amountOfRows, gridObjectHolderArray, idNames, gridExecutionSortedClone)
    }, 5000);

    // for (let i = 0; i < gridExecutionSorted.length; i++) {
    //     await getApiData(urlCreator("7cb1be139ed54458fbd98b4276cbffbf", "5a85e89fb4bf24f06ea9f7f0b0826619bc2fdd0c7f37e5f7bd16a9a84f6f7e8c", gridExecutionSorted[i][0][5][1], idNames[i][0], gridExecutionSorted[i][0][7][1], idNames[i][1]), gridExecutionSorted[i][0][2][1], gridExecutionSorted[i][0][0][1], bodyFileUpdate(gridObjectHolder, gridExecutionSortedClone[i][1]));
    // }
}


async function readTextFile(previousDate, gridExecutionSorted, flag, amountOfRows, gridObjectHolderArray, idNames, gridExecutionSortedClone) {
    let data = await fetch(`WebhookData.txt`)
        .then(data => data.text())
        .then(data => textToObject(data, previousDate, gridExecutionSorted, flag, amountOfRows, gridObjectHolderArray, idNames, gridExecutionSortedClone));
}

async function textToObject(loadedText, previousDate, gridExecutionSorted, flag, amountOfRows, gridObjectHolderArray, idNames, gridExecutionSortedClone) {
    let holderArray = loadedText.split("|");
    let timeOfCurrentNotification = holderArray[0];
    let returnObject = JSON.parse(holderArray[1]);
    let timeElement;
    let endpointType = sessionStorage.getItem("endpointType");
    let spotifyToken = sessionStorage.getItem("spotifyToken");
    let trelloKey = sessionStorage.getItem("key");
    let trelloToken = sessionStorage.getItem("token");
    console.log("endpointType", endpointType);
    console.log("returnObject:", returnObject);
    console.log("timeOfLastNot: ", timeOfCurrentNotification);

    timeElement = document.getElementById("timeNotification");

    if (flag != 0) {
        for (let i = 0; i < gridExecutionSorted.length; i++) {
            console.log("gridExecutionSorted[i][4]", gridExecutionSorted[i][4]);
            console.log("returnObject", returnObject.action.type);
            console.log("gridExecutionSorted[i][5]", gridExecutionSorted[i][5]);
            console.log("returnObjectCardid: ", returnObject.action.data.card.id);
            console.log("PreviousDate: ", previousDate.innerHTML);
            console.log("timeOfCurrentNotification: ", timeOfCurrentNotification);

            if ((gridExecutionSorted[i][4] === returnObject.action.type) && (gridExecutionSorted[i][1][2] === returnObject.action.data.card.id) && (previousDate.innerHTML != timeOfCurrentNotification) && (gridExecutionSorted[i][3] === "0")) {
                let currentIndex = i + 1;
                for (let j = currentIndex; j < gridExecutionSorted.length; j++) {
                    if (gridExecutionSorted[j][3] == 1) {
                        console.log("YEEEEEEEEEEEEEEEEEEEES");

                        await getApiData(urlCreator(trelloKey, trelloToken, gridExecutionSorted[j][0][5][1], idNames[j][0], gridExecutionSorted[j][0][7][1], idNames[j][1], gridExecutionSorted[j][0][9][1], idNames[j][2], endpointType), gridExecutionSorted[j][0][2][1], gridExecutionSorted[j][0][0][1], bodyFileUpdate(gridObjectHolderArray[j], gridExecutionSortedClone[j][1]), spotifyToken, endpointType);
                    }
                    else if (gridExecutionSorted[j][3] === 0) {
                        j = gridExecutionSorted.length;
                    }
                }
            }
            else {
                console.log("NOOOOOOOOOOO");
            }
        }
    }
    timeElement.innerHTML = timeOfCurrentNotification;
    return flag++;
}







