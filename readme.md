# Daniilbase

Daniilbase is an easy to use extremely customizable json based db.
It allows for complex and powerful queries with a collection of helpers and packages to make rules and authentication.

-- It isn't finished please don't use for production --

### Roadmap

-> Read / Writing 
-> Querying
-> Realtime Data
-> Rules / Hooks
-> Extensions + Package Manager

## Structure 

This github contains 3 directories :

-> client-test:
Contains a bunch of snippets and an example to kickstart you experience

-> package :
The client side package to access your jdb

-> server :
Where your db resides and the data is stored
    -> root :
        -> index.js : the server
        -> modules :
            Where are stored the modules necessary to make jason base live
        -> api :
            Where all of the features for the api are stored
            -> auth :
                Authentication keys
            -> extensions :
                extensions / modules to help you use jdb
        -> db :
            the place where all the data is stored


## Client usage 

	
```js

let jason = require("jasonbase")

let db = new jason.db({
    url:"localhost", // Put the url where your db lives
    key:"your-key" // Your authentication key
})

```

### Functions 

db.path

```js
    db.collection("users").doc("1235486") // equivalent to db/users/1235486.json
```

db.path.getOnce

```js
    db.collection("users").doc("1235486").getOnce().then(data=>{
        // If file is succesfully fetched
        console.log("User data : " + JSON.stringify(data))
    }).catch(error=>{
        // If file is not fetched
        console.log(`Error : ${error.message}`)
    })
```

db.path.query.getOnce

```js
db.collection("population").query({
    allInstances:{
        where:{
            population:{
                greater:targetNum
            }
        }
    }
}).getOnce().then(data=>{
    console.log(`All the countries with more than ${targetNum} habitants`)
    data.forEach(cd => {
        console.log(`--> ${cd.country} with ${cd.population} habitants`)
    });
})
```

This one is a bit complicated, you put a collection then your query and then you get it.

the syntax : 

```js
filter : {
  array: {
    validation : {
      params
    }
  },
  params
}
```

db.path.writeFile

```js
    db.collection("users").doc("1235486").writeFile({/*JSON OBJECT*/}).then(data=>{
        // IF the fille is successfully written ( data will be the written data )
        console.log("User data : " + JSON.stringify(data))
    }).catch(error=>{
        // If file isn't written
        console.log(`Error : ${error.message}`)
    })
```

db.path.getRealTime 
-> Have to redo it

## Server

Daniilbase is made to be extremely modular and secure.

You can make hook / privileges to restrian the access to you db and even make custom routes.

Example : 
```js
// -> server/index.js

// [...]

app.listen(port, () => {
  console.log(`Server app listening at http://localhost:${port}`);
});

jason.addCustomHook("/population",(req)=>{
  req.switchByType({
    read(){  
      req.fetchData().then(data=>{
      req.json(data)
      req.validate()
      }).catch(error=>{
        req.reject(404)
      })
    },
    write() {
      if(req.hasPrivilege("admin")){
        req.write()
      }else{
        reject(401)
      }
    }
  })

})
```

By default, if you do not set a hook for a path Daniilbase will reject the request.

To add privileges you can just go into server > api > auth > your-key.json
and then 

```json
{
    "privileges": [
        "user"
    ]
}
```
