import express from "express";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";
import fs from "fs"; 

const USER_API = express.Router();
USER_API.use(express.json); 



function generateRandomString(length) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}



let users = [];
try {
  const data = fs.readFileSync('users.json', 'utf8');
  users = JSON.parse(data);
} catch (err) {
  console.log('Error reading users file:', err.message);
}

function saveUsersToFile() {
    fs.writeFileSync('users.json', JSON.stringify(users), 'utf8', (err) => {
      if (err) {
        console.log('Error writing users file:', err.message);
      }
    });
  }








USER_API.get("/:id", (req, res) => {
    const userId = req.params.id;

    // Find the user with the specified ID
    const foundUser = users.find(u => u.id === userId);

    if (foundUser) {
     

        res.status(HttpCodes.SuccesfullRespons.Ok).send(foundUser).end();
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
});

USER_API.get("/", (req, res) => {

    res.status(HttpCodes.SuccesfullRespons.Ok).send(users).end();
});

USER_API.post("/", (req, res, next) => {
    const { name, email, password } = req.body;

    if (name !== "" && email !== "" && password !== "") {
     saveUsersToFile();
        const user = new User();
        let newUserId;
        do {
            newUserId = generateRandomString(7);
        } while (users.some(u => u.id === newUserId)); // Ensure the ID is unique

        user.id = newUserId;
        user.name = name;
        user.email = email;
        user.pswHash = password;

        users.push(user);
        saveUsersToFile();
        res.status(HttpCodes.SuccesfullRespons.Ok).send(users).end();
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }
});

USER_API.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  // Find the index of the user with the specified ID
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
      // Update the user properties if new values are provided
      if (name) users[userIndex].name = name;
      if (email) users[userIndex].email = email;
      if (password) users[userIndex].pswHash = password;
      saveUsersToFile();
      res.status(HttpCodes.SuccesfullRespons.Ok).send(users[userIndex]).end();
  } else {
      res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
  }
}); 








USER_API.delete("/:id", (req, res) => {
  const userId = req.params.id;

  // Find the index of the user with the specified ID
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
      // Remove the user from the array
      const deletedUser = users.splice(userIndex, 1)[0];
      saveUsersToFile();
      res.status(HttpCodes.SuccesfullRespons.Ok).send(deletedUser).end();
  } else {
      res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
  }
});





export default USER_API;
