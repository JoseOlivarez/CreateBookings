// amplify/backend/function/createBookingsLambda/src/index.js

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const bookingId = uuidv4();

    const params = {
      TableName: process.env.BOOKINGS_TABLE, // We'll set this environment variable later
      Item: {
        BookingID: bookingId,
        UserID: data.userId,
        ServiceID: data.serviceId,
        Date: data.date,
        TimeSlot: data.timeSlot,
        Status: 'Booked',
      },
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ bookingId }),
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create booking' }),
    };
  }
};
