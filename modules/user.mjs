
import DBManager from "./storageManager.mjs";

/*  
// If you dont want to use class, this is one alternative

const User = function () {
  return {
    email: "",
    pswHash: "",
    name: "",
    id: null,
    save: Save,
  };

  function Save() {
    console.log(this.name);
  }
};

}*/


class User {

    constructor() {
        ///TODO: Are these the correct fields for your project?
        this.pswHash;
        this.name;
    }
async save() {
    if (this.id == null){ 
        return await DBManger.createUser(this);
    } else { 
        return await DBManger.updateUser(this);
    }
  }

  delete() {

    /// TODO: What happens if the DBManager fails to complete its task?
    DBManager.deleteUser(this);
  }
}

export default User;
