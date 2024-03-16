import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import bcrypt from 'bcrypt';






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
    const { name, email, password } = req.body;

    if (name && email && password) {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user object
            let user = new User();
            user.name = name;
            user.email = email;
            user.pswHash = hashedPassword; // Store the hashed password

            // Check if the user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                // User already exists, return a 400 Bad Request response
                res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
                return;
            }

            // Save the user to the database
            user = await user.save();
            res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
        } catch (error) {
            console.error("Error occurred during user registration:", error);
            res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Internal Server Error").end();
        }
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing required fields").end();
    }
});

USER_API.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    if (email && password) {

        // Check if user exists
        const user = new User();
        // Assuming your User class has a method to fetch user by email
        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            // Validate password
            const isValidPassword = await existingUser.authenticate(password);
            if (isValidPassword) {
                // Password is correct, generate auth token
                const authToken = await existingUser.generateAuthToken();
                // Return the auth token
                res.status(HTTPCodes.SuccesfullRespons.Ok).json({ authToken, existingUser }).end();
                return;
            }
        }
    }

    // Invalid credentials
    res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).end();
});

USER_API.post('/save-game-state', async (req, res) => {
    const user = new User();
    const userId = req.body.userId;
    const gameState = req.body.currentGameState;

    try {
        // Update or create the user's game state in the database
        await user.saveUserGameState(userId, gameState);
        res.status(HTTPCodes.SuccesfullRespons.Ok).send("Game state saved successfully").end();
    } catch (error) {
        console.error("Error saving game state:", error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Internal Server Error").end();
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