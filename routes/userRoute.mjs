import express from "express";
import User from "../modules/user.mjs";
import { HttpCodes } from "../modules/httpConstants.mjs";
import fs from "fs";
import SuperLogger from "../modules/SupperLogger.mjs";

const USER_API = express.Router();
USER_API.use(express.json());

const logger = new SuperLogger();

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
  const { name, password } = req.body;

  if (name !== "" && password !== "") {
    const user = new User();
    let newUserId;
    do {
      newUserId = generateRandomString(7);
    } while (users.some(u => u.id === newUserId));

    user.id = newUserId;
    user.name = name;
    user.pswHash = password;

    users.push(user);
    res.status(HttpCodes.SuccesfullRespons.Ok).send(users).end();
  } else {
    res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
  }
});

USER_API.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { name, password } = req.body;

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    if (name) users[userIndex].name = name;
    if (password) users[userIndex].pswHash = password;
    res.status(HttpCodes.SuccesfullRespons.Ok).send(users[userIndex]).end();
  } else {
    res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
  }
});

USER_API.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1)[0];
    res.status(HttpCodes.SuccesfullRespons.Ok).send(deletedUser).end();
  } else {
    res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
  }
});

const autoLoggerMiddleware = logger.createAutoHTTPRequestLogger();
USER_API.use(autoLoggerMiddleware);

const limitedLoggerMiddleware = logger.createLimitedHTTPRequestLogger({ threshold: SuperLogger.LOGGING_LEVELS.IMPORTANT });
USER_API.use(limitedLoggerMiddleware);

export default USER_API;
