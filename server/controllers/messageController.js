const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        isFile:msg.message.isFile
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message,isFile:false },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
module.exports.deleteMessage = async (req,res,next) =>{
  try {
    const userId = req.params.id;
    const deleteMsg = await Messages.findByIdAndRemove(userId, (error, docs) => {
      if (error) {
        console.log(error)
      } else {
        console.log("item removed ", docs)
      }
    })
    return res.json({ msg: "Message deleted" })
  }catch (ex) {
    next(ex)
  }
}