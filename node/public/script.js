// import {sendAPI} from "./Obj_api.mjs";
import { choosingBox, userInputFieldCreator, filterData, contentCardContent, extentCard, addingBoxes } from "./LiveFilter.mjs";
import { createWebhook } from "./Webhooks.mjs";
import { getApiData, bodyFileUpdate, urlCreator, loadIntoTable, sortGrid, executeGrid } from "./request.mjs";

class TrelloKeyObject {
    constructor(name, category, method, bodyFile, key, id, key2, id2, key3, id3) {
        this.name = name;
        this.category = category;
        this.method = method;
        this.idCounter = this.idCounterFunction();
        this.bodyFile = bodyFile;
        this.key = (key === undefined) ? "" : key;
        this.id = (id === undefined) ? "" : id;
        this.key2 = (key2 === undefined) ? "" : key2;
        this.id2 = (id2 === undefined) ? "" : id2;
        this.key3 = (key3 === undefined) ? "" : key3;
        this.id3 = (id3 === undefined) ? "" : id3;
        this.idCounter = this.idCounterFunction();
    }
    idCounterFunction() {
        let idCounter = 0;
        if (this.id != "") { idCounter++ }
        if (this.id2 != "") { idCounter++ }
        if (this.id3 != "") { idCounter++ }
        return idCounter;
    }
}


class WebhookObject {
    constructor(name, viableCategory) {
        this.name = name;
        this.viableCategory = viableCategory;
        this.viableCategoryCounter = this.vcCounterFunction();
    }
    vcCounterFunction() {
        let vcCounter = 0;
        for (let i = 0; i < this.viableCategory.length; i++) {
            if (this.viableCategory[i] === true) { vcCounter++ }
            
        }
        return vcCounter;
    }
}

class SpotifyEndpointObject {
    constructor(name, category, method, bodyFile, key, id, key2, id2, key3, id3) {
        this.name = name;
        this.category = category;
        this.method = method;
        this.idCounter = this.idCounterFunction();
        this.bodyFile = bodyFile;
        this.key = (key === undefined) ? "" : key;
        this.id = (id === undefined) ? "" : id;
        this.key2 = (key2 === undefined) ? "" : key2;
        this.id2 = (id2 === undefined) ? "" : id2;
        this.key3 = (key3 === undefined) ? "" : key3;
        this.id3 = (id3 === undefined) ? "" : id3;
        this.idCounter = this.idCounterFunction();
    }
    idCounterFunction() {
        let idCounter = 0;
        if (this.id != "") { idCounter++ }
        if (this.id2 != "") { idCounter++ }
        if (this.id3 != "") { idCounter++ }
        return idCounter;
    }
}

let token;
let key;
let spotifyToken;

window.onload = function () {
    var token = sessionStorage.getItem('token');
    var key = sessionStorage.getItem('key');
    var spotifyToken = sessionStorage.getItem('spotifyToken');
    let amountOfRows = 0;
    let addRows = 3;
    amountOfRows = addingBoxes(addRows, amountOfRows);
    //Kalder på Obj_api.mjs
    // let input = document.getElementById("knap");
    // input.addEventListener("click", sendAPI);

    //kalder Webhooks.mjs
    let webhookInput = document.getElementById("webhooks");
    let webhookObj = webhookInput.addEventListener("click", createWebhook);

    // kalder LiveFilter.mjs
    const filter1 = document.getElementById('filter');
    const filter2 = document.getElementById('filter2');
    let mainCategories = [["Actions", "Applications", "Batch", "Boards", "Cards", "Checklists", "CustomFields", "Emoji", "Enterprises", "Labels", "Lists", "Members", "Notifications", "Organizations", "Plugins", "Search", "Tokens", "Webhooks"], ["Albums", "Artists", "Shows", "Episodes", "Tracks", "Search", "Users", "Playlists", "Categories", "Genres", "Player", "Markets"]];

    let firstContentCardAmount = contentCardContent(trelloKeyObjectArray, "termlist", "", mainCategories[0]);
    let secondContentCardAmount = contentCardContent(spotifyEndpointArray, "secondaryTermList", "second", mainCategories[1]);
    filter1.addEventListener('input', (e) => filterData(e.target.value, 1));
    filter2.addEventListener('input', (e) => filterData(e.target.value, 2));

    const boxChoice = document.getElementById('boxChoiceDiv');
    boxChoice.style.display = "block";

    let btnaddbox = document.getElementById("addrow");
    btnaddbox.addEventListener('click', function () { addRows++, amountOfRows = addingBoxes(addRows, amountOfRows) });

    //Input and properties content cards
    let BtnProperties = document.getElementsByClassName('BtnGoProperties');

    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < mainCategories[j].length; i++) {
            let btnFirst = document.getElementById(`btn${mainCategories[j][i]}`);
            let btnSecond = document.getElementById(`secondbtn${mainCategories[j][i]}`);
            if (j < 1) {
                btnFirst.addEventListener('click', function () { extentCard(`${mainCategories[j][i]}`, "") });
            } else {
                btnSecond.addEventListener('click', function () { extentCard(`${mainCategories[j][i]}`, "second") });
            }
        }
    }

    let returnHolder = [0, 0];
    for (let i = 0; i < firstContentCardAmount + secondContentCardAmount; i++) {
        BtnProperties[i].addEventListener('click', function () {
            let holder = this.id.split("U").pop();
            if (i < firstContentCardAmount) {
                returnHolder = userInputFieldCreator(trelloKeyObjectArray[parseInt(holder)], returnHolder[2], returnHolder[1], returnHolder[0], parseInt(holder), webhookObjectArray);
            } else {
                returnHolder = userInputFieldCreator(spotifyEndpointArray[parseInt(holder)], returnHolder[2], returnHolder[1], returnHolder[0], parseInt(holder), webhookObjectArray);
            }
        });
    }

    let gridExecutionIndex = 0;
    let gridExecution = [];
    let gridExecutionSorted = [];
    let BtnSubmit = document.getElementById('submitBox');
    BtnSubmit.addEventListener('click', function () {
        gridExecution[gridExecutionIndex] = choosingBox(returnHolder[3], returnHolder[4])
        gridExecutionIndex++;
    });


    let gridSubmit = document.getElementById(`gridSubmit`);
    gridSubmit.addEventListener('click', function () {
        gridExecutionSorted = sortGrid(amountOfRows, gridExecution, gridExecutionSorted);
        executeGrid(gridExecutionSorted);
    });
}


