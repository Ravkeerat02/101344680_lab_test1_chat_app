const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({

    from_user:{
        type: String, 
        required : true , 
        max:100
    },
    to_user:{
        type: String, 
        required: true, 
        max:100
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

module.exports = mongoose.model('prv_message',messageSchema)