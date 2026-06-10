const songModel = require("../models/song.model");
const NodeID3 = require("node-id3");
const storageServices = require("../services/storage.service");

const songUploadController = async (req, res) => {
  try {
    const { mood } = req.body;
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const songBuffer = req.file.buffer;
    const tags = NodeID3.read(songBuffer);

    // 🎵 Upload song
    const uploadPromises = [];

    // 🎵 Song upload (always)
    uploadPromises.push(
      storageServices.uploadFile({
        buffer: songBuffer,
        fileName: `${tags.title || "song"}.mp3`,
        folder: "/cohort-2/modify/songs",
      }),
    );

    // 🖼️ Image upload (conditional)
    if (tags?.image?.imageBuffer) {
      uploadPromises.push(
        storageServices.uploadFile({
          buffer: tags.image.imageBuffer,
          fileName: `${tags.title || "song"}.jpeg`,
          folder: "/cohort-2/modify/postUrl",
        }),
      );
    }


    const results = await Promise.all(uploadPromises);


    const songFile = results[0];
    let posterUrl = "https://www.fantastick.in/cdn/shop/files/CAMB011.jpg?v=1695123269&width=1946";

    if (results[1]) {
      posterUrl = results[1].url;
    }

 
    const song = await songModel.create({
      title: tags.title || "Unknown",
      url: songFile.url,
      posterUrl,
      mood,
    });

    res.status(201).json({
      message: "Song created successfully",
      song,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getSong = async (req, res) => {
  const { mood } = req.body;

  if (!mood) {
    return res.status(401).json({
      message: "mood not found",
    });
  }
  const song = await songModel.findOne({
    mood,
  });
  if (!song) {
    return res.status(401).json({
      message: "song not found",
    });
  }
  res.status(200).json({
    message: "song fetching successfull",
    song,
  });
};

module.exports = { getSong, songUploadController };
