let jason = require("jasonbase")
let cities = require("./popualtion")

let db = new jason.db({
    url:"localhost",
    key:"Bjn02NFZBVwXUjpB"
})

cities.forEach(data => {
    db.collection("population").doc(data.country.toLowerCase()).writeFile({
        population:data.population,
        country:data.country.toLowerCase()
    }).then(result=>{

    }).catch(error=>{
        console.log(error)
    })
});

//let targetNum = Math.pow(10,8);
//
//db.collection("population").query({
//    allInstances:{
//        where:{
//            population:{
//                greater:targetNum
//            }
//        }
//    }
//}).getOnce().then(data=>{
//    console.log(`All the countries with more than ${targetNum} habitants`)
//    data.forEach(cd => {
//        console.log(`--> ${cd.country} with ${cd.population} habitants`)
//    });
//})

//
//db.collection("population").doc("spain").getOnce().then(data=>{
//    console.log(JSON.stringify(data))
//}).catch(error=>{
//    console.log("Error : " + error)
//})


/*db.doc("w").getRealTime(data=>{
    console.log(data)
})*/