const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const knex = require("../database/knex") 

class UserController {
 async create (request, response) {
    const {name, password} = request.body

    const checkUserExists = await  knex("users").where("name", name).first()

    if(checkUserExists) {
        return console.log("Usuário criado!")
    }
    
    if(!name) {
      throw new AppError ("Name is required")
    }

   const hashedPassowrd = await hash(password, 8)

   await knex( "users" ).insert({
     name,
     password: hashedPassowrd,
   })
    
    return response.status(201).json({name, hashedPassowrd})
  }
}

module.exports = UserController