const express = require('express');
const app = express();
const port = 3000;

const FAILURE_PROBABILITY = 0.5;

function randomFailuresMiddleware(_, res, next) {
    if (Math.random() > 1 - FAILURE_PROBABILITY) {
        res.setHeader('Content-Type', 'text/plain');
        res.writeHead(500, res.headers);
        return res.end('#fail');
    }
    next();
}

app.use(randomFailuresMiddleware);

app.use(express.json())

app.post('/', (req, res) => {
    res.send(req.body)
});

app.listen(port, () => console.log(`Providers server listening at http://localhost:${port}`));