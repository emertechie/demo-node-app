var express = require('express'),
    expjwt = require('express-jwt'),
    expressValidator = require('express-validator'),
    bodyParser = require('body-parser'),
    config = require('config'),
    logging = require('./logging'),
    ticketService = require('./services/tickets');

var app = express(),
    port = process.env.PORT || 3001,
    logger = logging.createLogger('app'),
    signingSecret = config.get('jwtSigningSecret'),
    seureWithJwt = expjwt({ secret: signingSecret });

app.use(bodyParser.urlencoded());
app.use(expressValidator());

// secure all routes by default:
app.use(seureWithJwt);

app.post('/ticket', function(req, res) {
    req.checkBody('status', 'Ticket status required').notEmpty();
    req.checkBody('title', 'Title required').notEmpty();
    req.checkBody('description', 'Description required').notEmpty();

    var validationErrors = req.validationErrors(true);
    if (validationErrors) {
        res.status(400).json(validationErrors);
        return;
    }

    logger.debug('Adding ticket');
    ticketService.add({
        status: req.body.status,
        title: req.body.title,
        description: req.body.description,
        assignedTo: req.body.assignedTo
    }).then(function(added) {
        logger.info('Added new ticket %s', added.id);
        res.status(200).json(added);
    }, function(err) {
        logger.error(err, 'Error adding ticket');
        res.status(500).send('Something went wrong there');
    });
});

app.get('/ticket', function(req, res) {
    logger.debug('Finding tickets');
    ticketService.findAll({
        limit: req.query.limit,
        offset: req.query.offset,
        order: req.query.order
    }).then(function(results) {
        logger.debug('Found %d tickets', results ? results.length : 0);
        res.status(200).json(results);
    }, function(err) {
        logger.error(err, 'Error getting tickets');
        res.status(500).send('Something went wrong there');
    });
});

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send(401, 'invalid token');
    } else {
        logger.error(err);
        res.status(500).send('Something went wrong there');
    }
});

app.listen(port);
console.log('Express app started on port ' + port);
