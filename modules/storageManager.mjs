
import pg from "pg";

class DBManager {
  constructor(connectionString) {
    this.credentials = {
      connectionString,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    };
  }

  async getAllUsers() {
    const client = new pg.Client(this.credentials);

    try {
      await client.connect();
      const result = await client.query('SELECT * FROM "public"."Users";');
      return result.rows;
    } finally {
      client.end();
    }
  }

  async getUserById(userId) {
    const client = new pg.Client(this.credentials);

    try {
      await client.connect();
      const result = await client.query('SELECT * FROM "public"."Users" WHERE id = $1;', [userId]);
      return result.rows[0];
    } finally {
      client.end();
    }
  }

  async createUser(user) {
    const client = new pg.Client(this.credentials);

    try {
      await client.connect();
      const result = await client.query(
        'INSERT INTO "public"."Users"("name", "password") VALUES($1, $2) RETURNING *;',
        [user.name, user.password]
      );
      return result.rows[0];
    } finally {
      client.end();
    }
  }

  async updateUser(user) {
    const client = new pg.Client(this.credentials);

    try {
      await client.connect();
      const result = await client.query(
        'UPDATE "public"."Users" SET "name" = $1, "password" = $2 WHERE id = $3 RETURNING *;',
        [user.name, user.password, user.id]
      );
      return result.rows[0];
    } finally {
      client.end();
    }
  }

  async deleteUser(userId) {
    const client = new pg.Client(this.credentials);

    try {
      await client.connect();
      const result = await client.query('DELETE FROM "public"."Users" WHERE id = $1 RETURNING *;', [userId]);
      return result.rows[0];
    } finally {
      client.end();
    }
  }
}

export default new DBManager(process.env.DB_CONNECTIONSTRING);
