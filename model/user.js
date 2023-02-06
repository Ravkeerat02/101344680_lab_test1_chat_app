const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    username:{
        type: String,
        required: true,
        max:20
    },
    firstname:{
        type:String,
        required: true,
        max:50
    },
    lastname:{
        type:String,
        required: true,
        max: 50
    },
    password:{
        type:String,
        required:true,
        max: 255
    },
    createon:{
        type: Date, 
        required: true, 
    }

})

module.exports = mongoose.model('user',userSchema)