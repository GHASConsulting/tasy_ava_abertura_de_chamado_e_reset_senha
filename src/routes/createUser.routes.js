const { Router } = require("express");
const UserController = require("../controller/UserController");

const useRoutes = Router()

const userController = new UserController()

useRoutes.post("/", userController.create)


module.exports = useRoutes