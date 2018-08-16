const mongoose = require('mongoose');
const { Schema } = mongoose;

const linkSchema = new Schema({
    original_url:  { type: String, required: true },
    short_url:     { type: Number, required: true }
});

mongoose.model('links', linkSchema);