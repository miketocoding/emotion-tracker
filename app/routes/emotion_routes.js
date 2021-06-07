// Require express
const express = require('express')
// requrie passport - authenticate middleware step
const passport = require('passport')
// const mongoose = require('mongoose')

// Create a router to group routes into a mini app
const router = express.Router()

// require Emotion model
const Emotion = require('./../models/emotion')

// bring in custom errors using destructuring
const { handle404, requireOwnership } = require('./../../lib/custom_errors')

// passport.authenticate is a middleware used to authenticate
// pass in `bearer` - scheme we set up
const requireToken = passport.authenticate('bearer', { session: false })

// CREATE
router.post('/emotions', requireToken, (req, res, next) => {
  // Create a key on the incoming data called `owner`
  // setting the value to be the ID of the user making the request
  req.body.emotion.owner = req.user._id
  Emotion.create(req.body.emotion)
    .then(console.log('I made it to express backend'))
    .then(emotion => res.status(201).json({ emotion }))
    .catch(next)
})

// SHOW
router.get('/emotions/:id', requireToken, (req, res, next) => {
  Emotion.findById(req.params.id)
    .then(handle404)
    .then(emotion => requireOwnership(req, emotion))
    .then(emotion => res.json(emotion))
    .catch(next)
})

// INDEX
router.get('/emotions', requireToken, (req, res, next) => {
  // want to show all emotions but need to hide owner info
  Emotion.find({})
    .then(console.log('I made it to index express backend'))
    .then(emotions => res.json(emotions))
    .catch(next)
})

// UPDATE
router.patch('/emotions/:id', requireToken, (req, res, next) => {
  delete req.body.emotion.owner
  // get id of event from params
  const id = req.params.id
  // get emotion data from request
  const emotionData = req.body.emotion

  Emotion.findById(id)
    .then(handle404)
    .then(emotion => {
      requireOwnership(req, emotion)
      return emotion.updateOne(emotionData)
    })
    .then(() => { res.sendStatus(204) })
    .catch(next)
})

// DELETE
router.delete('/emotions/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Emotion.findById(id)
    .then(console.log('I made it to delete express backend'))
    .then(handle404)
    .then(emotion => requireOwnership(req, emotion))
    .then(emotion => emotion.deleteOne())
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
