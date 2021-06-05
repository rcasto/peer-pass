const { isValidRequest } = require('../helpers/validate');

exports.connectToRoom = (req, res) => {
    if (!isValidRequest(req)) {
        res.status(400).end();
        return;
    }

    res.send(`Hello World!`);
};