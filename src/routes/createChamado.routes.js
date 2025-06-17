const { Router } = require("express");
const ChamadoController = require("../controller/ChamadoController");

const createChamado = Router()

const chamadoController = new ChamadoController()

createChamado.post("/", chamadoController.create)


module.exports = createChamado