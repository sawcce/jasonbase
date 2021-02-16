const { cwd } = require("process");
const query = require("./query");
const { DBrequest } = require("./request");
const fs = require("fs");
const pth = require("path");
const { isKeyValid } = require("./auth");

var hooks = {};

function callCustomHook({ path, req, notExists }) {
  if (path in hooks) {
    hooks[path](req);
  } else {
    notExists();
  }
}

module.exports = {
  callHook(req, res, type) {
    let dbReq = new DBrequest(req, res, type);
    let path = cwd() + "/db" + req.body.path;
    let dirPath = req.body.path;

    const splitPath = dirPath.split("/");
    if (splitPath[splitPath.length - 1].includes(".")) {
      dirPath = pth.dirname(dirPath);
    }

    let body = req.body;
    let key = body.key;

    console.log("Key : " + key);

    isKeyValid({
      key: key,
      isValid(keyData) {
        dbReq.setPrivileges(keyData.privileges);
        callCustomHook({ path: dirPath, req: dbReq });
      },
      isInvalid() {
        dbReq.reject(401);
      },
    });
  },

  addCustomHook(path, callback) {
    hooks[path] = callback;
  },
};
