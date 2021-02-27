let jason = require("jasonbase");

let db = new jason.db({
  url: "localhost",
  key: "Bjn02NFZBVwXUjpB",
});

console.log(db.key);

db.execute("login", {
  username: "Sawcce",
  email: "soce@soce.soce",
  password: "soce",
})
  .then((data) => {
    console.log("data  : " + JSON.stringify(data));
    console.log(db.key);

    db.execute("getUser", {})
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.log(e)
      });
  })
  .catch((error) => {
    console.log("error : " + error.description);
  });

//db.execute("register",{username:"Sawcce",email:"soce@soce.soce",password:"soce"}).then(data=>{
//  console.log("data : " + JSON.stringify(data))
//}).catch(error=>{
//  console.log("error : " + error.description)
//})
