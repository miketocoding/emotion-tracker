// require mongoose
const mongoose = require('mongoose')

const emotionSchema = new mongoose.Schema({
  emotionName: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

module.exports = mongoose.model('Emotion', emotionSchema)
