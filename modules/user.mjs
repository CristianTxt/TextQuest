
import DBManager from "./storageManager.mjs";
import bcrypt from 'bcrypt';
import crypto from 'crypto';



class User {

  constructor() {
  
    this.email;
    this.pswHash;
    this.name;
    this.id;
  }


  

  async save() {

  
    if (this.id == null) {
      return await DBManager.createUser(this);
    } else {
      return await DBManager.updateUser(this);
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

    /// TODO: What happens if the DBManager fails to complete its task?
    DBManager.deleteUser(this);
  }
}

export default User;