import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Updated Middleware to generate pre-signed URL that accepts a key dynamically
const universalPreSignedUrl = (bucketName) => (key, contentType, req, res, next) => {
    const params = {
        Bucket: bucketName,
        Key: key, // Key is now passed as a parameter
        Expires: 60, // This URL will be valid for 1 minute
        ContentType: contentType

    };

    s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error generating pre-signed URL' });
        }
        // You may need to adjust this part depending on how you want to store the URL
        req.preSignedUrl = url;
        next();
    });
};

export default universalPreSignedUrl;