export { choosingBox, userInputFieldCreator, filterData, contentCardContent, extentCard, propertiesSubmitted, addingBoxes };
import { loadIntoTable, createTabs } from "./request.mjs";
/* LiveFilter Stuff */


let listProperties = [];
let ucardList1 = [];
let ucardList2 = [];
let property;
let tabNumber = 0;


/*https://github.com/bradtraversy/50projects50days/blob/master/live-user-filter/script.js*/


function contentCardContent(trelloKeyObjectArray, liveUserFilter, firstOrSecond, mainCategory) {
    let userFilter = document.getElementById(liveUserFilter);
    userFilter.innerHTML = "";
    let cardList = [];
    let contentCardAmount = 0;
    let loopReset = 0;
    let idValue = 0;
    for (var i = 0; i < mainCategory.length; i++) {
        let li = document.createElement('li');
        cardList.push(li);
        li.className = "mainCategory";
        li.id = mainCategory[i];
        li.innerHTML = `
        <div class="card-info">
            <h4 class="main-category">${mainCategory[i]}</h4>
            <button onclick="" class="BtnReadMore" id="${firstOrSecond}btn${mainCategory[i]}">Read More</button>
        </div>
    `
        userFilter.appendChild(li);
        let randomVariable = mainCategory[i];
        for (var l = 0; l < trelloKeyObjectArray.length; l++) {
            let bodyfileArray = Object.entries(trelloKeyObjectArray[l]);
            if (bodyfileArray[1][1] === mainCategory[i]) {
                if (mainCategory[loopReset] != mainCategory[i]) {
                    loopReset++;
                    idValue = 0;
                }
                let uli = document.createElement('li');
                if (firstOrSecond === "second") {
                    ucardList2.push(uli);
                } else {
                    ucardList1.push(uli);
                }
                uli.className = "underCategory" + mainCategory[i];
                uli.id = firstOrSecond + "u" + mainCategory[i] + idValue;
                uli.innerHTML = ` 
                <div class="card-info">
                    <h4 class="card-name">${bodyfileArray[0][1]}</h4>
                    <p class="card-category">Category: ${bodyfileArray[1][1]}</p>
                    <p class="card-method">Method: ${bodyfileArray[2][1]}</p>
                    <button onclick="" class="BtnGoProperties" id="${firstOrSecond}BtnU${contentCardAmount}">Input Field</button>
                </div>
                `
                userFilter.appendChild(uli);
                contentCardAmount++;
                document.getElementById(firstOrSecond + "u" + mainCategory[i] + idValue).style.display = 'none';
                idValue++;
            }
        }
    }
    return contentCardAmount;
}

