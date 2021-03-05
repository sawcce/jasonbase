import {cwd} from 'process';
import {DBrequest} from './request';
import * as fs from "fs";
import * as pth from "path";
import {isKeyValid} from './auth';
import * as shared from './shared';


let hooks = {};
let filters = {};


function callCustomHook({ path, req, notExists }) {
  if (path in hooks) {
    hooks[path](req);
  } else {
    notExists();
  }
}

function callHook(req, res, type) {
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
}

function addCustomHook(path, callback) {
  hooks[path] = callback;
}

module.exports = {
  addCustomHook,
  callCustomHook,
  addCustomMethod : shared.addCustomMethod,
  callCustomMethod : shared.callCustomMethod,
  addCustomFilter : shared.addCustomFilter,
  callCustomFilter: shared.callCustomFilter,
  callHook
};
