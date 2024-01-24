import express from "express";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";

const USER_API = express.Router();

const users = [];
function generateRandomString(length) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
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
    const user = new User();
    user.id = generateRandomString(7); // Change 8 to the desired length
    user.name = name;
    user.email = email;
    user.pswHash = password;

    let exists = users.some((u) => u.email === email);

    if (!exists) {
      users.push(user);
      res.status(HttpCodes.SuccesfullRespons.Ok).send(users).end();
    } else {
      res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("User with this email already exists").end();
    }
  } else {
    res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
  }
});

USER_API.put("/:id", (req, res) => {});

USER_API.delete("/:id", (req, res) => {});

export default USER_API;