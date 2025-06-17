const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { compare } = require('bcryptjs')
const authConfig = require('../config/auth')
const { sign } = require('jsonwebtoken')

class SessionController {
    async create(request, response) {
        const {name, password} = request.body;

    const user = await knex("users").where({ name }).first();

    if (!user) {
        return response.status(401).json({
           message : "Usuário ou senha incorreta"})
    }
    
    const passwordMatched = await compare (password, user.password)
    
    if(passwordMatched) {
      console.log("Sessão iniciada!")
    }

    if (!passwordMatched) {
        return response.status(401).json({
           message : "Usuário ou senha incorreta"})
    }
    
    const {secret } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
    })

    return response.json(token);
  }
}

module.exports = SessionController;