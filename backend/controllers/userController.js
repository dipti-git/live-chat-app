const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/token');

const signupUser = asyncHandler(async (req, res) => {
    const { name, email, password, picture } = req.body;

    if(!name || !email || !password) {
        res.status(400);
        throw new Error('Please enter all the fields');
    }

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name, email, password, picture
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the user!");
    }
});

const loginUser  = asyncHandler(async (req, res) =>{
    const { email, password} = req.body;
    const user = await User.findOne({ email });

    if(user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id),  
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }

}); 

// /api/user?search=abc

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        // $or returns  documents that satisfy either of the condition
        $or: [
            {name: {$regex: req.query.search, $options: "i"} },
            {email: {$regex: req.query.search, $options: "i" } },
        ]
    }: {};

    // to search all the users except the one which is logged in and provides the JWT
    // $ne:req.user._id means not equal to the logged-in user's id
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
});

module.exports = { signupUser, loginUser, allUsers };
