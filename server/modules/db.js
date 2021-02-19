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
