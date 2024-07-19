import { handler } from './index.js';

const event = {
  body: {
    message: "Hello, world!"
  }
};

handler(event)
  .then(response => console.log(response))
  .catch(error => console.error(error));