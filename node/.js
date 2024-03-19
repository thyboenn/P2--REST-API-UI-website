let url = Document.getElementById("api")[0].innerHTML;
console.log("sucess");
fetch(url, {
    method:'GET',
    headers:{
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
.then(responce => responce.json())
.then(data => {
    console.log('Sucess', data);
})
.catch((error) => {
    console.error('Error', error);
});