const mongoose = require('mongoose');

const grp_messageSchema = new mongoose({
    from_user:{
        type:String, 
        required:true
    },
    room:{
        type:String,
        required:true
    },
    message:{
        type:String, 
        required
    },
    date_sent:{
        type:Date , 
        default: Date.now,
        required:true
    }
})

module.exports = mongoose.exports('GroupChat',grp_messageSchema)