function filterData(searchTerm, firstOrSecond) {
    if (firstOrSecond === 1) {
        ucardList1.forEach(item => {
            if (item.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        })
    } else {
        ucardList2.forEach(item => {
            if (item.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        })
    }
}

function extentCard(MainCat, firstOrSecond) {
    let amount = document.getElementsByClassName("underCategory" + MainCat);
    let BtnMainCat = document.getElementById(firstOrSecond + "btn" + MainCat);
    for (var i = 0; i < amount.length; i++) {
        if (document.getElementById(`${firstOrSecond}u${MainCat}${i}`).style.display === 'none') {
            BtnMainCat.innerText = "Read Less";
            document.getElementById(`${firstOrSecond}u${MainCat}${i}`).style.display = 'block'
        } else {
            document.getElementById(`${firstOrSecond}u${MainCat}${i}`).style.display = 'none'
            BtnMainCat.innerText = "Read More";
        }
    }
}

function userInputFieldCreator(trelloKeyObject, previousBtn, firstRun, previousInputLength, contentCardAmount, webhookObjectArray, trelloKey, trelloToken) {
    const userInputField = document.getElementById('propertyInputs');
    let textField;
    let newline;
    let trelloKeyArray = Object.entries(trelloKeyObject);
    let bodyfileArray = Object.entries(trelloKeyArray[4][1]);
    let currentInputLength = 0;
    // let token = document.getElementById("Token").value;
    // let key = document.getElementById("key").value;
    let submitProperties;
    let webhookField;
    let modelCategory;
    let modelCategoryNewline;

    if (firstRun != 0) {
        for (let i = 0; i < previousInputLength; i++) {
            textField = document.getElementById('propertyInput' + (i + 1));
            textField.remove();
            newline = document.getElementById(`newline${i}`)
            newline.remove();
            
            modelCategory = document.getElementById('modelCategory' + (i + 1));
            if (modelCategory != null) {
                modelCategory.remove();
            }
            modelCategoryNewline = document.getElementById(`modelCategoryNewline${i + 1}`)
            if (modelCategoryNewline != null) {
                modelCategoryNewline.remove();  
            }
        }
        submitProperties = document.getElementById(`btnGrid${previousBtn}`);
        submitProperties.remove();

        webhookField = document.getElementById('dropdown');
        if (webhookField != null) {
            webhookField.remove();
        }
        
    }

    submitProperties = document.createElement("button");
    submitProperties.type = "button";
    submitProperties.innerText = "Grid";
    submitProperties.className = "BtnGoGrid"
    submitProperties.id = `btnGrid${contentCardAmount}`;
    userInputField.appendChild(submitProperties);

    for (let i = 0; i < trelloKeyObject.idCounter; i++) {
        newline = document.createElement('linebreak');
        newline.id = "newline" + i;
        newline.innerHTML = `<br>`
        userInputField.appendChild(newline);
        currentInputLength++;
        textField = document.createElement('input');
        textField.type = "text";
        textField.id = "propertyInput" + (i + 1);
        textField.className = "propertyInput";
        textField.setAttribute("placeholder", `id ${i + 1}`);
        userInputField.appendChild(textField);
    }

    for (let i = trelloKeyObject.idCounter; i < bodyfileArray.length + trelloKeyObject.idCounter; i++) {
        newline = document.createElement('linebreak');
        newline.innerHTML = `<br>`
        newline.id = "newline" + i;
        userInputField.appendChild(newline);
        currentInputLength++;
        textField = document.createElement('input');
        textField.type = "text";
        textField.id = "propertyInput" + (i + 1);
        textField.className = "propertyInput";
        textField.setAttribute("placeholder", bodyfileArray[i - trelloKeyObject.idCounter][0]);
        userInputField.appendChild(textField);
    }

    let idModelHolder;
    /*Dropdown menu for webhook creator*/
    if (trelloKeyObject.name === "Create a Webhook") {
        let dropDownBox;
        let dropDownLinks;
        let dropDownBoxBtn;
        let dropDownContent;
        let sortingArray = ["Card", "List", "Board", "Member", "Team", "Enterprise"];
        let modelCategory;
        let modelCategoryCounter = 0;
        let classChosenCounter = 0;
        let classChosenElement;
        let dropDownCommitBtn;

        dropDownBox = document.createElement("div");
        dropDownBox.setAttribute("class", "dropdown");
        dropDownBox.setAttribute("id", "dropdown");

        dropDownContent = document.createElement("div");
        dropDownContent.setAttribute("class", "dropdown-content");
        dropDownContent.setAttribute("id", "myDropdown");

        dropDownBoxBtn = document.createElement("button");
        dropDownBoxBtn.setAttribute("class", "dropbtn");
        dropDownBoxBtn.innerHTML = "Please select the action you want to monitor";
        dropDownBoxBtn.onclick = function toggleShow() {
            dropDownContent.classList.toggle("show");
        }

        dropDownCommitBtn = document.createElement("button");
        dropDownCommitBtn.setAttribute("class", "commitbtn");
        dropDownCommitBtn.innerHTML = "Commit";

        dropDownCommitBtn.onclick = function commit() {
            for (let i = 0; i < webhookObjectArray.length; i++) {
                if (webhookObjectArray[i].name === document.getElementById("chosen").innerHTML) {
                    returnArray[5] = document.getElementById("chosen").innerHTML;
                    for (let j = 0; j < webhookObjectArray[i].viableCategoryCounter; j++) {
                        let modelCategory = document.getElementById("modelCategory" + (j + 1));
                        if (modelCategory.value != "") {
                            idModelHolder = modelCategory.value;
                        }
                    }
                }
            }
        } 
        dropDownBox.appendChild(dropDownBoxBtn);
        dropDownBox.appendChild(dropDownContent);
        dropDownBox.appendChild(dropDownCommitBtn);
        userInputField.appendChild(dropDownBox);


        for (let i = 0; i < webhookObjectArray.length; i++) {
            dropDownLinks = document.createElement("a");
            dropDownLinks.setAttribute("href", "#");
            dropDownLinks.innerHTML = webhookObjectArray[i].name;

            dropDownLinks.onclick = function () {
                if (classChosenCounter != 0) {
                    classChosenElement = document.getElementById("chosen");
                    classChosenElement.removeAttribute("id");
                    classChosenCounter = 0;
                }
                this.setAttribute("id", "chosen");
                classChosenCounter++;
                if (modelCategoryCounter != 0) {
                    for (let i = 0; i < modelCategoryCounter; i++) {
                        modelCategory = document.getElementById("modelCategory" + (i + 1));
                        modelCategory.remove();
                        newline = document.getElementById("modelCategoryNewline" + (i + 1));
                        newline.remove();
                    }
                    modelCategoryCounter = 0;
                }
                dropDownContent.classList.toggle("show");
                for (let j = 0; j < webhookObjectArray[i].viableCategory.length; j++) {
                    if (webhookObjectArray[i].viableCategory[j] === true) {
                        newline = document.createElement('linebreak');
                        newline.innerHTML = `<br>`
                        newline.id = "modelCategoryNewline" + (modelCategoryCounter + 1);
                        userInputField.appendChild(newline);
                        modelCategory = document.createElement('input');
                        modelCategory.id = "modelCategory" + (modelCategoryCounter + 1);
                        modelCategory.className = "modelCategory";
                        modelCategory.setAttribute("placeholder", sortingArray[j]);
                        userInputField.appendChild(modelCategory);
                        modelCategoryCounter++;
                    }
                }
            }
            dropDownContent.appendChild(dropDownLinks);
        }
    }

    firstRun++;
    let returnArray = [currentInputLength, firstRun, contentCardAmount, trelloKeyArray, listProperties];
    submitProperties.addEventListener('click', function () {
        listProperties = [];
        let endpointType = trelloKeyObject.constructor.name;
        sessionStorage.setItem(`endpointType`, endpointType);
        let trelloKey = sessionStorage.getItem("key");
        let trelloToken = sessionStorage.getItem("token");
        
        if (trelloKeyObject.method === "GET") {
            tabNumber = createTabs(trelloKeyObject, trelloKey, trelloToken, returnArray[4] = propertiesSubmitted(bodyfileArray, trelloKeyObject.idCounter, ""), tabNumber);
        }
        else {
            if (trelloKeyObject.name === "Create a Webhook") {
                returnArray[4] = propertiesSubmitted(bodyfileArray, trelloKeyObject.idCounter, idModelHolder);
            }
            else {
                returnArray[4] = propertiesSubmitted(bodyfileArray, trelloKeyObject.idCounter, "")
            }
        }
    });
    return returnArray;
}


function propertiesSubmitted(bodyfileArray, idCounter, idModel) {
    for (var i = 0; i < bodyfileArray.length + idCounter; i++) {
        property = document.getElementById("propertyInput" + (i + 1)).value;
        if (property === "") {
            property = undefined;
        }
        listProperties[i] = property;
    }
    if (idModel != "") {
        listProperties[2] = idModel;
    }
    return structuredClone(listProperties);
}

// Choosing which box and the input of it
function choosingBox(trelloKeyObject, listProperties, actionType) {
    let chosenBox = document.getElementById('boxChoice').selectedIndex;//finding option list
    let boxChoice = document.getElementById('boxChoice');
    let holder = boxChoice[chosenBox].id.split("t").pop();
    let gridContainer = document.getElementById(holder);
    let indexArray = holder.split(".");
    gridContainer.innerHTML = ` 
    <div class="card-info">
        <h6 class="grid-name">${trelloKeyObject[0][1]}</h4>
        <p class="grid-category">Category: ${trelloKeyObject[1][1]}</p>
        <p class="grid-method">Method: ${trelloKeyObject[2][1]}</p>
    </div>
    `;
    // <p class="grid-array">${trelloKeyObject}</p> 
    // <p class="grid-array">${listProperties}</p>   <- begge var ovenover nederst i div
    return [trelloKeyObject, listProperties, indexArray[0], indexArray[1], actionType];
}

function addingBoxes(boxRows, amountAlreadyThere) {
    var location = document.getElementById("grid-container");
    var options = document.getElementById("boxChoice");
    for (amountAlreadyThere; amountAlreadyThere < boxRows; amountAlreadyThere++) {
        var first = document.createElement("div");
        var second = document.createElement("div");
        var third = document.createElement("div");

        var firstBox = document.createElement("option");
        var secondBox = document.createElement("option");
        var thirdBox = document.createElement("option");

        first.id = (amountAlreadyThere + ".0");
        second.id = (amountAlreadyThere + ".1");
        third.id = (amountAlreadyThere + ".2");

        first.className = ("grid-item");
        second.className = ("grid-item");
        third.className = ("grid-item");

        firstBox.innerHTML = ("boxSelect" + amountAlreadyThere + ".0");
        secondBox.innerHTML = ("boxSelect" + amountAlreadyThere + ".1");
        thirdBox.innerHTML = ("boxSelect" + amountAlreadyThere + ".2");

        firstBox.id = ("boxSelect" + amountAlreadyThere + ".0");
        secondBox.id = ("boxSelect" + amountAlreadyThere + ".1");
        thirdBox.id = ("boxSelect" + amountAlreadyThere + ".2");

        location.appendChild(first);
        location.appendChild(second);
        location.appendChild(third);

        options.appendChild(firstBox);
        options.appendChild(secondBox);
        options.appendChild(thirdBox);
    }
    return amountAlreadyThere;
}