const express = require('express');
const router = express.Router();
const Db = require('./userDb')
const posts = require('../posts/postDb')



router.post('/', validateUser, (req, res) => {
  // do your magic!
  const { userName } = req.body;
  Db.insert({ name: userName })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({ message: "Could not add user" })
    })
});



router.get('/', (req, res) => {
  // do your magic!
  Db.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(error => {
    res.status(500).json({ message: "Couldn't get from Data base" })
  })

});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Db.getUserPosts(req.user.id)
  .then(posts => {
    if (posts.length > 0) {
      res.status(200).json(posts);
    }
    else {
      res.status(400).json({ message: "This user has no posts" });
    }
  })
  .catch(error => {
    res.status(500).json({ message: "Couldn't get posts" })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Db.remove(req.user.id)
  .then(() => {
    res.status(200).json({ message: `user with id ${req.user.id} was removed` })
  })
  .catch(error => {
    res.status(500).json({ message: "Couldn't delete the user" })
  })
});

router.put('/:id', (req, res) => {
  // do your magic!
  Db.update(req.user.id, { name: req.body.name })
  .then(() => {
    Db.getById(req.user.id)
      .then(user => {
        res.status(200).json(user);
      })
      .catch(error => {
        res.status(500).json({ message: "Could not get updated user." });
      });
  })
  .catch(error => {
    res.status(500).json({ message: "Could not update user." });
  });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  posts.insert({ user_id: req.params.id, text: req.body.text })
  .then(post => {
    res.status(200).json({ message: post })
  })
  .catch(error => {
    res.status(500).json({ message: "Could not post" })
  })
});

function validateUserId(req, res, next) {
  Db.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      }
      else {
        res.status(500).json({ message: "No user with this ID exists" })
      }
    })
    .catch(error => {
      res.status(500).json({ message: "need to give an ID"})
    })
}

function validateUser(req, res, next) {

  if (req.body) {
    if (req.body.name) {
      next();
    }
    else {
      res.status(400).json({ message: "Missing name" })
    }
  } else {
    res.status(400).json({ message: "Missing user data" })
  }
}

function validatePost(req, res, next) {
  if (req.body) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ message: "Missing required text field" });
    }
  } else {
    res.status(400).json({ message: "Missing post data" });
  }
}


module.exports = router;



/*const express = require('express');

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

router.post('/:id/posts',validatePost, validateUserId, (req, res) => {
  // do your magic!
  postDB.insert(req.params.id, req.body)
  .then(hubs => {
    res.status(200).json(hubs)
    console.log(hubs)
  })
  .catch(error => {
    res.status(500).json({ error: "The post was not updated"})
  })
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

router.get('/:id',validateUserId, (req, res) => {
  // do your magic!
  userDB.getById(req.params.id)
  .then(hubs => {
    res.status(200).json(hubs)
  })
  .catch(error => {
    res.status(500).json({ error: "The user information could not be returned"})
  })
});

router.get('/:id/posts',validateUserId, (req, res) => {
  // do your magic!
  postDB.getById()
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
  userDB.getById(req.params.id)
    .then(post => {
       if(!post) {
        res.status(404).json({message: "invalid user id"  });
       } else{
        next();
       }
    })  
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
*/
