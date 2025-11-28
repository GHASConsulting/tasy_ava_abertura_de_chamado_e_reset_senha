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

userRepository.create({
    name: process.env.USER_SERVICE,
    password: process.env.PASSORWD
})


app.listen(port, () => console.log(`server is running on PORT ${port}`))
