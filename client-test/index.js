let jason = require("jasonbase")
let cities = require("./popualtion")

let db = new jason.db({url:"localhost"})

//cities.forEach(data => {
//    db.collection("population").doc(data.country.toLowerCase()).writeFile({
//        population:data.population,
//        country:data.country.toLowerCase()
//    })
//});

db.collection("population").query({
    allInstances:{
        where:{
            country:{
                equals:"spain"
            }
        }
    }
}).getOnce(data=>{
    console.log("France's data : " + JSON.stringify(data[0]))
})


/*db.doc("w").getOnce(data=>{
    console.log("Fetched city : " + data.city)
})*/

/*db.doc("w").getRealTime(data=>{
    console.log(data)
})*/