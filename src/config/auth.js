module.exports = {
  // json web token: é um padrão de mercado um token no
  //formato json e o objetivo é trocar indormação entra a aplicação e API
  jwt: {
    secret: process.env.AUTH_SECRET || 'default',
    expiresIn: "-1"

  }
}