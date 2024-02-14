import express from "express";
import User from "../modules/user.mjs";
import DBManager from "../modules/storageManager.mjs";
import { HttpCodes } from "../modules/httpConstants.mjs";
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

USER_API.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const foundUser = await DBManager.getUserById(userId);

    if (foundUser) {
      res.status(HttpCodes.SuccesfullRespons.Ok).send(foundUser).end();
    } else {
      res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal Server Error").end();
  }
});

USER_API.get("/", async (req, res) => {
  try {
    const users = await DBManager.getAllUsers();
    res.status(HttpCodes.SuccesfullRespons.Ok).send(users).end();
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal Server Error").end();
  }
});

USER_API.post("/", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Missing data fields").end();
    return;
  }

  try {
    const newUser = await DBManager.createUser({ name, password });
    res.status(HttpCodes.SuccesfullRespons.Ok).send(newUser).end();
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal Server Error").end();
  }
});

USER_API.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, password } = req.body;

  try {
    const updatedUser = await DBManager.updateUser({ id: userId, name, password });
    res.status(HttpCodes.SuccesfullRespons.Ok).send(updatedUser).end();
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal Server Error").end();
  }
});

USER_API.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await DBManager.deleteUser(userId);
    res.status(HttpCodes.SuccesfullRespons.Ok).send(deletedUser).end();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(HttpCodes.ServerSideErrorRespons.InternalServerError).send("Internal Server Error").end();
  }
});

const autoLoggerMiddleware = logger.createAutoHTTPRequestLogger();
USER_API.use(autoLoggerMiddleware);

const limitedLoggerMiddleware = logger.createLimitedHTTPRequestLogger({ threshold: SuperLogger.LOGGING_LEVELS.IMPORTANT });
USER_API.use(limitedLoggerMiddleware);

export default USER_API;
