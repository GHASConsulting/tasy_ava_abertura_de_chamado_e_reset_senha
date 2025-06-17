const knex  = require("../database/knex");
const { hash, compare } = require('bcryptjs')
const sqliteConnection = require("../database/sqlite");

class UserRepository {

  async create({name, password}) {
    const database = await sqliteConnection();

    const checkUserExists = await  knex("users").where({name}).first()

    console.log(checkUserExists)
    if(checkUserExists) {
        return console.log("Usuário criado!")
    }

    if(!checkUserExists){
      const hashedPassowrd = await hash(password, 8)
      const userId = await database.run(
        "INSERT INTO users (name, password) VALUES (?, ?)", 
        [name, hashedPassowrd])
      
        console.log(name, password)
      return {id: userId} 
    }
  }


}

module.exports = UserRepository;