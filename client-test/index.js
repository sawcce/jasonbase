let jason = require("jasonbase")

let db = new jason.db({url:"localhost"})

db.doc("w").writeFile({l:"d"})

db.doc("w").getRealTime(data=>{
    console.log(data)
})