let trelloKeyObjectArray = [
    /*Actions*/
    new TrelloKeyObject(`Get an Action`, `Actions`, `GET`, { display: undefined, entities: undefined, fields: undefined, member: undefined, member_fields: undefined, memberCreator: undefined, memberCreator_fields: undefined }, `actions`, `{actionsId}`),
    new TrelloKeyObject(`Update an Action`, `Actions`, `PUT`, { text: undefined }, `actions`, `{actionsId}`),
    new TrelloKeyObject(`Delete an Action`, `Actions`, `DELETE`, {}, `actions`, `{actionsId}`),
    new TrelloKeyObject(`Get a specific field on an Action`, `Actions`, `GET`, {}, `actions`, `{actionsId}`, ``, `{fieldId}`),
    new TrelloKeyObject("Get the Board for an Action", "Actions", "GET", { fields: undefined }, "actions", "{actionsId}", "", "{boardId}"),
    new TrelloKeyObject("Get the Card for an Action", "Actions", "GET", { fields: undefined }, "actions", "{actionsId", "", "{cardId}"),
    new TrelloKeyObject("Get the List for an Action", "Actions", "GET", { fields: undefined }, "actions", "{actionsId", "", "{listId}"),
    new TrelloKeyObject("Get the Member of an Action", "Actions", "GET", { fields: undefined }, "actions", "{actionsId}", "", "{memberId}"),
    new TrelloKeyObject("Get the Member Creator of an Action", "Actions", "GET", { fields: undefined }, "actions", "{actionsId}", "", "{memberCreatorId}"),
    new TrelloKeyObject("Get the Organization of an Action", "Actions", "GET", { fields: undefined }, "actions", "{actionsId}", "", "{organizationId}"),
    new TrelloKeyObject("Update a Comment Action", "Actions", "PUT", { value: undefined }, "actions", "{actionsId}", "", "{textId}"),
    new TrelloKeyObject("Get Action's Reactions", "Actions", "GET", { member: undefined, emoji: undefined }, "actions", "{actionsId}", "", "{reactionsId}"),//actionId tvivl
    new TrelloKeyObject("Create Reaction for Action", "Actions", "POST", {}, "actions", "{actionsId}", "", "{reactions}"),//Body parameters?
    new TrelloKeyObject("Get Action's Reaction", "Actions", "GET", { member: undefined, emoji: undefined }, "actions", "{actionsId}", "", "{reactionsId}"),
    new TrelloKeyObject("Delete Action's Reaction", "Actions", "DELETE", {}, "actions", "{actionsID}", "", "{reactionsId}"),
    new TrelloKeyObject("List Action's summary of Reactions", "Actions", "GET", {}, "actions", "{actionsId}", "", "{reactionsSummaryId}"),

    /*Applications*/
    new TrelloKeyObject("Get Application's compliance data", "Applications", "GET", {}, "applications", "{cardsId}", "compliance"),

    /*Batch*/
    new TrelloKeyObject("Batch Requests", "Batch", "GET", { urls: undefined }, "batch"),

    /*Boards*/
    new TrelloKeyObject("Get Memberships of a Board", "Boards", "GET", { filter: undefined, activity: undefined, orgMemberType: undefined, member: undefined, member_fields: undefined }, "boards", "{boardsId}", "memberships"),
    new TrelloKeyObject("Get a Board", "Boards", "GET", { actions: undefined, boardStars: undefined, cards: undefined, card_pluginData: undefined, checklists: undefined, customFields: undefined, fields: undefined, labels: undefined, lists: undefined, members: undefined, memberships: undefined, pluginData: undefined, organization: undefined, organization_pluginData: undefined, myPrefs: undefined, tags: undefined }, "boards", "{boardsId}"),
    new TrelloKeyObject("Update a Board", "Boards", "PUT", { name: undefined, desc: undefined, closed: undefined, subscribed: undefined, idOrganization: undefined, permissionLevel: undefined, selfJoin: undefined, cardCovers: undefined, hideVotes: undefined, invitations: undefined, voting: undefined, comments: undefined, background: undefined, cardAging: undefined, calendarFeedEnabled: undefined, labelNames_green: undefined, labelNames_yellow: undefined, labelNames_orange: undefined, labelNames_red: undefined, labelNames_purple: undefined, labelNames_blue: undefined }, "boards", "{boardsId}"),
    new TrelloKeyObject("Delete a Board", "Boards", "DELETE", {}, "boards", "{boardsId}"),
    new TrelloKeyObject("Get a field on a Board", "Boards", "GET", {}, "boards", "{boardsId}", "", "{fieldId}"),
    new TrelloKeyObject("Get Actions of a Board", "Boards", "GET", { filter: undefined }, "boards", "boardsId}", "actions"),
    new TrelloKeyObject("Get a Card on a Board", "Boards", "GET", {}, "boards", "{boardsId}", "cards", "{idCard}"),
    new TrelloKeyObject("Get boardStars on a Board", "Boards", "GET", {}, "boards", "{boardsId}", "boardStars"),
    new TrelloKeyObject("Get Checklists on a Board", "Boards", "GET", {}, "boards", "{boardsId}", "checklists"),
    new TrelloKeyObject("Create Checklist on a Board", "Boards", "POST", { name: undefined }, "boards", "{boardsId}", "checklists"),
    new TrelloKeyObject("Get Cards on a Board", "Boards", "GET", {}, "boards", "{boardsId}", "cards"),
    new TrelloKeyObject("Get filtered Cards on a Board", "Boards", "GET", {}, "boards", "{boardsId}", "cards", "{filterId}"),
    new TrelloKeyObject("Get Custom Fields for Board", "Boards", "GET", {}, "boards", "{boardsId}", "customFields"),
    new TrelloKeyObject("Get Labels on a Board", "Boards", "GET", { fields: undefined, limit: undefined }, "boards", "{boardsId}", "labels"),
    new TrelloKeyObject("Create a Label on a Board", "Boards", "POST", { name: undefined, color: undefined }, "boards", "{boardsId}", "labels"),
    new TrelloKeyObject("Get Lists on a Board", "Boards", "GET", { cards: undefined, card_fields: undefined, filter: undefined, fields: undefined }, "boards", "{boardsId}", "lists"),
    new TrelloKeyObject("Create a List on a Board", "Boards", "POST", { name: undefined, pos: undefined }, "boards", "{boardsId}", "lists"),
    new TrelloKeyObject("Get filtered Lists on a Board", "Boards", "GET", {}, "boards", "{boardsId}", "lists", "{filterId}"),
    new TrelloKeyObject("Get the Members of a Board", "Boards", "GET", {}, "boards", "{boardsId}", "members"),
    new TrelloKeyObject("Invite Member to Board via email", "Boards", "PUT", { email: undefined, type: undefined, fullName: undefined }, "boards", "{boardsId}", "members"),
    new TrelloKeyObject("Add a Member to a Board", "Boards", "PUT", { type: undefined, allowBillableGuest: undefined }, "boards", "{boardsId}", "members", "{membersId}"),
    new TrelloKeyObject("Remove Member from Board", "Boards", "DELETE", {}, "boards", "{boardsId}", "members", "memberId"),
    new TrelloKeyObject("Update Membership of Member on a Board", "Boards", "PUT", { type: undefined, member_fields: undefined }, "boards", "{boardsId}", "memberships", "{membershipId}"),
    new TrelloKeyObject("Create a Board", "Boards", "POST", { name: undefined, defaultLabels: undefined, defaultLists: undefined, desc: undefined, idOrganization: undefined, idBoardSource: undefined, keepFromSource: undefined, powerUps: undefined, permissionLevel: undefined, voting: undefined, comments: undefined, invitations: undefined, selfJoin: undefined, cardCovers: undefined, background: undefined, cardAging: undefined }, "boards"),
    new TrelloKeyObject("Create a Tag for a Board", "Boards", "POST", { value: undefined }, "boards", "{boardsId}", "idTags"),
    new TrelloKeyObject("Mark Board as viewed", "Boards", "POST", {}, "boards", "{boardsId}", "markedAsViewed"),
    new TrelloKeyObject("Get Enabled Power-Ups on Board", "Boards", "GET", {}, "boards", "{boardsId}", "boardPlugins"),
    new TrelloKeyObject("Get Power-Ups on a Board", "Boards", "GET", { filter: undefined }, "boards", "{boardsId}", "plugins"),

    /*Cards*/
    new TrelloKeyObject("Create a new Card", "Cards", "POST", { name: undefined, desc: undefined, pos: undefined, due: undefined, dueComplete: undefined, idList: undefined, idMembers: undefined, idLabels: undefined, urlSource: undefined, fileSource: undefined, mimeType: undefined, idCardSource: undefined, keepFromSource: undefined, adress: undefined, locationName: undefined, coordinates: undefined }, "cards"),
    new TrelloKeyObject("Get a Card", "Cards", "GET", { fields: undefined, actions: undefined, attachments: undefined, attachment_fields: undefined, members: undefined, member_fields: undefined, membersVoted: undefined, memberVoted_fields: undefined, checkItemStates: undefined, checklists: undefined, checklist_fields: undefined, board: undefined, board_fields: undefined, list: undefined, pluginData: undefined, stickers: undefined, sticker_fields: undefined, customFieldItems: undefined }, "cards", "{cardsId}"),
    new TrelloKeyObject("Update a Card", "Cards", "PUT", { name: undefined, desc: undefined, closed: undefined, idMembers: undefined, idAttachmentCover: undefined, idList: undefined, idLabels: undefined, idBoard: undefined, pos: undefined, due: undefined, dueComplete: undefined, subscribed: undefined, address: undefined, locationName: undefined, coordiantes: undefined, cover: undefined }, "cards", "{cardsId}"),
    new TrelloKeyObject("Delete a Card", "Cards", "DELETE", {}, "cards", "{cardsId}"),
    new TrelloKeyObject("Get a field on a Card", "Cards", "GET", {}, "cards", "{cardsId}", "", "{fieldId}"),
    new TrelloKeyObject("Get Actions on a Card", "Cards", "GET", { filter: undefined }, "cards", "{cardsId}", "actions"),
    new TrelloKeyObject("Get Attachments on a Card", "Cards", "GET", {}, "cards", "{cardsId}", "attachments"),
    new TrelloKeyObject("Create Attachment On Card", "Cards", "POST", { name: undefined, file: undefined, mimeType: undefined, url: undefined, setCover: undefined }, "cards", "{cardsId}", "attachments"),
    new TrelloKeyObject("Get an Attachment on a Card", "Cards", "GET", { fields: undefined }, "cards", "{cardsId}", "attachments", "{attachmentId}"),
    new TrelloKeyObject("Delete an Attachment on a Card", "Cards", "DELETE", {}, "cards", "{cardsId}", "attachments", "{attachmentId}"),
    new TrelloKeyObject("Get the Board the Card is on", "Cards", "GET", { fields: undefined }, "cards", "{cardsId}", "board"),
    new TrelloKeyObject("Get checkItems on a Card", "Cards", "GET", { fields: undefined }, "cards", "{cardsId}", "checkItemStates"),
    new TrelloKeyObject("Get Checklists on a Card", "Cards", "GET", { checkItems: undefined, checkItem_fields: undefined, filter: undefined, fields: undefined }, "cards", "{cardsId}", "checklists"),
    new TrelloKeyObject("Create Checklist on a Card", "Cards", "POST", { name: undefined, idChecklistSource: undefined, pos: undefined }, "cards", "{cardsId}", "checklists"),
    new TrelloKeyObject("Get checkItem on a Card", "Cards", "GET", { fields: undefined }, "cards", "{cardsId}", "checkItem", "{CheckItemId}"),
    new TrelloKeyObject("Update a checkItem on a Card", "Cards", "PUT", { name: undefined, state: undefined, idChecklist: undefined, pos: undefined }, "cards", "{cardsId}", "checkItem", "{CheckItemId}"),
    new TrelloKeyObject("Delete checkItem on a Card", "Cards", "DELETE", {}, "cards", "{cardsId}", "checkItem", "{CheckItemId}"),
    new TrelloKeyObject("Get the List of a Card", "Cards", "GET", { fields: undefined }, "cards", "{cardsId}", "list"),
    new TrelloKeyObject("Get the Members of a Card", "Cards", "GET", { fields: undefined }, "cards", "{cardsId}", "members"),
    new TrelloKeyObject("Get Members who have voted on a Card", "Cards", "GET", { fields: undefined }, "cards", "{cardsId}", "membersVoted"),
    new TrelloKeyObject("Add Member vote to Card", "Cards", "POST", { value: undefined }, "cards", "{cardsId}", "membersVoted"),
    new TrelloKeyObject("Get pluginData on a Card", "Cards", "GET", {}, "cards", "{cardsId}", "pluginData"),
    new TrelloKeyObject("Get Stickers on a Card", "Cards", "GET", { fields: undefined }, "cards", "{cardsId}", "stickers"),
    new TrelloKeyObject("Add a Sticker to a Card", "Cards", "POST", { image: undefined, top: undefined, left: undefined, zIndex: undefined, rotate: undefined }, "cards", "{cardsId}", "stickers"),
    new TrelloKeyObject("Get a Sticker on a Card", "Cards", "GET", { fields: undefined }, "cards", "{cardsId}", "stickers", "{stickerId}"),
    new TrelloKeyObject("Update a Sticker on a Card", "Cards", "PUT", { top: undefined, left: undefined, zIndex: undefined, rotate: undefined }, "cards", "{cardsId}", "stickers", "{stickerId}"),
    new TrelloKeyObject("Delete a Sticker on a Card", "Cards", "DELETE", {}, "cards", "{cardsId}", "stickers", "{stickerId}"),
    // SPECIAL 
    //new TrelloKeyObject("Update Comment Action on a Card", "Cards", "PUT", { text: undefined }, "cards", "{cardsId}", "actions", "{actionId}"), //har "comments" som 3rd key
    //SPECIAL
    //new TrelloKeyObject("Delete a comment on a Card", "Cards", "DELETE", {}, "cards", "{cardsId}", "actions", "{actionId}"), //har "comments" som 3rd key
    //SPECIAL
    //new TrelloKeyObject("Update Custom Field item on Card", "Cards", "PUT", {}, "cards", "{cardsId}", "customField", "{CustomFieldId}"), //har "item" som 3rd key
    new TrelloKeyObject("Get Custom Field Items for a Card", "Cards", "GET", {}, "cards", "{cardsId}", "customFieldItems"),
    //SPECIAL
    //new TrelloKeyObject("Add a new comment to a Card", "Cards", "POST", { text: undefined }, "cards", "{cardsId}", "actions"), //har "comments" som 3rd key, uden id2 + id3
    new TrelloKeyObject("Add a Label to a Card", "Cards", "POST", { value: undefined }, "cards", "{cardsId}", "idLabels"),
    new TrelloKeyObject("Add a Member to a Card", "Cards", "POST", { value: undefined }, "cards", "{cardsId}", "idMembers"),
    new TrelloKeyObject("Create a new Label on a Card", "Cards", "POST", { color: undefined, name: undefined }, "cards", "{cardsId}", "labels"),
    new TrelloKeyObject("Mark a Card's Notifications as read", "Cards", "POST", {}, "cards", "{cardsId}", "markAssociatedNotificationsRead"),
    new TrelloKeyObject("Remove a Label from a Card", "Cards", "DELETE", {}, "cards", "{cardsId}", "idLabels", "{labelId}"),
    new TrelloKeyObject("Remove a Member from a Card", "Cards", "DELETE", {}, "cards", "{cardsId}", "idMembers", "{memberId}"),
    new TrelloKeyObject("Remove a Member's Vote on a Card", "Cards", "DELETE", {}, "cards", "{cardsId}", "membersVoted", "{memberId}"),
    //SPECIAL!!!
    //new TrelloKeyObject("Update Checkitem on Checklist on Card", "Cards", "PUT", { pos: undefined }, "cards", "{cardsId}", "checklist", "{checklistId}"), //har "checkItem" som 3rd key + "{CheckItemId}" som 3rd ID
    new TrelloKeyObject("Delete a Checklist on a Card", "Cards", "DELETE", {}, "cards", "{cardsId}", "checklists", "{checklistId}"),

    /*Checklists*/
    new TrelloKeyObject("Create a Checklist", "Checklists", "POST", { idCard: undefined, name: undefined, pos: undefined, idChecklistSource: undefined }, "checklists"),
    new TrelloKeyObject("Get a Checklist", "Checklists", "GET", { cards: undefined, checkItems: undefined, checkItem_fields: undefined, fields: undefined }, "checklists", "checklistsId"),
    new TrelloKeyObject("Update a Checklist", "Checklists", "PUT", { name: undefined, pos: undefined }, "checklists", "checklistsId"),
    new TrelloKeyObject("Delete a Checklist", "Checklists", "DELETE", {}, "checklists", "checklistsId"),
    new TrelloKeyObject("Get field on a Checklist", "Checklists", "GET", {}, "checklists", "checklistsId", "", "fieldId"),
    new TrelloKeyObject("Update field on a Checklist", "Checklists", "PUT", { value: undefined }, "checklists", "checklistsId", "", "fieldId"),
    new TrelloKeyObject("Get the Board the Checklist is on", "Checklists", "GET", { fields: undefined }, "checklists", "checklistsId", "", "boardId"),
    new TrelloKeyObject("Get the Card a Checklist is on", "Checklists", "GET", {}, "checklists", "checklistsId", "", "cardsId"),
    new TrelloKeyObject("Get Checkitems on a Checklist", "Checklists", "GET", { filter: undefined, fields: undefined }, "checklists", "checklistsId", "", "checkItemsId"),
    new TrelloKeyObject("Create Checkitem on Checklist", "Checklists", "POST", { name: undefined, pos: undefined, checked: undefined }, "checklists", "checklistsId", "", "checkItemsId"),
    new TrelloKeyObject("Get a Checkitem on a Checklist", "Checklists", "GET", { fields: undefined }, "checklists", "checklistsId", "", "checkItemsId"),
    new TrelloKeyObject("Delete Checkitem from Checklist", "Checklists", "DELETE", {}, "checklists", "checklistsId", "", "checkItemsId"),

    /*CutsomFields*/
    new TrelloKeyObject("Create a new Custom Field on a Board", "CustomFields", "POST", { idModel: undefined, modelType: undefined, name: undefined, type: undefined, options: undefined, pos: undefined, display_cardFront: undefined }, "customFields"),
    new TrelloKeyObject("Get a Custom Field", "CustomFields", "GET", {}, "customFields", "{customFieldsId}"),
    new TrelloKeyObject("Update a Custom Field definition", "CustomFields", "PUT", { name: undefined, pos: undefined, display_cardFront: undefined }, "customFields", "{customFieldsId}"),
    new TrelloKeyObject("Delete a Custom Field definition", "CustomFields", "DELETE", {}, "customFields", "{customFieldsId}"),
    new TrelloKeyObject("Get Options of Custom Field drop down", "CustomFields", "GET", {}, "customFields", "{customFieldsId}", "options"),
    new TrelloKeyObject("Add Option to Custom Field dropdown", "CustomFields", "POST", {}, "customFields", "{customFieldsId}", "options"),
    new TrelloKeyObject("Get Option of Custom Field dropdown", "CustomFields", "GET", {}, "customFields", "{customFieldsId}", "options", "{customFieldOptionId}"),
    new TrelloKeyObject("Delete Option of Custom Field dropdown", "CustomFields", "DELETE", {}, "customFields", "{customFieldsId}", "options", "{customFieldOptionId}"),

    /*Emoji*/
    new TrelloKeyObject("List available Emoji", "Emoji", "GET", { locale: undefined, spritesheets: undefined }, "emoji"),

    /*Enterprises*/
    new TrelloKeyObject("Get an Enterprise", "Enterprises", "GET", { fields: undefined, members: undefined, member_fields: undefined, member_filter: undefined, member_sort: undefined, member_sortBy: undefined, member_sortOrder: undefined, member_startIndex: undefined, member_count: undefined, organizations: undefined, organization_fields: undefined, organization_paid_accounts: undefined, organization_memberships: undefined }, "enterprises", "{enterprisesId}"),
    new TrelloKeyObject("Get auditlog data for an Enterprise", "Enterprises", "GET", {}, "enterprises", "{enterprisesId}", "auditlog"),
    new TrelloKeyObject("Get Enterprise admin Members", "Enterprises", "GET", { fields: undefined }, "enterprises", "{enterprisesId}", "admins"),
    new TrelloKeyObject("Get signupUrl for Enterprise", "Enterprises", "GET", { authenticate: undefined, confirmationAccepted: undefined, returnUrl: undefined, tosAccepter: undefined }, "enterprises", "{enterprisesId}", "signupUrl"),
    new TrelloKeyObject("Get Members of Enterprise", "Enterprises", "GET", { fields: undefined, filter: undefined, sort: undefined, sortBy: undefined, sortOrder: undefined, startIndex: undefined, count: undefined, organization_fields: undefined, board_fields: undefined }, "enterprises", "{enterprisesId}", "members"),
    new TrelloKeyObject("Get a Member of Enterprise", "Enterprises", "GET", { fields: undefined, organization_fields: undefined, board_fields: undefined }, "enterprises", "{enterprisesId}", "members", "{membersId}"),
    new TrelloKeyObject("Get whether an organization can be transferred to an enterprise.", "Enterprises", "GET", {}, "enterprises", "{enterprisesId}", "organization", "{organizationId}"),
    new TrelloKeyObject("Get ClaimableOrganizations of an Enterprise", "Enterprises", "GET", {}, "enterprises", "{enterprisesId}", "claimableOrganizations"),
    new TrelloKeyObject("Get PendingOrganizations of an Enterprise", "Enterprises", "GET", {}, "enterprises", "{enterprisesId}", "pendingOrganizations"),
    new TrelloKeyObject("Create an auth Token for an Enterprise", "Enterprises", "POST", { expiration: undefined }, "enterprises", "{enterprisesId}", "tokens"),
    new TrelloKeyObject("Transfer an Organization to an Enterprise", "Enterprises", "PUT", { idOrganization: undefined }, "enterprises", "{enterprisesId}", "organizations"),
    //new TrelloKeyObject("Update a Member's licensed status", "Enterprises", "PUT", {value: undefined}, "enterprises", "{enterprisesId}", ), <<<< triple key
    //new TrelloKeyObject("Deactivate a Member of an Enterprise", "Enterprises", "GET", {}, "enterprises", "{enterprisesId}"),
    new TrelloKeyObject("Update Member to be admin of Enterprise", "Enterprises", "PUT", {}, "enterprises", "{enterprisesId}", "admins", "membersId"),
    new TrelloKeyObject("Remove a Member as admin from Enterprise", "Enterprises", "DELETE", {}, "enterprises", "{enterprisesId}", "admins", "membersId"),
    new TrelloKeyObject("Delete an Organization from an Enterprise", "Enterprises", "DELETE", {}, "enterprises", "{enterprisesId}", "organizations", "{organizationsId}"),

    /*Labels*/
    new TrelloKeyObject("Get a Label", "Labels", "GET", { fields: undefined }, "labels", "{labelsId}"),
    new TrelloKeyObject("Update a Label", "Labels", "PUT", { name: undefined, color: undefined }, "labels", "{labelsId}"),
    new TrelloKeyObject("Delete a Label", "Labels", "DELETE", {}, "labels", "{labelsId}"),
    new TrelloKeyObject("Update a field on a label", "Labels", "PUT", { value: undefined }, "labels", "{labelsId}", "", "{fieldId}"),
    new TrelloKeyObject("Create a Label", "Labels", "POST", { name: undefined, color: undefined, idBoard: undefined }, "labels"),

    /*Lists*/
    new TrelloKeyObject("Get a List", "Lists", "GET", { fields: undefined }, "lists", "{listsId}"),
    new TrelloKeyObject("Update a List", "Lists", "PUT", { fields: undefined }, "lists", "{listsId}"),
    new TrelloKeyObject("Create a new List", "Lists", "POST", { name: undefined, idBoard: undefined, idListSource: undefined, pos: undefined }, "lists"),
    new TrelloKeyObject("Archive all Cards in List", "Lists", "POST", {}, "lists", "{listsId}", "archiveAllCards"),
    new TrelloKeyObject("Move all Cards in List", "Lists", "POST", { idBoard: undefined, idList: undefined }, "lists", "{listsId}", "moveAllCards"),
    new TrelloKeyObject("Archive or unarchive a list", "Lists", "PUT", { value: undefined }, "lists", "{listsId}", "closed"),
    new TrelloKeyObject("Move List to Board", "Lists", "PUT", { value: undefined }, "lists", "{listsId}", "idBoard"),
    new TrelloKeyObject("Update a field on a List", "Lists", "PUT", { value: undefined }, "lists", "{listsId}", "", "fieldId"),
    new TrelloKeyObject("Get Actions for a List", "Lists", "GET", { filter: undefined }, "lists", "{listsId}", "actions"),
    new TrelloKeyObject("Get the Board a List is on", "Lists", "GET", { fields: undefined }, "lists", "{listsId}", "board"),
    new TrelloKeyObject("Get Cards in a List", "Lists", "GET", {}, "lists", "{listsId}", "cards"),

    /*Members*/
    new TrelloKeyObject("Get a Member", "Members", "GET", { actions: undefined, boards: undefined, boardBackgrounds: undefined, boardsInvited: undefined, boardsInvited_fields: undefined, boardStars: undefined, cards: undefined, customBoardBackgrounds: undefined, customEmoji: undefined, customStickers: undefined, fields: undefined, organization_fields: undefined, organization_paid_account: undefined, organizationsInvited: undefined, organizationsInvited_fields: undefined, paid_account: undefined, savedSearches: undefined, tokens: undefined }, "members", "{membersId}"),
    new TrelloKeyObject("Update a Member", "Members", "PUT", { fullName: undefined, initials: undefined, username: undefined, bio: undefined, avatarSource: undefined, colorblind: undefined, locale: undefined, minutesBetweenSummaries: undefined }, "members", "{membersId}"),
    new TrelloKeyObject("Get a field on a Member", "Members", "GET", {}, "members", "{membersId}", "", "{fieldId}"),
    new TrelloKeyObject("Get a Member's Actions", "Members", "GET", { filter: undefined }, "members", "{membersId}", "actions"),
    new TrelloKeyObject("Get Member's custom Board backgrounds", "Members", "GET", { filter: undefined }, "members", "{membersId}", "boardBackgrounds"),
    new TrelloKeyObject("Upload new boardBackground for Member", "Members", "POST", { file: undefined }, "members", "{membersId}", "boardBackgrounds"),
    new TrelloKeyObject("Get a boardBackground of a Member", "Members", "GET", { fields: undefined }, "members", "{membersId}", "boardBackgrounds", "{backgroundId}"),
    new TrelloKeyObject("Update a Member's custom Board background", "Members", "PUT", { brightness: undefined, tile: undefined }, "members", "{membersId}", "boardBackgrounds", "{backgroundId}"),
    new TrelloKeyObject("Delete a Member's custom Board background", "Members", "DELETE", {}, "members", "{membersId}", "boardBackgrounds", "{backgroundId}"),
    new TrelloKeyObject("Get a Member's boardStars", "Members", "GET", {}, "members", "{membersId}", "boardStars"),
    new TrelloKeyObject("Create Star for Board", "Members", "POST", { idBoard: undefined, pos: undefined }, "members", "{membersId}", "boardStars"),
    new TrelloKeyObject("Get a boardStar of Member", "Members", "GET", {}, "members", "{membersId}", "boardStars", "{starId}"),
    new TrelloKeyObject("Update the position of a boradStar of Member", "Members", "PUT", { pos: undefined }, "members", "{membersId}", "boardStars", "{starId}"),
    new TrelloKeyObject("Delete Star for Board", "Members", "DELETE", {}, "members", "{membersId}", "boardStars", "{starId}"),
    new TrelloKeyObject("Get Boards that Member belongs to", "Members", "GET", { filter: undefined, fields: undefined, lists: undefined, organization: undefined, organization_fields: undefined }, "members", "{membersId}", "boards"),
    new TrelloKeyObject("Get Boards the Member has been invited to", "Members", "GET", { fields: undefined }, "members", "{membersId}", "boardsInvited"),
    new TrelloKeyObject("Get Cards the Member is on", "Members", "GET", { filter: undefined }, "members", "{membersId}", "cards"),
    new TrelloKeyObject("Get a Member's custom Board Backgrounds", "Members", "GET", {}, "members", "{membersId}", "customBoardBackgrounds"),
    new TrelloKeyObject("Create a new custom Board Background", "Members", "POST", { file: undefined }, "members", "{membersId}", "customBoardBackgrounds"),
    new TrelloKeyObject("Get custom Board Background of Member", "Members", "GET", {}, "members", "{membersId}", "customBoardBackgrounds", "{backgroundId}"),
    new TrelloKeyObject("Update custom Board Background of Member", "Members", "PUT", { brightness: undefined, tile: undefined }, "members", "{membersId}", "customBoardBackgrounds", "{backgroundId}"),
    new TrelloKeyObject("Delete custom Board Background of Member", "Members", "DELETE", {}, "members", "{membersId}", "customBoardBackgrounds", "{backgroundId}"),
    new TrelloKeyObject("Get a Member's customEmojis", "Members", "GET", {}, "members", "{membersId}", "customEmoji"),
    new TrelloKeyObject("Create custom Emoji for Member", "Members", "POST", { file: undefined, name: undefined }, "members", "{membersId}", "customEmoji"),
    new TrelloKeyObject("Get a Member's custom Emoji", "Members", "GET", { fields: undefined }, "members", "{membersId}", "customEmoji", "{emojiId}"),
    new TrelloKeyObject("Get Member's custom Stickers", "Members", "GET", {}, "members", "{membersId}", "customStickers"),
    new TrelloKeyObject("Create custom Sticker for Member", "Members", "POST", { file: undefined }, "members", "{membersId}", "customStickers"),
    new TrelloKeyObject("Get a Member's custom Sticker", "Members", "GET", { fields: undefined }, "members", "{membersId}", "customStickers", "{stickerId}"),
    new TrelloKeyObject("Delete a Member's custom Sticker", "Members", "DELETE", {}, "members", "{membersId}", "customStickers", "{stickerId}"),
    new TrelloKeyObject("Get Member's Notifications", "Members", "GET", { entities: undefined, display: undefined, filter: undefined, read_filter: undefined, fields: undefined, limit: undefined, page: undefined, before: undefined, since: undefined, memberCreator: undefined, memberCreator_fields: undefined }, "members", "{membersId}", "notifications"),
    new TrelloKeyObject("Get Member's Organizations", "Members", "GET", { filter: undefined, fields: undefined, paid_account: undefined }, "members", "{membersId}", "organizations"),
    new TrelloKeyObject("Get Organizations a Member has been incited to", "Members", "GET", { fields: undefined }, "members", "{membersId}", "organizationsInvited"),
    new TrelloKeyObject("Get Member's saved searched", "Members", "GET", {}, "members", "{membersId}", "savedSearches"),
    new TrelloKeyObject("Create saved Search for Member", "Members", "POST", { name: undefined, query: undefined, pos: undefined }, "members", "{membersId}", "savedSearches"),
    new TrelloKeyObject("Get a saved search", "Members", "GET", {}, "members", "{membersId}", "savedSearches", "{searchId}"),
    new TrelloKeyObject("Update a saved search", "Members", "PUT", { name: undefined, query: undefined, pos: undefined }, "members", "{membersId}", "savedSearches", "{searchId}"),
    new TrelloKeyObject("Delete a saved search", "Members", "DELETE", {}, "members", "{membersId}", "savedSearches", "{searchId}"),
    new TrelloKeyObject("Get Member's Tokens", "Members", "GET", { webhooks: undefined }, "members", "{membersId}", "tokens"),
    new TrelloKeyObject("Create Avatar for Member", "Members", "POST", { file: undefined }, "members", "{membersId}", "avatar"),
    new TrelloKeyObject("Dismiss a message for Member", "Members", "POST", { value: undefined }, "members", "{membersId}", "oneTimeMessagesDismissed"),


    /*Notifications*/
    new TrelloKeyObject("Get a Notification", "Notifications", "GET", { board: undefined, board_fields: undefined, card: undefined, card_fields: undefined, display: undefined, entities: undefined, fields: undefined, list: undefined, member: undefined, member_fields: undefined, memberCreator: undefined, memberCreator_fields: undefined, organization: undefined, organization_fields: undefined }, "notifications", "{notificationsId}"),
    new TrelloKeyObject("Update a Notification's read status", "Notifications", "PUT", { unread: undefined }, "notifications", "{notificationsId}"),
    new TrelloKeyObject("Get a field of a Notification", "Notifications", "GET", {}, "notifications", "{notificationsId}", "", "{fieldsId}"),
    //new TrelloKeyObject("Mark all Notifications as read", "Notifications", "GET", {}, "notifications", "{notificationsId}"),
    new TrelloKeyObject("Update Notification's read status", "Notifications", "PUT", { value: undefined }, "notifications", "{notificationsId}", "unread"),
    new TrelloKeyObject("Get the Board a Notification is on", "Notifications", "GET", { fields: undefined }, "notifications", "{notificationsId}", "board"),
    new TrelloKeyObject("Get the Card a Notification is on", "Notifications", "GET", { fields: undefined }, "notifications", "{notificationsId}", "card"),
    new TrelloKeyObject("Get the List a Notification is on", "Notifications", "GET", { fields: undefined }, "notifications", "{notificationsId}", "list"),
    new TrelloKeyObject("Get the Member a Notification is about (not the creator)", "Notifications", "GET", { fields: undefined }, "notifications", "{notificationsId}", "member"),
    new TrelloKeyObject("Get the Member who created the Notification", "Notifications", "GET", { fields: undefined }, "notifications", "{notificationsId}", "memberCreator"),
    new TrelloKeyObject("Get a Notification's associated Organization", "Notifications", "GET", { fields: undefined }, "notifications", "{notificationsId}", "organization"),

    // Organization
    new TrelloKeyObject("Create a new Organization", "Organizations", "POST", { displayName: undefined, desc: undefined, name: undefined, website: undefined }, "organizations", "{organizationsId}"),
    new TrelloKeyObject("Get an Organization", "Organizations", "GET", {}, "organizations", "{organizationsId}"),
    new TrelloKeyObject("Update an Organization", "Organizations", "PUT", { name: undefined, displayName: undefined, desc: undefined, website: undefined, associatedDomain: undefined, externalMembersDisabled: undefined, googleAppsVersion: undefined, boardVisibilityRestrict_org: undefined, boardVisibilityRestrict_private: undefined, boardVisibilityRestrict_public: undefined, orgInviteRestrict: undefined, permissionLevel: undefined }, "organizations", "{organizationsId}"),
    new TrelloKeyObject("Delete an Organization", "Organizations", "DELETE", {}, "organizations", "{organizationsId}"),
    new TrelloKeyObject("Get field on Organization", "Organizations", "GET", {}, "organizations", "{organizationsId}", "", "{fieldId}"),
    new TrelloKeyObject("Get Actions for Organization", "Organizations", "GET", {}, "organizations", "{organizationsId}", "", "{actionsId}"),
    new TrelloKeyObject("Get Boards in an Organization", "Organizations", "GET", { filter: undefined, fields: undefined }, "organizations", "{organizationsId}", "", "{boardsId}"),
    new TrelloKeyObject("Retrieve Organization's Exports", "Organizations", "GET", {}, "organizations", "{organizationsId}", "", "{exportsId}"),
    new TrelloKeyObject("Create Export for Organizations", "Organizations", "POST", { attachments: undefined }, "organizations", "{organizationsId}", "", "{exportsId}"),
    new TrelloKeyObject("Get the Members of an Organization", "Organizations", "GET", {}, "organizations", "{organizationsId}", "", "{membersId}"),
    new TrelloKeyObject("Update an Organization's Members", "Organizations", "PUT", { email: undefined, fullName: undefined, type: undefined }, "organizations", "{organizationsId}", "", "{membersId}"),
    new TrelloKeyObject("Get Memberships of an Organization", "Organizations", "GET", { filter: undefined, member: undefined }, "organizations", "{organizationsId}", "", "{membershipsID}"),
    new TrelloKeyObject("Get a Membership of an Organization", "Organizations", "GET", { member: undefined }, "organizations", "{organizationsId}", "", "{membershipsId}"),
    new TrelloKeyObject("Get the pluginData Scoped to Organization", "Organizations", "GET", {}, "organizations", "{organizationsId}", "", "{pluginData}"),
    new TrelloKeyObject("Get Tags of an Organization", "Organizations", "GET", {}, "organizations", "{organizationsId}", "", "{tagsId}"),
    new TrelloKeyObject("Create a Tag in Organization", "Organizations", "POST", {}, "organizations", "{organizationsId}", "", "{tagsId}"),
    new TrelloKeyObject("Update a Member of an Organization", "Organizations", "PUT", { type: undefined }, "organizations", "{organizationsId}", "", "{membersId}"),
    new TrelloKeyObject("Remove a Member from an Organization", "Organizations", "DELETE", {}, "organizations", "{organizationsId}", "", "{membersId}"),
    new TrelloKeyObject("Deactivate or reactivate a member of an Organization", "Organizations", "PUT", { value: undefined }, "organizations", "{organizationsId}", "", "{membersId}"),
    new TrelloKeyObject("Update logo for an Organization", "Organizations", "POST", { file: undefined }, "organizations", "{organizationsId}", "", "{logoId}"),
    new TrelloKeyObject("Delete Logo for Organization", "Organizations", "DELETE", {}, "organizations", "{organizationsId}", "", "{logoId}"),
    new TrelloKeyObject("Remove a Member from an Organization and all Organization Boards", "Organizations", "DELETE", {}, "organizations", "{organizationsId}", "", "{membersId}"),
    new TrelloKeyObject("Remove the associated Google Apps domain from a Workspace", "Organizations", "DELETE", {}, "organizations", "{organizationsId}", "", "{prefs/associatedDomainId}"),
    new TrelloKeyObject("Delete the email domain restriction on who can be invited to the Workspace", "Organizations", "DELETE", {}, "organizations", "{organizationsId}", "", "{prefs/orgInviteRestrictId}"),
    new TrelloKeyObject("Delete an Organization's Tag", "Organizations", "DELETE", {}, "organizations", "{organizationsId}", "", "{tagsId}"),
    new TrelloKeyObject("Get Organizations new billable guests", "Organizations", "GET", {}, "organizations", "{organizationsId}", "", "{newBillableGuestsId}"),

    //Plugins
    new TrelloKeyObject("Get a Plugin", "Plugins", "GET", {}, "plugins", "{pluginsId}"),
    new TrelloKeyObject("Update a Plugin", "Plugins", "PUT", {}, "plugins", "{pluginsId}"),
    new TrelloKeyObject("Create a Listing for Plugin", "Plugins", "POST", {}, "plugins", "{pluginsId}", "", "{listingId}"),
    new TrelloKeyObject("Get Plugin's Member privacy compliance", "Plugins", "GET", {}, "plugins", "{pluginsId}", "", "{compliance/memberPrivacyId}"),
    new TrelloKeyObject("Updating Plugin's Listing", "Plugins", "PUT", {}, "plugins", "{pluginsId}", "", "{listingsId}"),

    //Search
    new TrelloKeyObject("Search Trello", "Search", "GET", { query: undefined, idBoards: undefined, idOrganizations: undefined, idCards: undefined, modelTypes: undefined, board_fields: undefined, boards_limit: undefined, board_organization: undefined, card_fields: undefined, cards_limit: undefined, cards_page: undefined, card_board: undefined, card_list: undefined, card_members: undefined, card_stickers: undefined, card_attachments: undefined, organization_fields: undefined, organizations_limit: undefined, member_fields: undefined, members_limit: undefined, partial: undefined }, "search", "{searchId}"),
    new TrelloKeyObject("Search for Members", "Search", "GET", { query: undefined, limit: undefined, idBoard: undefined, idOrganization: undefined, onlyOrgMembers: undefined }, "search", "{searchId}"),

    //Tokens
    new TrelloKeyObject("Get a Token", "Tokens", "GET", { fields: undefined, webhooks: undefined }, "tokens", "{tokensId}"),
    new TrelloKeyObject("Get Token's Member", "Tokens", "GET", { fields: undefined }, "tokens", "{tokensId}"),
    new TrelloKeyObject("Get Webhooks for Token", "Tokens", "GET", {}, "tokens", "{tokensId}"),
    new TrelloKeyObject("Create Webhooks for Token", "Tokens", "POST", { description: undefined, callbackURL: undefined, idModel: undefined }, "tokens", "{tokensId}"),
    new TrelloKeyObject("Get a Webhook belonging to a Token", "Tokens", "GET", {}, "tokens", "{tokensId}", "", "{webhooksId}"),
    new TrelloKeyObject("Update a Webhook created by Token", "Tokens", "PUT", { description: undefined, callbackURL: undefined, idModel: undefined }, "tokens", "{tokensId}", "", "{webhooksId}"),
    new TrelloKeyObject("Delete a Webhook created by Token", "Tokens", "DELETE", {}, "tokens", "{tokensId}", "", "{webhooksId}"),
    new TrelloKeyObject("Delete a Token", "Tokens", "DELETE", {}, "tokens", "{tokensId}"),

    //Webhooks
    new TrelloKeyObject("Create a Webhook", "Webhooks", "POST", { description: undefined, callbackURL: undefined, idModel: undefined, active: undefined }, "webhooks"),
    new TrelloKeyObject("Get a Webhook", "Webhooks", "GET", {}, "webhooks", "{webhooksId}"),
    new TrelloKeyObject("Update a Webhook", "Webhooks", "PUT", { description: undefined, callbackURL: undefined, idModel: undefined, active: undefined }, "webhooks", "{webhooksId}"),
    new TrelloKeyObject("Delete a Webhook", "Webhooks", "DELETE", {}, "webhooks", "{webhooksId}"),
    new TrelloKeyObject("Get a field on a Webhook", "Webhooks", "GET", {}, "webhooks", "{webhooksId}", "", "{fieldId}")
]

