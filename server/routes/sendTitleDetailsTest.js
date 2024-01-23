import AWS from 'aws-sdk';
import editEngine from '../middleware/editingEngine/editEngine.js';


const lambda = new AWS.Lambda();

export async function preparePayload(storylineId, musicName, coupleName, marriageDate) {
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
    FunctionName: 'renderVideo', // replace with your Lambda function name
    InvocationType: 'Event',
    Payload: JSON.stringify({ 
      storylineId: storylineId,
      titleDetails: jsonData,
      orderDetails: orderData
    })
  };
  console.log('payload details', JSON.parse(lambdaParams.Payload));

  const lambdaResponse = await lambda.invoke(lambdaParams).promise();

  console.log('Lambda response:', lambdaResponse);

  return lambdaResponse;
}

// Test the function with dummy data
preparePayload('65a59778e91d4c46ebf40ed5', 'Wistful.mp3', 'dummyCoupleName', 'dummyMarriageDate')
  .then(lambdaParams => console.log('payload details', lambdaParams.Payload))
  .catch(error => console.error(error));