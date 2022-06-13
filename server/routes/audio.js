const { addAudio,getAllAudio } = require("../controllers/audioController");
const router = require("express").Router();

router.post("/addaudio/", addAudio);
router.post("/getaudio/", getAllAudio);

module.exports = router;
