function isValidRequest(req) {
    if (req.method !== 'POST') {
        return false;
    }
    
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
        return false;
    }

    if (!req.body) {
        return false;
    }

    return true;
}

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.connectPeer = (req, res) => {
    if (!isValidRequest(req)) {
        res.status(400).end();
        return;
    }

    res.send(`Hello World!`);
};