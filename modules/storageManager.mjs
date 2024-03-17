import pg from "pg"
import SuperLogger from "./SuperLogger.mjs";




/// TODO: is the structure / design of the DBManager as good as it could be?

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

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }
   
    
    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users"  where id = $1;', [user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]);



            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
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
                // Map database fields to User object
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    pswHash: user.password
                };
            } else {
                return null; // User not found
            }
        } catch (error) {
            console.error("Error retrieving user by email:", error);
            throw error; // Propagate the error
        } finally {
            client.end(); // Disconnect from the database
        }
    }
    async saveGameState(userId, currentGameState) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            // Check if the game state already exists for this user
            const existingGameState = await client.query('SELECT * FROM "public"."UserGameStates" WHERE "user_id" = $1;', [userId]);
            if (existingGameState.rows.length === 0) {
                // If game state doesn't exist, insert a new record
                await client.query('INSERT INTO "public"."UserGameStates"("user_id", "game_state") VALUES($1, $2);', [userId, JSON.stringify(currentGameState)]);
            } else {
                // If game state exists, update the existing record
                await client.query('UPDATE "public"."UserGameStates" SET "game_state" = $1 WHERE "user_id" = $2;', [JSON.stringify(currentGameState), userId]);
            }
        } catch (error) {
            console.error("Error saving game state:", error);
            throw error; // Propagate the error
        } finally {
            client.end(); // Disconnect from the database
        }
    }

    async getGameState(userId) {
        const client = new pg.Client(this.#credentials);
    
        try {
            await client.connect();
            // Retrieve the game state for the specified user ID
            const result = await client.query('SELECT "game_state" FROM "public"."UserGameStates" WHERE "user_id" = $1;', [userId]);
            if (result.rows.length === 0) {
                
                // If no game state found for the user, return null
                return null;
            } else {
                // Parse and return the game state
                return result.rows[0].game_state;
            }
        } catch (error) {
            console.error("Error retrieving game state:", error);
            throw error; // Propagate the error
        } finally {
            client.end(); // Disconnect from the database
        }
    }
    
    


    

}

// The following is thre examples of how to get the db connection string from the enviorment variables.
// They accomplish the same thing but in different ways.
// It is a judgment call which one is the best. But go for the one you understand the best.

// 1:
let connectionString = process.env.ENVIRONMENT  == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;

// We are using an enviorment variable to get the db credentials 
if (connectionString == undefined) {
    throw ("You forgot the db connection string");
}

export default new DBManager(connectionString);

//
