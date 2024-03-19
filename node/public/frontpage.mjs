let token = [];
let key = [];
let spotifyToken;
let redirect_uri = "https://fs-21-sw-2-a217a.p2datsw.cs.aau.dk/node1/";


window.onload = function () {
    let checkboxTrello = document.querySelector("input[name=trelloBox]");
    let checkboxspotify = document.querySelector("input[name=spotifyBox]");
    let btnSubmit = document.getElementById("btnFrontpageSubmit");

    let inputListToken = [];
    let inputListKey = [];
    let inputListTitle = [];
    let APIs = ["Trello", "Spotify"]

    for (let i = 0; i < APIs.length; i++) {
        createInput(inputListToken, inputListKey, inputListTitle, APIs[i]);
    }

    checkboxTrello.addEventListener('change', function () {
        if (this.checked) {
            hideCurrent(APIs, 1, 0);
        } else {
            hideCurrent(APIs, 0, 0);
        }
    });

    checkboxspotify.addEventListener('change', function () {
        if (this.checked) {
            hideCurrent(APIs, 1, 1);
        } else {
            hideCurrent(APIs, 0, 1);
        }
    });

    btnSubmit.addEventListener('click', function() {submitInfo(APIs)});
}

function createInput(inputListToken, inputListKey, inputListTitle, API) {
    let input = document.getElementById("inputBox");
    let title = document.createElement('p');
    let token = document.createElement('input');
    let key = document.createElement('input');
    inputListTitle.push(title);
    inputListToken.push(token);
    inputListKey.push(key);
    title.className = "fieldTitle";
    token.className = "tokenField";
    key.className = "keyField";
    title.id = `title${API}`;
    token.id = `token${API}`;
    key.id = `key${API}`;
    title.innerHTML = `${API} Association`;
    if (API === "Trello") {
        token.setAttribute("placeholder", `${API} Token`);
        key.setAttribute("placeholder", `${API} Key`);
    } else if (API === "Spotify") {
        token.setAttribute("placeholder", `${API} Client ID`);
        key.setAttribute("placeholder", `${API} Client Secret`);
    }

    input.appendChild(title);
    input.appendChild(token);
    input.appendChild(key);
    document.getElementById(`title${API}`).style.display = 'none';
    document.getElementById(`token${API}`).style.display = 'none';
    document.getElementById(`key${API}`).style.display = 'none';
}

function hideCurrent(API, hidden, APInr) {
    if (hidden === 0) {
        document.getElementById(`title${API[APInr]}`).style.display = 'none';
        document.getElementById(`token${API[APInr]}`).style.display = 'none';
        document.getElementById(`key${API[APInr]}`).style.display = 'none';
    } else if (hidden === 1) {
        document.getElementById(`title${API[APInr]}`).style.display = 'block';
        document.getElementById(`token${API[APInr]}`).style.display = 'block';
        document.getElementById(`key${API[APInr]}`).style.display = 'block';
    }
}

async function submitInfo(APIs) {
    for (let i = 0; i < APIs.length; i++) {
        token[i] = document.getElementById(`token${APIs[i]}`).value;
        key[i] = document.getElementById(`key${APIs[i]}`).value;
    }
    let code = getCode();
    if (code == null) {
        AuthorizeWithSpotify(token[1]);
    }
    else {
        spotifyToken = await getSpotifyToken(token[1], key[1], code);
        sessionStorage.setItem("spotifyToken", spotifyToken);
        sessionStorage.setItem("token", token[0]);
        sessionStorage.setItem("key", key[0]);
        window.location.replace("https://fs-21-sw-2-a217a.p2datsw.cs.aau.dk/node1/index.html");
    }
    
}

function getCode() {
    let code = null;
    const windowURL = window.location.search;
    if (windowURL.length > 0) {
        const urlParams = new URLSearchParams(windowURL);
        code = urlParams.get("code");
    }
    return code;
}


async function getSpotifyToken(clientId, clientSecret, code) {
    let bodyData = "grant_type=authorization_code";
    bodyData += "&code=" + code;
    bodyData += "&redirect_uri=" + encodeURI(redirect_uri);
    bodyData += "&client_id=" + clientId;
    bodyData += "&client_secret=" + clientSecret;
    
    const spotifyTokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: bodyData
    });
    let spotifyTokenInfo = await spotifyTokenResponse.json();
    return spotifyTokenInfo["access_token"];
}

async function AuthorizeWithSpotify (client_id) {
    let url = "https://accounts.spotify.com/authorize?";
    url += "client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=ugc-image-upload user-modify-playback-state user-read-playback-state user-read-currently-playing user-follow-modify user-follow-read user-read-recently-played user-read-playback-position user-top-read playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private app-remote-control streaming user-read-email user-read-private user-library-modify user-library-read"
    window.location.href = url;
}