let spotifyEndpointArray = [
    //Albums
    new SpotifyEndpointObject("Get Album", "Albums", "GET", { market: undefined }, "albums", "{albumId}"),
    new SpotifyEndpointObject("Get Several Albums", "Albums", "GET", { ids: undefined, market: undefined }, "albums"),
    new SpotifyEndpointObject("Get Album Tracks", "Albums", "GET", { limit: undefined, market: undefined, offset: undefined }, "albums", "{albumId}", "tracks"),
    new SpotifyEndpointObject("Get Saved Albums", "Albums", "GET", { limit: undefined, market: undefined, offset: undefined }, "me", "", "albums"),
    new SpotifyEndpointObject("Save Albums", "Albums", "PUT", { ids: undefined }, "me", "", "albums"),
    new SpotifyEndpointObject("Remove Albums", "Albums", "DELETE", { ids: undefined }, "me", "", "albums"),
    new SpotifyEndpointObject("Check Saved Albums", "Albums", "GET", { ids: undefined }, "me", "", "albums", "", "contains"),
    new SpotifyEndpointObject("Get New Releases", "Albums", "GET", { country: undefined, limit: undefined, offset: undefined }, "browse", "", "new-releases"),

    //Artists
    new SpotifyEndpointObject("Get Artist", "Artists", "GET", {}, "artists", "{artistId}"),
    new SpotifyEndpointObject("Get Several Artists", "Artists", "GET", {ids: undefined}, "artists"),
    new SpotifyEndpointObject("Get Artist's Albums", "Artists", "GET", {include_groups: undefined, limit: undefined, market: undefined, offset: undefined}, "artists", "{artistId}", "albums"),
    new SpotifyEndpointObject("Get Artist's Top Tracks", "Artists", "GET", {market: undefined}, "artists", "{artistId}", "top-tracks"),
    new SpotifyEndpointObject("Get Artist's Related Artists", "Artists", "GET", {}, "artists", "{artistId}", "related-artists"),

    //Shows
    new SpotifyEndpointObject("Get Show", "Shows", "GET", { market: undefined }, "shows", "{showId}"),
    new SpotifyEndpointObject("Get Several Shows", "Shows", "GET", { ids: undefined, market: undefined }, "shows"),
    new SpotifyEndpointObject("Get Show Episodes", "Shows", "GET", { limit: undefined, market: undefined, offset: undefined }, "shows", "{showId}", "episodes"),
    new SpotifyEndpointObject("Get User's Saved Shows", "Shows", "GET", { limit: undefined, offset: undefined }, "me", "", "shows"),
    new SpotifyEndpointObject("Save Shows for Current User", "Shows", "PUT", { ids: undefined }, "me", "", "shows"),
    new SpotifyEndpointObject("Remove User's Saved Shows", "Shows", "DELETE", { ids: undefined, market: undefined }, "me", "", "shows"),
    new SpotifyEndpointObject("Check User's Saved Shows", "Shows", "GET", { ids: undefined }, "me", "", "shows", "", "contains"),

    //Episodes
    new SpotifyEndpointObject("Get Episode", "Episodes", "GET", { market: undefined }, "episodes", "{episodeId}"),
    new SpotifyEndpointObject("Get Several Episodes", "Episodes", "GET", { ids: undefined, market: undefined }, "episodes"),
    new SpotifyEndpointObject("Get User's Saved Episodes", "Episodes", "GET", { limit: undefined, market: undefined, offset: undefined }, "me", "", "episodes"),
    new SpotifyEndpointObject("Save Episodes for User", "Episodes", "PUT", { ids: undefined }, "me", "", "episodes"),
    new SpotifyEndpointObject("Remove User's Saved Episodes", "Episodes", "DELETE", { ids: undefined }, "me", "", "episodes"),
    new SpotifyEndpointObject("Check User's Saved Episodes", "Episodes", "GET", { ids: undefined }, "me", "", "episodes", "", "contains"),

    //Tracks
    new SpotifyEndpointObject("Get Track", "Tracks", "GET", { market: undefined }, "tracks", "{trackId}"),
    new SpotifyEndpointObject("Get Several Tracks", "Tracks", "GET", { ids: undefined, market: undefined }, "tracks"),
    new SpotifyEndpointObject("Get User's Saved Tracks", "Tracks", "GET", { limit: undefined, market: undefined, offset: undefined }, "me", "", "tracks"),
    new SpotifyEndpointObject("Save Tracks for Current User", "Tracks", "PUT", { ids: undefined }, "me", "", "tracks"),
    new SpotifyEndpointObject("Remove Tracks for Current User", "Tracks", "DELETE", { ids: undefined }, "me", "", "tracks"),
    new SpotifyEndpointObject("Check User's Saved Tracks", "Tracks", "GET", { ids: undefined }, "me", "", "tracks", "", "contains"),
    new SpotifyEndpointObject("Get Tracks' Audio Features", "Tracks", "GET", { ids: undefined }, "audio-features"),
    new SpotifyEndpointObject("Get Track's Audio Features", "Tracks", "GET", {}, "audio-features", "{trackId}"),
    new SpotifyEndpointObject("Get Track's Audio Analysis", "Tracks", "GET", {}, "audio-analysis", "{trackId}"),
    new SpotifyEndpointObject("Get Recommendations", "Tracks", "GET", { seed_artists: undefined, seed_genres: undefined, seed_tracks: undefined, limit: undefined, market: undefined, max_acousticness: undefined, max_danceability: undefined, max_duration_ms: undefined, max_energy: undefined, max_instrumentalness: undefined, max_key: undefined, max_liveness: undefined, max_loudness: undefined, max_mode: undefined, max_popularity: undefined, max_speechiness: undefined, max_tempo: undefined, max_time_signature: undefined, max_valence: undefined, min_acousticness: undefined, min_danceability: undefined, min_duration_ms: undefined, min_energy: undefined, min_instrumentalness: undefined, min_key: undefined, min_liveness: undefined, min_loudness: undefined, min_mode: undefined, min_popularity: undefined, min_speechiness: undefined, min_tempo: undefined, min_time_signature: undefined, min_valence: undefined, target_acousticness: undefined, target_danceability: undefined, target_duration_ms: undefined, target_energy: undefined, target_instrumentalness: undefined, target_key: undefined, target_liveness: undefined, target_loudness: undefined, target_mode: undefined, target_popularity: undefined, target_speechiness: undefined, target_tempo: undefined, target_time_signature: undefined, target_valence: undefined }, "recommendations"),

    //Search
    new SpotifyEndpointObject("Search for Item", "Search", "GET", { q: undefined, type: undefined, include_external: undefined, limit: undefined, market: undefined, offset: undefined }, "search"),

    //Users
    new SpotifyEndpointObject("Get Current User's Profile", "Users", "GET", {}, "me"),
    new SpotifyEndpointObject("Get User's Top Items", "Users", "GET", { limit: undefined, offset: undefined, time_range: undefined }, "me", "", "top", "{typeArtistOrTrack"),
    new SpotifyEndpointObject("Get User's Profile", "Users", "GET", {}, "users", "{userId}"),
    new SpotifyEndpointObject("Follow Playlist", "Users", "PUT", {}, "playlists", "{playlistId}", "followers"),
    new SpotifyEndpointObject("Unfollow Playlist", "Users", "DELETE", {}, "playlists", "{playlistId}", "followers"),
    new SpotifyEndpointObject("Get Followed Artists", "Users", "GET", { type: undefined, after: undefined, limit: undefined }, "me", "", "following"),
    new SpotifyEndpointObject("Follow Artists or Users", "Users", "PUT", { ids: undefined, type: undefined }, "me", "", "following"),
    new SpotifyEndpointObject("Unfollow Artists or Users", "Users", "DELETE", { ids: undefined, type: undefined }, "me", "", "following"),
    new SpotifyEndpointObject("Check If User Follows Artists or Users", "Users", "GET", { ids: undefined, type: undefined }, "me", "", "following", "", "contains"),
    new SpotifyEndpointObject("Check if Users Follow Playlist", "Users", "GET", { ids: undefined }, "playlists", "{playlistId}", "followers", "", "contains"),

    //Playlists
    new SpotifyEndpointObject("Get Playlist", "Playlists", "GET", { additional_types: undefined, fields: undefined, market: undefined }, "playlists", "{playlistId}"),
    new SpotifyEndpointObject("Change Playlist Details", "Playlists", "PUT", { name: undefined, public: undefined, collaborative: undefined, description: undefined }, "playlists", "{playlistId}"),
    new SpotifyEndpointObject("Get Playlist Items", "Playlists", "GET", { additional_types: undefined, fields: undefined, limit: undefined, market: undefined, offset: undefined }, "playlists", "{playlistId}", "tracks"),
    new SpotifyEndpointObject("Add Items to Playlist", "Playlists", "POST", { position: undefined, uris: undefined }, "playlists", "{playlistId}", "tracks"),
    new SpotifyEndpointObject("Update Playlist Items", "Playlists", "PUT", { uris: undefined, range_start: undefined, insert_before: undefined, range_length: undefined, snapshot_id: undefined }, "playlists", "{playlistId}", "tracks"),
    new SpotifyEndpointObject("Remove Playlist Items", "Playlists", "DELETE", { tracks: undefined, snapshot_id: undefined }, "playlists", "{playlistId}", "tracks"),
    new SpotifyEndpointObject("Get Current User's Playlists", "Playlists", "GET", { limit: undefined, offset: undefined }, "me", "", "playlists"),
    new SpotifyEndpointObject("Get User's Playlists", "Playlists", "GET", { limit: undefined, offset: undefined }, "users", "{userId}", "playlists"),
    new SpotifyEndpointObject("Create Playlist", "Playlists", "POST", { name: undefined, public: undefined, collaborative: undefined, description: undefined }, "users", "{userId}", "playlists"),
    new SpotifyEndpointObject("Get Featured Playlists", "Playlists", "GET", { country: undefined, limit: undefined, locale: undefined, offset: undefined, timestamp: undefined }, "browse", "", "featured-playlists"),
    new SpotifyEndpointObject("Get Category's Playlists", "Playlists", "GET", { country: undefined, limit: undefined, offset: undefined }, "browsel", "", "categories", "{categoryId}", "playlists"),
    new SpotifyEndpointObject("Get Playlist Cover Image", "Playlists", "GET", {}, "playlists", "{playlistId}", "images"),
    new SpotifyEndpointObject("Add Custom Playlist Cover Image", "Playlists", "PUT", {}, "playlists", "{playlistId}", "images"),

    //Categories
    new SpotifyEndpointObject("Get Several Browse Categories", "Categories", "GET", { country: undefined, limit: undefined, locale: undefined, offset: undefined }, "browse", "", "categories"),
    new SpotifyEndpointObject("Get Single Browse Category", "Categories", "GET", { country: undefined, locale: undefined }, "browse", "", "categories", "{categoryId}"),

    //Genres
    new SpotifyEndpointObject("Get Available Genre Seeds", "Genres", "GET", {}, "recommendations", "", "available-genre-seeds"),

    //Player
    new SpotifyEndpointObject("Get Playback State", "Player", "GET", { additional_types: undefined, market: undefined }, "me", "", "player"),
    new SpotifyEndpointObject("Transfer Playback", "Player", "PUT", { device_ids: undefined, play: undefined }, "me", "", "player"),
    new SpotifyEndpointObject("Get Available Devices", "Player", "GET", {}, "me", "", "player", "", "devices"),
    new SpotifyEndpointObject("Get Currently Playing Track", "Player", "GET", { additional_types: undefined, market: undefined }, "me", "", "player", "", "currently-playing"),
    new SpotifyEndpointObject("Start/Resume Playback", "Player", "PUT", { device_id: undefined, context_uri: undefined, uris: undefined, offset: undefined, position_ms: undefined }, "me", "", "player", "", "play"),
    new SpotifyEndpointObject("Pause Playback", "Player", "PUT", { device_id: undefined }, "me", "", "player", "", "pause"),
    new SpotifyEndpointObject("Skip To Next", "Player", "POST", { device_id: undefined }, "me", "", "player", "", "next"),
    new SpotifyEndpointObject("Skip To Previous", "Player", "POST", { device_id: undefined }, "me", "", "player", "", "previous"),
    new SpotifyEndpointObject("Seek To Position", "Player", "PUT", { position_ms: undefined, device_id: undefined }, "me", "", "player", "", "seek"),
    new SpotifyEndpointObject("Set Repeat Mode", "Player", "PUT", { state: undefined, device_id: undefined }, "me", "", "player", "", "repeat"),
    new SpotifyEndpointObject("Set Playback Volume", "Player", "PUT", { volume_percent: undefined, device_id: undefined }, "me", "", "player", "", "volume"),
    new SpotifyEndpointObject("Toggle Playback Shuffle", "Player", "PUT", { state: undefined, device_id: undefined }, "me", "", "player", "", "shuffle"),
    new SpotifyEndpointObject("Get Recently Played Tracks", "Player", "GET", { after: undefined, before: undefined, limit: undefined }, "me", "", "player", "", "recently-played"),
    new SpotifyEndpointObject("Add Item to Playback Queue", "Player", "POST", { uri: undefined, device_id: undefined }, "me", "", "player", "", "queue"),

    //Markets
    new SpotifyEndpointObject("Get Available Markets", "Market", "GET", {}, "markets"),
]

