const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  console.log('EVENT:', JSON.stringify(event, null, 2)); // Log the incoming event

  try {
    // Parse the event body if it's coming from API Gateway
    const data = typeof event.body === 'string' ? JSON.parse(event.body) : event;

    console.log('Parsed Data:', data); // Log parsed data

    const bookingId = uuidv4(); // Generate a unique ID
    console.log('Generated Booking ID:', bookingId); // Log the generated booking ID

    // Define the DynamoDB put parameters
    const params = {
      TableName: process.env.BOOKINGS_TABLE, // Ensure this environment variable is set
      Item: {
        BookingID: bookingId,
        UserID: data.userId,
        ServiceID: data.serviceId,
        Date: data.date,
        TimeSlot: data.timeSlot,
        Status: 'Booked',
      },
    };

    console.log('DynamoDB Params:', JSON.stringify(params, null, 2)); // Log DynamoDB parameters

    // Write to DynamoDB
    await dynamodb.put(params).promise();
    console.log('Successfully wrote to DynamoDB'); // Log success

    return {
      statusCode: 201,
      body: JSON.stringify({ bookingId }),
    };
  } catch (error) {
    console.error('Error occurred:', error); // Log the error
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create booking' }),
    };
  }
};
