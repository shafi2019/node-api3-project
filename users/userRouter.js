const express = require('express');

const userDB= require('./userDb.js');
const postDB = require('../posts/postDb.js')

const router = express.Router();

router.post('/',validateUser, (req, res) => {
  // do your magic!
  userDB.insert(req.body)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(error => {
    res.status(500).json({ error: "The user was not added" })
  })
});

router.post('/:id/posts',validatePost, (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  // do your magic!
  userDB.get()
  .then(user => {
    res.status(200).json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the users'
    });
  });
});

router.get('/:id', (req, res) => {
  // do your magic!
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
  postDB.get()
  .then(user => {
    res.status(200).json(user);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the users'
    });
  });
});


router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
  if(!req.body || req.body.length<1){
    res.status(400).json({ message: "missing user data" })
  } else if(!req.body.name || req.body.name.length<1) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if(!req.body || req.body.length<1){
    res.status(400).json({message: "missing post data"})
  } else if(!req.body.text || req.body.text.length<1) {
    res.status(400).json({message: "missing required text field"})
  } else{
    next();
  }
}



function errorHandler(error, req, res, next) {
  console.log('error: ', error.message);
  res.status(400).json({ message: error.message })
}

router.use(errorHandler);

module.exports = router;
