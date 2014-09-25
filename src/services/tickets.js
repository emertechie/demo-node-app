var db = require('../data/database'),
    Ticket = db.models.Ticket,
    _ = require('lodash');

module.exports = {
    add: function(ticketProps) {
        var ticket = Ticket.build(ticketProps);
        return ticket.save();
    },
    findAll: function(options) {
        options = _.defaults(options || {}, {
            limit: 50,
            offset: 0,
            order: [['createdAt', 'DESC']]
        });
        return Ticket.findAll(options);
    }
};