let webhookObjectArray = [
    new WebhookObject ("acceptEnterpriseJoinRequest", [false, false, false, false, true, true]),
    new WebhookObject ("addAttachmentToCard", [true, true, true, true, false, false]),
    new WebhookObject ("addChecklistToCard", [true, false, true, true, false, false]),
    new WebhookObject ("addLabelToCard", [true, false, true, true, false, false]),
    new WebhookObject ("addMemberToBoard", [false, false, true, true, false, false]),
    new WebhookObject ("addMemberToCard", [true, false, true, true, false, false]),
    new WebhookObject ("addMemberToOrganization", [false, false, false, true, true, false]),
    new WebhookObject ("addOrganizationToEnterprise", [false, false, false, false, true, true]),
    new WebhookObject ("addToEnterprisePluginWhitelist", [false, false, false, true, false, true]),
    new WebhookObject ("addToOrganizationBoard", [false, false, true, true, true, false]),
    new WebhookObject ("commentCard", [true, true, true, true, false, false]),
    new WebhookObject ("convertToCardFromCheckItem", [false, false, true, true, false, false]),
    new WebhookObject ("copyBoard", [false, false, false, true, false, false]),
    new WebhookObject ("copyCard", [false, true, true, true, false, false]),
    new WebhookObject ("copyChecklist", [true, false, true, true, false, false]),
    new WebhookObject ("copyCommentCard", [false, false, false, true, false, false]),
    new WebhookObject ("createBoard", [false, false, false, true, false, false]),
    new WebhookObject ("createBoardInvitation", [false, false, false, true, true, false]),
    new WebhookObject ("createBoardPreference", [false, false, true, false, false, false]),
    new WebhookObject ("createCard", [false, true, true, true, false, false]),
    new WebhookObject ("createCheckItem***", [true, false, true, true, false, false]),
    new WebhookObject ("createLabel", [false, false, true, true, false, false]),
    new WebhookObject ("createList", [false, false, true, true, false, false]),
    new WebhookObject ("createOrganization", [false, false, false, true, false, false]),
    new WebhookObject ("createOrganizationInvitation", [false, false, false, true, true, false]),
    new WebhookObject ("deactivatedMemberInBoard", [false, false, false, true, false, false]),
    new WebhookObject ("deactivatedMemberInEnterprise", [false, false, false, true, false, true]),
    new WebhookObject ("deactivatedMemberInOrganization", [false, false, false, true, true, false]),
    new WebhookObject ("deleteAttachmentFromCard", [true, false, true, true, false, false]),
    new WebhookObject ("deleteBoardInvitation", [false, false, true, true, false, false]),
    new WebhookObject ("deleteCard", [true, true, true, true, false, false]),
    new WebhookObject ("deleteCheckItem", [true, false, true, true, false, false]),
    new WebhookObject ("deleteComment***", [true, false, true, true, false, false]),
    new WebhookObject ("deleteLabel", [false, false, true, true, false, false]),
    new WebhookObject ("deleteOrganizationInvitation", [false, false, false, true, true, false]),
    new WebhookObject ("disableEnterprisePluginWhitelist", [false, false, false, true, false, true]),
    new WebhookObject ("disablePlugin", [false, false, true, true, false, false]),
    new WebhookObject ("disablePowerUp", [false, false, true, true, false, false]),
    new WebhookObject ("emailCard", [false, true, true, true, false, false]),
    new WebhookObject ("enableEnterprisePluginWhitelist", [false, false, false, true, false, true]),
    new WebhookObject("enablePlugin", [false, false, true, true, false, false]),
    new WebhookObject ("enablePowerUp", [false, false, true, true, false, false]),
    new WebhookObject ("makeAdminOfBoard", [false, false, true, true, false, false]),
    new WebhookObject ("makeAdminOfOrganization", [false, false, false, true, true, false]),
    new WebhookObject ("makeNormalMemberOfBoard", [false, false, true, true, false, false]),
    new WebhookObject ("makeNormalMemberOfOrganization", [false, false, false, true, true, false]),
    new WebhookObject ("makeObserverOfBoard", [false, false, true, true, false, false]),
    new WebhookObject ("memberJoinedTrello", [false, false, false, true, false, false]),
    new WebhookObject ("moveCardFromBoard", [true, true, true, true, false, false]),
    new WebhookObject ("moveCardToBoard", [true, true, true, true, false, false]),
    new WebhookObject ("moveListFromBoard", [false, true, true, true, false, false]),
    new WebhookObject ("moveListToBoard", [false, true, true, true, false, false]),
    new WebhookObject ("reactivatedMemberInBoard", [false, false, true, true, false, false]),
    new WebhookObject ("reactivatedMemberInEnterprise", [false, false, false, false, false, true]),
    new WebhookObject ("reactivatedMemberInOrganization", [false, false, true, true, false, false]),
    new WebhookObject ("removeChecklistFromCard", [true, false, true, true, false, false]),
    new WebhookObject ("removeFromEnterprisePluginWhitelist", [false, false, false, true, true, false]),
    new WebhookObject ("removeFromOrganizationBoard", [false, false, true, true, true, false]),
    new WebhookObject ("removeLabelFromCard", [true, false, true, true, false, false]),
    new WebhookObject ("removeMemberFromBoard", [false, false, true, true, false, false]),
    new WebhookObject ("removeMemberFromCard", [true, false, true, true, false, false]),
    new WebhookObject ("removeMemberFromOrganization", [false, false, false, true, true, false]),
    new WebhookObject ("removeOrganizationFromEnterprise", [false, false, false, false, true, true]),
    new WebhookObject ("unconfirmedBoardInvitation", [false, false, true, true, false, false]),
    new WebhookObject ("unconfirmedOrganizationInvitation", [false, false, false, true, true, false]),
    new WebhookObject ("updateBoard", [false, false, true, true, false, false]),
    new WebhookObject ("updateCard", [true, true, true, true, false, false]),
    new WebhookObject ("updateCheckItem", [true, false, true, true, false, false]),
    new WebhookObject ("updateCheckItemStateOnCard", [true, false, true, true, false, false]),
    new WebhookObject ("updateChecklist", [false, false, true, true, false, false]),
    new WebhookObject ("updateComment", [true, false, true, true, false, false]),
    new WebhookObject ("updateLabel", [false, false, true, true, false, false]),
    new WebhookObject ("updateList", [false, true, true, true, false, false]),
    new WebhookObject ("updateOrganization", [false, false, false, true, true, false]),
    new WebhookObject ("voteOnCard", [true, false, true, true, false, false]),
]