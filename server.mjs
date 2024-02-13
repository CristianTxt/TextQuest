import express from "express"
import USER_API from "./routes/userRoute.mjs";
import SuperLogger from "./modules/SupperLogger.mjs";



const server = express();


const port = (process.env.PORT );
server.set('port', port);

const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger());

server.use(express.json());
server.use(express.static('public'));

server.use("/user", USER_API);

server.use(express.static('public'));

server.get("/", (req, res, next) => {


    req.originalUrl


    res.status(200).send(JSON.stringify({ msg: "This is a message..." })).end();
});

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});