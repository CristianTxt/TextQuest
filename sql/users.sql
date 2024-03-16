CREATE TABLE "Users" (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text,
    name text,
    password text
); 

CREATE TABLE "UserGameStates" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
    game_state JSONB
);


