const express = require("express");
const songController = require("../controllers/song.controller");
const upload = require("../Middlewares/upload.middleware")

const songRouter = express.Router() ;


songRouter.post("/song",upload.single("song"),songController.songUploadController)
songRouter.post("/getSong",songController.getSong)


module.exports = songRouter;