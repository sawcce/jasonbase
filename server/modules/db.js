const jetpack = require("fs-jetpack");
const dbPath = jetpack.cwd() + "/db";

module.exports = {
  fileExists({ path, exists, notExists }) {
    var filePath = dbPath + path;
    var doesExists = jetpack.exists(filePath);
    if (doesExists) {
      exists();
    } else {
      notExists();
    }
  },
  read(path){
    return new Promise((resolve,reject)=>{
      jetpack.readAsync(dbPath + path + ".json").then(data=>{
        resolve(JSON.parse(data))
      }).catch(e=>{
        reject(e)
      })
    })
  },
  write(path, data) {
    return new Promise((resolve, reject) => {
      var filePath = dbPath + path;
      jetpack
        .writeAsync(filePath, data)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  create(path, data) {
    return new Promise((resolve,reject)=>{
      var dirPath = dbPath + path;
      var filesList = jetpack.list(dirPath);
      var p =`${dirPath}/${filesList.length}.json`;
      jetpack.write(p, data);
      resolve({docID:filesList.length})
    })
  },
};
