let SERVER_NAME = 'User-Api'
let PORT = 3000;
let HOST = '127.0.0.1';

let restify = require('restify');
let errors = require('restify-errors');

// Definition for saving users
let usersSave = require('save')('users');

// Create the restify server
let server = restify.createServer({ name: SERVER_NAME});

server.listen(PORT, HOST, function () {
    console.log('Server %s listening at %s', server.name, server.url);
    console.log('**** Resources: ****');
    console.log('********************');
    console.log(' /users');
    console.log(' /users/:id');
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all users
server.get('/users', function (req, res, next) {
    console.log('GET /users params => ' + JSON.stringify(req.params));

    // Find all users and send response
    usersSave.find({}, function (error, users) {
        // Send response
        res.send(users);
    })
});

// Get a user
server.get('/users/:id', function (req, res, next) {
    console.log('GET /users/:id params => ' + JSON.stringify(req.params));

    // Find the user and send response
    usersSave.findOne({ _id: req.params.id }, function (error, user) {
        if (error) return next(new Error(JSON.stringify(error.errors)));

        // Send response
        if (user) {
            res.send(user);
        } else {
            res.send(404);
        }
    })
});

// Create a user
server.post('/users', function (req, res, next) {
    console.log('POST /users params => ' + JSON.stringify(req.params));
    console.log('POST /users body => ' + JSON.stringify(req.body));

    // Input validations
    if (req.body.name === undefined ) {
        return next(new errors.BadRequestError('name must be supplied'));
    }
    if (req.body.age === undefined ) {
        return next(new errors.BadRequestError('age must be supplied'));
    }

    // Define a new user object
    let newUser = {
        name: req.body.name, 
        age: req.body.age
    };

    // Create the user and send response
    usersSave.create( newUser, function (error, user) {
        if (error) return next(new Error(JSON.stringify(error.errors)));

        // Send a 201 response
        res.send(201, user);
    })
});

// Update a user by their id
server.put('/users/:id', function (req, res, next) {
    console.log('POST /users params => ' + JSON.stringify(req.params));
    console.log('POST /users body => ' + JSON.stringify(req.body));

    // Input validations
    if (req.body.name === undefined ) {
        return next(new errors.BadRequestError('name must be supplied'));
    }
    if (req.body.age === undefined ) {
        return next(new errors.BadRequestError('age must be supplied'));
    }

    // Define the user object
    let newUser = {
        _id: req.body.id,
        name: req.body.name, 
        age: req.body.age
    };

    // Update the user and send response
    usersSave.update(newUser, function (error, user) {
        if (error) return next(new Error(JSON.stringify(error.errors)));

        // Send a 200 response
        res.send(200);
    });
});

// Delete a user and send response
server.del('/users/:id', function (req, res, next) {
    console.log('POST /users params => ' + JSON.stringify(req.params));
    // Delete the user and send response
    usersSave.delete(req.params.id, function (error, user) {
        if (error) return next(new Error(JSON.stringify(error.errors)));

        // Send a 204 response
        res.send(204);
    })
});
