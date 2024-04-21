const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    chat: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Chat"
    },    
    content: {type: String, trim: true},

},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Message', messageSchema);