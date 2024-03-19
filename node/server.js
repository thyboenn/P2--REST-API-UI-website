//THIS APP USES ES6 MODULES  
import http from 'http';
import fs from "fs";
import path  from "path";
import url from 'url';

const hostname = 'localhost';
// we have access to the ports 3070 -> 3079
const port = 3071;
//const serverName="http://localhost:3000";


/****************************************************************************  
  First a number of generic helper functions to serve basic files and documents 
******************************************************************************/ 

/* ***                 Setup Serving of files ***                  */ 

const publicResources="public/";
function processReq (request, response){
  var pathname = url.parse(request.url).pathname;
  var ext = path.extname(pathname);
  if(request.method =="GET"){
    if(ext){
      if(ext === '.css'){
          response.writeHead(200, {'Content-Type': 'text/css'});
      }
      else if(ext === '.js' || ext === '.mjs'){
          response.writeHead(200, {'Content-Type': 'text/javascript'});
      } else if (ext === '.html'){
        response.writeHead(200, {'Content-Type': 'text/html'});
      } else if (ext === `.txt`) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
      }
      response.write(fs.readFileSync(publicResources + pathname, 'utf8'));

    }else{
         response.writeHead(200, {'Content-Type': 'text/html'});
         response.write(fs.readFileSync(publicResources +'frontpage.html', 'utf8')); // husk at ændere til den nye starts fil, og lav en ny HTML loader
        } 
    
  } else if (request.method == "POST"){
    console.log("A Webhook has send a POST request to this server!");
    let data ='';
    request.on('data', chuck =>{
      data += chuck;
    });
    request.on('end', () =>{
      fs.writeFile(publicResources + "WebhookData.txt", Date.now()  + "|" + data,(err) =>{
        if(err){
          console.log("There was an error, while POSTing to the serve " + err);
          response.writeHead(500);
        }else {
          console.log("The Webhook data was successfully stored" + 201);
          response.writeHead(201);
        }
      });
    });
    
} else if (request.method == "HEAD") {
      response.writeHead(200);
} else {
  console.log("Error" + 405);
  response.writeHead(405);
}      
  response.end();
} 



/**********************************************************************
  Setup HTTP server and route handling 
  *********************************************************************/
const server = http.createServer(requestHandler);
function requestHandler(req,res){
  try{
   processReq(req,res);
  }catch(e){
    console.log('fail' +"!!: " +e);
  }
}

function startServer(){
 /* start the server */
 server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  fs.writeFileSync('message.txt', `Server running at http://${hostname}:${port}/`);
 });
}
startServer(); 