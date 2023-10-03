require('dotenv').config();


const express = require('express');
const cors = require('cors');
const gptRequestRouter = require('./routes/gptRequest');

const app = express();
app.use(express.json());
const port = 3001;

app.use(cors());
app.use('/gpt', gptRequestRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});