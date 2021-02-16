const { cwd } = require("process")
const jetpack = require("fs-jetpack")
const {callCustomHook} = require("./jason-server")

module.exports = {
    isKeyValid({key,isValid,isInvalid}) {
        let authPath = cwd() + "/api/auth"
        let path = authPath + "/" + key + ".json"

        jetpack.readAsync(path).then(data=>{
            isValid(JSON.parse(data))
        }).catch(error=>{
            console.log(error)
            isInvalid(error)
        })
    }
}