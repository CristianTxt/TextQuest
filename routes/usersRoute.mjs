import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";





const USER_API = express.Router();
USER_API.use(express.json()); 


USER_API.get('/', (req, res, next) => {

    res.status(HTTPCodes.SuccesfullRespons.Ok).send(User).end();

   
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})


// Define the GET endpoint to fetch a specific user by ID and allow editing
USER_API.get('/users/:id', async (req, res, next) => {
   

   
});


USER_API.post('/register', async (req, res, next) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    const { name, email, password } = req.body;


    if (name != "" && email != "" && password != "") {
        let user = new User();
        user.name = name;
        user.email = email;

        ///TODO: Do not save passwords.
        user.pswHash = password;

        ///TODO: Does the user exist?
        let exists = false;

        if (!exists) {
            //TODO: What happens if this fails?
            user = await user.save();
            res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

// POST endpoint to update user details
USER_API.post('/:id', async (req, res) => {
  
});

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
    const user = new User(); //TODO: Actual user
    user.delete();
});

export default USER_API