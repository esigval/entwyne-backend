import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Updated Middleware to generate pre-signed URL that accepts a key dynamically
const universalPreSignedUrl = (bucketName) => (operation, key, contentType) => {
    return new Promise((resolve, reject) => {
        let params = {
            Bucket: bucketName,
            Key: key,
            Expires: 60
        };

        // Only add ContentType for putObject operations
        if (operation === 'putObject') {
            params.ContentType = contentType;
        }

        s3.getSignedUrl(operation, params, (err, url) => {
            if (err) {
                console.log(err);
                reject('Error generating pre-signed URL');
            } else {
                resolve(url);
            }
        });
    });
};
export default universalPreSignedUrl;