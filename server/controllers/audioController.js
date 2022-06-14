const Audio = require("../models/audioModel");
const Messages = require("../models/messageModel");
/* const link = require("../index") */

/* module.exports.getAudio = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const audios = await Audio.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedAudio = audios.map((audio) => {
      return {
        fromSelf: audio.sender.toString() === from,
        message: audio.message.text,
      };
    });
    res.json(projectedAudio);
  } catch (ex) {
    next(ex);
  }
}; */


module.exports.getAllAudio = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const audios = await Audio.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedAudio = audios.map((audio)=>{
      return {
        fromSelf : audio.sender.toString()===from,
        message : audio.message.text,
        isAudio:true
      };
    });
    res.json(projectedAudio);
  } catch (ex) {
    next(ex)
  }
}

module.exports.addAudio = async (req, res, next) => {
  try {
    const { from, to, messages } = req.body;
    
    const data = await Messages.create({
      message: { text: messages },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

