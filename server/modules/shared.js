const { DBrequest } = require("./request");

let hooks = {};
let filters = {};
let methods = {};

module.exports = {
  hooks,
  filters,
  methods,

  callCustomMethod({name,notExist,exists}){
    console.log("--- New call ----")
    if(name in methods){
      exists(methods[name]);
    }else{
      res.status(404)
      res.json({"message":"not found"})
    }
  },
  addCustomMethod(name,callback){
    methods[name] = callback;
  },
  callCustomFilter({ name, params, exists, notExists }) {
    if (name in filters) {
      exists(filters[name]);
    } else {
      notExists();
    }
  },
  addCustomFilter(name, method) {
    filters[name] = method;
  },
};
