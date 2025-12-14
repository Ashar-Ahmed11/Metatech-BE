const mongoose = require('mongoose')


const { Schema } = mongoose;

const adminSchema = new Schema({
    title: {
        type: 'String',
        required: 'True'
    },
    catge
    image: {
        type: 'String',
        required: 'True'
    }
});

module.exports = mongoose.model('admin', adminSchema)