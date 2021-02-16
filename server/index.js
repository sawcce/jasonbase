const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 1009;
const fs = require("fs");
const ws = require("ws");
const server = new ws.Server({ port: 1010 });
const { cwd } = require("process");
const jetpack = require("fs-jetpack");
const jason = require("./modules/jason-server");
const { write } = require("fs-jetpack");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/get-once", (req, res) => {
  jason.callHook(req,res,"get")
});

app.post("/write-file", (req, res) => {
  jason.callHook(req,res,"write")
  let path = cwd() + "/db" + req.body.path;
});

server.on("connection", (socket) => {
  socket.on("message", function incoming(message) {
    console.log("Asked to watch file : ", message);
    let path = cwd() + "/db" + JSON.parse(message).path;
    jetpack.readAsync(path).then((data) => {
      console.log(data);
      socket.send(
        JSON.stringify({
          previousMT: undefined,
          currentMT: undefined,
          data: data,
        })
      );

      fs.watchFile(path, (curr, prev) => {
        console.log("Changed");
        jetpack.readAsync(path).then((data) => {
          console.log(data);
          socket.send(
            JSON.stringify({
              previousMT: prev.mtime,
              currentMT: curr.mtime,
              data: data,
            })
          );
        });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`);
});

jason.addCustomHook("/population",(req)=>{
  req.switchByType({
    read(){  
      req.fetchData().then(data=>{
      req.json(data)
      req.validate()
      }).catch(error=>{
        req.reject(404)
      })
    },
    write() {
      if(req.hasPrivilege("admin")){
        req.write()
      }else{
        reject(401)
      }
    }
  })

})
