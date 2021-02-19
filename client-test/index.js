let jason = require("jasonbase");

let db = new jason.db({
  url: "localhost",
  key: "Bjn02NFZBVwXUjpB",
});

db.execute("register",{username:"Sawcce",email:"soce@soce.soce",password:"soce"}).then(data=>{
  console.log("data : " + JSON.stringify(data))
}).catch(error=>{
  console.log("error : " + error.description)
})


