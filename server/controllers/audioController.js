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


let audioLink="";

module.exports.pathLink = (pathlink) => {
 return audioLink = pathlink;
}

module.exports.addAudio = async (req, res, next) => {
  try {
      const { from, to,message } = req.body;
      console.log(from);
      console.log(message);
      const data = await Messages.create({
        message: { text: "audioLink" },
        users: [from, to],
        sender: from,
        message:message
      });
    

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

