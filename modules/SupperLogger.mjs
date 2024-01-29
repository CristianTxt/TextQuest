function logg(req, res,next){ 
    const type = req. method;
    const path = req.originalUrl;
    const when = new Date().toLocaleTimeString();


console.log(when, type, path);
next();
}