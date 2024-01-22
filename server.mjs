import  express  from "express"
import USER_API from "./routes/userRoute.mjs";
import exp from "constants";
import { nextTick } from "process";


const server  = express(); 


const port = (process.env.PORT || 8080);
server.set('port', port);

server.use(express.static('public'));

server.use("/user", USER_API); 


server.get("/", (req, res, next)=> { 
    res.status(200).send(JSON.stringify({msg:"This is a message..."})).end();
}); 

server.listen(server.get('port'), function ()  { 
    console.log('server running', server.get('port'));
});