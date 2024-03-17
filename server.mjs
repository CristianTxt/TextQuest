import 'dotenv/config'
import express from 'express' 
import USER_API from './routes/usersRoute.mjs'; 
import SuperLogger from './modules/SuperLogger.mjs';
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";





const server = express();
const port = (process.env.PORT || 5000);
server.set('port', port);



const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); 


server.use(express.json()); 
server.use(express.static('public'));


server.use("/user", USER_API);
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
    
});

printDeveloperStartupInportantInformationMSG();