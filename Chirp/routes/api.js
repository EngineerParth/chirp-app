var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

router.route('/posts')
  .get(function(req, res){
    //res.send({message: 'TODO return all posts'})

    Post.find(function(err, posts){
      if(err){
				return res.send(500, err);
			}
			return res.send(posts);
    });
  })

  .post(function(req, res){
    //res.send({message: 'TODO create a new post'});
    var post = new Post();
    post.text = req.body.text;
    post.created_by = req.body.created_by;

    post.save(function(err, post){
      if(err){
        return res.send(500, err);
      }
      return res.json(post);
    });
  });

router.route('/posts/:id')
  .get(function(req, res){

    // return res.send({message:'TODO get an existing post using param ' + req.params.id});

    Post.findById(req.params.id, function(err, post){
      if(err){
        res.send(err);
      }
      res.json(post);
    });

   })
  .put(function(req, res) {

    // return res.send({message:'TODO modify an existing post using param ' + req.params.id});

    Post.findById(req.params.id, function(err, post){
      if(err){
        req.send(err);
      }
      post.text = req.body.text;
      post.created_by = req.body.created_by;
      post.save(function(err, post){
        if(err){
          res.send(err);
        }
        res.json(post);
      });
    });

  })
  .delete(function(req, res){

    // return res.send({message:'TODO delete an existing post using param ' + req.params.id});

    Post.remove({"_id": req.params.id}, // double quotes are important!!
                  function(err){
                    if(err){
                      res.send(err);
                    }
                    res.json('Deleted :(');
                  }
    );
  });

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);
module.exports = router;
