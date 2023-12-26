// index.js
exports.handler = async (event) => {
    // TODO: implement your Lambda function here
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};