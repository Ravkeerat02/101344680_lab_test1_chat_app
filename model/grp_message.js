const mongoose = require('mongoose');

const groupMessageSchema = mongoose.Schema({

    from_user:{
        type: String, 
        required : true , 
        max:100
    },
    room:{
        type: String, 
        required: true, 
        max:20
    },
    message:{
        type: String, 
        required: true, 
        max: 250
    },
    date_sent:{
        type: Date, 
        required: true, 
    }

})

module.exports = mongoose.model('grp_message',groupMessageSchema)