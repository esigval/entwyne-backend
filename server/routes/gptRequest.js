const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/', (req, res) => {
    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
        }
    };

    console.log(`API key: ${process.env.OPENAI_API_KEY}`);

    const request = https.request(options, response => {
        console.log(`statusCode: ${response.statusCode}`);

        response.on('data', data => {
            res.send(data);
        });
    });

    request.on('error', error => {
        console.error(error);
        res.status(500).send('Internal server error');
    });

    const data = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Say this is a test!' }],
        temperature: 0.7
    });

    request.write(data);
    request.end();
});

module.exports = router;