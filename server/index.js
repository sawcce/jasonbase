// EXPRESS
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 1009;
// WEB SOCKETS
const ws = require("ws");
const server = new ws.Server({ port: 1010 });
// FILES
const fs = require("fs");
const { cwd } = require("process");
const jetpack = require("fs-jetpack");
// JASON SERVER
const jason = require("./modules/jason-server");
const auth = require("./modules/auth");
const request = require("./modules/request");
const extension_loader = require("./modules/extension-loader")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

extension_loader.loadModules()

app.post("/get-once", (req, res) => {
  jason.callHook(req, res, "get");
});

app.post("/write-file", (req, res) => {
  jason.callHook(req, res, "write");
});

app.post("/call", (req, res) => {
  var body = req.body;
  
  auth.isKeyValid({
    key: body.key,
    isValid(keyData) {
      jason.callCustomMethod({
        name: body.name,
        exists(method){
          var params = new request.DBrequest(req,res,"call")
          method(params)
        },
        notExists() {
          res.status(404);
          res.json({ message: "Requested function doesn't exists" });
        },
      });
    },
    isInvalid() {
      dbReq.reject(401);
    },
  });
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
