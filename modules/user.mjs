import DBManager from "./storageManager.mjs";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

class User {

  constructor() {
    this.email;
    this.pswHash;
    this.name;
    this.id;
    this.gameState; 
  }

  async save() {
    try {
      let savedUser = null;
      if (this.id == null) {
        savedUser = await DBManager.createUser(this);
      } else {
        savedUser = await DBManager.updateUser(this);
      }

      if (this.gameState && this.id) {
        await DBManager.saveGameState(this.id, this.gameState);
      }

      return savedUser;
    } catch (error) {
      console.error("Error saving user:", error);
      throw error; 
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
        return null; 
      }
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error; 
    }
  }

  async authenticate(password) {
    try {
    
      return await bcrypt.compare(password, this.pswHash);
    } catch (error) {
      console.error("Error occurred during password comparison:", error);
      return false; 
    }
  }

  async generateAuthToken() {
    try {
   
      const token = crypto.randomBytes(64).toString('hex');
      return token;
    } catch (error) {
      console.error("Error generating auth token:", error);
      throw error; 
    }
  }

  delete() {
    DBManager.deleteUser(this);
  }

  async saveUserGameState(userId, currentGameState) {
    try {
      const result = await DBManager.saveGameState(userId, currentGameState);
      return result; 
    } catch (error) {
      console.error("Error saving user game state:", error);
      throw new Error("Error saving user game state");
    }
  }

  async getUserGameState(userId) {
    try {
      const gameState = await DBManager.getGameState(userId);
      return gameState;
      
    } catch (error) {
      console.error("Error getting user game state:", error);
      throw new Error("Error getting user game state");
    }
  }
  
  
  
}


export default User;
