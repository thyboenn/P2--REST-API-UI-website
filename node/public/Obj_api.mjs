export {sendAPI}

function sendAPI (event) {
    let API_string ='';
    let API = create_API();
    for (let i = 0; i < API.length; i++){
        API_string += API[i];
    }
    fetch(API.base + API_string + API.key + API.token, {
    method:API.method,
    headers:{
        'Content-Type': 'application/json',
    }
    })
    .then(response => response.json())
    .then(function (data){
        displayData(data);
    })
    .catch((error) => {
    console.log('Error', error);
    });
}

function create_API(){
    let url = document.getElementById("input").value;
    var objs = url.split(`/`);
    var API = {
        length: objs.length - 3,
        base: objs[0] + '//' + objs[2],
        method: document.getElementById("method").value,
        key: document.getElementById("key").value !='' ? document.getElementById("key").value: '',
        token: document.getElementById("Token").value!='' ? document.getElementById("Token").value: '',
    }
    for (let i = 3; i < objs.length; i++){
         addProp(API, i-3, '/' + objs[i]);
        }
    

    return API;
}
let addProp = (object, propname, value) =>{
    object[propname] = value;
};

function displayData(data){
    var textholder = document.getElementById("text-holder");
    for (var i = 0; i < data.length; i++){
        var title = document.createElement("h3");
        var description = document.createElement("p");
        var br = document.createElement("br");

        title.innerHTML = 'Title: ' + data[i].title;
        description.innerHTML = 'Description: ' + data[i].description;
        
        textholder.appendChild(title);
        textholder.appendChild(description);
        textholder.appendChild(br);
    }
}