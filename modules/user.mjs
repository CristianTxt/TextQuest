import DBManager from "./storageManager.mjs";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

class User {

  constructor() {
    this.email;
    this.pswHash;
    this.name;
    this.id;
    this.gameState; // Add a property to store game state
  }

  async save() {
    try {
      let savedUser = null;
      if (this.id == null) {
        savedUser = await DBManager.createUser(this);
      } else {
        savedUser = await DBManager.updateUser(this);
      }

      // Save game state if present
      if (this.gameState && this.id) {
        await DBManager.saveGameState(this.id, this.gameState);
      }

      return savedUser;
    } catch (error) {
      console.error("Error saving user:", error);
      throw error; // Propagate the error
    }
  }

  static async findByEmail(email) {
    try {
      const user = await DBManager.getUserByEmail(email);
      if (user) {
        const newUser = new User();
        Object.assign(newUser, user);
        return newUser;
      } else {
        return null; // User not found
      }
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error; // Propagate the error
    }
  }

  async authenticate(password) {
    try {
      // Compare the provided password with the stored hashed password
      return await bcrypt.compare(password, this.pswHash);
    } catch (error) {
      console.error("Error occurred during password comparison:", error);
      return false; // Return false in case of an error
    }
  }

  async generateAuthToken() {
    try {
      // Generate a random token
      const token = crypto.randomBytes(64).toString('hex');
      return token;
    } catch (error) {
      console.error("Error generating auth token:", error);
      throw error; // Propagate the error
    }
  }

  delete() {
    // TODO: What happens if the DBManager fails to complete its task?
    DBManager.deleteUser(this);
  }

  async saveUserGameState(userId, currentGameState) {
    try {
      const result = await DBManager.saveGameState(userId, currentGameState);
      return result; // Return the result from saveGameState function
    } catch (error) {
      console.error("Error saving user game state:", error);
      throw new Error("Error saving user game state");
    }
  }

  async getUserGameState(userId) {
    try {
      const gameState = await DBManager.getGameState(userId);
      return gameState; // Return the retrieved game state
      
    } catch (error) {
      console.error("Error getting user game state:", error);
      throw new Error("Error getting user game state");
    }
  }
  
  
  
}


export default User;
