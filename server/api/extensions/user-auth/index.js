const { cwd } = require("fs-jetpack");
const bcrypt = require("bcrypt");

module.exports = ({ jason, auth, query, db }) => {
  jason.addCustomMethod("register", (req) => {
    var params = req.body.params;

    var username = params.username;
    var email = params.email;
    var password = params.password;

    var q = {
      allInstances: {
        where: {
          matches: {
            // If the value email of the doc matches the first element of array and if field username matches second element of array
            values: ["email", "username"],
            data: [email, username],
            type: "large", // Strict or large, strict will take in count A-a and large will consider A-a the same
          },
        },
      },
    };

    query.executeQuery({ query: q, path: cwd() + "/db/users" }).then((data) => {
      if (data.length > 0) {
        // Error user w/ same email or username already exists
        req.reject(409);
      } else {
        let date = Date.now();
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(
            `${date * email.length}${password}${email}`,
            salt,
            function (err, result) {
              console.log(err);
              if (!err) {
                db.create("/users", {
                  username: username,
                  email: email,
                  password: result,
                  creationDate: date,
                  salt: salt,
                }).then(({ docID }) => {
                  let keyID = parseInt(Math.random() * 100 * Date.now());
                  auth
                    .createNewKey({
                      name: keyID,
                      privileges: ["user"],
                      data: {
                        userID: docID,
                      },
                    })
                    .then(() => {
                      req.json({
                        message: "User created",
                        data: {
                          value: keyID,
                        },
                      });
                      req.validate();
                    });
                });
              } else {
                req.reject(501);
              }
            }
          );
        });
      }
    });
  });
};
