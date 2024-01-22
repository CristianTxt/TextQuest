import express, { response } from "express";
import User from "../modules/user.mjs"; 
import HttpCodes from "../modules/httpErrorCodes.mjs";


const USER_API = express.Router(); 

const user = []; 

USER_API.get('/id',(req, res)=>{ 




});

USER_API.post("/", (req, res, next)=>{ 

const { name, email, password} = req.body;

if ( name !="" && email !="" && password !=""){ 
    const user = new User(); 
    user.name = name;
    user.email = email; 

   user.pswHash = password; 



   let exists = False; 

   if(!exists){ 
    user.push(user);
    res.status(HttpCodes.SuccesfullRespons.Ok).end();
   } else { 
    res.status(HttpCodes.ClientSideErrorRespons.BadRequest).end();
   }


} else { 
    res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
}


}); 


USER_API.put('/:ID', (req, res)=> {

})


USER_API.delete('/:id', (req, res)=> { 

})
export default USER_API