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


USER_API.get('/users/:id', async (req, res, next) => {  
});


USER_API.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;

    if (name && email && password) {
        try {
        
            const hashedPassword = await bcrypt.hash(password, 10);

            
            let user = new User();
            user.name = name;
            user.email = email;
            user.pswHash = hashedPassword; 

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
               
                res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
                return;
            }

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

        const user = new User();
     
        const existingUser = await User.findByEmail(email);

        if (existingUser) {

            const isValidPassword = await existingUser.authenticate(password);
            if (isValidPassword) {
                const authToken = await existingUser.generateAuthToken();
                res.status(HTTPCodes.SuccesfullRespons.Ok).json({ authToken, existingUser }).end();
                return;
            }
        }
    }

    res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).end();
});

USER_API.post('/save-game-state', async (req, res) => {
    const user = new User();
    const userId = req.body.userId;
    const gameState = req.body.currentGameState;

    try {
        
        await user.saveUserGameState(userId, gameState);
        res.status(HTTPCodes.SuccesfullRespons.Ok).send("Game state saved successfully").end();
    } catch (error) {
        console.error("Error saving game state:", error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Internal Server Error").end();
    }
});


USER_API.get('/get-game-state/:userId', async (req, res) => {
    const user = new User();
    const userId = req.params.userId;

    try {
        
        const gameState = await user.getUserGameState(userId);

        res.status(HTTPCodes.SuccesfullRespons.Ok).send(gameState).end();
    } catch (error) {
        console.error("Error retrieving game state:", error);
        res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Internal Server Error").end();
        return;
    }


});


USER_API.post('/:id', async (req, res) => {
  
});

USER_API.delete('/:id', (req, res) => {
    
    const user = new User(); 
    user.delete();
});

export default USER_API