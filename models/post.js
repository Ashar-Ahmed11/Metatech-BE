const mongoose = require('mongoose')


const { Schema } = mongoose;

const postSchema = new Schema({
    slug: {
        type: 'String',
    },
    metaTitle: {
        type: 'String',
    },
    metaDescription: {
        type: 'String',
    },
    title: {
        type: 'String',
   
    },
    category: {
        type: 'String',
     
    },
    image: {
        type: 'String',
        
    },
    description: {
        type: 'String',
        
    },
    date: {
        type: 'Date',
        default: Date.now
    }
});

module.exports = mongoose.model('post', postSchema)