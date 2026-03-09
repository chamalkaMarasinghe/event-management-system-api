const express = require("express");//....
const cors = require("cors");
const amqp = require("amqplib");
require("dotenv").config({ path: "../.env" });
const { sendNotifications } = require("./utils/notifications/notifications");
const currentEnvironment = require("./config/environmentConfig");

const app = express();

app.use(
  cors({
    origin: [`${process.env.CLIENT}`],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", async (req, res, next) => {
  try {
    return res.status(200).json({ status: 200, message: `API Version - ${currentEnvironment.API_VERSION} : Welcome to Notification service !` });
  } catch (error) {
    return next(error);
  }
});

// NOTE: consuming queue messages - listening for user_booked-event
async function startConsuming() {
  try {
    console.log(`amqp://${currentEnvironment.RABBIT_MQ_URL}`);
    let retry = 5;
    let connection = null, channel = null;

    while(retry){
      try {
        connection = await amqp.connect(`amqp://${currentEnvironment.RABBIT_MQ_URL}`);            
        channel = await connection?.createChannel();
        await channel.assertQueue("user_booked_event");
        console.log("Notification Service is listening to messages");
        return;
      } catch (error) {
        console.error("Retrying RabbitMQ Connection Error : " , error.message);
        retry --;
        console.error("Retrying again: " , retry);
        await new Promise(res => setTimeout(res, 3000));
      }
    }
    
    // connection = await amqp.connect(`amqp://${currentEnvironment.RABBIT_MQ_URL}`);
    // channel = await connection.createChannel();

    // await channel.assertQueue("user_booked_event");
    // console.log("Notification Service is listening to messages");

    if(channel){
      channel?.consume("user_booked_event", (msg) => {      
        const data = JSON.parse(msg.content.toString());
        // console.log("Notification: NEW DATA: ", data);

        // NOTE: sending confirmation email to the user

        sendNotifications({
          isSendingEmail: true,
          emailOptions: {
            email: data?.email,
            subject: `The event was successfully booked.`,
            topic: 'Your event booking is confirmed',
            content: `Please note that, You have booked ${data?.event?.name}.`,
          }
        });

        channel.ack(msg);
      });
    }

  } catch (error) {
    console.error("RabbitMQ Connection Error : " , error.message);
  }
}

startConsuming();

app.listen(process.env.PORT, () => {
  console.log(`Notification Service running on port ${process.env.PORT}`);
});
