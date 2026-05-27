const express = require("express");
const songController = require("../controllers/song.controller");
const upload = require("../Middlewares/upload.middleware")

const Router = express.Router() ;


Router.post("/song",upload.single("song"),songController.songUploadController)
Router.post("/getSong",songController.getSong)


module.exports = Router;