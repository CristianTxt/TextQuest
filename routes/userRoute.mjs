import express, { response } from "express";
import User from "../modules/user.mjs"; 
import HttpCodes from "../modules/httpErrorCodes.mjs";

import express from "express";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";

class UserApi {
    constructor() {
        this.currentUserId = 0;
        this.users = [];
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get("/user", this.getUsers.bind(this));
        this.router.get("/user/:id", this.getUserById.bind(this));
        this.router.post("/user", this.createUser.bind(this));
        this.router.put("/user/:id", this.updateUser.bind(this));
        this.router.delete("/user/:id", this.deleteUser.bind(this));
    }

    getUsers(req, res) {
        res.status(HttpCodes.SuccesfullRespons.Ok).send(this.users).end();
    }

    getUserById(req, res) {
        const userId = parseInt(req.query.id);
        const user = this.users.find((u) => u.id === userId);
        if (user) {
            res.status(HttpCodes.SuccesfullRespons.Ok).send(user).end();
        } else {
            res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
        }
    }

    createUser(req, res) {
        const { name, email, password } = req.body;

        if (name !== "" && email !== "" && password !== "") {
            const user = new User();
            user.id = ++this.currentUserId;
            user.name = name;
            user.email = email;
            user.pswHash = password;

            let exists = false;

            if (!exists) {
                this.users.push(user);
                res.status(HttpCodes.SuccesfullRespons.Ok).send(user).end();
            } else {
                res.status(HttpCodes.ClientSideErrorRespons.BadRequest).end();
            }
        } else {
            res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
        }
    }

    updateUser(req, res) {
        // Implement your logic for updating a user
    }

    deleteUser(req, res) {
        // Implement your logic for deleting a user
    }
}

export default new UserApi().router;
