import express from "express";
import path from "path";
import USER_API from "./routes/userRoute.mjs";
import SuperLogger from "./modules/SupperLogger.mjs";
import 'dotenv/config';

const server = express();

const port = process.env.PORT || 8080;
server.set('port', port);

const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger());
server.use(express.json());
server.use(express.static(path.join(__dirname, 'public')));

// Mounting the user API routes
server.use("/user", USER_API);

// Serving index.html for the root route
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(server.get('port'), () => {
    console.log(`Server running on port ${server.get('port')}`);
});
