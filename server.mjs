import 'dotenv/config'
import express from "express"
import USER_API from "./routes/userRoute.mjs";
import SuperLogger from "./modules/SupperLogger.mjs";




const server = express();


const port = (process.env.PORT || 5432);
server.set('port', port);



const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger());



server.use(express.json());

server.use(express.static('Public'));

server.use("/user", USER_API);



server.get("/", (req, res, next) => {
   
    res.status(200).send(JSON.stringify({ msg: "This is a message..." })).end();
});

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});