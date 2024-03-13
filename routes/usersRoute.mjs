import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import bcrypt from 'bcrypt';


const USER_API = express.Router();
USER_API.use(express.json()); 

const users = [];



USER_API.get('/', (req, res, next) => {

    console.log("yOU DID IT");

   
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})


USER_API.get('/:id', (req, res, next) => {

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object
})

USER_API.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;

    if (name && email && password) { // Check if fields are not empty
        try {
            // Check if the user already exists
            let existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("User already exists").end();
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user instance
            let newUser = new User({
                name: name,
                email: email,
                pswHash: hashedPassword
            });

            // Save the new user
            newUser = await newUser.save();

            // Return the saved user data
            return res.status(HTTPCodes.SuccesfullRespons.Ok).json(newUser).end();
        } catch (error) {
            console.error("Error while registering user:", error);
            return res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Internal Server Error").end();
        }
    } else {
        return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing required fields").end();
    }
});
USER_API.post('/:id', (req, res, next) => {
    /// TODO: Edit user
    const user = new User(); //TODO: The user info comes as part of the request 
    user.save();
});

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
    const user = new User(); //TODO: Actual user
    user.delete();
});

export default USER_API