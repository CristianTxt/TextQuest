import Chalk from "chalk";
import { HTTPMethods } from "./httpErrorCodes.mjs";



let COLORS = {};
COLORS[HTTPMethods.POST] = Chalk.yellow;
COLORS[HTTPMethods.PATCH] = Chalk.yellow;
COLORS[HTTPMethods.PUT] = Chalk.yellow;
COLORS[HTTPMethods.GET] = Chalk.green;
COLORS[HTTPMethods.DELETE] = Chalk.red; 
COLORS.Default = Chalk.gray;



const colorize = (method) => { 
    if (method in COLORS) { 
        return COLORS[method](method);
    }

    return COLORS.Default(method);
};



class SupperLogger { 


    static  LOGGING_LEVELS = { 
        ALL: 0,
        VERBOSE: 5,
        NORMAL: 10,
        IMPORTANT: 100,
        CRITICAL: 999
    }; 





    #globalThreshold = SupperLogger.LOGGING_LEVELS.ALL;




    #loggers; 






    static instance = null; 


    constructor (){ 
        if(SupperLogger.instance == null){ 
            SupperLogger.instance = this;
            this.#loggers = [];
            this.#globalThreshold = SupperLogger.LOGGING_LEVELS.NORMAL;
        }

        return SupperLogger.instance;



    }

    static log(msg, logLev1 = SupperLogger.LOGGING_LEVELS.NORMAL){ 
        let logger = SupperLogger.instance;
        if (logger.#globalThreshold > logLev1){ 
            return;
        }

        logger.#writeToLog(msg);
    }




createAutoHTTPRequestLogger(){

    return this.createAutoHTTPRequestLogger({ threshold: SupperLogger.LOGGING_LEVELS.NORMAL});

}

createLimitedHTTPRequestLogger(options) {

   
    const threshold = options.threshold || SuperLogger.LOGGING_LEVELS.NORMAL;

    
    return (req, res, next) => {

       
        if (this.#globalThreshold > threshold) {
            return;
        }

        
        this.#LogHTTPRequest(req, res, next);
    }

}

#LogHTTPRequest(req, res, next) {

    let type = req.method;
    const path = req.originalUrl;
    const when = new Date().toLocaleTimeString();

    // TODO: This is just one simple thing to create structure and order. Can you do more?
    type = colorize(type);
    this.#writeToLog([when, type, path].join(" "));


    next();
}

#writeToLog(msg){ 
    msg += "\n";
    console.log(msg); 


    fs.appendFile("./log.txt", msg , {encoding: "utf8"}, (err) => { });
}

}


export default SupperLogger



