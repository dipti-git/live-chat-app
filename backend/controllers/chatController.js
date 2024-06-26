const asyncHandler = require("express-async-handler");
const Chat = require( "../models/chatModel") ;
const User = require("../models/userModel"); 

//create or get one on one chat
const accessChat = asyncHandler(async(req, res) => {
    const { userId } = req.body;

    // check  if the chat with the userId exists
        if(!userId) {
        console.log("User ID  is missing!");
        return res.status(400);
    }

    var isChat = await Chat.find({
        // isGroupChat: false,
        $and: [
            {users: { $elemMatch: { $eq: req.user._id}}},
            {users: {$elemMatch: { $eq: userId }}},
        ],
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

        if (isChat.length > 0 ) {
            res.send(isChat[0]);
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            try {
                const createdChat = await Chat.create(chatData);

                const FullChat = await Chat.findOne({_id: createdChat._id}).populate(
                    "users",
                    "-password"
                );

                res.status(200).send(FullChat);

            } catch (error) {
                res.status(400);
                throw new Error(error.message);
            }
        }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({
            users: {$elemMatch: {$eq: req.user._id}}
        }).populate("users", "-password").populate("latestMessage").sort({ updatedAt: -1 }).then(async(results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });

            res.status(200).send(results);
        });
    } catch(error){
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { accessChat, fetchChats }