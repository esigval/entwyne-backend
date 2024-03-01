import express from 'express';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import editEngine from '../middleware/editingEngine/editEngine.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware
dotenv.config();

const router = express.Router();
const lambda = new AWS.Lambda();

router.post('/', validateTokenMiddleware, async (req, res) => {
  try {
    const { storylineId, musicName, coupleName, marriageDate } = req.headers;

    const data = {
      musicName,
      coupleName,
      marriageDate
    };

    const jsonData = JSON.stringify(data);
    const order = await editEngine(storylineId);
    const orderData = order;
    console.log('order details', orderData);

    // Prepare Lambda function parameters
    const lambdaParams = {
      FunctionName: 'YourLambdaFunctionName', // replace with your Lambda function name
      InvocationType: 'Event',
      Payload: JSON.stringify({
        storylineId: storylineId,
        titleDetails: jsonData,
        orderDetails: orderData
      })
    };

    const lambdaResponse = await lambda.invoke(lambdaParams).promise();
    console.log('Lambda function invoked:', lambdaResponse);

    res.status(200).send('Lambda function invoked successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;