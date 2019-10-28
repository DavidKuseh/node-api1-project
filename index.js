// implement your API here

const express = require('express');

const Users = require('./data/db.js')

const server = express();

server.use(express.json()) 

//post new user
server.post('/api/users', (req,res) => {
    const { name, bio } = req.body;

    if (!name || !bio) {
        res
        .status(400)
        .json({ errorMessage: 'Please provide name and bio for the user.'})
    } else {
        Users.insert(req.body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(() => {
            res.status(500).json({
                errorMessage:
                'There was an error while saving the user to the database.'
            })
        })
    }
})

//get users
server.get('/api/users', (req, res) => {
    Users.find()
      .then(users => {
        res.status(200).json(users); 
      })
      .catch(() => {
        res.status(500).json({
          errorMessage: 'The users information could not be retrieved.',
        });
    });  
});

//get users by id
server.get('/api/users/:id', (req, res) =>{
    Users.findById(req.params.id)
    .then(user => {
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist.'})
        }
    })
    .catch(() => {
        res.status(500).json({ errorMessage: 'The user information could not be retrieved.'})
    })
})  

// delete user by id
server.delete('/api/users/:id', (req,res) => {
    Users.remove(req.params.id)
        .then(user => {
            if(!user){
                res.status(400).json({ message: 'The user with the specified ID does not exist.'})
            }
            else {
                res.json(user)
            }
        })
        .catch(error => {
            res.status(500).json({error: "The user could not be removed"})
        })
})

// update user info
server.put('/api/users/:id', (req,res) => {
    const { name, bio } = req.body;

    if(!name || !bio) {
        res.status(400).json({ errorMessage: 'Please provide name and bio for user '})
    } else {
        Users.update(id, name, bio)
        .then(user => {
            if(!user){
                res.status(404).json({ message: 'The user with the specified ID does not exist.'})
            } else {
                res.status(201).json(user)
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'The user information could not be modified'})
        })
    }
})

server.listen((process.env.PORT || 3000), () => {
    console.log('listening on ' + (process.env.PORT || 3000));
})
