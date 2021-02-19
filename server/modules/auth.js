const { cwd } = require("process");
const jetpack = require("fs-jetpack");

module.exports = {
  createNewKey({ name, privileges, data }) {
    return new Promise((resolve, reject) => {
      let object = {};
      object.privileges = privileges;
      object.data = data;
      jetpack.writeAsync(`${cwd()}/api/auth/${name}.json`,object).then(() => {
          resolve();
      });
    });
  },
  isKeyValid({ key, isValid, isInvalid }) {
    let authPath = cwd() + "/api/auth";
    let path = authPath + "/" + key + ".json";

    jetpack
      .readAsync(path)
      .then((data) => {
        isValid(JSON.parse(data));
      })
      .catch((error) => {
        console.log(error);
        isInvalid(error);
      });
  },
};
