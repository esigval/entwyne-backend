const express = require('express');
const router = express.Router();
const https = require('https');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

let chatHistory = [
    {
      role: 'system',
      content: `You are a helpful assistant dedicated to help me solve my home problems. You will help me diagnose the issue, establish a possible set of items I will need to fix it, and then finally offer me a link literally called [GetScannableCodeLink]`
    }
  ];

router.post('/', (req, res) => {
    const { sender, message } = req.body;
    console.log('Payload:', req.body);
    console.log(req.body);

    chatHistory.push({ role: sender, content: message });

    console.log(chatHistory);

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
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            console.log('Server Response:', data);
            try {
                const parsedResponse = JSON.parse(data);
                const assistantMessage = parsedResponse.choices[0].message;
                if (assistantMessage && assistantMessage.content) {
                    chatHistory.push({
                        role: assistantMessage.role,
                        content: assistantMessage.content
                    });
                }
                res.json({ content: assistantMessage.content });
            } catch (err) {
                console.error('Error parsing JSON:', err);
                res.status(500).send('Internal server error');
            }
        });
    });
    


    request.on('error', error => {
        console.error(error);
        res.status(500).send('Internal server error');
    });

    // Insert the `message` variable into the `content` field
    const data = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: chatHistory,
        temperature: 0.7
    });

    request.write(data);
    request.end();
});

module.exports = router;
