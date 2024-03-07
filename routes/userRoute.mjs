import express from "express";
import User from "../modules/user.mjs";
import { HttpCodes } from "../modules/httpConstants.mjs";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import SuperLogger from "../modules/SupperLogger.mjs";

const USER_API = express.Router();
USER_API.use(express.json());

const logger = new SuperLogger();

USER_API.get("/:id", (req, res) => {
  const userId = req.params.id;

  const foundUser = User.find(u => u.id === userId);

  if (foundUser) {
    res.status(HttpCodes.SuccesfullRespons.Ok).send(foundUser).end();
  } else {
    res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
  }
});

USER_API.get("/", (req, res) => {
  res.status(HttpCodes.SuccesfullRespons.Ok).send(User).end();
});

USER_API.post("/register", async (req, res, next) => {
  const { name, password } = req.body;

  try {
    if (name && password) {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

      const newUser = new User({
        name: name,
        pswHash: hashedPassword // Store hashed password
      });

      // Save the user to the database
      await newUser.save();

      res.status(HttpCodes.SuccesfullRespons.Ok).send(newUser).end();
    } else {
      res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Missing data fields").end();
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(HttpCodes.ServerErrorRespons.InternalError).send("Error registering user").end();
  }
});

USER_API.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, password } = req.body;

  try {
    // Find the user by ID
    const foundUser = User.find(u => u.id === userId);

    if (foundUser) {
      // Update user fields
      if (name) foundUser.name = name;

      if (password) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
        foundUser.pswHash = hashedPassword;
      }

      // Save the updated user to the database
      await foundUser.save();

      res.status(HttpCodes.SuccesfullRespons.Ok).send(foundUser).end();
    } else {
      res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(HttpCodes.ServerErrorRespons.InternalError).send("Error updating user").end();
  }
});

USER_API.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const userIndex = User.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    const deletedUser = User.splice(userIndex, 1)[0];
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
