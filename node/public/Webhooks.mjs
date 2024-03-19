export{createWebhook};

async function createWebhook(event){
    let data = {
        description: "my first webhook",
        callbackURL: "https://fs-21-sw-2-a217a.p2datsw.cs.aau.dk/node0/",
        idModel: document.getElementById('idModel').value,
        active: True
    }

    let newdata = await getdata(data);
    let dataholder = {};
    for (let i = 0; i < newdata.length; i++){
        addProp(dataholder, i, newdata[i].action);
    }

    console.log('Here is the data'+dataholder);

    return dataholder;
}


function getdata(data){
    let token = document.getElementById("Token").value;
    let key = document.getElementById("key").value;
    fetch(`https://api.trello.com/1/webhooks?key=${key}&token=${token}`,{
        method: "POST",
        headers: {'content-Type': 'application/json'},
        body : JSON.stringify(data)
    }).then (res => {
        if (res !== 200){
            console.log("Looks like there was a problem " + res.status);
            return;
        }
        res.json().then(data =>{
            console.log("A webhook was created");
            resolve(data);
        });
        
    }).catch(function(err){
        console.log("Fetch Error :(", err);
        reject(err);
    });

    
}
let addProp = (object, propname, value) =>{
    object[propname] = value;
};