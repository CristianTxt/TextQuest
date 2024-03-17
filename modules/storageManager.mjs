import pg from "pg"
import SuperLogger from "./SuperLogger.mjs";






class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };

    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);


        } catch (error) {
           
        } finally {
            client.end(); 
        }

        return user;

    }
   
    
    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users"  where id = $1;', [user.id]);


        } catch (error) {
           
        } finally {
            client.end(); 
        }

        return user;
    }

    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]);



            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
        } finally {
            client.end(); 
        }

        return user;
 
    }  



    async getUserByEmail(email) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const result = await client.query('SELECT * FROM "public"."Users" WHERE "email" = $1;', [email]);
            if (result.rows.length === 1) {
                const user = result.rows[0];
               
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    pswHash: user.password
                };
            } else {
                return null; 
            }
        } catch (error) {
            console.error("Error retrieving user by email:", error);
            throw error; 
        } finally {
            client.end(); 
        }
    }
    async saveGameState(userId, currentGameState) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            
            const existingGameState = await client.query('SELECT * FROM "public"."UserGameStates" WHERE "user_id" = $1;', [userId]);
            if (existingGameState.rows.length === 0) {
                
                await client.query('INSERT INTO "public"."UserGameStates"("user_id", "game_state") VALUES($1, $2);', [userId, JSON.stringify(currentGameState)]);
            } else {
              
                await client.query('UPDATE "public"."UserGameStates" SET "game_state" = $1 WHERE "user_id" = $2;', [JSON.stringify(currentGameState), userId]);
            }
        } catch (error) {
            console.error("Error saving game state:", error);
            throw error; 
        } finally {
            client.end(); 
        }
    }

    async getGameState(userId) {
        const client = new pg.Client(this.#credentials);
    
        try {
            await client.connect();
           
            const result = await client.query('SELECT "game_state" FROM "public"."UserGameStates" WHERE "user_id" = $1;', [userId]);
            if (result.rows.length === 0) {
                
               
                return null;
            } else {
             
                return result.rows[0].game_state;
            }
        } catch (error) {
            console.error("Error retrieving game state:", error);
            throw error; 
        } finally {
            client.end(); 
        }
    }
    
    


    

}

let connectionString = process.env.ENVIRONMENT  == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;


if (connectionString == undefined) {
    throw ("You forgot the db connection string");
}

export default new DBManager(connectionString);


