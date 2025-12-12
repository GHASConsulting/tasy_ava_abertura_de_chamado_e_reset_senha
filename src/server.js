const { configDotenv } = require("dotenv")
const connectionTasy = require("./connection")
const runMigrations = require("./database/knex")
const UserRepository = require("./repositories/UserCreateService")
const routes = require("./routes")
require("dotenv/config")
const userRepository = new UserRepository()


express = require("express")

const app = express()
const port = 5000
connectionTasy()
runMigrations()


app.use(express.json())
app.use(routes)

// Criar usuário apenas se as variáveis de ambiente estiverem definidas
if (process.env.USER_SERVICE && process.env.PASSORWD) {
  userRepository.create({
    name: process.env.USER_SERVICE,
    password: process.env.PASSORWD
  }).catch(err => {
    console.error("Erro ao criar usuário:", err.message);
  });
} else {
  console.log("Variáveis USER_SERVICE ou PASSORWD não definidas. Pulando criação de usuário.");
}


app.listen(port, () => console.log(`server is running on PORT ${port}`))
