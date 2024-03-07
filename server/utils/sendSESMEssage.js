import AWS from 'aws-sdk';

// Configure AWS SES
AWS.config.update({
  region: 'us-east-1', // Update this with your SES region
});

const ses = new AWS.SES();

const sendEmail = async (fromName, recipientEmail, subject, htmlBody) => {
  const params = {
    Source: `${fromName} <evan@entwyne.com>`, // Replace this with your verified email address
    Destination: {
      ToAddresses: [
        recipientEmail,
      ],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: htmlBody,
        },
      },
    },
  };

  console.log('Recipient:', recipientEmail);
  console.log('HTML Body:', htmlBody);

  try {
    const data = await ses.sendEmail(params).promise();
    console.log('Email sent:', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail;
